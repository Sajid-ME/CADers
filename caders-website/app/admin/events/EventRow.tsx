"use client";

import { Trash2 } from "lucide-react";
import { deleteEventAction } from "../actions";

type Props = {
  event: {
    id: string;
    title: string;
    date: string;
    venue: string;
    description: string | null;
  };
};

export default function EventRow({ event }: Props) {
  return (
    <tr className="hover:bg-surface-container-high/50 transition">
      <td className="px-6 py-4 text-body-md text-surface-on">{event.title}</td>
      <td className="px-6 py-4 text-body-md text-surface-on-variant">
        {new Date(event.date).toLocaleDateString("en-GB")}
      </td>
      <td className="px-6 py-4 text-body-md text-surface-on-variant">
        {event.venue}
      </td>
      <td className="px-6 py-4 text-right">
        <form
          action={deleteEventAction}
          onSubmit={(e) => {
            if (!confirm(`Delete "${event.title}"?`)) e.preventDefault();
          }}
        >
          <input type="hidden" name="event_id" value={event.id} />
          <button
            type="submit"
            className="w-9 h-9 rounded-full inline-flex items-center justify-center text-red-600 hover:bg-red-500/10 transition"
            aria-label="Delete"
          >
            <Trash2 size={16} />
          </button>
        </form>
      </td>
    </tr>
  );
}