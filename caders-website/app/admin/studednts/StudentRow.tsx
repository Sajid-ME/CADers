"use client";

import { Trash2 } from "lucide-react";
import { deleteStudentAction } from "../actions";

type Props = {
  student: {
    id: string;
    username: string;
    full_name: string;
    department: string | null;
    roll_number: string | null;
    created_at: string;
  };
};

export default function StudentRow({ student }: Props) {
  return (
    <tr className="hover:bg-surface-container-high/50 transition">
      <td className="px-6 py-4 text-body-md text-surface-on">
        {student.full_name}
      </td>
      <td className="px-6 py-4 text-body-md text-surface-on-variant">
        {student.username}
      </td>
      <td className="px-6 py-4 text-body-md text-surface-on-variant">
        {student.department || "—"}
      </td>
      <td className="px-6 py-4 text-body-md text-surface-on-variant">
        {student.roll_number || "—"}
      </td>
      <td className="px-6 py-4 text-body-md text-surface-on-variant">
        {new Date(student.created_at).toLocaleDateString("en-GB")}
      </td>
      <td className="px-6 py-4 text-right">
        <form
          action={deleteStudentAction}
          onSubmit={(e) => {
            if (
              !confirm(
                `Delete student "${student.username}"? This cannot be undone.`
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="user_id" value={student.id} />
          <button
            type="submit"
            className="w-9 h-9 rounded-full inline-flex items-center justify-center text-red-600 hover:bg-red-500/10 transition"
            aria-label={`Delete ${student.username}`}
          >
            <Trash2 size={16} />
          </button>
        </form>
      </td>
    </tr>
  );
}