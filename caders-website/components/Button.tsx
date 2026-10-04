"use client";

import Link from "next/link";
import { MouseEvent, ReactNode, useState } from "react";

type Variant = "filled" | "outlined" | "text" | "elevated" | "tonal";
type Size = "sm" | "md" | "lg";

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  target?: string;
  rel?: string;
};

type RippleItem = { id: number; x: number; y: number; size: number };

const variants: Record<Variant, string> = {
  filled:
    "bg-primary text-primary-on hover:bg-primary-dark hover:shadow-elev-2 active:shadow-elev-1",
  tonal:
    "bg-primary-container text-primary-on-container hover:brightness-95 hover:shadow-elev-1",
  outlined:
    "bg-transparent text-primary border border-primary/50 hover:bg-primary/10",
  text: "bg-transparent text-primary hover:bg-primary/10",
  elevated:
    "bg-surface text-primary shadow-elev-1 hover:bg-surface-container hover:shadow-elev-3",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-5 text-label-md",
  md: "h-11 px-6 text-label-lg",
  lg: "h-12 px-8 text-label-lg",
};

export default function Button({
  children,
  variant = "filled",
  size = "md",
  href,
  onClick,
  type = "button",
  disabled,
  className = "",
  fullWidth = false,
  target,
  rel,
}: Props) {
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  function createRipple(e: MouseEvent<HTMLElement>) {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const diameter = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - diameter / 2;
    const y = e.clientY - rect.top - diameter / 2;
    const id = Date.now() + Math.random();

    setRipples((prev) => [...prev, { id, x, y, size: diameter }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.(e);
  }

  const classes = [
    "state-layer",
    "relative",
    "overflow-hidden",
    "inline-flex",
    "items-center",
    "justify-center",
    "rounded-full",
    "font-medium",
    "select-none",
    "transition-all",
    "duration-m-short",
    "ease-m-standard",
    "disabled:opacity-40",
    "disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
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

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={classes}
        onClick={createRipple}
        target={target}
        rel={rel}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={createRipple}
      disabled={disabled}
    >
      {content}
    </button>
  );
}