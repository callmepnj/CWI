import Link from "next/link";
import { ArrowRight, FileCheck2 } from "lucide-react";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Corrections - Cockroach Watch India",
  description:
    "Public correction and clarification log from Cockroach Watch India, including what changed, why it changed, and how readers can submit corrections.",
  path: "/corrections",
  keywords: ["CWI corrections", "Cockroach Watch India corrections", "CWI clarification log", "CWI editorial desk"]
});

const correctionPrinciples = [
  "CWI separates verified facts, attributed claims, opinion, satire/context, and developing information.",
  "Corrections are reviewed by the CWI Editorial Desk before public posting.",
  "Visible source links, dates, creator credit, and clarification notes are preserved wherever possible.",
  "Readers can submit missing context, source links, credit requests, or factual corrections through the report form."
];

export default function CorrectionsPage() {
  return (
    <main className="bg-paper text-ink">
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-royal">Public trust</p>
          <h1 className="mt-4 font-display text-5xl font-black uppercase leading-none tracking-[-0.05em] sm:text-7xl">
            Corrections & Clarifications
          </h1>
          <p className="mt-6 max-w-3xl text-xl font-semibold leading-8 text-ink/72">
            CWI publishes correction records when a source, date, credit, wording, or public-interest context needs a visible update.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="rounded-full bg-royal px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white shadow-soft" href="/submit">
              Submit correction
            </Link>
            <Link className="rounded-full border border-line bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-royal" href="/live-newsroom">
              Enter Live Newsroom
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[1.5rem] border border-line bg-white p-6 shadow-card">
          <FileCheck2 className="h-8 w-8 text-royal" />
          <h2 className="mt-4 font-display text-3xl font-black uppercase tracking-[-0.03em]">Correction log</h2>
          <p className="mt-3 leading-7 text-ink/66">
            No public correction entry is posted yet. When one is approved, this page will show the article title, date, what changed,
            why it changed, the source or correction note, and that it was updated by the CWI Editorial Desk.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {correctionPrinciples.map((item) => (
            <div key={item} className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card">
              <p className="text-sm font-bold leading-6 text-ink/70">{item}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[1.5rem] border border-line bg-ink p-6 text-white shadow-soft">
          <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em]">Seen something CWI should correct?</h2>
          <p className="mt-3 max-w-3xl leading-7 text-white/74">
            Send the article link, source link, date, and the exact correction needed. CWI reviews corrections before updating public pages.
          </p>
          <Link className="mt-5 inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-ink" href="/submit">
            Submit correction <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
