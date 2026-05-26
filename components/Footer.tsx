import Image from "next/image";
import Link from "next/link";
import { posts, trendingTopics } from "@/data/posts";
import { site } from "@/lib/site";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Watch", href: "/watch" },
  { label: "CWI Live Newsroom", href: "/live-newsroom" },
  { label: "Cockroach Watch India", href: "/" },
  { label: "CWI Watch Desk", href: "/watch-desk" },
  { label: "India Unanswered Files", href: "/india-unanswered-files" },
  { label: "Manipur Investigation", href: "/watch/manipur-crisis" },
  { label: "About CWI", href: "/about" },
  { label: "Charter", href: "/charter" },
  { label: "Watch Desk", href: "/watch-desk" },
  { label: "Issues", href: "/issues" },
  { label: "Join", href: "/join" },
  { label: "Submit Report", href: "/submit" },
  { label: "Contact CWI", href: "/contact" },
  { label: "Five-Point Agenda", href: "/five-point-agenda" },
  { label: "Youth Voice", href: "/youth-voice" },
  { label: "Media Bank", href: "/media-bank" },
  { label: "Editorial Policy", href: "/editorial-policy" },
  { label: "Credit Policy", href: "/credit-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "X", href: site.x },
  { label: "Instagram", href: site.instagram },
  { label: "YouTube", href: site.youtube },
  { label: "Reddit", href: site.reddit },
  { label: "Facebook", href: site.facebook },
  { label: "Bluesky", href: site.bluesky },
  { label: "Email", href: `mailto:${site.email}` }
];

export function Footer() {
  const latestPosts = [...posts].sort((first, second) => dateValue(second.date) - dateValue(first.date)).slice(0, 4);

  return (
    <footer className="bg-ink px-4 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.8fr_0.8fr]">
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
            Cockroach Watch India — CWI is an independent civic watch, satire, and commentary platform. We document, verify, and amplify youth voice, public issues, civic satire, creator credit, and source-backed updates.
          </p>
          <p className="mt-6 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-4 text-sm font-bold uppercase leading-6 tracking-[0.06em] text-white/78">
            {site.disclaimer}
          </p>
        </div>
        <div>
          <p className="mb-4 font-mono text-xs font-black uppercase tracking-[0.18em] text-saffron">Latest updates</p>
          <div className="space-y-3">
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
        <div className="grid grid-cols-2 gap-3">
          {footerLinks.map((link) => (
            <Link
              key={`${link.label}-${link.href}`}
              href={link.href}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/78 transition hover:border-saffron/60 hover:bg-white/10 hover:text-saffron"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

function dateValue(value: string) {
  return new Date(`${value}T00:00:00+05:30`).getTime();
}
