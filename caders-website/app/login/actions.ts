"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { USERNAME_DOMAIN } from "@/lib/departments";

export type LoginState = {
  error: string | null;
};

// In-memory rate limiting to protect against credential stuffing & brute force
const loginAttemptsMap = new Map<string, { attempts: number; lockUntil: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_MS = 5 * 60 * 1000; // 5-minute cooldown

function getClientKey(headerList: Headers, identifier: string): string {
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "ip";
  return `${ip}::${identifier.toLowerCase()}`;
}

/**
 * Accepts a bare username, or a full email. Tries the new @caders.kuet
 * domain first, then falls back to @caders.local for legacy accounts.
 */
function candidates(identifier: string): string[] {
  const trimmed = identifier.trim().toLowerCase();
  if (trimmed.includes("@")) return [trimmed];
  return [`${trimmed}${USERNAME_DOMAIN}`, `${trimmed}@caders.local`];
}

/** Only allow same-site relative paths (prevents open redirects). */
function safeNext(raw: string): string | null {
  return raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\")
    ? raw
    : null;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const identifier = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const next = safeNext(String(formData.get("next") || ""));

  if (!identifier || !password) {
    return { error: "Please enter both username and password." };
  }

  const h = await headers();
  const clientKey = getClientKey(h, identifier);
  const now = Date.now();
  const attemptRecord = loginAttemptsMap.get(clientKey);

  // Check if locked out
  if (attemptRecord && attemptRecord.lockUntil > now) {
    const minutesLeft = Math.ceil((attemptRecord.lockUntil - now) / 60000);
    return {
      error: `Too many failed login attempts. Please wait ${minutesLeft} minute(s) before trying again.`,
    };
  }

  const supabase = await createClient();

  let signedInUser: { id: string } | null = null;
  let lastError: string | null = null;

  for (const email of candidates(identifier)) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      signedInUser = { id: data.user.id };
      break;
    }

    lastError = error?.message ?? null;
    console.error("[LOGIN attempt failed]", lastError);
  }

  if (!signedInUser) {
    // Record failed attempt
    const currentAttempts = (attemptRecord?.attempts ?? 0) + 1;
    if (currentAttempts >= MAX_LOGIN_ATTEMPTS) {
      loginAttemptsMap.set(clientKey, {
        attempts: currentAttempts,
        lockUntil: now + LOGIN_LOCKOUT_MS,
      });
      return {
        error: "Too many failed attempts. Account temporarily locked for 5 minutes.",
      };
    } else {
      loginAttemptsMap.set(clientKey, {
        attempts: currentAttempts,
        lockUntil: 0,
      });
    }

    return {
      error:
        lastError && !lastError.toLowerCase().includes("invalid")
          ? `Login failed: ${lastError}`
          : "Invalid username or password.",
    };
  }

  // Reset failed attempts on success
  loginAttemptsMap.delete(clientKey);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", signedInUser.id)
    .single();

  try {
    await supabase.from("login_logs").insert({
      user_id: signedInUser.id,
      user_agent: h.get("user-agent") ?? null,
    });
  } catch {
    /* ignore */
  }

  if (profile?.role === "admin" || profile?.role === "super_admin") {
    redirect(next ?? "/admin");
  }

  redirect(next && !next.startsWith("/admin") ? next : "/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
