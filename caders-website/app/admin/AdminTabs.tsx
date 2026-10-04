"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

export default function AdminTabs({ items }: { items: Item[] }) {
  const pathname = usePathname();

  return (
    <div className="border-b border-outline-variant bg-surface">
      <div className="container">
        <nav className="flex gap-1 overflow-x-auto -mb-px">
          {items.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 px-4 py-4 text-label-lg border-b-2 transition-all duration-m-short ease-m-standard ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-surface-on-variant hover:text-primary hover:border-primary/40"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}