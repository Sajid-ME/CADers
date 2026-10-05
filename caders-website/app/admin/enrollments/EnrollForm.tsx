"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { UserPlus } from "lucide-react";
import Button from "@/components/Button";
import { enrollStudentAction, type ActionState } from "../actions";

type Student = { id: string; username: string; full_name: string };
type Course = { id: string; name: string; order_index: number };

const initial: ActionState = { error: null, success: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="filled" size="md" disabled={pending}>
      <UserPlus size={16} />
      {pending ? "Enrolling..." : "Enroll Student"}
    </Button>
  );
}

export default function EnrollForm({
  students,
  courses,
}: {
  students: Student[];
  courses: Course[];
}) {
  const [state, action] = useActionState(enrollStudentAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  const disabled = students.length === 0 || courses.length === 0;

  return (
    <div className="rounded-m-xl bg-surface-container border border-outline-variant p-6 md:p-8 shadow-elev-1">
      <h3 className="text-title-md text-surface-on mb-6">Enroll a student</h3>

      {disabled ? (
        <p className="text-body-md text-surface-on-variant">
          {students.length === 0
            ? "You need at least one student first."
            : "You need at least one course first."}
        </p>
      ) : (
        <form ref={formRef} action={action} className="space-y-4">
          <Select
            name="student_id"
            label="Student"
            options={students.map((s) => ({
              value: s.id,
              label: `${s.full_name} (@${s.username})`,
            }))}
          />
          <Select
            name="course_id"
            label="Course"
            options={courses.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
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
    <div className="relative">
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