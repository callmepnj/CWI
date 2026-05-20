import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { WatchDeskGrid } from "@/components/WatchDeskGrid";
import { posts } from "@/data/posts";

export const metadata: Metadata = {
  title: "The Watch Desk",
  description: "Verified notes, explainers, public reactions, corrections, and movement updates from Cockroach Watch India."
};

export default function WatchDeskPage() {
  return (
    <Section eyebrow="CWI Editorial Desk" title="The Watch Desk" subtitle="Verified notes, explainers, public reactions, corrections, and movement updates.">
      <WatchDeskGrid posts={posts} />
    </Section>
  );
}
