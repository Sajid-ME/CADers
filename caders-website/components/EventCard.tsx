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
    <div className="group relative overflow-hidden rounded-m-lg bg-surface-container border border-outline-variant p-6 shadow-elev-1 hover:shadow-elev-3 hover:-translate-y-1 transition-all duration-m-medium ease-m-standard">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary" />

      <h3 className="text-title-lg text-surface-on">{event.title}</h3>
      <div className="mt-4 space-y-2 text-body-md text-surface-on-variant">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-primary" />
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-secondary" />
          <span>{event.venue}</span>
        </div>
      </div>
      {event.description && (
        <p className="mt-4 text-body-md text-surface-on-variant">
          {event.description}
        </p>
      )}
    </div>
  );
}