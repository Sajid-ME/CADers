"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export type ActionState = {
  error: string | null;
  success?: string | null;
};

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Not authenticated." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    !profile ||
    (profile.role !== "admin" && profile.role !== "super_admin")
  ) {
    return { ok: false as const, error: "Admin access required." };
  }

  return { ok: true as const };
}

function generatePassword(length = 10) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export async function createStudentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const guard = await assertAdmin();
  if (!guard.ok) return { error: guard.error };

  const full_name = String(formData.get("full_name") || "").trim();
  const username = String(formData.get("username") || "")
    .trim()
    .toLowerCase();
  const department = String(formData.get("department") || "").trim();
  const roll_number = String(formData.get("roll_number") || "").trim();
  const providedPassword = String(formData.get("password") || "").trim();

  if (!full_name || !username) {
    return { error: "Full name and username are required." };
  }
  if (!/^[a-z0-9_.-]{3,32}$/.test(username)) {
    return {
      error:
        "Username must be 3–32 chars and may only contain a–z, 0–9, _, ., and -.",
    };
  }

  const password = providedPassword || generatePassword();
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const admin = createAdminClient();
  const email = `${username}@caders.local`;

  // Check for existing username first (profiles table)
  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existing) {
    return { error: `Username "${username}" is already taken.` };
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      username,
      full_name,
      department: department || null,
      roll_number: roll_number || null,
      role: "student",
    },
  });

  if (createError || !created.user) {
    return { error: createError?.message || "Failed to create user." };
  }

  revalidatePath("/admin/students");
  revalidatePath("/admin");

  return {
    error: null,
    success: `✅ Created "${username}". Password: "${password}" — copy it now; you won't see it again.`,
  };
}

export async function deleteStudentAction(formData: FormData) {
  const guard = await assertAdmin();
  if (!guard.ok) return;

  const userId = String(formData.get("user_id") || "").trim();
  if (!userId) return;

  // Prevent self-deletion
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.id === userId) return;

  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(userId);

  revalidatePath("/admin/students");
  revalidatePath("/admin");
}