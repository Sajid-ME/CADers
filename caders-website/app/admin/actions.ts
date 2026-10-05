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
  const surname_base = String(formData.get("surname_base") || "")
    .trim()
    .toLowerCase();
  const dept_code = String(formData.get("dept_code") || "")
    .trim()
    .toUpperCase();
  const roll_number = String(formData.get("roll_number") || "").trim();
  const username = String(formData.get("username") || "")
    .trim()
    .toLowerCase();
  const providedPassword = String(formData.get("password") || "").trim();

  if (!full_name || !surname_base || !dept_code || !roll_number || !username) {
    return {
      error: "Full name, surname, department, roll number are all required.",
    };
  }

  if (!/^[a-z0-9]{4,40}$/.test(username)) {
    return {
      error:
        "Username may only contain a–z, 0–9 and must be 4–40 characters.",
    };
  }

  const password = providedPassword || generatePassword();
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const admin = createAdminClient();
  const email = `${username}@caders.kuet`;

  // Check username uniqueness
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
      department: dept_code,
      roll_number,
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
    success: `✅ Created "${email}". Password: "${password}" — copy it now; you won't see it again.`,
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
// =====================================================================
// Events
// =====================================================================

export async function createEventAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const guard = await assertAdmin();
  if (!guard.ok) return { error: guard.error };

  const title = String(formData.get("title") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const venue = String(formData.get("venue") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!title || !date || !venue) {
    return { error: "Title, date, and venue are required." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: "Date must be in YYYY-MM-DD format." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("events").insert({
    title,
    date,
    venue,
    description: description || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");

  return { error: null, success: `✅ Event "${title}" created.` };
}

export async function deleteEventAction(formData: FormData) {
  const guard = await assertAdmin();
  if (!guard.ok) return;

  const id = String(formData.get("event_id") || "").trim();
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", id);

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
}

// =====================================================================
// Achievements
// =====================================================================

export async function createAchievementAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const guard = await assertAdmin();
  if (!guard.ok) return { error: guard.error };

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const date = String(formData.get("date") || "").trim();

  if (!title) return { error: "Title is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("achievements").insert({
    title,
    description: description || null,
    date: date || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  revalidatePath("/");

  return { error: null, success: `✅ Achievement "${title}" added.` };
}

export async function deleteAchievementAction(formData: FormData) {
  const guard = await assertAdmin();
  if (!guard.ok) return;

  const id = String(formData.get("achievement_id") || "").trim();
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("achievements").delete().eq("id", id);

  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  revalidatePath("/");
}

// =====================================================================
// Voices
// =====================================================================

export async function createVoiceAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const guard = await assertAdmin();
  if (!guard.ok) return { error: guard.error };

  const type = String(formData.get("type") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const designation = String(formData.get("designation") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const order_index = Number(formData.get("order_index") || 0) || 0;

  if (!name || !message) {
    return { error: "Name and message are required." };
  }
  if (type !== "moderator" && type !== "faculty") {
    return { error: "Please choose Moderator or Faculty." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("voices").insert({
    type,
    name,
    designation: designation || null,
    message,
    order_index,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/voices");
  revalidatePath("/voices");
  revalidatePath("/");

  return { error: null, success: `✅ Voice "${name}" added.` };
}

export async function deleteVoiceAction(formData: FormData) {
  const guard = await assertAdmin();
  if (!guard.ok) return;

  const id = String(formData.get("voice_id") || "").trim();
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("voices").delete().eq("id", id);

  revalidatePath("/admin/voices");
  revalidatePath("/voices");
  revalidatePath("/");
}