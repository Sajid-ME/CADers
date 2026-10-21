import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import AdminStudentsHub from "./AdminStudentsHub";

export default async function AdminStudentsPage() {
  const supabase = await createClient();

  const [studentsRes, coursesRes, enrollmentsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, full_name, department, roll_number, created_at")
      .eq("role", "student")
      .order("created_at", { ascending: false }),
    supabase
      .from("courses")
      .select("id, name, order_index")
      .order("order_index", { ascending: true }),
    supabase
      .from("enrollments")
      .select(
        "id, enrolled_at, student:student_id (id, username, full_name), course:course_id (id, name)"
      )
      .order("enrolled_at", { ascending: false }),
  ]);

  const students = studentsRes.data ?? [];
  const courses = coursesRes.data ?? [];
  const enrollments = enrollmentsRes.data ?? [];

  // Build map of student_id -> course names
  const studentCourseMap: Record<string, string[]> = {};
  for (const e of enrollments) {
    const studentId = (e.student as any)?.id;
    const courseName = (e.course as any)?.name;
    if (studentId && courseName) {
      if (!studentCourseMap[studentId]) {
        studentCourseMap[studentId] = [];
      }
      studentCourseMap[studentId].push(courseName);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-headline-md text-surface-on">Students & Courses</h2>
        <p className="text-body-md text-surface-on-variant mt-1">
          Manage students, batch CSV imports with auto-enrollment, course catalogs, and active enrollments.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="p-8 text-center text-surface-on-variant">
            Loading student and course management...
          </div>
        }
      >
        <AdminStudentsHub
          students={students}
          courses={courses}
          enrollments={enrollments}
          studentCourseMap={studentCourseMap}
        />
      </Suspense>
    </div>
  );
}
