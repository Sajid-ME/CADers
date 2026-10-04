"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import { logoutAction } from "@/app/login/actions";

type User = {
  username: string;
  full_name: string;
  role: string;
};

const links = [
  { href: "/", label: "Home" },
  { href: "/achievements", label: "Achievements" },
  { href: "/events", label: "Events" },
  { href: "/voices", label: "Voices" },
  { href: "/feedback", label: "Feedback" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-m-medium ease-m-standard ${
        elevated
          ? "bg-surface/75 backdrop-blur-xl border-b border-outline-variant/50 shadow-elev-1"
          : "bg-surface/50 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <nav className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-m-md bg-gradient-to-br from-primary to-secondary text-primary-on flex items-center justify-center font-bold shadow-elev-1 group-hover:shadow-elev-2 transition-shadow">
            C
          </div>
          <span className="text-title-lg text-primary font-semibold">
            CADers
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative px-4 py-2 rounded-full text-label-lg transition-all duration-m-short ease-m-standard ${
                    active
                      ? "text-primary bg-primary/10"
                      : "text-surface-on-variant hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button href="/login" variant="outlined" size="sm">
              Login
            </Button>
          )}
        </div>

        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 rounded-full text-surface-on hover:bg-primary/10 transition"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-outline-variant bg-surface/95 backdrop-blur-xl">
          <ul className="container py-4 flex flex-col gap-1">
            {links.map((l) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 rounded-full text-label-lg transition ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-surface-on-variant hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}

            <li className="pt-3 mt-3 border-t border-outline-variant">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-2">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-on flex items-center justify-center font-semibold">
                      {(user.full_name || user.username)
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="text-title-md text-surface-on truncate">
                        {user.full_name || user.username}
                      </p>
                      <p className="text-body-md text-surface-on-variant truncate">
                        @{user.username}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-1">
                    <Link
                      href={isAdmin ? "/admin" : "/dashboard"}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 rounded-full text-label-lg text-surface-on hover:bg-primary/10 hover:text-primary transition"
                    >
                      {isAdmin ? "Admin Panel" : "My Dashboard"}
                    </Link>
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="w-full text-left px-4 py-3 rounded-full text-label-lg text-red-600 dark:text-red-400 hover:bg-red-500/10 transition"
                      >
                        Sign out
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <Button href="/login" variant="filled" size="md" fullWidth>
                  Login
                </Button>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}