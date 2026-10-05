import { createClient } from "@/lib/supabase/server";
import AddEventForm from "./AddEventForm";
import EventRow from "./EventRow";

export default async function AdminEventsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("id, title, date, venue, description")
    .order("date", { ascending: false });

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-headline-md text-surface-on">Events</h2>
        <p className="text-body-md text-surface-on-variant mt-1">
          Add and remove events shown on the public site.
        </p>
      </div>

      <AddEventForm />

      <div className="rounded-m-xl bg-surface-container border border-outline-variant overflow-hidden shadow-elev-1">
        <div className="px-6 py-4 border-b border-outline-variant">
          <h3 className="text-title-md text-surface-on">
            All events ({events?.length ?? 0})
          </h3>
        </div>

        {!events || events.length === 0 ? (
          <div className="p-10 text-center text-body-md text-surface-on-variant">
            No events yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-high">
                <tr className="text-label-md text-surface-on-variant uppercase">
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Venue</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {events.map((e) => (
                  <EventRow key={e.id} event={e} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}