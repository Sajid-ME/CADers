import { createClient } from "@/lib/supabase/server";
import AddStudentForm from "./AddStudentForm";
import StudentRow from "./StudentRow";

export default async function AdminStudentsPage() {
  const supabase = await createClient();

  const { data: students } = await supabase
    .from("profiles")
    .select("id, username, full_name, department, roll_number, created_at")
    .eq("role", "student")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-headline-md text-surface-on">Students</h2>
        <p className="text-body-md text-surface-on-variant mt-1">
          Create new accounts and manage existing ones.
        </p>
      </div>

      <AddStudentForm />

      <div className="rounded-m-xl bg-surface-container border border-outline-variant overflow-hidden shadow-elev-1">
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between">
          <h3 className="text-title-md text-surface-on">
            All students ({students?.length ?? 0})
          </h3>
        </div>

        {!students || students.length === 0 ? (
          <div className="p-10 text-center text-body-md text-surface-on-variant">
            No students yet. Create one above.
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