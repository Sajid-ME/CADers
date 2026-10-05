import { createClient } from "@/lib/supabase/server";
import AddAchievementForm from "./AddAchievementForm";
import AchievementRow from "./AchievementRow";

export default async function AdminAchievementsPage() {
  const supabase = await createClient();

  const { data: achievements } = await supabase
    .from("achievements")
    .select("id, title, description, date")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-headline-md text-surface-on">Achievements</h2>
        <p className="text-body-md text-surface-on-variant mt-1">
          Add or remove achievements shown on the public site.
        </p>
      </div>

      <AddAchievementForm />

      <div className="rounded-m-xl bg-surface-container border border-outline-variant overflow-hidden shadow-elev-1">
        <div className="px-6 py-4 border-b border-outline-variant">
          <h3 className="text-title-md text-surface-on">
            All achievements ({achievements?.length ?? 0})
          </h3>
        </div>

        {!achievements || achievements.length === 0 ? (
          <div className="p-10 text-center text-body-md text-surface-on-variant">
            No achievements yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-high">
                <tr className="text-label-md text-surface-on-variant uppercase">
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {achievements.map((a) => (
                  <AchievementRow key={a.id} achievement={a} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}