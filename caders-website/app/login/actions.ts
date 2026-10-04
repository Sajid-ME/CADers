"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  error: string | null;
};

/**
 * Accepts either:
 *   - a plain username (e.g. "test23")  → becomes "test23@caders.local"
 *   - a full email (e.g. "test23@me.com") → used as-is
 */
function toLoginEmail(input: string) {
  const trimmed = input.trim().toLowerCase();
  if (trimmed.includes("@")) return trimmed;
  return `${trimmed}@caders.local`;
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

  const email = toLoginEmail(identifier);
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    console.error("[LOGIN ERROR]", { email, error });
    return {
      error: error?.message?.includes("Invalid login")
        ? "Invalid username or password."
        : `Login failed: ${error?.message ?? "unknown error"}`,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  try {
    const h = await headers();
    await supabase.from("login_logs").insert({
      user_id: data.user.id,
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