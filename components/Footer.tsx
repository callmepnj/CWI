import Image from "next/image";
import Link from "next/link";
import { posts, trendingTopics } from "@/data/posts";
import { site } from "@/lib/site";

const footerGroups = [
  {
    title: "Newsroom",
    links: [
      { label: "Live Newsroom", href: "/live-newsroom" },
      { label: "Archive", href: "/watch-desk" },
      { label: "India Unanswered Files", href: "/india-unanswered-files" },
      { label: "Corrections", href: "/corrections" },
      { label: "Submit Report", href: "/submit" }
    ]
  },
  {
    title: "About",
    links: [
      { label: "About CWI", href: "/about" },
      { label: "What is CWI", href: "/what-is-cwi" },
      { label: "Editorial Policy", href: "/editorial-policy" },
      { label: "Credit Policy", href: "/credit-policy" },
      { label: "Contact", href: "/contact" }
    ]
  },
  {
    title: "Civic Pages",
    links: [
      { label: "Watch", href: "/watch" },
      { label: "Manipur Investigation", href: "/watch/manipur-crisis" },
      { label: "Issues", href: "/issues" },
      { label: "Youth Voice", href: "/youth-voice" },
      { label: "Five-Point Agenda", href: "/five-point-agenda" },
      { label: "Support CWI", href: "/support" }
    ]
  },
  {
    title: "Policy",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
      { label: "Media Bank", href: "/media-bank" },
      { label: "Charter", href: "/charter" }
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
  const latestPosts = [...posts].sort((first, second) => dateValue(second.date) - dateValue(first.date)).slice(0, 3);

  return (
    <footer className="bg-ink px-4 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
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
            <p className="font-display text-4xl font-black uppercase leading-none tracking-[-0.04em]">
              Cockroach Watch India
            </p>
          </div>
          <p className="mt-4 max-w-xl text-white/72">
            Cockroach Watch India is an independent civic watch, satire, commentary, and public archive platform tracking youth voice, public issues, creator credit, and source-backed civic memory.
          </p>
          <p className="mt-6 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-4 text-sm font-bold uppercase leading-6 tracking-[0.06em] text-white/78">
            {site.disclaimer}
          </p>
          <div className="mt-6">
            <p className="mb-4 font-mono text-xs font-black uppercase tracking-[0.18em] text-saffron">Latest archive notes</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {latestPosts.map((post) => (
                <Link key={post.slug} href={`/watch-desk/${post.slug}`} className="block rounded-2xl border border-white/10 bg-white/5 p-3 text-xs font-black uppercase leading-5 tracking-[0.1em] text-white/78 transition hover:border-saffron/60 hover:text-saffron">
                  {post.title}
                </Link>
              ))}
            </div>
            <p className="mt-5 text-xs font-bold uppercase leading-6 tracking-[0.08em] text-white/52">
              Trending: {trendingTopics.slice(0, 5).join(" / ")}
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.18em] text-saffron">{group.title}</p>
              <div className="grid gap-2">
                {group.links.map((link) => (
                  <FooterLink key={`${group.title}-${link.href}`} label={link.label} href={link.href} />
                ))}
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
      className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/78 transition hover:border-saffron/60 hover:bg-white/10 hover:text-saffron"
    >
      {label}
    </Link>
  );
}

function dateValue(value: string) {
  return new Date(`${value}T00:00:00+05:30`).getTime();
}
