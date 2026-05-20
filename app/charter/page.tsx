import { CharterCard } from "@/components/CharterCard";
import { MovementQuote } from "@/components/MovementQuote";
import { Section } from "@/components/Section";
import { charterPrinciples } from "@/data/charter";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "The CWI Watch Charter — Cockroach Watch India",
  description:
    "Read the CWI Watch Charter: ten civic principles for documenting, verifying, crediting, and archiving youth-led public memory.",
  path: "/charter"
});

export default function CharterPage() {
  return (
    <>
      <Section eyebrow="CWI Charter" title="The CWI Watch Charter" titleAs="h1" subtitle="A serious charter for a generation that refuses to be ignored.">
        <MovementQuote />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {charterPrinciples.map((principle, index) => (
            <CharterCard key={principle.title} index={index + 1} {...principle} />
          ))}
        </div>
      </Section>
    </>
  );
}
