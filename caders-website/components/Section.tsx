import { ReactNode } from "react";
import Reveal from "./Reveal";

type Props = {
  id?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  /** "fresh" (default): clean top, mint bottom. "deep": mint top, clean bottom. "none": no gradient. */
  tone?: "fresh" | "deep" | "none";
};

const tones = {
  fresh: "bg-section-fresh",
  deep: "bg-section-deep",
  none: "",
};

export default function Section({
  id,
  title,
  subtitle,
  children,
  className = "",
  tone = "fresh",
}: Props) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${tones[tone]} ${className}`}
    >
      <div className="container">
        <Reveal>
          {(title || subtitle) && (
            <div className="text-center mb-14 max-w-3xl mx-auto">
              {title && (
                <h2 className="text-headline-lg text-surface-on">{title}</h2>
              )}
              {subtitle && (
                <p className="mt-4 text-body-lg text-surface-on-variant">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  );
}