import Link from "next/link";
import Button from "@/components/Button";

export const metadata = {
  title: "Page not found | CADers",
};

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-16 overflow-hidden">
      {/* Soft background glows */}
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute -bottom-40 -left-32 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[120px]" />

      {/* Blueprint grid */}
      <div className="absolute inset-0 bg-blueprint opacity-50" />

      <div className="container relative max-w-lg text-center">
        {/* Giant 404 */}
        <p className="text-[8rem] md:text-[10rem] font-bold leading-none bg-gradient-to-b from-primary/30 to-primary/5 bg-clip-text text-transparent select-none" aria-hidden>
          404
        </p>

        <h1 className="mt-4 text-headline-lg text-surface-on -mt-4 relative">
          Page not found
        </h1>
        <p className="mt-4 text-body-lg text-surface-on-variant">
          The page you&apos;re looking for doesn&apos;t exist, may have been moved, or you
          might not have permission to view it.
        </p>

        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <Button href="/" variant="filled" size="lg">
            Back to home
          </Button>
          <Button href="/events" variant="outlined" size="lg">
            View events
          </Button>
        </div>

        {/* Helpful links */}
        <div className="mt-10 pt-8 border-t border-outline-variant">
          <p className="text-label-md text-surface-on-variant mb-3">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-body-md">
            {[
              { href: "/#achievements", label: "Achievements" },
              { href: "/feedback", label: "Feedback" },
              { href: "/contact", label: "Contact" },
              { href: "/login", label: "Login" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-primary hover:underline"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}