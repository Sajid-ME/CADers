import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { FacebookIcon, LinkedInIcon, YouTubeIcon, MailIcon } from "./SocialIcons";

const quickLinks = [
  { href: "/achievements", label: "Achievements" },
  { href: "/events", label: "Events" },
  { href: "/voices", label: "Voices" },
  { href: "/feedback", label: "Feedback" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  {
    href: "https://www.facebook.com/caders.kuet",
    label: "Facebook",
    icon: FacebookIcon,
    hoverColor: "hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10",
  },
  {
    href: "https://www.linkedin.com/company/caders/",
    label: "LinkedIn",
    icon: LinkedInIcon,
    hoverColor: "hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10",
  },
  {
    href: "https://www.youtube.com/@CADersKUET",
    label: "YouTube",
    icon: YouTubeIcon,
    hoverColor: "hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/10",
  },
  {
    href: "mailto:caders.kuet@gmail.com",
    label: "Email",
    icon: MailIcon,
    hoverColor: "hover:text-primary hover:border-primary/40 hover:bg-primary/10",
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface-container-high mt-20 border-t border-outline-variant">
      <div className="container py-14 grid gap-10 md:grid-cols-3">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="CADers logo"
              className="h-10 w-auto object-contain"
            />
            <div>
              <h3 className="text-title-lg text-primary leading-none">CADers</h3>
              <p className="text-label-md text-surface-on-variant mt-0.5">KUET</p>
            </div>
          </div>
          <p className="mt-4 text-body-md text-surface-on-variant max-w-xs">
            Official engineering design club of KUET — promoting CAD skills and
            producing quality designers.
          </p>

          {/* Social links with logos */}
          <div className="mt-6">
            <p className="text-label-md text-surface-on-variant mb-2.5 font-medium">
              Connect with us
            </p>
            <div className="flex items-center gap-2.5">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                const isMail = s.href.startsWith("mailto:");
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={isMail ? undefined : "_blank"}
                    rel={isMail ? undefined : "noopener noreferrer"}
                    aria-label={`CADers on ${s.label}`}
                    title={s.label}
                    className={`w-10 h-10 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-surface-on-variant transition-all duration-m-short ease-m-standard shadow-sm hover:scale-105 ${s.hoverColor}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-title-md text-surface-on mb-4">Quick Links</h4>
          <ul className="space-y-3 text-body-md text-surface-on-variant">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="hover:text-primary transition-colors duration-m-short ease-m-standard"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + university link */}
        <div>
          <h4 className="text-title-md text-surface-on mb-4">Contact</h4>
          <address className="not-italic text-body-md text-surface-on-variant space-y-3">
            <p>
              Khulna University of Engineering &amp; Technology
              <br />
              Khulna 9203, Bangladesh
            </p>
            <a
              href="mailto:caders.kuet@gmail.com"
              className="hover:text-primary transition-colors"
            >
              caders.kuet@gmail.com
            </a>
          </address>
          <a
            href="https://kuet.ac.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-label-md text-surface-on-variant hover:text-primary transition-colors"
          >
            <ExternalLink size={13} />
            kuet.ac.bd
          </a>
        </div>
      </div>

      <div className="border-t border-outline-variant py-5 text-center text-label-md text-surface-on-variant">
        © {new Date().getFullYear()} CADers, KUET. All rights reserved.
      </div>
    </footer>
  );
}
