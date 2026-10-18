"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { deleteVoiceAction, updateVoiceAction } from "../actions";
import {
  EditActions,
  EditInput,
  EditSelect,
  EditTextarea,
} from "../EditFields";

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
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
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
          </div>
        </td>
      </tr>

      {editing && (
        <tr>
          <td colSpan={5} className="px-6 py-5 bg-surface-container-high/40">
            <form
              action={async (formData) => {
                const res = await updateVoiceAction(formData);
                if (res.error) setError(res.error);
                else {
                  setError(null);
                  setEditing(false);
                }
              }}
              className="grid gap-4 md:grid-cols-2"
            >
              <input type="hidden" name="voice_id" value={voice.id} />
              <EditSelect
                name="type"
                label="Type"
                defaultValue={voice.type}
                options={[
                  { value: "moderator", label: "Moderator" },
                  { value: "faculty", label: "Faculty Advisor" },
                ]}
              />
              <EditInput name="name" label="Name" defaultValue={voice.name} required />
              <EditInput
                name="designation"
                label="Designation (optional)"
                defaultValue={voice.designation}
              />
              <EditInput
                name="order_index"
                label="Order"
                type="number"
                defaultValue={voice.order_index}
              />
              <EditTextarea
                name="message"
                label="Message"
                defaultValue={voice.message}
                required
                className="md:col-span-2"
              />
              <EditActions error={error} onCancel={() => setEditing(false)} />
            </form>
          </td>
        </tr>
      )}
    </>
  );
}