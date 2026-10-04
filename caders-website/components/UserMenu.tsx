"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, ShieldCheck, LogOut } from "lucide-react";
import { logoutAction } from "@/app/login/actions";

type User = {
  username: string;
  full_name: string;
  role: string;
};

export default function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const displayName = user.full_name || user.username;
  const initial = displayName.charAt(0).toUpperCase();
  const firstName = displayName.split(" ")[0];
  const isAdmin = user.role === "admin" || user.role === "super_admin";
  const dashHref = isAdmin ? "/admin" : "/dashboard";
  const dashLabel = isAdmin ? "Admin Panel" : "My Dashboard";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-primary/10 transition-all duration-m-short ease-m-standard"
      >
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-on flex items-center justify-center text-label-lg font-semibold">
          {initial}
        </span>
        <span className="hidden lg:inline text-label-lg text-surface-on max-w-[140px] truncate">
          {firstName}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-64 rounded-m-lg bg-surface-container border border-outline-variant shadow-elev-3 overflow-hidden"
        >
          <div className="px-4 py-4 border-b border-outline-variant">
            <p className="text-title-md text-surface-on truncate">
              {displayName}
            </p>
            <p className="text-body-md text-surface-on-variant truncate">
              @{user.username}
            </p>
            {isAdmin && (
              <p className="mt-2 inline-block px-2 py-0.5 rounded-full bg-primary-container text-primary-on-container text-label-md uppercase">
                {user.role === "super_admin" ? "Super Admin" : "Admin"}
              </p>
            )}
          </div>

          <Link
            href={dashHref}
            onClick={() => setOpen(false)}
            role="menuitem"
            className="flex items-center gap-3 px-4 py-3 text-body-md text-surface-on hover:bg-primary/10 transition"
          >
            {isAdmin ? <ShieldCheck size={16} /> : <LayoutDashboard size={16} />}
            {dashLabel}
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              role="menuitem"
              className="w-full flex items-center gap-3 px-4 py-3 text-body-md text-red-600 dark:text-red-400 hover:bg-red-500/10 transition"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}