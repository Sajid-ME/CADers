"use client";

import { Trash2 } from "lucide-react";
import { deleteAchievementAction } from "../actions";

type Props = {
  achievement: {
    id: string;
    title: string;
    description: string | null;
    date: string | null;
  };
};

export default function AchievementRow({ achievement }: Props) {
  return (
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
      <td className="px-6 py-4 text-right">
        <form
          action={deleteAchievementAction}
          onSubmit={(e) => {
            if (!confirm(`Delete "${achievement.title}"?`)) e.preventDefault();
          }}
        >
          <input
            type="hidden"
            name="achievement_id"
            value={achievement.id}
          />
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