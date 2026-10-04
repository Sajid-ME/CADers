"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Button from "./Button";

const links = [
  { href: "/", label: "Home" },
  { href: "/achievements", label: "Achievements" },
  { href: "/events", label: "Events" },
  { href: "/voices", label: "Voices" },
  { href: "/feedback", label: "Feedback" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <div className="w-10 h-10 rounded-m-md bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold shadow-elev-1 group-hover:shadow-elev-2 transition-shadow">
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

        <div className="hidden md:block">
          <Button href="/login" variant="outlined" size="sm">
            Login
          </Button>
        </div>

        <button
          className="md:hidden p-2 rounded-full text-surface-on hover:bg-primary/10 transition"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
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
            <li className="pt-2">
              <Button href="/login" variant="filled" size="md" fullWidth>
                Login
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}