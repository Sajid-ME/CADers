import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  // Basic CSRF defence: same-origin requests only
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

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

  let body: { message?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > 5000) {
    return NextResponse.json(
      { error: "Feedback must be between 1 and 5000 characters." },
      { status: 400 }
    );
  }

  const url = process.env.FEEDBACK_WEBHOOK_URL;
  if (!url) {
    return NextResponse.json(
      { error: "Feedback is temporarily unavailable." },
      { status: 503 }
    );
  }

  try {
    // Only the message is forwarded, never the user's identity (stays anonymous)
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