import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { WatchDeskCard } from "@/components/WatchDeskCard";
import { posts } from "@/data/posts";
import { createMetadata } from "@/lib/seo";
import { categoryEntries, getCategoryFromSlug } from "@/lib/taxonomy";

type Props = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return categoryEntries.map((entry) => ({ category: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const entry = getCategoryFromSlug(category);

  if (!entry) {
    return createMetadata({
      title: "Archive Category - CWI",
      description: "Browse Cockroach Watch India Archive category archives.",
      path: "/watch-desk"
    });
  }

  return createMetadata({
    title: `${entry.label} - CWI Archive`,
    description: `Read Cockroach Watch India ${entry.label} articles on CJP, the Cockroach wave, youth voice, civic satire, and digital public culture.`,
    path: `/watch-desk/category/${entry.slug}`,
    keywords: [entry.label]
  });
}

export default async function WatchDeskCategoryPage({ params }: Props) {
  const { category } = await params;
  const entry = getCategoryFromSlug(category);

  if (!entry) {
    notFound();
  }

  const categoryPosts = posts
    .filter((post) => post.category === entry.label)
    .sort((first, second) => dateValue(second.date) - dateValue(first.date));

  return (
    <Section
      eyebrow="Archive Category"
      title={entry.label}
      titleAs="h1"
      subtitle={`CWI category archive for ${entry.label}: Cockroach Janta Party, Cockroach wave, Gen Z politics, public reaction, civic satire, and youth voice coverage.`}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categoryPosts.map((post) => (
          <WatchDeskCard key={post.slug} post={post} />
        ))}
      </div>
    </Section>
  );
}

function dateValue(value: string) {
  return new Date(`${value}T00:00:00+05:30`).getTime();
}
