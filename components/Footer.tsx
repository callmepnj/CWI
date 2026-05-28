import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

const footerGroups = [
  {
    title: "Main",
    links: [
      { label: "Home", href: "/" },
      { label: "Live Newsroom", href: "/live-newsroom" },
      { label: "Unanswered Files", href: "/india-unanswered-files" },
      { label: "Archive", href: "/archive" },
      { label: "Submit", href: "/submit" },
      { label: "Support", href: "/support" }
    ]
  },
  {
    title: "Trust",
    links: [
      { label: "About CWI", href: "/about" },
      { label: "Editorial Policy", href: "/editorial-policy" },
      { label: "Corrections", href: "/corrections" },
      { label: "Credit Policy", href: "/credit-policy" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
      { label: "Contact", href: "/contact" }
    ]
  },
  {
    title: "Social",
    links: [
      { label: "X", href: site.x },
      { label: "Instagram", href: site.instagram },
      { label: "YouTube", href: site.youtube },
      { label: "Reddit", href: site.reddit },
      { label: "Facebook", href: site.facebook },
      { label: "Bluesky", href: site.bluesky },
      { label: "Email", href: `mailto:${site.email}` }
    ]
  }
];

export function Footer() {
  return (
    <footer className="border-t border-cwi-brown/18 bg-cwi-ink px-4 py-12 text-cwi-cream">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-lg border border-cwi-cream/15 bg-white">
              <Image src="/brand/logo.png" alt="Cockroach Watch India CWI logo" width={56} height={56} className="h-full w-full object-cover" />
            </span>
            <div>
              <p className="font-display text-3xl font-black uppercase leading-none sm:text-4xl">Cockroach Watch India</p>
              <p className="mt-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-cwi-saffron">Live Newsroom / Public archive</p>
            </div>
          </div>
          <p className="mt-5 max-w-2xl leading-7 text-cwi-cream/74">
            CWI is an independent civic watch, satire, commentary, Live Newsroom, and public archive platform. Current updates live in the Live Newsroom; older explainers are preserved in the Archive.
          </p>
          <p className="mt-6 max-w-3xl rounded-lg border border-cwi-cream/12 bg-cwi-cream/6 p-4 text-xs font-bold uppercase leading-6 tracking-[0.08em] text-cwi-cream/72">
            {site.disclaimer}
          </p>
          <div className="mt-5 max-w-xl rounded-lg border border-cwi-cream/12 bg-cwi-cream/6 p-4">
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-cwi-saffron">Join the Watchlist</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-cwi-cream/70">Watchlist signup coming soon. It will ask only for email and consent.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
              <input disabled type="email" placeholder="Email signup coming soon" className="min-h-11 rounded-lg border border-cwi-cream/12 bg-cwi-cream/10 px-3 text-sm font-bold text-cwi-cream placeholder:text-cwi-cream/45" />
              <button disabled type="button" className="min-h-11 rounded-lg border border-cwi-saffron/30 bg-cwi-saffron/20 px-4 font-mono text-xs font-black uppercase tracking-[0.12em] text-cwi-saffron opacity-80">Coming soon</button>
            </div>
            <label className="mt-3 flex gap-2 text-xs font-bold leading-5 text-cwi-cream/62">
              <input disabled type="checkbox" className="mt-0.5 h-4 w-4 rounded border-cwi-cream/30" />
              Consent checkbox will be required when signup opens.
            </label>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.18em] text-cwi-saffron">{group.title}</p>
              <div className="grid gap-2">
                {group.links.map((link) => <FooterLink key={`${group.title}-${link.href}`} label={link.label} href={link.href} />)}
              </div>
            </nav>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  return (
    <Link
      href={href}
      target={external && href.startsWith("http") ? "_blank" : undefined}
      rel={external && href.startsWith("http") ? "noreferrer" : undefined}
      className="rounded-lg border border-cwi-cream/10 bg-cwi-cream/5 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-cwi-cream/76 transition hover:border-cwi-saffron/60 hover:bg-cwi-cream/10 hover:text-cwi-saffron"
    >
      {label}
    </Link>
  );
}