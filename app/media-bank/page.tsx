import { ArchiveCard } from "@/components/ArchiveCard";
import { CreditPolicyBox } from "@/components/CreditPolicyBox";
import { Section } from "@/components/Section";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Media Bank — Cockroach Watch India",
  description:
    "Explore the CWI visual archive for posters, reels, shorts, explainable graphics, public reaction clips, creator submissions, and official assets.",
  path: "/media-bank"
});

const assets = [
  ["CWI Official Posters", "Posters", "Cockroach Watch India", "CWI", "Official asset"],
  ["Explainer Reel Archive", "Reels", "Creator credited where visible", "Instagram", "Permission preferred"],
  ["Shorts Watch Log", "Shorts", "Publicly visible creator", "YouTube", "Commentary archive"],
  ["Satire With Context", "Memes", "Original creator where traceable", "X / Instagram", "Credit required"],
  ["Five-Point Graphics", "Explainable graphics", "CWI / credited creators", "CWI", "Review before sharing"],
  ["Public Reaction Clips", "Public reaction clips", "Community-submitted", "Public platforms", "Requires safety review"],
  ["Creator Submissions", "Creator submissions", "Submitted creators", "CWI intake", "Permission-led"],
  ["CWI Official Assets", "CWI official assets", "Cockroach Watch India", "CWI", "Official asset"]
] as const;

export default function MediaBankPage() {
  return (
    <Section eyebrow="Archive" title="Media Bank" titleAs="h1" subtitle="The visual archive of the movement. This is a serious archive, not a meme dump.">
      <div className="mb-8">
        <CreditPolicyBox />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {assets.map(([title, kind, credit, platform, permission]) => (
          <ArchiveCard key={title} title={title} kind={kind} credit={credit} platform={platform} permission={permission} />
        ))}
      </div>
    </Section>
  );
}
