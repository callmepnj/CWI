import Link from "next/link";
import { CwiMasthead, CwiPageShell, CwiSectionHeader } from "@/components/CwiDesignSystem";
import { PageBackgroundGesture } from "@/components/PageBackgroundGesture";
import { Card, CardLabel } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Terms - Cockroach Watch India",
  description: "CWI terms covering informational, satire, commentary, submissions, takedown/corrections, voluntary support, and independence.",
  path: "/terms",
  keywords: ["Cockroach Watch India terms", "CWI terms", "CWI submissions"]
});

const terms = [
  ["Informational and commentary nature", "CWI content is for public-interest information, commentary, satire, civic education, verification notes, and archive context."],
  ["No legal advice", "CWI is not a court, law enforcement body, lawyer, or official authority. Content is not legal advice or a legal finding."],
  ["No official party affiliation", "CWI is not official CJP and is independent from political parties and organizations unless clearly declared."],
  ["User submissions", "By submitting material, users confirm they have permission to share it and understand CWI may review, edit for clarity, decline, or hold it."],
  ["Takedown and correction", "Creators and affected people can request credit, correction, takedown, blurring, or context review through /submit or email."],
  ["Support is voluntary", "Support does not buy coverage, influence, membership, access, or editorial control."],
  ["Comment and safety rules", "CWI may reject or remove threats, hate, private data, spam, targeted harassment, or unsupported allegations presented as fact."]
];

export default function TermsPage() {
  return (
    <PageBackgroundGesture intensity="subtle">
      <CwiPageShell>
      <CwiMasthead
        label="Terms"
        title="Terms"
        subtitle="Terms for using CWI pages, submissions, comments, archive items, and voluntary support features."
        primaryCta={{ href: "/editorial-policy", label: "Editorial policy" }}
        secondaryCta={{ href: "/submit", label: "Send correction" }}
        meta={["Independent platform", "No legal advice", "Support voluntary", "Corrections open"]}
      />
      <section className="mt-10">
        <CwiSectionHeader eyebrow="Terms" title="Use CWI responsibly" />
        <div className="grid gap-5 md:grid-cols-2">
          {terms.map(([title, body]) => (
            <Card key={title}>
              <CardLabel>Terms</CardLabel>
              <h2 className="font-display text-2xl font-black uppercase leading-tight text-cwi-ink">{title}</h2>
              <p className="mt-4 leading-8 text-cwi-ink/70">{body}</p>
            </Card>
          ))}
        </div>
      </section>
      <section className="mt-10 rounded-lg border border-cwi-brown/18 bg-white/78 p-6">
        <p className="leading-8 text-cwi-ink/72">Questions about these terms can be sent to <Link href={`mailto:${site.email}`} className="font-bold text-cwi-green underline-offset-4 hover:underline">{site.email}</Link>.</p>
      </section>
    </CwiPageShell>
      </PageBackgroundGesture>
    );
  }