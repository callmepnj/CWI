import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";
import { Section } from "@/components/Section";
import { SocialLinks } from "@/components/SocialLinks";
import { WatchCarousel } from "@/components/WatchCarousel";
import { WatchCategoryCard } from "@/components/WatchCategoryCard";
import { WatchDeskCard } from "@/components/WatchDeskCard";
import { WatchPageHero } from "@/components/WatchPageHero";
import { WatchVerificationPromise } from "@/components/WatchVerificationPromise";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { posts } from "@/data/posts";
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
