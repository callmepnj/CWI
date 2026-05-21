import Link from "next/link";
import { ArrowRight, Flame, Newspaper, RadioTower, TrendingUp } from "lucide-react";
import { Section } from "@/components/Section";
import { WatchDeskCard } from "@/components/WatchDeskCard";
import { WatchDeskGrid } from "@/components/WatchDeskGrid";
import { Card, CardLabel } from "@/components/ui/card";
import { posts, trendingTopics } from "@/data/posts";
import { createMetadata } from "@/lib/seo";

const newsroomStats = [
  { label: "Watch Desk Articles", value: `${posts.length}+`, Icon: Newspaper },
  { label: "Trending Topics", value: `${trendingTopics.length}`, Icon: TrendingUp },
  { label: "Archive Mode", value: "Active", Icon: RadioTower },
  { label: "Most Discussed", value: "CJP / Cockroach wave", Icon: Flame }
];

export const metadata = createMetadata({
  title: "CWI Watch Desk - Updates, Explainers & Civic Notes",
  description:
    "Read Cockroach Watch India updates, explainers, public reactions, youth voice stories, fact-check notes, creator spotlights, and Cockroach wave archive posts.",
  path: "/watch-desk"
});

export default function WatchDeskPage() {
  const featured = posts[0];
  const highlights = posts.slice(1, 4);

  return (
    <>
      <Section
        eyebrow="CWI Digital Newsroom"
        title="The Watch Desk"
        titleAs="h1"
        subtitle="The internet archive and newsroom of the Cockroach wave: explainers, public reactions, youth voice, creator-led commentary, civic satire, and public issue signals."
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="bg-gradient-to-br from-ink via-[#102a63] to-royal text-white">
            <CardLabel className="bg-white/12 text-saffron ring-white/20">Featured article</CardLabel>
            <h2 className="font-display text-5xl font-black uppercase leading-none tracking-[-0.05em]">{featured.title}</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/76">{featured.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {featured.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white/78 ring-1 ring-white/15">
                  {tag}
                </span>
              ))}
            </div>
            <Link href={`/watch-desk/${featured.slug}`} className="mt-8 inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-ink">
              Read featured article <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>

          <div className="grid gap-4">
            {newsroomStats.map(({ label, value, Icon }) => (
              <Card key={label} className="p-5">
                <Icon className="h-6 w-6 text-royal" />
                <p className="mt-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-ink/45">{label}</p>
                <p className="mt-2 font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">{value}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow="Watch Desk Highlights" title="Trending newsroom notes">
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((post) => (
            <WatchDeskCard key={post.slug} post={post} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Archive Search" title="All Watch Desk articles" subtitle="Filter by category, search topic clusters, and read CWI&apos;s public-interest archive of the Cockroach wave.">
        <WatchDeskGrid posts={posts} />
      </Section>
    </>
  );
}
