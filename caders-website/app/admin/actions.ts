"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export type ActionState = {
  error: string | null;
  success?: string | null;
};

// =====================================================================
// Helpers
// =====================================================================

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("[assertAdmin] user:", user?.id ?? null, "error:", userError);

  if (!user) return { ok: false as const, error: "Not authenticated." };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  console.log("[assertAdmin] profile:", profile, "error:", profileError);

  if (
    !profile ||
    (profile.role !== "admin" && profile.role !== "super_admin")
  ) {
    return { ok: false as const, error: "Admin access required." };
  }

  return { ok: true as const, user };
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

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

// =====================================================================
// Students (from Phase 3C-1)
// =====================================================================

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
  if (guard.user?.id === userId) return;

  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(userId);

  revalidatePath("/admin/students");
  revalidatePath("/admin");
}

// =====================================================================
// Courses
// =====================================================================

export async function createCourseAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const guard = await assertAdmin();
  if (!guard.ok) return { error: guard.error };

  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const order_index = Number(formData.get("order_index") || 0) || 0;

  if (!name) return { error: "Course name is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("courses").insert({
    name,
    description: description || null,
    order_index,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/enrollments");
  revalidatePath("/admin");
  revalidatePath("/dashboard");

  return { error: null, success: `✅ Created course "${name}".` };
}

export async function deleteCourseAction(formData: FormData) {
  const guard = await assertAdmin();
  if (!guard.ok) return;

  const id = String(formData.get("course_id") || "").trim();
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("courses").delete().eq("id", id);

  revalidatePath("/admin/enrollments");
  revalidatePath("/admin");
}

// =====================================================================
// Enrollments
// =====================================================================

export async function enrollStudentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const guard = await assertAdmin();
  if (!guard.ok) return { error: guard.error };

  const student_id = String(formData.get("student_id") || "").trim();
  const course_id = String(formData.get("course_id") || "").trim();

  if (!student_id || !course_id) {
    return { error: "Select both a student and a course." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("enrollments")
    .insert({ student_id, course_id });

  if (error) {
    if (error.code === "23505") {
      return { error: "This student is already enrolled in that course." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/enrollments");
  revalidatePath("/admin");

  return { error: null, success: "✅ Student enrolled." };
}

export async function deleteEnrollmentAction(formData: FormData) {
  const guard = await assertAdmin();
  if (!guard.ok) return;

  const id = String(formData.get("enrollment_id") || "").trim();
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("enrollments").delete().eq("id", id);

  revalidatePath("/admin/enrollments");
  revalidatePath("/admin");
}

// =====================================================================
// Materials (file uploads)
// =====================================================================

export async function uploadMaterialAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const guard = await assertAdmin();
  if (!guard.ok) return { error: guard.error };

  const course_id = String(formData.get("course_id") || "").trim();
  const type = String(formData.get("type") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const file = formData.get("file") as File | null;

  if (!course_id || !type || !title) {
    return { error: "Course, type, and title are required." };
  }
  if (type !== "slide" && type !== "hw" && type !== "cw") {
    return { error: "Invalid material type." };
  }
  if (!file || file.size === 0) {
    return { error: "Please choose a file to upload." };
  }
  if (file.size > 20 * 1024 * 1024) {
    return { error: "File must be under 20 MB." };
  }

  const admin = createAdminClient();
  const safeName = sanitizeFileName(file.name);
  const filePath = `${course_id}/${type}/${Date.now()}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await admin.storage
    .from("materials")
    .upload(filePath, arrayBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return { error: `Upload failed: ${uploadError.message}` };
  }

  const { error: dbError } = await admin.from("materials").insert({
    course_id,
    type,
    title,
    file_path: filePath,
    uploaded_by: guard.user.id,
  });

  if (dbError) {
    // Best-effort cleanup of the orphan file
    await admin.storage.from("materials").remove([filePath]);
    return { error: `Database error: ${dbError.message}` };
  }

  revalidatePath("/admin/materials");
  revalidatePath("/admin");
  revalidatePath("/dashboard");

  return { error: null, success: `✅ Uploaded "${title}".` };
}

export async function deleteMaterialAction(formData: FormData) {
  const guard = await assertAdmin();
  if (!guard.ok) return;

  const id = String(formData.get("material_id") || "").trim();
  if (!id) return;

  const admin = createAdminClient();

  const { data: material } = await admin
    .from("materials")
    .select("file_path")
    .eq("id", id)
    .single();

  if (material?.file_path) {
    await admin.storage.from("materials").remove([material.file_path]);
  }

  await admin.from("materials").delete().eq("id", id);

  revalidatePath("/admin/materials");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}