"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Upload } from "lucide-react";
import Button from "@/components/Button";
import { uploadMaterialAction, type ActionState } from "../actions";

type Course = { id: string; name: string; order_index: number };

const initial: ActionState = { error: null, success: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="filled" size="md" disabled={pending}>
      <Upload size={16} />
      {pending ? "Uploading..." : "Upload Material"}
    </Button>
  );
}

export default function UploadForm({ courses }: { courses: Course[] }) {
  const [state, action] = useActionState(uploadMaterialAction, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setFileName("");
    }
  }, [state.success]);

  const disabled = courses.length === 0;

  return (
    <div className="rounded-m-xl bg-surface-container border border-outline-variant p-6 md:p-8 shadow-elev-1">
      <h3 className="text-title-md text-surface-on mb-6">Upload material</h3>

      {disabled ? (
        <p className="text-body-md text-surface-on-variant">
          Create a course first in the Enrollments tab.
        </p>
      ) : (
        <form
          ref={formRef}
          action={action}
          className="grid gap-4 md:grid-cols-2"
        >
          <Select
            name="course_id"
            label="Course"
            options={courses.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
          />
          <Select
            name="type"
            label="Type"
            options={[
              { value: "slide", label: "Slide" },
              { value: "hw", label: "Homework" },
              { value: "cw", label: "Classwork" },
            ]}
          />

          <div className="relative md:col-span-2">
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder=" "
              className="peer w-full rounded-m-md bg-surface-variant border border-outline px-4 pt-6 pb-2 text-body-lg text-surface-on focus:outline-none focus:border-primary focus:border-2 transition-all duration-m-short ease-m-standard"
            />
            <label
              htmlFor="title"
              className="absolute left-4 top-2 text-label-md text-primary transition-all duration-m-short pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-body-md peer-placeholder-shown:text-surface-on-variant peer-focus:top-2 peer-focus:text-label-md peer-focus:text-primary"
            >
              Title
            </label>
          </div>

          {/* File picker */}
          <div className="md:col-span-2">
            <label
              htmlFor="file"
              className="flex items-center gap-3 w-full rounded-m-md border-2 border-dashed border-outline bg-surface-variant px-4 py-6 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-m-short ease-m-standard"
            >
              <Upload className="text-primary" size={20} />
              <span className="text-body-md text-surface-on-variant flex-1 truncate">
                {fileName || "Choose a file (PDF, PPTX, DOCX — max 20 MB)"}
              </span>
              <input
                id="file"
                name="file"
                type="file"
                accept=".pdf,.ppt,.pptx,.doc,.docx,.zip"
                required
                onChange={(e) =>
                  setFileName(e.target.files?.[0]?.name ?? "")
                }
                className="sr-only"
              />
            </label>
          </div>

          {state.error && (
            <div className="md:col-span-2 rounded-m-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-body-md text-red-700 dark:text-red-300">
              {state.error}
            </div>
          )}
          {state.success && (
            <div className="md:col-span-2 rounded-m-md border border-primary/40 bg-primary/10 px-4 py-3 text-body-md text-primary">
              {state.success}
            </div>
          )}

          <div className="md:col-span-2">
            <SubmitButton />
          </div>
        </form>
      )}
    </div>
  );
}

function Select({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-label-md text-surface-on-variant mb-1.5"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        required
        defaultValue=""
        className="w-full rounded-m-md bg-surface-variant border border-outline px-4 py-3 text-body-lg text-surface-on focus:outline-none focus:border-primary focus:border-2 transition-all duration-m-short ease-m-standard appearance-none"
      >
        <option value="" disabled>
          Choose {label.toLowerCase()}…
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}