"use client";

import { Download, Trash2 } from "lucide-react";
import { deleteMaterialAction } from "../actions";

type Props = {
  material: {
    id: string;
    type: "slide" | "hw" | "cw";
    title: string;
    uploaded_at: string;
    signedUrl: string | null;
    course: { id: string; name: string } | null;
  };
};

const typeLabels = {
  slide: "Slide",
  hw: "Homework",
  cw: "Classwork",
};

export default function MaterialRow({ material }: Props) {
  return (
    <tr className="hover:bg-surface-container-high/50 transition">
      <td className="px-6 py-4 text-body-md text-surface-on">
        {material.title}
      </td>
      <td className="px-6 py-4 text-body-md text-surface-on-variant">
        {material.course?.name ?? "—"}
      </td>
      <td className="px-6 py-4">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-container text-primary-on-container text-label-md">
          {typeLabels[material.type]}
        </span>
      </td>
      <td className="px-6 py-4 text-body-md text-surface-on-variant">
        {new Date(material.uploaded_at).toLocaleDateString("en-GB")}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1">
          {material.signedUrl && (
            <a
              href={material.signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full inline-flex items-center justify-center text-primary hover:bg-primary/10 transition"
              aria-label="Download"
            >
              <Download size={16} />
            </a>
          )}
          <form
            action={deleteMaterialAction}
            onSubmit={(e) => {
              if (!confirm(`Delete "${material.title}"? This cannot be undone.`)) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="material_id" value={material.id} />
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
  );
}