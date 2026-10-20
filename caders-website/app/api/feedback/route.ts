import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter (per IP, resets on cold start / redeployment)
// For production, replace with Redis-backed rate limiting (e.g. Upstash)
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute window
const RATE_LIMIT_MAX_REQUESTS = 3;   // max 3 feedback submissions per minute

function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true; // allowed
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // blocked
  }

  entry.count++;
  return true;
}

// ---------------------------------------------------------------------------
// POST /api/feedback
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  // 1. Rate limit
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment before submitting again." },
      { status: 429 }
    );
  }

  // 2. Basic CSRF defence: same-origin requests only
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  // 3. Authentication: must be logged in
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  // 4. Authorisation: must be enrolled student or admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";

  if (!isAdmin) {
    const { count } = await supabase
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("student_id", user.id);
    if (!count) {
      return NextResponse.json(
        { error: "Feedback is open to enrolled students only." },
        { status: 403 }
      );
    }
  }

  // 5. Parse + validate body
  let body: { message?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const rawMessage = typeof body.message === "string" ? body.message : "";
  // Strip potential HTML/script tags before length check
  const message = rawMessage.replace(/<[^>]*>/g, "").trim();
  if (!message || message.length > 5000) {
    return NextResponse.json(
      { error: "Feedback must be between 1 and 5000 characters." },
      { status: 400 }
    );
  }

  // 6. Forward to webhook (identity is never forwarded — stays anonymous)
  const url = process.env.FEEDBACK_WEBHOOK_URL;
  if (!url) {
    return NextResponse.json(
      { error: "Feedback is temporarily unavailable." },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ message, source: "web" }),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch {
    return NextResponse.json(
      { error: "Could not record feedback. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}