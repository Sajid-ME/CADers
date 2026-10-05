"use client";

import { Trash2 } from "lucide-react";
import { deleteEnrollmentAction } from "../actions";

type Props = {
  enrollment: {
    id: string;
    enrolled_at: string;
    student: { id: string; username: string; full_name: string } | null;
    course: { id: string; name: string } | null;
  };
};

export default function EnrollmentRow({ enrollment }: Props) {
  return (
    <tr className="hover:bg-surface-container-high/50 transition">
      <td className="px-6 py-4 text-body-md text-surface-on">
        {enrollment.student?.full_name ?? "—"}
      </td>
      <td className="px-6 py-4 text-body-md text-surface-on-variant">
        {enrollment.student?.username ?? "—"}
      </td>
      <td className="px-6 py-4 text-body-md text-surface-on-variant">
        {enrollment.course?.name ?? "—"}
      </td>
      <td className="px-6 py-4 text-body-md text-surface-on-variant">
        {new Date(enrollment.enrolled_at).toLocaleDateString("en-GB")}
      </td>
      <td className="px-6 py-4 text-right">
        <form
          action={deleteEnrollmentAction}
          onSubmit={(e) => {
            if (
              !confirm(
                `Remove enrollment for "${
                  enrollment.student?.full_name ?? "this student"
                }"?`
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="enrollment_id" value={enrollment.id} />
          <button
            type="submit"
            className="w-9 h-9 rounded-full inline-flex items-center justify-center text-red-600 hover:bg-red-500/10 transition"
            aria-label="Remove enrollment"
          >
            <Trash2 size={16} />
          </button>
        </form>
      </td>
    </tr>
  );
}