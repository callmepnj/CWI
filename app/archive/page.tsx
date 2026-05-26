import Link from "next/link";
import { ArrowRight, Archive, FileText, Newspaper, RadioTower } from "lucide-react";
import { Section } from "@/components/Section";
import { WatchDeskCard } from "@/components/WatchDeskCard";
import { WatchDeskGrid } from "@/components/WatchDeskGrid";
import { Card, CardLabel } from "@/components/ui/card";
import { posts, trendingTopics } from "@/data/posts";
import { getPublishedWatchPosts } from "@/lib/db/articles";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

const archiveStats = [
  { label: "Archived articles", value: `${posts.length}+`, Icon: Newspaper },
  { label: "Topic clusters", value: `${trendingTopics.length}`, Icon: RadioTower },
  { label: "Archive mode", value: "Passive", Icon: Archive },
  { label: "Current desk", value: "Live Newsroom", Icon: FileText }
];

export const metadata = createMetadata({
  title: "CWI Archive - Cockroach Watch India",
  description:
    "Browse archived CWI explainers, older newsroom notes, public context posts, and historical civic-watch material from Cockroach Watch India.",
  path: "/archive",
  keywords: ["CWI Archive", "Cockroach Watch India archive", "CWI explainers", "older newsroom notes"]
});

export default async function ArchivePage() {
  const publishedPosts = await getPublishedWatchPosts().catch(() => []);
  const dateSortedPosts = mergePosts([...posts, ...publishedPosts]).sort((first, second) => dateValue(second.date) - dateValue(first.date));
  const featured = dateSortedPosts[0];
  const highlights = dateSortedPosts.slice(1, 4);

  return (
    <>
      <Section
        eyebrow="CWI Archive"
        title="CWI Archive"
        titleAs="h1"
        subtitle="A historical archive of older CWI explainers, notes, and context posts. Current source-backed updates now live in the CWI Live Newsroom."
      >
        <div className="mb-6 rounded-3xl border border-saffron/30 bg-saffron/10 p-5 text-sm font-bold leading-7 text-[#8A5B00]">
          The CWI Archive contains older explainers, drafts, and context posts. For current source-backed updates, advisories, and verified context, visit the CWI Live Newsroom.
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="bg-gradient-to-br from-ink via-[#102a63] to-royal text-white">
            <CardLabel className="bg-white/12 text-saffron ring-white/20">Featured archive item</CardLabel>
            <h2 className="font-display text-5xl font-black uppercase leading-none tracking-[-0.05em]">{featured.title}</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/76">{featured.summary}</p>
            <Link href={`/archive/${featured.slug}`} className="mt-8 inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-ink">
              Read archived context <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>

          <div className="grid gap-4">
            {archiveStats.map(({ label, value, Icon }) => (
              <Card key={label} className="p-5">
                <Icon className="h-6 w-6 text-royal" />
                <p className="mt-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-ink/45">{label}</p>
                <p className="mt-2 font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">{value}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow="Archive Highlights" title="Editor-selected archived context">
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((post) => (
            <WatchDeskCard key={post.slug} post={post} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Archive Search" title="All archived CWI articles" subtitle="Filter older CWI context posts, explainers, and historical notes. New source-backed updates belong in the Live Newsroom.">
        <WatchDeskGrid posts={dateSortedPosts} />
      </Section>
    </>
  );
}

function dateValue(value: string) {
  return new Date(`${value}T00:00:00+05:30`).getTime();
}

function mergePosts<T extends { slug: string }>(items: T[]) {
  return Array.from(new Map(items.map((item) => [item.slug, item])).values());
}
