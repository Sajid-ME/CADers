import Section from "@/components/Section";
import VoicesSlideshow from "@/components/VoicesSlideshow";
import { voices } from "@/lib/data";

export const metadata = {
  title: "Voices | CADers",
  description: "Messages from the CADers moderator and faculty advisor.",
};

export default function VoicesPage() {
  return (
    <Section
      title="Voices from Our Community"
      subtitle="Guiding words from the people who lead CADers."
    >
      <div className="max-w-3xl mx-auto">
        <VoicesSlideshow items={voices} />
      </div>
    </Section>
  );
}