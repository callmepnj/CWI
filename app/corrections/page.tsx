import Link from "next/link";
import { CwiMasthead, CwiPageShell, CwiSectionHeader, CwiSubmitCTA } from "@/components/CwiDesignSystem";
import { Card, CardLabel } from "@/components/ui/card";
import { corrections } from "@/data/live-newsroom";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Corrections & Clarifications - Cockroach Watch India",
  description: "CWI corrections and clarifications. If the record changes, the page should change too.",
  path: "/corrections",
  keywords: ["CWI corrections", "Cockroach Watch India corrections", "correction log"]
});

export default function CorrectionsPage() {
  const publicCorrections = corrections.filter((correction) => correction.status === "published");

  return (
    <CwiPageShell>
      <CwiMasthead
        label="Editorial transparency"
        title="Corrections & Clarifications"
        subtitle="If the record changes, the page should change too."
        primaryCta={{ href: "/submit", label: "Send correction" }}
        secondaryCta={{ href: "/editorial-policy", label: "Read policy" }}
        meta={["Correction open", "Source notes requested", "Updated by CWI Editorial Desk"]}
      />

      <section className="mt-10">
        <CwiSectionHeader eyebrow="Correction log" title="Latest corrections" />
        {publicCorrections.length ? (
          <div className="grid gap-5">
            {publicCorrections.map((correction) => (
              <Card key={correction.id}>
                <CardLabel>{formatDate(correction.correctionDate)}</CardLabel>
                <h2 className="font-display text-2xl font-black uppercase leading-tight text-cwi-ink">{correction.itemTitle}</h2>
                <dl className="mt-5 grid gap-3 md:grid-cols-2">
                  <CorrectionLine label="What changed" value={correction.whatChanged} />
                  <CorrectionLine label="Why it changed" value={correction.whyChanged} />
                  <CorrectionLine label="Source note" value={correction.sourceNote ?? "Correction source reviewed by CWI."} />
                  <CorrectionLine label="Updated by" value="CWI Editorial Desk" />
                </dl>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardLabel>No public corrections</CardLabel>
            <p className="text-lg font-bold leading-8 text-cwi-ink/72">No public corrections have been logged yet.</p>
            <p className="mt-3 leading-7 text-cwi-ink/66">Need to correct a page? Send the URL, date, source link, and requested change through <Link href="/submit" className="font-bold text-cwi-green underline-offset-4 hover:underline">Submit Source or Correction</Link>.</p>
          </Card>
        )}
      </section>

      <div className="mt-10"><CwiSubmitCTA /></div>
    </CwiPageShell>
  );
}

function CorrectionLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-cwi-brown/14 bg-cwi-cream p-4">
      <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-cwi-green">{label}</dt>
      <dd className="mt-2 font-semibold leading-7 text-cwi-ink/72">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}