"use client";

import { MouseEvent, ReactNode, useState } from "react";

type RippleItem = {
  id: number;
  x: number;
  y: number;
  size: number;
};

type Props = {
  children: ReactNode;
  className?: string;
  as?: "button" | "div" | "span" | "a";
  href?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
};

export default function Ripple({
  children,
  className = "",
  as = "button",
  href,
  onClick,
  type = "button",
  disabled,
  ariaLabel,
}: Props) {
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  function handleClick(e: MouseEvent<HTMLElement>) {
    if (disabled) return;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y, size }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.(e);
  }

  const inner = (
    <>
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple-ink"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
          }}
        />
      ))}
    </>
  );

  const base = `state-layer ${className}`;

  if (as === "a" && href) {
    return (
      <a
        href={href}
        className={base}
        onClick={handleClick}
        aria-label={ariaLabel}
      >
        {inner}
      </a>
    );
  }

  if (as === "div" || as === "span") {
    const Tag = as;
    return (
      <Tag className={base} onClick={handleClick} aria-label={ariaLabel}>
        {inner}
      </Tag>
    );
  }

  return (
    <button
      type={type}
      className={base}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {inner}
    </button>
  );
}