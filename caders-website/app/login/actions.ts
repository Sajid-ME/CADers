"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  error: string | null;
};

function usernameToEmail(username: string) {
  return `${username.toLowerCase().trim()}@caders.local`;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return { error: "Please enter both username and password." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: usernameToEmail(username),
    password,
  });

  if (error || !data.user) {
    return { error: "Invalid username or password." };
  }

  // Fetch role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  // Log the login (best-effort, ignore errors)
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