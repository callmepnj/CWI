import type { Metadata } from "next";
import { CharterCard } from "@/components/CharterCard";
import { MovementQuote } from "@/components/MovementQuote";
import { Section } from "@/components/Section";
import { charterPrinciples } from "@/data/charter";

export const metadata: Metadata = {
  title: "The CWI Watch Charter",
  description: "The CWI Watch Charter: ten civic principles for documenting, verifying, crediting, and archiving youth-led public memory."
};

export default function CharterPage() {
  return (
    <>
      <Section eyebrow="CWI Charter" title="The CWI Watch Charter" subtitle="A serious charter for a generation that refuses to be ignored.">
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
