"use client";

import Section from "@/components/Section";
import Button from "@/components/Button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <Section
      title="Something went wrong"
      subtitle="An unexpected error occurred. You can try again."
    >
      <div className="text-center">
        <Button variant="filled" size="lg" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </Section>
  );
}