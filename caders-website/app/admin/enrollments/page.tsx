import { createClient } from "@/lib/supabase/server";
import CreateCourseForm from "./CreateCourseForm";
import EnrollForm from "./EnrollForm";
import EnrollmentRow from "./EnrollmentRow";

export default async function AdminEnrollmentsPage() {
  const supabase = await createClient();

  const [studentsRes, coursesRes, enrollmentsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, full_name")
      .eq("role", "student")
      .order("full_name"),
    supabase.from("courses").select("id, name, order_index").order("order_index"),
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

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-headline-md text-surface-on">Enrollments</h2>
        <p className="text-body-md text-surface-on-variant mt-1">
          Manage courses and enroll students.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CreateCourseForm />
        <EnrollForm students={students} courses={courses} />
      </div>

      <div className="rounded-m-xl bg-surface-container border border-outline-variant overflow-hidden shadow-elev-1">
        <div className="px-6 py-4 border-b border-outline-variant">
          <h3 className="text-title-md text-surface-on">
            All enrollments ({enrollments.length})
          </h3>
        </div>

        {enrollments.length === 0 ? (
          <div className="p-10 text-center text-body-md text-surface-on-variant">
            No enrollments yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-high">
                <tr className="text-label-md text-surface-on-variant uppercase">
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Course</th>
                  <th className="px-6 py-3">Enrolled</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {enrollments.map((e: any) => (
                  <EnrollmentRow key={e.id} enrollment={e} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}