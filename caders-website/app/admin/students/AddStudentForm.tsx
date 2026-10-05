"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { UserPlus, Copy, Check } from "lucide-react";
import Button from "@/components/Button";
import { createStudentAction, type ActionState } from "../actions";
import {
  DEPARTMENTS,
  USERNAME_DOMAIN,
  buildUsernameBase,
  deriveRollSuffix,
  deriveSurname,
} from "@/lib/departments";

const initial: ActionState = { error: null, success: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="filled" size="md" disabled={pending}>
      <UserPlus size={16} />
      {pending ? "Creating..." : "Create Student"}
    </Button>
  );
}

export default function AddStudentForm() {
  const [state, action] = useActionState(createStudentAction, initial);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [fullName, setFullName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [roll, setRoll] = useState("");
  const [surnameBase, setSurnameBase] = useState("");
  const [usernameOverride, setUsernameOverride] = useState<string | null>(null);

  // Auto-derive surname from full name until admin edits it manually
  const derivedSurname = useMemo(() => deriveSurname(fullName), [fullName]);

  useEffect(() => {
    // Only auto-fill surname field if the admin hasn't manually changed it
    if (surnameBase === "" || surnameBase === deriveSurname(fullName.slice(0, -1))) {
      setSurnameBase(derivedSurname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [derivedSurname]);

  // Computed username (admin can override)
  const computedUsername = useMemo(() => {
    if (!surnameBase || !deptCode || !roll) return "";
    return buildUsernameBase(surnameBase, deptCode, roll);
  }, [surnameBase, deptCode, roll]);

  const finalUsername = usernameOverride ?? computedUsername;

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setFullName("");
      setDeptCode("");
      setRoll("");
      setSurnameBase("");
      setUsernameOverride(null);
    }
  }, [state.success]);

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
        <div className="relative md:col-span-2">
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder=" "
            className="peer w-full rounded-m-md bg-surface-variant border border-outline px-4 pt-6 pb-2 text-body-lg text-surface-on focus:outline-none focus:border-primary focus:border-2 transition-all duration-m-short ease-m-standard"
          />
          <label
            htmlFor="full_name"
            className="absolute left-4 top-2 text-label-md text-primary transition-all duration-m-short pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-body-md peer-placeholder-shown:text-surface-on-variant peer-focus:top-2 peer-focus:text-label-md peer-focus:text-primary"
          >
            Full name (e.g. MK Sajid)
          </label>
        </div>

        <div className="relative">
          <input
            id="surname_base"
            name="surname_base"
            type="text"
            required
            value={surnameBase}
            onChange={(e) => setSurnameBase(e.target.value)}
            placeholder=" "
            className="peer w-full rounded-m-md bg-surface-variant border border-outline px-4 pt-6 pb-2 text-body-lg text-surface-on focus:outline-none focus:border-primary focus:border-2 transition-all duration-m-short ease-m-standard"
          />
          <label
            htmlFor="surname_base"
            className="absolute left-4 top-2 text-label-md text-primary transition-all duration-m-short pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-body-md peer-placeholder-shown:text-surface-on-variant peer-focus:top-2 peer-focus:text-label-md peer-focus:text-primary"
          >
            Surname base (auto from last name)
          </label>
        </div>

        <div>
          <label
            htmlFor="dept_code"
            className="block text-label-md text-surface-on-variant mb-1.5"
          >
            Department
          </label>
          <select
            id="dept_code"
            name="dept_code"
            required
            value={deptCode}
            onChange={(e) => setDeptCode(e.target.value)}
            className="w-full rounded-m-md bg-surface-variant border border-outline px-4 py-3 text-body-lg text-surface-on focus:outline-none focus:border-primary focus:border-2 transition-all duration-m-short ease-m-standard appearance-none"
          >
            <option value="" disabled>
              Choose department…
            </option>
            {DEPARTMENTS.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <input
            id="roll_number"
            name="roll_number"
            type="text"
            required
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            placeholder=" "
            className="peer w-full rounded-m-md bg-surface-variant border border-outline px-4 pt-6 pb-2 text-body-lg text-surface-on focus:outline-none focus:border-primary focus:border-2 transition-all duration-m-short ease-m-standard"
          />
          <label
            htmlFor="roll_number"
            className="absolute left-4 top-2 text-label-md text-primary transition-all duration-m-short pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-body-md peer-placeholder-shown:text-surface-on-variant peer-focus:top-2 peer-focus:text-label-md peer-focus:text-primary"
          >
            Roll number (e.g. 2305021)
          </label>
        </div>

        <div className="relative md:col-span-2">
          <input
            id="username"
            name="username"
            type="text"
            required
            value={finalUsername}
            onChange={(e) => setUsernameOverride(e.target.value.toLowerCase())}
            placeholder=" "
            className="peer w-full rounded-m-md bg-surface-variant border border-outline px-4 pt-6 pb-2 text-body-lg text-surface-on focus:outline-none focus:border-primary focus:border-2 transition-all duration-m-short ease-m-standard"
          />
          <label
            htmlFor="username"
            className="absolute left-4 top-2 text-label-md text-primary transition-all duration-m-short pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-body-md peer-placeholder-shown:text-surface-on-variant peer-focus:top-2 peer-focus:text-label-md peer-focus:text-primary"
          >
            Username (auto — editable)
          </label>
          {finalUsername && (
            <p className="mt-2 text-label-md text-surface-on-variant">
              Login email will be:{" "}
              <span className="text-primary font-medium">
                {finalUsername}
                {USERNAME_DOMAIN}
              </span>
            </p>
          )}
        </div>

        <div className="relative md:col-span-2">
          <input
            id="password"
            name="password"
            type="text"
            placeholder=" "
            className="peer w-full rounded-m-md bg-surface-variant border border-outline px-4 pt-6 pb-2 text-body-lg text-surface-on focus:outline-none focus:border-primary focus:border-2 transition-all duration-m-short ease-m-standard"
          />
          <label
            htmlFor="password"
            className="absolute left-4 top-2 text-label-md text-primary transition-all duration-m-short pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-body-md peer-placeholder-shown:text-surface-on-variant peer-focus:top-2 peer-focus:text-label-md peer-focus:text-primary"
          >
            Password (leave blank to auto-generate)
          </label>
        </div>

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