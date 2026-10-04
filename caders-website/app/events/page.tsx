import Section from "@/components/Section";
import EventCard from "@/components/EventCard";
import { events } from "@/lib/data";

export const metadata = {
  title: "Events | CADers",
  description: "Upcoming events and workshops by CADers, KUET.",
};

export default function EventsPage() {
  return (
    <Section
      title="Events"
      subtitle="Workshops, bootcamps, and design sprints organized by CADers."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </Section>
  );
}