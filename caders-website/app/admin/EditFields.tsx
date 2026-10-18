"use client";

import { useFormStatus } from "react-dom";
import { Check } from "lucide-react";
import Button from "@/components/Button";

const fieldClass =
  "w-full rounded-m-md bg-surface-variant border border-outline px-4 py-2.5 text-body-md text-surface-on focus:outline-none focus:border-primary focus:border-2 transition-all duration-m-short ease-m-standard";

const labelClass = "block text-label-md text-surface-on-variant mb-1.5";

export function EditInput({
  name,
  label,
  defaultValue,
  required,
  type = "text",
  className = "",
}: {
  name: string;
  label: string;
  defaultValue?: string | number | null;
  required?: boolean;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass}>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        className={fieldClass}
      />
    </label>
  );
}

export function EditTextarea({
  name,
  label,
  defaultValue,
  required,
  className = "",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass}>{label}</span>
      <textarea
        name={name}
        rows={4}
        required={required}
        defaultValue={defaultValue ?? ""}
        className={`${fieldClass} resize-y`}
      />
    </label>
  );
}

export function EditSelect({
  name,
  label,
  defaultValue,
  options,
  className = "",
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass}>{label}</span>
      <select
        name={name}
        required
        defaultValue={defaultValue}
        className={`${fieldClass} appearance-none`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Must be rendered inside the <form> (uses useFormStatus). */
export function EditActions({
  onCancel,
  error,
}: {
  onCancel: () => void;
  error: string | null;
}) {
  const { pending } = useFormStatus();
  return (
    <div className="md:col-span-2 space-y-3">
      {error && (
        <div className="rounded-m-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-body-md text-red-700 dark:text-red-300">
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <Button type="submit" variant="filled" size="sm" disabled={pending}>
          <Check size={14} />
          {pending ? "Saving..." : "Save changes"}
        </Button>
        <Button type="button" variant="text" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}