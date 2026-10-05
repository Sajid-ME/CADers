"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { MessageSquareQuote } from "lucide-react";
import Button from "@/components/Button";
import { createVoiceAction, type ActionState } from "../actions";

const initial: ActionState = { error: null, success: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="filled" size="md" disabled={pending}>
      <MessageSquareQuote size={16} />
      {pending ? "Adding..." : "Add Voice"}
    </Button>
  );
}

export default function AddVoiceForm() {
  const [state, action] = useActionState(createVoiceAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <div className="rounded-m-xl bg-surface-container border border-outline-variant p-6 md:p-8 shadow-elev-1">
      <h3 className="text-title-md text-surface-on mb-6">
        Add a moderator / faculty voice
      </h3>

      <form ref={formRef} action={action} className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="type"
            className="block text-label-md text-surface-on-variant mb-1.5"
          >
            Type
          </label>
          <select
            id="type"
            name="type"
            required
            defaultValue=""
            className="w-full rounded-m-md bg-surface-variant border border-outline px-4 py-3 text-body-lg text-surface-on focus:outline-none focus:border-primary focus:border-2 transition-all duration-m-short ease-m-standard appearance-none"
          >
            <option value="" disabled>
              Choose…
            </option>
            <option value="moderator">Moderator</option>
            <option value="faculty">Faculty Advisor</option>
          </select>
        </div>

        <Field name="name" label="Name" required />
        <Field name="designation" label="Designation (optional)" />
        <Field name="order_index" label="Order (e.g. 1, 2)" type="number" />

        <div className="relative md:col-span-2">
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder=" "
            className="peer w-full rounded-m-md bg-surface-variant border border-outline px-4 pt-6 pb-2 text-body-lg text-surface-on focus:outline-none focus:border-primary focus:border-2 transition-all duration-m-short ease-m-standard resize-y"
          />
          <label
            htmlFor="message"
            className="absolute left-4 top-2 text-label-md text-primary transition-all duration-m-short pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-body-md peer-placeholder-shown:text-surface-on-variant peer-focus:top-2 peer-focus:text-label-md peer-focus:text-primary"
          >
            Message
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