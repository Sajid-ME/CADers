import Section from "@/components/Section";
import EventCard from "@/components/EventCard";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Events | CADers",
  description: "Upcoming events and workshops by CADers, KUET.",
};

export default async function EventsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("id, title, date, venue, description")
    .order("date", { ascending: true });

  const events = data ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.date >= today);
  const past = events.filter((e) => e.date < today).reverse();

  return (
    <Section
      title="Events"
      subtitle="Workshops, bootcamps, and design sprints organized by CADers."
    >
      {events.length === 0 ? (
        <p className="text-center text-body-md text-surface-on-variant">
          No events scheduled yet.
        </p>
      ) : (
        <div className="space-y-14">
          <div>
            <h3 className="text-title-lg text-surface-on mb-6">Upcoming</h3>
            {upcoming.length === 0 ? (
              <p className="text-body-md text-surface-on-variant">
                Nothing scheduled right now. Check back soon.
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            )}
          </div>

          {past.length > 0 && (
            <div>
              <h3 className="text-title-lg text-surface-on mb-6">
                Past events
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-90">
                {past.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}