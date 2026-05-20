import { Section } from "@/components/Section";
import { WatchDeskGrid } from "@/components/WatchDeskGrid";
import { posts } from "@/data/posts";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "CWI Watch Desk — Updates, Explainers & Civic Notes",
  description:
    "Read Cockroach Watch India updates, explainers, public issue notes, youth voice stories, fact-check requests, and creator-credit posts.",
  path: "/watch-desk"
});

export default function WatchDeskPage() {
  return (
    <Section eyebrow="CWI Editorial Desk" title="The Watch Desk" titleAs="h1" subtitle="Verified notes, explainers, public reactions, corrections, and movement updates.">
      <WatchDeskGrid posts={posts} />
    </Section>
  );
}
