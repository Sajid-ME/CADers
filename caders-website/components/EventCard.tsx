import { Calendar, MapPin } from "lucide-react";
import { EventItem } from "@/lib/data";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="group rounded-m-lg bg-surface-container border border-outline-variant p-6 shadow-elev-1 hover:shadow-elev-3 transition-all duration-m-medium ease-m-standard">
      <h3 className="text-title-lg text-surface-on">{event.title}</h3>
      <div className="mt-4 space-y-2 text-body-md text-surface-on-variant">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-primary" />
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-primary" />
          <span>{event.venue}</span>
        </div>
      </div>
      <p className="mt-4 text-body-md text-surface-on-variant">
        {event.description}
      </p>
    </div>
  );
}