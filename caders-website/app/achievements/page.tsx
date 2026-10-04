import Section from "@/components/Section";
import { achievements } from "@/lib/data";

export const metadata = {
  title: "Achievements | CADers",
  description: "Milestones and achievements of CADers, KUET.",
};

export default function AchievementsPage() {
  return (
    <Section
      title="Our Achievements"
      subtitle="Every milestone is a step toward building better designers."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {achievements.map((a) => (
          <div
            key={a.id}
            className="rounded-m-lg bg-surface-container border border-outline-variant p-8 shadow-elev-1 hover:shadow-elev-3 transition-all duration-m-medium ease-m-standard"
          >
            <p className="text-label-md text-primary uppercase">{a.date}</p>
            <h3 className="mt-3 text-title-lg text-surface-on">{a.title}</h3>
            <p className="mt-3 text-body-md text-surface-on-variant">
              {a.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}