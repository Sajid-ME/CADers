"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  deleteAchievementAction,
  updateAchievementAction,
} from "../actions";
import { EditActions, EditInput } from "../EditFields";

type Props = {
  achievement: {
    id: string;
    title: string;
    description: string | null;
    date: string | null;
  };
};

export default function AchievementRow({ achievement }: Props) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <tr className="hover:bg-surface-container-high/50 transition">
        <td className="px-6 py-4 text-body-md text-surface-on">
          {achievement.title}
        </td>
        <td className="px-6 py-4 text-body-md text-surface-on-variant">
          {achievement.date || "—"}
        </td>
        <td className="px-6 py-4 text-body-md text-surface-on-variant max-w-md truncate">
          {achievement.description || "—"}
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
              action={deleteAchievementAction}
              onSubmit={(e) => {
                if (!confirm(`Delete "${achievement.title}"?`)) e.preventDefault();
              }}
            >
              <input type="hidden" name="achievement_id" value={achievement.id} />
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
                const res = await updateAchievementAction(formData);
                if (res.error) setError(res.error);
                else {
                  setError(null);
                  setEditing(false);
                }
              }}
              className="grid gap-4 md:grid-cols-2"
            >
              <input type="hidden" name="achievement_id" value={achievement.id} />
              <EditInput
                name="title"
                label="Title"
                defaultValue={achievement.title}
                required
                className="md:col-span-2"
              />
              <EditInput
                name="description"
                label="Short description (optional)"
                defaultValue={achievement.description}
                className="md:col-span-2"
              />
              <EditInput
                name="date"
                label="Date (e.g. March 2024)"
                defaultValue={achievement.date}
              />
              <EditActions error={error} onCancel={() => setEditing(false)} />
            </form>
          </td>
        </tr>
      )}
    </>
  );
}