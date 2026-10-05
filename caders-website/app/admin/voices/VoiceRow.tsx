"use client";

import { Trash2 } from "lucide-react";
import { deleteVoiceAction } from "../actions";

type Props = {
  voice: {
    id: string;
    type: "moderator" | "faculty";
    name: string;
    designation: string | null;
    message: string;
    order_index: number;
  };
};

export default function VoiceRow({ voice }: Props) {
  return (
    <tr className="hover:bg-surface-container-high/50 transition">
      <td className="px-6 py-4">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-container text-primary-on-container text-label-md capitalize">
          {voice.type}
        </span>
      </td>
      <td className="px-6 py-4 text-body-md text-surface-on">{voice.name}</td>
      <td className="px-6 py-4 text-body-md text-surface-on-variant">
        {voice.designation || "—"}
      </td>
      <td className="px-6 py-4 text-body-md text-surface-on-variant max-w-md truncate">
        {voice.message}
      </td>
      <td className="px-6 py-4 text-right">
        <form
          action={deleteVoiceAction}
          onSubmit={(e) => {
            if (!confirm(`Delete voice from "${voice.name}"?`))
              e.preventDefault();
          }}
        >
          <input type="hidden" name="voice_id" value={voice.id} />
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