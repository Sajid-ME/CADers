import Section from "@/components/Section";
import VoicesSlideshow from "@/components/VoicesSlideshow";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Voices | CADers",
  description: "Messages from the CADers moderator and faculty advisor.",
};

export default async function VoicesPage() {
  const supabase = await createClient();
  const { data: voices } = await supabase
    .from("voices")
    .select("id, type, name, designation, message")
    .order("order_index");

  return (
    <Section
      title="Voices from Our Community"
      subtitle="Guiding words from the people who lead CADers."
    >
      {!voices || voices.length === 0 ? (
        <p className="text-center text-body-md text-surface-on-variant">
          Voices coming soon.
        </p>
      ) : (
        <div className="max-w-3xl mx-auto">
          <VoicesSlideshow items={voices} />
        </div>
      )}
    </Section>
  );
}