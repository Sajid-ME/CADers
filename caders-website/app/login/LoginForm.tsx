"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import Button from "@/components/Button";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="filled"
      size="lg"
      fullWidth
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Signing in…
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  );
}

export default function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next ?? ""} />

      {/* ── Username field ── */}
      <div className="relative">
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          placeholder=" "
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-describedby={state.error ? "login-error" : undefined}
          className="peer w-full rounded-m-md bg-surface-variant border border-outline px-4 pt-6 pb-2 text-body-lg text-surface-on focus:outline-none focus:border-primary focus:border-2 transition-all duration-m-short ease-m-standard"
        />
        <label
          htmlFor="username"
          className="absolute left-4 top-2 text-label-md text-primary transition-all duration-m-short pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-body-md peer-placeholder-shown:text-surface-on-variant peer-focus:top-2 peer-focus:text-label-md peer-focus:text-primary"
        >
          Username or email
        </label>
      </div>

      {/* ── Password field ── */}
      <div className="relative">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          placeholder=" "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="peer w-full rounded-m-md bg-surface-variant border border-outline px-4 pt-6 pb-2 pr-12 text-body-lg text-surface-on focus:outline-none focus:border-primary focus:border-2 transition-all duration-m-short ease-m-standard"
        />
        <label
          htmlFor="password"
          className="absolute left-4 top-2 text-label-md text-primary transition-all duration-m-short pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-body-md peer-placeholder-shown:text-surface-on-variant peer-focus:top-2 peer-focus:text-label-md peer-focus:text-primary"
        >
          Password
        </label>
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-surface-on-variant hover:text-primary hover:bg-primary/10 transition"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* ── Error message ── */}
      {state.error && (
        <div
          id="login-error"
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-2.5 rounded-m-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-body-md text-red-700 dark:text-red-300"
        >
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      <SubmitButton />

      {/* Hint text */}
      <p className="text-center text-label-md text-surface-on-variant">
        Enter your CADers username (e.g.{" "}
        <span className="font-medium text-surface-on">sajidme021</span>) or
        full email address.
      </p>
    </form>
  );
}