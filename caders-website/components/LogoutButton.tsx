"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/login/actions";
import { useFormStatus } from "react-dom";

function Inner() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-label-lg text-surface-on-variant hover:text-primary hover:bg-primary/10 transition disabled:opacity-50"
    >
      <LogOut size={16} />
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Inner />
    </form>
  );
}