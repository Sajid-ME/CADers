"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { BookPlus } from "lucide-react";
import Button from "@/components/Button";
import { createCourseAction, type ActionState } from "../actions";

const initial: ActionState = { error: null, success: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="filled" size="md" disabled={pending}>
      <BookPlus size={16} />
      {pending ? "Creating..." : "Create Course"}
    </Button>
  );
}

export default function CreateCourseForm() {
  const [state, action] = useActionState(createCourseAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <div className="rounded-m-xl bg-surface-container border border-outline-variant p-6 md:p-8 shadow-elev-1">
      <h3 className="text-title-md text-surface-on mb-6">Create a course</h3>

      <form ref={formRef} action={action} className="space-y-4">
        <Field name="name" label="Course name" required />
        <Field name="description" label="Short description (optional)" />
        <Field
          name="order_index"
          label="Order (e.g., 1, 2, 3)"
          type="number"
        />

        {state.error && (
          <div className="rounded-m-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-body-md text-red-700 dark:text-red-300">
            {state.error}
          </div>
        )}
        {state.success && (
          <div className="rounded-m-md border border-primary/40 bg-primary/10 px-4 py-3 text-body-md text-primary">
            {state.success}
          </div>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  required,
  type = "text",
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="relative">
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder=" "
        className="peer w-full rounded-m-md bg-surface-variant border border-outline px-4 pt-6 pb-2 text-body-lg text-surface-on focus:outline-none focus:border-primary focus:border-2 transition-all duration-m-short ease-m-standard"
      />
      <label
        htmlFor={name}
        className="absolute left-4 top-2 text-label-md text-primary transition-all duration-m-short pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-body-md peer-placeholder-shown:text-surface-on-variant peer-focus:top-2 peer-focus:text-label-md peer-focus:text-primary"
      >
        {label}
      </label>
    </div>
  );
}