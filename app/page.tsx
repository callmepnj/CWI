import Link from "next/link";
import { ArrowRight, FileText, Mail, ShieldCheck } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { posts } from "@/data/posts";
import { unansweredFiles } from "@/data/unanswered-files";
import { getLiveNewsroomFallbackItems, getPublishedLiveNewsroomItems } from "@/lib/db/live-newsroom";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const homepageFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Cockroach Watch India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cockroach Watch India, also known as CWI, is an independent civic watch, satire, commentary, public archive, and youth voice platform."
      }
    },
    {
      "@type": "Question",
      name: "Is CWI affiliated with Cockroach Janta Party?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. CWI is independent from Cockroach Janta Party unless officially declared otherwise."
      }
    }
  ]
};

const homepageWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Cockroach Watch India - CWI",
  url: absoluteUrl("/"),
  description: site.description,
  isPartOf: {
    "@type": "WebSite",
    name: site.name,
    url: site.url
  },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: absoluteUrl("/opengraph-image"),
    width: 1200,
    height: 630
  }
};

export const metadata = createMetadata({
  title: "Cockroach Watch India - CWI Live Newsroom",
  description:
    "Cockroach Watch India is an independent civic watch, satire, commentary, public archive, and youth voice platform. Enter the CWI Live Newsroom for verified context and corrections.",
  path: "/",
  keywords: ["Cockroach Watch India", "CWI Live Newsroom", "CWI", "India Unanswered Files", "public advisories", "youth voice"]
});

