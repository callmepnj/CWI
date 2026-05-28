import Link from "next/link";
import { CwiMasthead, CwiPageShell, CwiSectionHeader, CwiSubmitCTA } from "@/components/CwiDesignSystem";
import { Card, CardLabel } from "@/components/ui/card";
import { site } from "@/lib/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Credit Policy - Creator Credit and Takedown - Cockroach Watch India",
  description: "CWI creator credit, repost, watermark, correction, and takedown policy.",
  path: "/credit-policy"
});

const sections = [
  ["Creator credit", "CWI credits original creators where visible and practical. Send the original link, public handle, and requested credit line if something needs updating."],
  ["Repost rules", "Short clips, screenshots, or excerpts may be used for commentary, criticism, explanation, or public-interest context where legally allowed. Full reposts need stronger justification or permission."],
  ["Watermark rules", "CWI does not remove watermarks or claim user-created content as its own."],
  ["Takedown requests", "Send the page URL, proof of authorship or affected status, and the requested action. CWI may remove, blur, re-caption, credit, or retain content depending on public-interest and safety review."],
  ["Correction requests", "Correction requests should include the page URL, the incorrect wording, the source link, and what should change."],
  ["What to send CWI", "Send source links, dates, creator handles, context, permission notes, and any safety concern. Do not send private data that is not needed for review."],
  ["Contact", `Use /submit or email ${site.email} for creator credit, repost, correction, or takedown review.`]
];

export default function CreditPolicyPage() {
  return (
    <CwiPageShell>
      <CwiMasthead
        label="Creator rights"
        title="Credit Policy"
        subtitle="Creator credit, repost, correction, and takedown rules for CWI."
        primaryCta={{ href: "/submit", label: "Send credit request" }}
        secondaryCta={{ href: "/editorial-policy", label: "Read editorial policy" }}
        meta={["Watermarks respected", "Takedowns reviewed", "Corrections open", "No private data"]}
      />

      <section className="mt-10">
        <CwiSectionHeader eyebrow="Policy desk" title="How CWI handles creator material" />
        <div className="grid gap-5 md:grid-cols-2">
          {sections.map(([title, body]) => (
            <Card key={title}>
              <CardLabel>Credit policy</CardLabel>
              <h2 className="font-display text-2xl font-black uppercase leading-tight text-cwi-ink">{title}</h2>
              <p className="mt-4 leading-8 text-cwi-ink/70">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-lg border border-cwi-brown/18 bg-white/78 p-6">
        <CwiSectionHeader eyebrow="Direct contact" title="Creator credit or takedown" />
        <p className="leading-8 text-cwi-ink/70">Email <Link href={`mailto:${site.email}`} className="font-bold text-cwi-green underline-offset-4 hover:underline">{site.email}</Link> or use the submit form with links, dates, and the requested change.</p>
      </section>

      <div className="mt-10"><CwiSubmitCTA /></div>
    </CwiPageShell>
  );
}