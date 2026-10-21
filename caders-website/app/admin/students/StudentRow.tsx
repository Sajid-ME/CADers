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
  courses?: string[];
};

export default function StudentRow({ student, courses = [] }: Props) {
  return (
    <tr className="hover:bg-surface-container-high/50 transition">
      <td className="px-6 py-4 text-body-md font-medium text-surface-on">
        {student.full_name}
      </td>
      <td className="px-6 py-4 text-body-md font-mono text-primary">
        {student.username}
      </td>
      <td className="px-6 py-4 text-body-md text-surface-on-variant">
        {student.department || "—"}
      </td>
      <td className="px-6 py-4 text-body-md text-surface-on-variant">
        {student.roll_number || "—"}
      </td>
      <td className="px-6 py-4">
        {courses.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {courses.map((c) => (
              <span
                key={c}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {c}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-surface-on-variant text-body-md">—</span>
        )}
      </td>
      <td className="px-6 py-4 text-body-md text-surface-on-variant whitespace-nowrap">
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
