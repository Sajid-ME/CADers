"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import Button from "@/components/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-16 overflow-hidden">
      {/* Soft background glows */}
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-red-500/10 blur-[120px]" />
      <div className="absolute -bottom-40 -left-32 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />

      <div className="container relative max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <AlertTriangle size={36} className="text-red-500 dark:text-red-400" />
        </div>

        <h1 className="text-headline-lg text-surface-on">Something went wrong</h1>
        <p className="mt-4 text-body-lg text-surface-on-variant">
          An unexpected error occurred. Our team has been notified. You can try
          refreshing the page or returning home.
        </p>

        {/* Error digest for support reference (never shows the raw stack) */}
        {error.digest && (
          <p className="mt-4 text-label-md text-surface-on-variant font-mono">
            Error ID: <span className="text-surface-on">{error.digest}</span>
          </p>
        )}

        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <Button variant="filled" size="lg" onClick={() => reset()}>
            Try again
          </Button>
          <Button href="/" variant="outlined" size="lg">
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}