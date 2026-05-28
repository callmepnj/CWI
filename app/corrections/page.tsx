import Link from "next/link";
import { CheckCircle2, Clock, FilePenLine } from "lucide-react";
import { Section } from "@/components/Section";
import { Card, CardLabel } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Corrections - Cockroach Watch India",
  description:
    "Corrections and clarifications from Cockroach Watch India. CWI keeps article changes visible with dates, reasons, and source notes.",
  path: "/corrections",
  keywords: ["CWI corrections", "Cockroach Watch India corrections", "editorial transparency", "source corrections"]
});

const correctionProcess = [
  "Reader or source submits a correction with the article URL and supporting context.",
  "CWI checks the original article, source trail, dates, screenshots, and affected wording.",
  "If a correction is required, the article is updated and a public correction entry is added here.",
  "If the request is declined, CWI keeps an internal note explaining why the published record was not changed."
];

const exampleCorrection = {
  article: "Example format: NEET student help resource note",
  dateResolved: "28 May 2026",
  whatChanged: "Updated a help-resource paragraph to separate official helpline information from CWI's own editorial guidance.",
  whyChanged: "The earlier wording could be read as if CWI was the source of the helpline itself. The corrected wording makes attribution clearer.",
  submittedBy: "Reader correction example",
  status: "Example format only"
};

export default function CorrectionsPage() {
  return (
    <Section
      eyebrow="Editorial Transparency"
      title="Corrections & Clarifications"
      titleAs="h1"
      subtitle="CWI keeps corrections visible because public memory should improve when better sources, clearer wording, or factual updates arrive."
    >
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardLabel>How corrections work</CardLabel>
          <FilePenLine className="h-8 w-8 text-royal" />
          <div className="mt-5 grid gap-3">
            {correctionProcess.map((step, index) => (
              <p key={step} className="rounded-2xl border border-line bg-paper p-4 font-bold leading-6 text-ink/72">
                {index + 1}. {step}
              </p>
            ))}
          </div>
          <Button asChild className="mt-6" variant="green">
            <Link href="/submit">Submit a correction</Link>
          </Button>
        </Card>

        <Card>
          <CardLabel>Correction format</CardLabel>
          <div className="flex items-center gap-3 rounded-2xl border border-royal/15 bg-skywash p-4">
            <Clock className="h-5 w-5 text-royal" />
            <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-royal">{exampleCorrection.status}</p>
          </div>
          <h2 className="mt-5 font-display text-3xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
            {exampleCorrection.article}
          </h2>
          <dl className="mt-5 grid gap-4">
            <CorrectionLine label="What changed" value={exampleCorrection.whatChanged} />
            <CorrectionLine label="Why it changed" value={exampleCorrection.whyChanged} />
            <CorrectionLine label="Submitted by" value={exampleCorrection.submittedBy} />
            <CorrectionLine label="Date resolved" value={exampleCorrection.dateResolved} />
          </dl>
        </Card>
      </div>

      <Card className="mt-8">
        <CardLabel>No hidden edits</CardLabel>
        <div className="grid gap-5 md:grid-cols-3">
          <TrustPoint title="Visible changes" body="Material factual changes receive a public note, not a silent rewrite." />
          <TrustPoint title="Source-linked" body="Corrections should include the source, document, timestamp, or article passage being corrected." />
          <TrustPoint title="Open channel" body={`Urgent corrections can be sent through /submit or directly to ${site.email}.`} />
        </div>
      </Card>
    </Section>
  );
}

function CorrectionLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-4">
      <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-royal">{label}</dt>
      <dd className="mt-2 font-semibold leading-7 text-ink/72">{value}</dd>
    </div>
  );
}

function TrustPoint({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-4">
      <CheckCircle2 className="h-5 w-5 text-leaf" />
      <h2 className="mt-3 font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">{title}</h2>
      <p className="mt-2 leading-7 text-ink/70">{body}</p>
    </div>
  );
}
