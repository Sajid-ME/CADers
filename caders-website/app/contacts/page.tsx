import Section from "@/components/Section";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
  title: "Contact | CADers",
  description: "Get in touch with CADers, KUET.",
};

const MAP_QUERY = "Khulna University of Engineering and Technology";

export default function ContactPage() {
  return (
    <Section
      title="Contact Us"
      subtitle="We'd love to hear from you. Reach out anytime."
    >
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-5">
          {[
            {
              icon: <MapPin className="text-primary mt-1" />,
              title: "Address",
              body: (
                <>
                  CADers, Khulna University of Engineering &amp; Technology,
                  <br />
                  Khulna 9203, Bangladesh
                </>
              ),
            },
            {
              icon: <Mail className="text-primary mt-1" />,
              title: "Email",
              body: (
                <a
                  href="mailto:caders.kuet@gmail.com"
                  className="hover:text-primary transition"
                >
                  caders.kuet@gmail.com
                </a>
              ),
            },
            {
              icon: <Phone className="text-primary mt-1" />,
              title: "Phone",
              body: <>+880 1XXX-XXXXXX</>,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-m-lg bg-surface-container border border-outline-variant p-5 shadow-elev-1"
            >
              {item.icon}
              <div>
                <h3 className="text-title-md text-surface-on">{item.title}</h3>
                <p className="text-body-md text-surface-on-variant mt-1">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            MAP_QUERY
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-m-lg overflow-hidden border border-outline-variant shadow-elev-2 hover:shadow-elev-4 transition-all duration-m-medium ease-m-standard"
        >
          <iframe
            title="CADers location"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              MAP_QUERY
            )}&output=embed`}
            className="w-full h-80 md:h-full pointer-events-none"
            loading="lazy"
          />
        </a>
      </div>
    </Section>
  );
}