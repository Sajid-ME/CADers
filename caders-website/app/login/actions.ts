"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { USERNAME_DOMAIN } from "@/lib/departments";

export type LoginState = {
  error: string | null;
};

/**
 * Accepts a bare username, or a full email. Tries the new @caders.kuet
 * domain first, then falls back to @caders.local for legacy accounts.
 */
function candidates(identifier: string): string[] {
  const trimmed = identifier.trim().toLowerCase();
  if (trimmed.includes("@")) return [trimmed];
  return [`${trimmed}${USERNAME_DOMAIN}`, `${trimmed}@caders.local`];
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const identifier = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!identifier || !password) {
    return { error: "Please enter both username and password." };
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
    console.error("[LOGIN attempt failed]", { email, error: lastError });
  }

  if (!signedInUser) {
    return {
      error:
        lastError && !lastError.toLowerCase().includes("invalid")
          ? `Login failed: ${lastError}`
          : "Invalid username or password.",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", signedInUser.id)
    .single();

  try {
    const h = await headers();
    await supabase.from("login_logs").insert({
      user_id: signedInUser.id,
      user_agent: h.get("user-agent") ?? null,
    });
  } catch {
    /* ignore */
  }

  if (profile?.role === "admin" || profile?.role === "super_admin") {
    redirect("/admin");
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}