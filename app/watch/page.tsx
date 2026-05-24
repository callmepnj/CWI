import Link from "next/link";
import { ArrowRight, FileSearch, Send } from "lucide-react";
import { Section } from "@/components/Section";
import { SocialLinks } from "@/components/SocialLinks";
import { WatchCarousel } from "@/components/WatchCarousel";
import { WatchCategoryCard } from "@/components/WatchCategoryCard";
import { WatchDeskCard } from "@/components/WatchDeskCard";
import { WatchPageHero } from "@/components/WatchPageHero";
import { WatchVerificationPromise } from "@/components/WatchVerificationPromise";
import { UnansweredFileVisual } from "@/components/UnansweredFileVisual";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { posts } from "@/data/posts";
import { unansweredFiles } from "@/data/unanswered-files";
import { watchAdvisories, watchCategories } from "@/data/watch";
import { absoluteUrl, createMetadata } from "@/lib/seo";

const watchDescription =
  "The Watch by Cockroach Watch India tracks public issues, viral claims, creator credit requests, civic advisories, youth voice, and source-backed Watch Desk updates.";

export const metadata = createMetadata({
  title: "The Watch - Cockroach Watch India",
  description: watchDescription,
  path: "/watch",
  keywords: [
    "Cockroach Watch India",
    "CWI",
    "The Watch",
    "Watch Desk",
    "public issues",
    "viral claims",
    "creator credit",
    "youth voice",
    "civic watch",
    "India is watching"
  ]
});

const watchJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "The Watch - Cockroach Watch India",
  url: absoluteUrl("/watch"),
  description: watchDescription,
  about: [
    "Public issues",
    "Viral claims",
    "Creator credit",
    "Youth voice",
    "Civic advisories",
    "Source-backed Watch Desk updates"
  ]
};

export default function WatchPage() {
  const latestArticles = [...posts]
    .sort((first, second) => dateValue(second.date) - dateValue(first.date))
    .slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(watchJsonLd) }} />
      <WatchPageHero />

      <Section
        eyebrow="Latest Advisories"
        title="Latest Public Advisories"
        subtitle="Public advisories are context notes, not legal findings. CWI labels developing or unverified claims clearly before amplification."
      >
        <div
          id="advisories"
          className="rounded-[2rem] bg-[#071123] p-4 shadow-[0_24px_70px_rgba(11,92,255,0.16)] sm:p-6"
        >
          <WatchCarousel alerts={watchAdvisories} />
        </div>
      </Section>

      <Section
        eyebrow="Investigative Watch"
        title="Manipur: The State India Forgot?"
        subtitle="A source-backed CWI investigation into the Manipur crisis from 2023 to 2026, covering violence, displacement, delayed response, political accountability, and unanswered questions."
      >
        <Card className="overflow-hidden bg-gradient-to-br from-[#040711] via-[#071225] to-[#13080d] text-white before:from-red-500 before:via-sky-400 before:to-saffron">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <CardLabel className="bg-sky-400/[0.12] text-sky-100 ring-sky-300/20">CWI Investigative Page</CardLabel>
              <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-white sm:text-5xl">
                A complete evidence-based timeline of Manipur
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">
                Track what began in May 2023, what remained unresolved through 2026, what official sources claimed, what independent reporting showed, and why many Manipuris felt abandoned.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="saffron">
                  <Link href="/watch/manipur-crisis">Open Investigation <FileSearch className="h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 bg-white/[0.08] text-white hover:bg-white/[0.14]">
                  <Link href="/submit">Submit source or correction</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
              <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-saffron">
                Includes
              </p>
              <div className="mt-4 grid gap-2 text-sm font-bold leading-6 text-white/70">
                <span>Timeline 2023-2026</span>
                <span>Human cost and relief camps</span>
                <span>Political accountability frames</span>
                <span>Searchable source archive</span>
                <span>Source-bound AI research box</span>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      <Section
        eyebrow="Investigative Archive"
        title="India's Unanswered Files"
        subtitle="A source-backed CWI section for under-reported public-interest cases where citizens demanded justice, rehabilitation, transparency, or accountability."
      >
        <Card className="overflow-hidden bg-gradient-to-br from-white via-skywash to-white">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center">
            <div>
              <CardLabel>18 case files / searchable sources</CardLabel>
              <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-ink sm:text-5xl">
                We are not against a party. We are against silence.
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-ink/70">
                Explore Manipur, Ladakh, Joshimath, Great Nicobar, Hasdeo, NEET, Electoral Bonds, bulldozer demolitions, farmers&apos; protests, and other files with source labels, timelines, case filters, and CWI AI explainers.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/unanswered-files">Open India&apos;s Unanswered Files <FileSearch className="h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/submit">Submit source or correction</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-3">
              {unansweredFiles.slice(0, 2).map((file) => (
                <UnansweredFileVisual key={file.slug} file={file} />
              ))}
            </div>
          </div>
        </Card>
      </Section>

      <Section
        eyebrow="What We Track"
        title="What We Track"
        subtitle="The Watch connects reports, claims, creator work, public issues, and source-backed articles into one civic memory system."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {watchCategories.map((category, index) => (
            <WatchCategoryCard key={category.title} index={index} {...category} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Watch Desk Articles"
        title="Source-backed Watch Desk Articles"
        subtitle="Latest researched explainers and updates from CWI, with visible sources, verification labels, dates, and correction paths."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((post) => (
            <WatchDeskCard key={post.slug} post={post} />
          ))}
        </div>
        <Button asChild className="mt-8" variant="green">
          <Link href="/watch-desk">Read all Watch Desk articles <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </Section>

      <Section title="Submit to the Watch" subtitle="Seen something important? Don't let it disappear in the feed.">
        <div className="rounded-[2rem] bg-gradient-to-br from-ink via-[#102a63] to-royal p-8 text-white shadow-soft">
          <CardLabel className="bg-white/12 text-saffron ring-white/15">Watch Intake</CardLabel>
          <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.04em]">
            Seen something important? Submit it to the Watch.
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-white/72">
            Send public issues, viral claims, source links, creator credit requests, corrections, or youth stories. CWI reviews submissions before publishing.
          </p>
          <Button asChild className="mt-7" variant="saffron">
            <Link href="/submit">Submit Report <Send className="h-4 w-4" /></Link>
          </Button>
        </div>
      </Section>

      <Section
        eyebrow="Verification Promise"
        title="Document. Verify. Amplify."
        subtitle="The Watch is active, but not reckless. Public memory needs proof, context, and responsible labels."
      >
        <WatchVerificationPromise />
      </Section>

      <Section title="Join the Watch. India is watching.">
        <Card className="bg-gradient-to-br from-white to-skywash">
          <CardLabel>Footer CTA</CardLabel>
          <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
            The youth are not silent. The Watch never sleeps.
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-ink/70">
            Follow CWI, submit reports, and read the latest source-backed articles as public issues, viral claims, and civic updates develop.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/submit">Submit Report</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#follow-cwi">Follow CWI</Link>
            </Button>
            <Button asChild variant="green">
              <Link href="/watch-desk">Read Latest Articles</Link>
            </Button>
          </div>
        </Card>
        <div id="follow-cwi" className="mt-8">
          <SocialLinks />
        </div>
      </Section>
    </>
  );
}

function dateValue(value: string) {
  return new Date(`${value}T00:00:00+05:30`).getTime();
}
