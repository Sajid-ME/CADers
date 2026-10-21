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

type NavItem = {
  href: string;
  label: string;
  exact?: boolean;
};

const publicLinks: NavItem[] = [
  { href: "/#home", label: "Home" },
  { href: "/#achievements", label: "Achievements" },
  { href: "/#events", label: "Events" },
  { href: "/#voices", label: "Voices" },
  { href: "/feedback", label: "Feedback" },
  { href: "/#contact", label: "Contact" },
];

const adminLinks: NavItem[] = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/enrollments", label: "Enrollments" },
  { href: "/admin/materials", label: "Materials" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/achievements", label: "Achievements" },
  { href: "/admin/voices", label: "Voices" },
  { href: "/admin/logs", label: "Login Logs" },
];

const studentLinks: NavItem[] = [
  { href: "/dashboard", label: "My Courses", exact: true },
  { href: "/feedback", label: "Feedback" },
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

  const isInAdmin = pathname.startsWith("/admin");
  const isInDashboard = pathname.startsWith("/dashboard");
  const isPanel = isInAdmin || isInDashboard;

  const navItems = isInAdmin
    ? adminLinks
    : isInDashboard
    ? studentLinks
    : publicLinks;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-m-medium ease-m-standard ${
        elevated
          ? "bg-surface/85 backdrop-blur-xl border-b border-outline-variant/60 shadow-elev-1"
          : "bg-surface/60 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <nav className="container flex items-center justify-between h-16 gap-3">
        {/* Brand — clicking CADers always takes you to the website homepage */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0" title="CADers Home">
          <img
            src="/logo.png"
            alt="CADers logo"
            className="h-9 w-auto object-contain transition-transform duration-m-medium ease-m-standard group-hover:scale-105"
          />
          <div className="flex flex-col justify-center">
            <span className="text-title-lg text-primary font-semibold leading-none tracking-tight">
              CADers
            </span>
            {isInAdmin ? (
              <span className="text-[10px] uppercase tracking-wider text-primary font-bold mt-0.5">
                Admin
              </span>
            ) : isInDashboard ? (
              <span className="text-[10px] uppercase tracking-wider text-secondary font-bold mt-0.5">
                Student
              </span>
            ) : user ? (
              <span className="text-[10px] uppercase tracking-widest text-primary/70 font-bold mt-0.5">
                {user.role === "admin" || user.role === "super_admin"
                  ? "Admin"
                  : "Student"}
              </span>
            ) : null}
          </div>
        </Link>

        {/* Center Nav: Contextual (Admin / Student / Public) */}
        <ul className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            let active = false;
            if (isPanel) {
              active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
            } else {
              const isAnchor = item.href.startsWith("/#");
              active = isAnchor
                ? pathname === "/" && item.label === "Home"
                : pathname.startsWith(item.href);
            }

            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  className={`relative px-3.5 py-1.5 rounded-full text-label-md lg:text-label-lg transition-all duration-m-short ease-m-standard select-none whitespace-nowrap ${
                    active
                      ? "text-primary bg-primary/12 font-medium shadow-sm"
                      : "text-surface-on-variant hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right action group */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <ThemeToggle />

          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button href="/login" variant="outlined" size="sm">
              Login
            </Button>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 rounded-full text-surface-on hover:bg-primary/10 transition"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-t border-outline-variant bg-surface/95 backdrop-blur-xl">
          <ul className="container py-4 flex flex-col gap-1">
            {navItems.map((item) => {
              let active = false;
              if (isPanel) {
                active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              } else {
                const isAnchor = item.href.startsWith("/#");
                active = isAnchor
                  ? pathname === "/" && item.label === "Home"
                  : pathname.startsWith(item.href);
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-2.5 rounded-full text-label-lg transition ${
                      active
                        ? "bg-primary/15 text-primary font-medium"
                        : "text-surface-on-variant hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}

            <li className="pt-3 mt-3 border-t border-outline-variant">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-2">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-on flex items-center justify-center font-semibold">
                      {(user.full_name || user.username).charAt(0).toUpperCase()}
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
                      href={
                        user.role === "admin" || user.role === "super_admin"
                          ? "/admin"
                          : "/dashboard"
                      }
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 rounded-full text-label-lg text-surface-on hover:bg-primary/10 hover:text-primary transition"
                    >
                      {user.role === "admin" || user.role === "super_admin"
                        ? "Admin Panel"
                        : "My Dashboard"}
                    </Link>
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="w-full text-left px-4 py-2.5 rounded-full text-label-lg text-red-600 dark:text-red-400 hover:bg-red-500/10 transition"
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
