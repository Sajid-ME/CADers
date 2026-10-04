"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { UserPlus, Copy, Check } from "lucide-react";
import Button from "@/components/Button";
import { createStudentAction, type ActionState } from "../actions";

const initial: ActionState = { error: null, success: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="filled"
      size="md"
      disabled={pending}
    >
      <UserPlus size={16} />
      {pending ? "Creating..." : "Create Student"}
    </Button>
  );
}

export default function AddStudentForm() {
  const [state, action] = useActionState(createStudentAction, initial);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the form when the student was successfully created
  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  // Extract password from the success message for the copy button
  const passwordMatch = state.success?.match(/Password: "([^"]+)"/);
  const password = passwordMatch?.[1];

  async function copyPassword() {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="rounded-m-xl bg-surface-container border border-outline-variant p-6 md:p-8 shadow-elev-1">
      <h3 className="text-title-md text-surface-on mb-6">Add a new student</h3>

      <form ref={formRef} action={action} className="grid gap-4 md:grid-cols-2">
        <Field name="full_name" label="Full name" required />
        <Field name="username" label="Username" required />
        <Field name="department" label="Department (optional)" />
        <Field name="roll_number" label="Roll number (optional)" />
        <Field
          name="password"
          label="Password (leave blank to auto-generate)"
          className="md:col-span-2"
        />

        {state.error && (
          <div className="md:col-span-2 rounded-m-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-body-md text-red-700 dark:text-red-300">
            {state.error}
          </div>
        )}

        {state.success && (
          <div className="md:col-span-2 rounded-m-md border border-primary/40 bg-primary/10 px-4 py-3 text-body-md text-primary flex items-start justify-between gap-4 flex-wrap">
            <span className="flex-1 break-all">{state.success}</span>
            {password && (
              <button
                type="button"
                onClick={copyPassword}
                className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-on text-label-md hover:bg-primary-dark transition"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy password"}
              </button>
            )}
          </div>
        )}

        <div className="md:col-span-2">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  required,
  className = "",
}: {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <input
        id={name}
        name={name}
        type="text"
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