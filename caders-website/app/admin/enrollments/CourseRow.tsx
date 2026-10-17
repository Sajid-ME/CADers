"use client";

import { useState } from "react";
import { Pencil, Check, X, Trash2 } from "lucide-react";
import { updateCourseAction, deleteCourseAction } from "../actions";

type Course = {
  id: string;
  name: string;
  order_index: number;
};

export default function CourseRow({ course }: { course: Course }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <tr className="hover:bg-surface-container-high/50 transition">
      <td className="px-6 py-4 text-body-md text-surface-on">
        {isEditing ? (
          <form
            action={async (formData) => {
              await updateCourseAction(formData);
              setIsEditing(false);
            }}
            className="flex items-center gap-2 max-w-md"
          >
            <input type="hidden" name="course_id" value={course.id} />
            <input
              name="name"
              defaultValue={course.name}
              required
              autoFocus
              className="w-full rounded-m-md border border-outline bg-surface px-3 py-1.5 text-body-md focus:outline-none focus:border-primary focus:border-2"
            />
            <button
              type="submit"
              className="p-2 text-primary hover:bg-primary/10 rounded-full transition"
              title="Save"
            >
              <Check size={18} />
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-2 text-surface-on-variant hover:bg-red-500/10 hover:text-red-600 rounded-full transition"
              title="Cancel"
            >
              <X size={18} />
            </button>
          </form>
        ) : (
          <span className="font-medium">{course.name}</span>
        )}
      </td>
      <td className="px-6 py-4 text-body-md text-surface-on-variant">
        {course.order_index}
      </td>
      <td className="px-6 py-4 text-right">
        {!isEditing && (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="w-9 h-9 rounded-full inline-flex items-center justify-center text-primary hover:bg-primary/10 transition"
              title="Edit course name"
            >
              <Pencil size={16} />
            </button>
            <form
              action={deleteCourseAction}
              onSubmit={(e) => {
                if (!confirm(`Delete course "${course.name}"? This will remove all related enrollments and materials.`)) {
                  e.preventDefault();
                }
              }}
            >
              <input type="hidden" name="course_id" value={course.id} />
              <button
                type="submit"
                className="w-9 h-9 rounded-full inline-flex items-center justify-center text-red-600 hover:bg-red-500/10 transition"
                title="Delete course"
              >
                <Trash2 size={16} />
              </button>
            </form>
          </div>
        )}
      </td>
    </tr>
  );
}