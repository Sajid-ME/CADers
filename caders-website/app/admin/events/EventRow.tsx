"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { deleteEventAction, updateEventAction } from "../actions";
import { EditActions, EditInput } from "../EditFields";

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
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <tr className="hover:bg-surface-container-high/50 transition">
        <td className="px-6 py-4 text-body-md text-surface-on">{event.title}</td>
        <td className="px-6 py-4 text-body-md text-surface-on-variant">
          {new Date(event.date).toLocaleDateString("en-GB")}
        </td>
        <td className="px-6 py-4 text-body-md text-surface-on-variant">
          {event.venue}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setEditing((e) => !e);
              }}
              className="w-9 h-9 rounded-full inline-flex items-center justify-center text-primary hover:bg-primary/10 transition"
              aria-label="Edit"
            >
              <Pencil size={16} />
            </button>
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
          </div>
        </td>
      </tr>

      {editing && (
        <tr>
          <td colSpan={4} className="px-6 py-5 bg-surface-container-high/40">
            <form
              action={async (formData) => {
                const res = await updateEventAction(formData);
                if (res.error) setError(res.error);
                else {
                  setError(null);
                  setEditing(false);
                }
              }}
              className="grid gap-4 md:grid-cols-2"
            >
              <input type="hidden" name="event_id" value={event.id} />
              <EditInput name="title" label="Event title" defaultValue={event.title} required />
              <EditInput
                name="date"
                label="Date"
                type="date"
                defaultValue={event.date?.slice(0, 10)}
                required
              />
              <EditInput name="venue" label="Venue" defaultValue={event.venue} required />
              <EditInput
                name="description"
                label="Short description (optional)"
                defaultValue={event.description}
              />
              <EditActions error={error} onCancel={() => setEditing(false)} />
            </form>
          </td>
        </tr>
      )}
    </>
  );
}