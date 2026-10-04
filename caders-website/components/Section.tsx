import { ReactNode } from "react";

type Props = {
  id?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export default function Section({
  id,
  title,
  subtitle,
  children,
  className = "",
}: Props) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="container">
        {(title || subtitle) && (
          <div className="text-center mb-14 max-w-3xl mx-auto">
            {title && (
              <h2 className="text-headline-lg md:text-headline-lg text-surface-on">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-body-lg text-surface-on-variant">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}