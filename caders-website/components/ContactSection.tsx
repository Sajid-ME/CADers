import { Mail, MapPin, Phone, Share2, ExternalLink } from "lucide-react";
import { FacebookIcon, LinkedInIcon, YouTubeIcon } from "./SocialIcons";

const MAP_LINK = "https://maps.app.goo.gl/P6PfRWXY4EfZKCLf7";
const EMBED_MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1838.25!2d89.5017612!3d22.9004184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ff9bd9e91f1eed%3A0xd4854c7541cf5ee!2sDepartment%20of%20Mechanical%20Engineering!5e0!3m2!1sen!2sbd!4v1700000000000";

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
            title: "Venue & Address",
            body: (
              <>
                Building of Department of Mechanical Engineering,
                <br />
                Khulna University of Engineering &amp; Technology (KUET),
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

      {/* Interactive Google Map Preview Container */}
      <div className="relative rounded-m-lg overflow-hidden border border-outline-variant shadow-elev-2 hover:shadow-elev-3 transition-all duration-m-medium ease-m-standard min-h-[380px] flex flex-col bg-surface-container">
        <iframe
          title="CADers Venue - Department of Mechanical Engineering, KUET"
          src={EMBED_MAP_SRC}
          className="w-full flex-1 min-h-[380px] border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a
          href={MAP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 bg-surface/95 dark:bg-surface-container-high/95 backdrop-blur-md px-4 py-2 rounded-full text-label-md text-surface-on shadow-elev-2 border border-outline hover:border-primary hover:text-primary transition-all flex items-center gap-2 group"
        >
          <MapPin size={16} className="text-primary group-hover:scale-110 transition-transform" />
          <span className="font-medium">Open in Google Maps</span>
          <ExternalLink size={13} className="text-surface-on-variant group-hover:text-primary" />
        </a>
      </div>
    </div>
  );
}
