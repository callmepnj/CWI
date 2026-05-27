import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileCheck, Newspaper, ShieldCheck, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const pagePath = "/about-cockroach-watch-india";

export const metadata = createMetadata({
  title: "About Cockroach Watch India - CockroachWatchIndia and CWI",
  description:
    "About Cockroach Watch India, also written as CockroachWatchIndia or CWI: an independent civic watch, satire, commentary, public archive and youth voice platform.",
  path: pagePath,
  keywords: [
    "About Cockroach Watch India",
    "CockroachWatchIndia",
    "CWI",
    "Cockroach Watch India official",
    "Cockroach Watch India platform",
    "@CockroachWatchIndia"
  ]
});

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Cockroach Watch India",
  url: absoluteUrl(pagePath),
  description:
    "About Cockroach Watch India, also written as CockroachWatchIndia or CWI, an independent civic watch, satire, commentary and public archive platform.",
  about: {
    "@type": "Organization",
    name: "Cockroach Watch India",
    alternateName: ["CockroachWatchIndia", "CWI", "@CockroachWatchIndia"],
    url: site.url,
    logo: absoluteUrl("/brand/logo.png"),
    sameAs: [site.instagram, site.x, site.youtube, site.telegram, site.reddit, site.facebook, site.bluesky]
  }
};

const cards = [
  ["Civic watch", "Tracks public issues, source trails, corrections and public advisories.", Newspaper],
  ["Youth voice", "Keeps space for student, creator and citizen-led public-interest conversation.", UsersRound],
  ["Careful labels", "Separates verified updates, developing claims, opinion, satire and archive material.", FileCheck],
  ["Clear boundaries", "Not a government body, court, police authority, emergency service or official political party platform.", ShieldCheck]
] as const;

export default function AboutCockroachWatchIndiaPage() {
  return (
    <main className="bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-skywash px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-royal">
              About the platform
            </p>
            <h1 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-ink sm:text-6xl">
              About Cockroach Watch India
            </h1>
            <p className="mt-6 text-lg font-semibold leading-8 text-ink/74">
              Cockroach Watch India, also written as CockroachWatchIndia or CWI, is an independent civic watch, satire, commentary and public archive platform.
            </p>
            <p className="mt-4 leading-8 text-ink/68">
              This page exists to help readers confirm the platform identity, understand what CWI covers, and find the main entity guide and latest updates without confusion between spaced and unspaced searches.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/cockroach-watch-india">Read the CWI platform guide</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/latest">Latest CWI updates <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
          <div className="rounded-[2rem] border border-line bg-paper p-4 shadow-soft">
            <Image
              src="/brand/logo.png"
              alt="Cockroach Watch India CWI logo for the official about page"
              width={720}
              height={720}
              className="aspect-square w-full rounded-[1.5rem] object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map(([title, body, Icon]) => (
            <Card key={title}>
              <Icon className="h-8 w-8 text-royal" />
              <h2 className="mt-5 font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">{title}</h2>
              <p className="mt-4 leading-8 text-ink/70">{body}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardLabel>Independence</CardLabel>
          <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">What CWI is and is not</h2>
          <div className="mt-5 space-y-5 text-lg leading-8 text-ink/72">
            <p>
              CWI covers public-interest commentary, youth voice, civic satire, creator-credit questions, public advisories, India Unanswered Files and source-backed updates where possible.
            </p>
            <p>
              CWI is not an official government platform, court, police authority, emergency service or formal representative body. It is not the official Cockroach Janta Party unless an affiliation is clearly declared.
            </p>
            <p>
              Readers can use the platform guide to understand why Cockroach Watch India, CockroachWatchIndia, CWI and @CockroachWatchIndia refer to the same brand identity.
            </p>
          </div>
        </Card>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ["Entity guide", "/cockroach-watch-india", "Cockroach Watch India platform guide"],
            ["Latest", "/latest", "Latest CWI updates"],
            ["Submit", "/submit", "Submit a source or correction"]
          ].map(([title, href, label]) => (
            <Link key={href} href={href} className="rounded-3xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-royal/35 hover:shadow-soft">
              <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-royal">{title}</p>
              <p className="mt-4 font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">{label}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
