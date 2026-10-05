import Section from "@/components/Section";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Achievements | CADers",
  description: "Milestones and achievements of CADers, KUET.",
};

export default async function AchievementsPage() {
  const supabase = await createClient();
  const { data: achievements } = await supabase
    .from("achievements")
    .select("id, title, description, date")
    .order("created_at", { ascending: false });

  return (
    <Section
      title="Our Achievements"
      subtitle="Every milestone is a step toward building better designers."
    >
      {!achievements || achievements.length === 0 ? (
        <p className="text-center text-body-md text-surface-on-variant">
          No achievements yet. Check back soon.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {achievements.map((a) => (
            <div
              key={a.id}
              className="rounded-m-lg bg-surface-container border border-outline-variant p-8 shadow-elev-1 hover:shadow-elev-3 transition-all duration-m-medium ease-m-standard"
            >
              {a.date && (
                <p className="text-label-md text-primary uppercase">{a.date}</p>
              )}
              <h3 className="mt-3 text-title-lg text-surface-on">{a.title}</h3>
              {a.description && (
                <p className="mt-3 text-body-md text-surface-on-variant">
                  {a.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}