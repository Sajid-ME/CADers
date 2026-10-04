"use client";

import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const next = !isDark;
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="relative w-10 h-10 rounded-full inline-flex items-center justify-center text-surface-on-variant hover:text-primary hover:bg-primary/10 transition-all duration-m-short ease-m-standard"
    >
      {/* Show Sun in dark mode, Moon in light mode */}
      <Sun size={20} className="hidden dark:block" />
      <Moon size={20} className="block dark:hidden" />
    </button>
  );
}