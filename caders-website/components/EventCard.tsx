import { Calendar, MapPin, Clock } from "lucide-react";
import { EventItem } from "@/lib/data";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00"); // treat as local midnight
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Returns "upcoming" | "today" | "past" based on the event date. */
function getStatus(dateStr: string): "upcoming" | "today" | "past" {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const event = new Date(dateStr + "T00:00:00");
  const eventDay = new Date(event.getFullYear(), event.getMonth(), event.getDate());

  const diff = eventDay.getTime() - today.getTime();
  if (diff === 0) return "today";
  if (diff > 0) return "upcoming";
  return "past";
}

const statusConfig = {
  upcoming: {
    label: "Upcoming",
    classes: "bg-tertiary/15 text-tertiary-on dark:text-tertiary border border-tertiary/20",
    dot: "bg-tertiary",
    pulse: true,
  },
  today: {
    label: "Today",
    classes: "bg-primary/15 text-primary border border-primary/30",
    dot: "bg-primary",
    pulse: true,
  },
  past: {
    label: "Past",
    classes: "bg-surface-variant text-surface-on-variant border border-outline-variant",
    dot: "bg-surface-on-variant",
    pulse: false,
  },
};

export default function EventCard({ event }: { event: EventItem }) {
  const status = getStatus(event.date);
  const config = statusConfig[status];

  return (
    <div className="group relative overflow-hidden rounded-m-lg bg-surface-container border border-outline-variant shadow-elev-1 hover:shadow-elev-3 hover:-translate-y-1 transition-all duration-m-medium ease-m-standard flex flex-col">
      {/* Top accent bar — primary gradient */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-tertiary" />

      {/* Date badge — top-right */}
      <div className="absolute top-5 right-5 flex flex-col items-center text-center w-12 h-12 rounded-m-md bg-primary-container text-primary-on-container shadow-elev-1">
        <span className="text-[10px] font-bold uppercase leading-none pt-1.5">
          {new Date(event.date + "T00:00:00").toLocaleDateString("en-GB", { month: "short" })}
        </span>
        <span className="text-title-lg font-bold leading-none">
          {new Date(event.date + "T00:00:00").getDate()}
        </span>
      </div>

      <div className="p-6 pt-7 flex-1 flex flex-col">
        {/* Status pill */}
        <span
          className={`inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full text-label-md mb-3 ${config.classes}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${config.dot} ${config.pulse ? "animate-pulse" : ""}`}
          />
          {config.label}
        </span>

        <h3 className="text-title-lg text-surface-on pr-14">{event.title}</h3>

        <div className="mt-4 space-y-2 text-body-md text-surface-on-variant">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-primary shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-secondary shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {event.description && (
          <p className="mt-4 text-body-md text-surface-on-variant line-clamp-2">
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}