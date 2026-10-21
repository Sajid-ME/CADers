import { createClient } from "@/lib/supabase/server";
import StudentManagementTabs from "./StudentManagementTabs";
import StudentRow from "./StudentRow";
import ExportStudentsCsvButton from "./ExportStudentsCsvButton";

export default async function AdminStudentsPage() {
  const supabase = await createClient();

  const [studentsRes, coursesRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, full_name, department, roll_number, created_at")
      .eq("role", "student")
      .order("created_at", { ascending: false }),
    supabase
      .from("courses")
      .select("id, name")
      .order("order_index", { ascending: true }),
  ]);

  const students = studentsRes.data ?? [];
  const courses = coursesRes.data ?? [];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-headline-md text-surface-on">Students</h2>
        <p className="text-body-md text-surface-on-variant mt-1">
          Create single accounts, bulk import from CSV with auto-enrollment, and export credentials.
        </p>
      </div>

      <StudentManagementTabs courses={courses} />

      <div className="rounded-m-xl bg-surface-container border border-outline-variant overflow-hidden shadow-elev-1">
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between">
          <h3 className="text-title-md text-surface-on">
            All students ({students.length})
          </h3>
          <ExportStudentsCsvButton students={students} />
        </div>

        {students.length === 0 ? (
          <div className="p-10 text-center text-body-md text-surface-on-variant">
            No students yet. Create or import above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-high">
                <tr className="text-label-md text-surface-on-variant uppercase">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Roll</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {students.map((s) => (
                  <StudentRow key={s.id} student={s} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
