import Section from "@/components/Section";
import ContactSection from "@/components/ContactSection";

export const metadata = {
  title: "Contact | CADers",
  description: "Get in touch with CADers, KUET.",
};

export default function ContactPage() {
  return (
    <Section
      title="Contact Us"
      subtitle="We'd love to hear from you. Reach out anytime."
    >
      <ContactSection />
    </Section>
  );
}