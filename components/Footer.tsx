import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

const exploreLinks = [
  { label: "Live Newsroom", href: "/live-newsroom" },
  { label: "India Unanswered Files", href: "/india-unanswered-files" },
  { label: "Archive", href: "/archive" },
  { label: "Submit Report", href: "/submit" },
];

const trustLinks = [
  { label: "Editorial Policy", href: "/editorial-policy" },
  { label: "Credit Policy", href: "/credit-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Corrections", href: "/corrections" },
  { label: "Contact", href: "/contact" },
  { label: "About CWI", href: "/about" },
  { label: "Terms", href: "/terms" },
];

const socialLinks = [
  { label: "Instagram", href: site.instagram },
  { label: "X", href: site.x },
  { label: "YouTube", href: site.youtube },
  { label: "Reddit", href: site.reddit },
  { label: "Facebook", href: site.facebook },
  { label: "Bluesky", href: site.bluesky },
  { label: "Email", href: `mailto:${site.email}` },
];

export function Footer() {
  return (
    <footer className="bg-ink px-4 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.3fr_0.6fr_0.6fr_0.6fr]">
        {/* Brand Column */}
        <div>
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-white ring-1 ring-white/15">
              <Image
                src="/brand/logo.png"
                alt="Cockroach Watch India CWI logo"
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </span>
            <div>
              <p className="font-display text-2xl font-black uppercase leading-none tracking-[-0.04em]">
                Cockroach Watch India
              </p>
              <p className="mt-1 font-mono text-[0.62rem] font-black uppercase tracking-[0.18em] text-saffron">
                Document. Verify. Amplify.
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
            Cockroach Watch India — CWI is an independent civic watch, satire, commentary, and public archive platform.
            We document, verify, and amplify youth voice, public issues, creator credit, source-backed updates, and
            India&apos;s unanswered files.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <Link
              href="/support"
              className="rounded-full border border-saffron/30 bg-saffron/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-saffron transition hover:bg-saffron/20"
            >
              Support CWI
            </Link>
            <Link
              href="/submit"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/75 transition hover:bg-white/10"
            >
              Submit a Report
            </Link>
          </div>
        </div>

        {/* Explore Column */}
        <div>
          <p className="mb-4 font-mono text-xs font-black uppercase tracking-[0.18em] text-saffron">Explore</p>
          <nav className="grid gap-2">
            {exploreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold leading-6 text-white/70 transition hover:text-saffron"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Trust Column */}
        <div>
          <p className="mb-4 font-mono text-xs font-black uppercase tracking-[0.18em] text-saffron">Trust</p>
          <nav className="grid gap-2">
            {trustLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold leading-6 text-white/70 transition hover:text-saffron"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Social Column */}
        <div>
          <p className="mb-4 font-mono text-xs font-black uppercase tracking-[0.18em] text-saffron">Social</p>
          <nav className="grid gap-2">
            {socialLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className="text-sm font-bold leading-6 text-white/70 transition hover:text-saffron"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-white/40">
          © {new Date().getFullYear()} Cockroach Watch India. Not affiliated with any political party.
        </p>
      </div>
    </footer>
  );
}
