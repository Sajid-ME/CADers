import { Mail, MapPin, Phone, Share2 } from "lucide-react";
import { FacebookIcon, LinkedInIcon, YouTubeIcon } from "./SocialIcons";

const MAP_QUERY = "Khulna University of Engineering and Technology";

const socialChannels = [
  {
    href: "https://www.facebook.com/caders.kuet",
    label: "Facebook",
    icon: FacebookIcon,
    hoverClass: "hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10",
  },
  {
    href: "https://www.linkedin.com/company/caders/",
    label: "LinkedIn",
    icon: LinkedInIcon,
    hoverClass: "hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10",
  },
  {
    href: "https://www.youtube.com/@CADersKUET",
    label: "YouTube",
    icon: YouTubeIcon,
    hoverClass: "hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/10",
  },
];

export default function ContactSection() {
  return (
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
            body: <>+880 1521-719758</>,
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

        {/* Social channels card */}
        <div className="flex items-start gap-4 rounded-m-lg bg-surface-container border border-outline-variant p-5 shadow-elev-1">
          <Share2 className="text-primary mt-1 shrink-0" size={24} />
          <div className="flex-1">
            <h3 className="text-title-md text-surface-on">Social Channels</h3>
            <p className="text-body-md text-surface-on-variant mt-1 mb-3">
              Follow CADers on our official platforms.
            </p>
            <div className="flex items-center gap-2.5">
              {socialChannels.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`CADers on ${s.label}`}
                    title={s.label}
                    className={`w-9 h-9 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center text-surface-on-variant transition-all duration-m-short ease-m-standard shadow-sm hover:scale-105 ${s.hoverClass}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
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
  );
}
