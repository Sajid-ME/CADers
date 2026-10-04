import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-high mt-20 border-t border-outline-variant">
      <div className="container py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-m-md bg-primary text-white flex items-center justify-center font-bold">
              C
            </div>
            <h3 className="text-title-lg text-primary">CADers</h3>
          </div>
          <p className="mt-4 text-body-md text-surface-on-variant max-w-xs">
            Official club of KUET promoting engineering design and CAD skills.
          </p>
        </div>

        <div>
          <h4 className="text-title-md text-surface-on mb-4">Quick Links</h4>
          <ul className="space-y-3 text-body-md text-surface-on-variant">
            {[
              { href: "/achievements", label: "Achievements" },
              { href: "/events", label: "Events" },
              { href: "/voices", label: "Voices" },
              { href: "/feedback", label: "Feedback" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
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

        <div>
          <h4 className="text-title-md text-surface-on mb-4">Contact</h4>
          <p className="text-body-md text-surface-on-variant">
            Khulna University of Engineering &amp; Technology
            <br />
            Khulna 9203, Bangladesh
          </p>
        </div>
      </div>

      <div className="border-t border-outline-variant py-5 text-center text-label-md text-surface-on-variant">
        © {new Date().getFullYear()} CADers, KUET. All rights reserved.
      </div>
    </footer>
  );
}