export default async function HomePage() {
  const dbLiveItems = await getPublishedLiveNewsroomItems(8).catch(() => []);
  const liveItems = mergeBySlug(dbLiveItems, getLiveNewsroomFallbackItems(8)).slice(0, 6);
  const developingItems = liveItems.filter((item) => ["Developing", "Reported", "Public Advisory"].includes(item.verificationStatus)).slice(0, 3);
  const archiveItems = [...posts].sort((first, second) => dateValue(second.date) - dateValue(first.date)).slice(0, 4);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageWebPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqJsonLd) }} />
      <HeroSection />

      <Section
        eyebrow="CWI Live Newsroom"
        title="Live from CWI Newsroom"
        subtitle="New public updates, advisories, and India Unanswered Files coverage with visible sources and dates."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {liveItems.map((item) => (
            <Link key={item.id} href={`/live-newsroom/${item.slug}`} className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-royal/35 hover:shadow-soft">
              <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-royal">
                {item.verificationStatus} / {item.sourceCount} sources
              </p>
              <h2 className="mt-3 font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">{item.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-ink/66">{item.summary}</p>
              <p className="mt-4 text-xs font-black uppercase leading-5 tracking-[0.1em] text-ink/45">
                What remains unclear: {item.whatRemainsUnclear.slice(0, 120)}
              </p>
            </Link>
          ))}
        </div>
        <Button asChild className="mt-8">
          <Link href="/live-newsroom">Enter Live Newsroom <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </Section>

      <Section eyebrow="Developing" title="Breaking / Developing" subtitle="Updates that need careful reading, clear attribution, and visible source context.">
        <div className="grid gap-5 md:grid-cols-3">
          {(developingItems.length ? developingItems : liveItems.slice(0, 3)).map((item) => (
            <Card key={item.id}>
              <CardLabel>{item.verificationStatus}</CardLabel>
              <h2 className="font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">{item.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-ink/66">{item.summary}</p>
              <Link href={`/live-newsroom/${item.slug}`} className="mt-5 inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-[0.14em] text-royal">
                Read update <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="India Unanswered Files"
        title="India Unanswered Files"
        subtitle="Public issues where records, responsibility, or official answers still need closer tracking."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {unansweredFiles.slice(0, 6).map((file) => (
            <Link key={file.slug} href={`/live-newsroom/${file.slug}`} className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-royal/35 hover:shadow-soft">
              <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-royal">{file.sourceCount} sources</p>
              <h2 className="mt-3 font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">{file.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-ink/66">{file.unansweredQuestion}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Submit a Report" subtitle="Send a public issue, source link, correction, creator credit request, or civic story to Cockroach Watch India.">
        <div className="rounded-[2rem] bg-gradient-to-br from-ink via-[#102a63] to-royal p-8 text-white shadow-soft">
          <FileText className="h-9 w-9 text-saffron" />
          <h2 className="mt-5 font-display text-4xl font-black uppercase leading-tight tracking-[-0.04em]">Help CWI verify the record.</h2>
          <p className="mt-4 max-w-3xl text-white/76">
            Submit source links, dates, creator credit, corrections, and public-interest context. Do not submit private data, threats, hate, or unverified allegations as fact.
          </p>
          <Button asChild className="mt-7" variant="saffron">
            <Link href="/submit">Submit Report</Link>
          </Button>
        </div>
      </Section>

      <Section
        eyebrow="What is CWI?"
        title="What is Cockroach Watch India?"
        subtitle="Independent civic watch, satire, and commentary platform tracking youth voice, public issues, corrections, and source trails."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Document", "Public issues, viral moments, creator work, and civic reactions."],
            ["Verify", "Source trails, correction requests, context notes, and careful labels."],
            ["Amplify", "Youth voice, public-interest satire, and reports that deserve attention."]
          ].map(([title, body]) => (
            <Card key={title}>
              <CardLabel>CWI</CardLabel>
              <h2 className="font-display text-3xl font-black uppercase">{title}</h2>
              <p className="mt-4 leading-7 text-ink/70">{body}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/cockroach-watch-india">Cockroach Watch India guide</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/about-cockroach-watch-india">About Cockroach Watch India</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/latest">Latest CWI updates</Link>
          </Button>
        </div>
      </Section>

      <Section eyebrow="Public Advisories" title="Public Advisories" subtitle="Verify-before-sharing notes, developing claims, creator credit requests, and platform restriction context.">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Verify before sharing", "CWI labels claims as reported, developing, or source-backed instead of treating viral posts as fact."],
            ["Creator credit matters", "Send source links and credit notes when public-interest material is missing attribution."],
            ["Official clarification awaited", "Where details are unclear, CWI keeps the update open for corrections and verified context."]
          ].map(([title, body]) => (
            <Card key={title}>
              <ShieldCheck className="h-6 w-6 text-royal" />
              <h2 className="mt-4 font-display text-2xl font-black uppercase tracking-[-0.03em]">{title}</h2>
              <p className="mt-3 leading-7 text-ink/70">{body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="CWI Archive" title="Archive preview" subtitle="Older CWI explainers and context posts are preserved as archive material. Current source-backed updates live in the Live Newsroom.">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {archiveItems.map((post) => (
            <Link key={post.slug} href={`/archive/${post.slug}`} className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-royal/35 hover:shadow-soft">
              <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-royal">{post.category}</p>
              <h2 className="mt-3 font-display text-xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">{post.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-ink/66">{post.summary}</p>
            </Link>
          ))}
        </div>
        <Button asChild className="mt-8" variant="outline">
          <Link href="/archive">Browse Archive</Link>
        </Button>
      </Section>

      <Section eyebrow="Follow CWI" title="Join the Watchlist" subtitle="Get CWI updates without sharing political preference or sensitive personal data.">
        <form className="grid gap-4 rounded-[2rem] border border-line bg-white p-6 shadow-card md:grid-cols-[1fr_auto]">
          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-ink/65">
            Email
            <input type="email" name="email" placeholder="you@example.com" className="rounded-2xl border border-line bg-paper px-4 py-3 normal-case tracking-normal outline-none focus:border-royal" />
          </label>
          <div className="flex flex-col justify-end gap-3">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-ink/60">
              <input type="checkbox" required />
              I consent to receive CWI updates.
            </label>
            <Button type="submit" className="w-fit">
              <Mail className="h-4 w-4" />
              Join Watchlist
            </Button>
          </div>
        </form>
      </Section>
    </>
  );
}

function mergeBySlug<T extends { slug: string }>(primary: T[], fallback: T[]) {
  const seen = new Set<string>();
  return [...primary, ...fallback].filter((item) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
}

function dateValue(value: string) {
  return new Date(`${value}T00:00:00+05:30`).getTime();
}
