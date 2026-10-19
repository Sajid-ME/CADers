import Section from "@/components/Section";
import Button from "@/components/Button";

export default function NotFound() {
  return (
    <Section
      title="Page not found"
      subtitle="The page you're looking for doesn't exist or has moved."
    >
      <div className="text-center">
        <Button href="/" variant="filled" size="lg">
          Back to home
        </Button>
      </div>
    </Section>
  );
}