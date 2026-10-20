import Link from "next/link";
import { ExternalLink, Mail, MapPin } from "lucide-react";

const quickLinks = [
  { href: "/achievements", label: "Achievements" },
  { href: "/events", label: "Events" },
  { href: "/voices", label: "Voices" },
  { href: "/feedback", label: "Feedback" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook" },  // Update to actual page
  { href: "https://github.com", label: "GitHub" },       // Update to actual org
  { href: "https://linkedin.com", label: "LinkedIn" },   // Update to actual page
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
          {/* Social links */}
          <div className="mt-5 flex flex-wrap gap-2">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`CADers on ${s.label}`}
                className="px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant text-label-md text-surface-on-variant hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-m-short ease-m-standard"
              >
                {s.label}
              </a>
            ))}
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