import Section from "@/components/Section";
import EventCard from "@/components/EventCard";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Events | CADers",
  description: "Upcoming events and workshops by CADers, KUET.",
};

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("id, title, date, venue, description")
    .order("date", { ascending: false });

  return (
    <Section
      title="Events"
      subtitle="Workshops, bootcamps, and design sprints organized by CADers."
    >
      {!events || events.length === 0 ? (
        <p className="text-center text-body-md text-surface-on-variant">
          No events scheduled yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </Section>
  );
}