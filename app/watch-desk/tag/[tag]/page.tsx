import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { WatchDeskCard } from "@/components/WatchDeskCard";
import { posts } from "@/data/posts";
import { createMetadata } from "@/lib/seo";
import { getTagFromSlug, tagEntries } from "@/lib/taxonomy";

type Props = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  return tagEntries.map((entry) => ({ tag: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const entry = getTagFromSlug(tag);

  if (!entry) {
    return createMetadata({
      title: "Watch Desk Tag - CWI",
      description: "Browse Cockroach Watch India Watch Desk tag archives.",
      path: "/watch-desk"
    });
  }

  return createMetadata({
    title: `${entry.label} Articles - CWI`,
    description: `Read Cockroach Watch India articles tagged ${entry.label}, including CJP, Cockroach wave, youth voice, meme politics, and civic satire coverage.`,
    path: `/watch-desk/tag/${entry.slug}`,
    keywords: [entry.label]
  });
}

export default async function WatchDeskTagPage({ params }: Props) {
  const { tag } = await params;
  const entry = getTagFromSlug(tag);

  if (!entry) {
    notFound();
  }

  const tagPosts = posts.filter((post) => post.tags.includes(entry.label));

  return (
    <Section
      eyebrow="Watch Desk Topic"
      title={entry.label}
      titleAs="h1"
      subtitle={`CWI topic archive for ${entry.label}: a public-interest cluster around Cockroach Watch India, CWI, Cockroach Janta Party, the Cockroach wave, and digital civic culture.`}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tagPosts.map((post) => (
          <WatchDeskCard key={post.slug} post={post} />
        ))}
      </div>
    </Section>
  );
}
