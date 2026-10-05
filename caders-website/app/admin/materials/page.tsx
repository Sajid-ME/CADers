import { createClient } from "@/lib/supabase/server";
import UploadForm from "./UploadForm";
import MaterialRow from "./MaterialRow";

export default async function AdminMaterialsPage() {
  const supabase = await createClient();

  const [coursesRes, materialsRes] = await Promise.all([
    supabase.from("courses").select("id, name, order_index").order("order_index"),
    supabase
      .from("materials")
      .select(
        "id, type, title, file_path, uploaded_at, course:course_id (id, name)"
      )
      .order("uploaded_at", { ascending: false }),
  ]);

  const courses = coursesRes.data ?? [];
  const materials = materialsRes.data ?? [];

  // Generate signed URLs for downloads (1 hour)
  const withUrls = await Promise.all(
    materials.map(async (m: any) => {
      const { data: signed } = await supabase.storage
        .from("materials")
        .createSignedUrl(m.file_path, 3600);
      return { ...m, signedUrl: signed?.signedUrl ?? null };
    })
  );

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-headline-md text-surface-on">Materials</h2>
        <p className="text-body-md text-surface-on-variant mt-1">
          Upload lecture slides, homework, and classwork for enrolled students.
        </p>
      </div>

      <UploadForm courses={courses} />

      <div className="rounded-m-xl bg-surface-container border border-outline-variant overflow-hidden shadow-elev-1">
        <div className="px-6 py-4 border-b border-outline-variant">
          <h3 className="text-title-md text-surface-on">
            All materials ({withUrls.length})
          </h3>
        </div>

        {withUrls.length === 0 ? (
          <div className="p-10 text-center text-body-md text-surface-on-variant">
            No materials uploaded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-high">
                <tr className="text-label-md text-surface-on-variant uppercase">
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Course</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Uploaded</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {withUrls.map((m) => (
                  <MaterialRow key={m.id} material={m} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}