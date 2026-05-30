import Link from "next/link";
import { CwiMasthead, CwiPageShell, CwiSectionHeader, CwiSubmitCTA, CwiTrustStrip } from "@/components/CwiDesignSystem";
import { PageBackgroundGesture } from "@/components/PageBackgroundGesture";
import { Card, CardLabel } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Editorial Policy - Cockroach Watch India",
  description: "CWI editorial policy for independence, source rules, verification labels, developing claims, corrections, creator credit, safety, and support independence.",
  path: "/editorial-policy",
  keywords: ["CWI editorial policy", "Cockroach Watch India verification", "CWI corrections", "creator credit"]
});

const labels = [
  ["Verified", "Reliable source trail or official record supports the point. It is not a legal finding unless a legal source says so."],
  ["Source-backed", "Named public sources support the update, with limits shown."],
  ["Reported", "A claim is reported by named sources but not independently settled by CWI."],
  ["Developing", "Facts, timelines, numbers, or official responses may still change."],
  ["Needs Source", "CWI has a claim or lead but still needs a stronger source trail."],
  ["Opinion/Analysis", "Interpretation or commentary, not straight reporting."],
  ["Satire/Context", "Satire, meme language, or public reaction explained with labels."],
  ["Unverified", "CWI has not verified the claim enough to treat it as settled."],
  ["False/Misleading", "Available evidence shows the claim is false or missing important context."],
  ["Blocked", "CWI will not amplify the item because of safety, privacy, hate, or source problems."]
];

const policies = [
  ["Independence", "CWI is independent from political parties and organizations unless clearly declared. CWI is not official CJP and does not publish as a campaign platform."],
  ["Source rules", "Sources should be named, dated, linked, and described by what they support and what they do not prove."],
  ["Developing claims", "CWI uses cautious language for fast-moving claims: reportedly, according to, claimed, developing, still unclear, or official clarification awaited."],
  ["Corrections", "Material factual changes should update the page and, where relevant, appear in the public correction log."],
  ["Creator credit", "CWI does not remove watermarks or claim user-created work as its own. Credit/takedown requests are reviewed."],
  ["What CWI does not publish", "Private data, threats, hate, doxxing, unsupported allegations as fact, and unsafe personal details should not be published."],
  ["Safety rules", "CWI may blur, decline, hold, or reword material that creates avoidable harm or legal risk."],
  ["Support independence", "Support keeps CWI online. It does not buy coverage, influence, access, or membership."],
  ["Contact for corrections", `Send corrections through /submit or email ${site.email}.`]
];

export default function EditorialPolicyPage() {
  return (
    <PageBackgroundGesture intensity="subtle">
      <CwiPageShell>
      <CwiMasthead
        label="Editorial trust"
        title="Editorial Policy"
        subtitle="How CWI handles independence, sources, developing claims, corrections, creator credit, and safety."
        primaryCta={{ href: "/submit", label: "Send source or correction" }}
        secondaryCta={{ href: "/corrections", label: "View corrections" }}
        meta={["Human reviewed", "Claims labelled", "Corrections open", "Support independent"]}
      />
      <div className="mt-6"><CwiTrustStrip items={["No official party role", "Source limits visible", "No private data", "No supporter control"]} /></div>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        {policies.map(([title, body]) => (
          <Card key={title} id={title === "Independence" ? "charter" : undefined}>
            <CardLabel>Editorial policy</CardLabel>
            <h2 className="font-display text-2xl font-black uppercase leading-tight text-cwi-ink">{title}</h2>
            <p className="mt-4 leading-8 text-cwi-ink/70">{body}</p>
          </Card>
        ))}
      </section>

      <section className="mt-10">
        <Card>
          <CwiSectionHeader eyebrow="Verification labels" title="What labels mean" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {labels.map(([title, body]) => (
              <div key={title} className="rounded-lg border border-cwi-brown/14 bg-cwi-cream p-4">
                <h3 className="font-display text-xl font-black uppercase leading-tight text-cwi-ink">{title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-cwi-ink/68">{body}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-10 rounded-lg border border-cwi-brown/18 bg-white/78 p-6">
        <CwiSectionHeader eyebrow="Correction path" title="Send corrections to CWI" />
        <p className="leading-8 text-cwi-ink/70">
          Use <Link href="/submit" className="font-bold text-cwi-green underline-offset-4 hover:underline">Submit Source or Correction</Link> or email <Link href={`mailto:${site.email}`} className="font-bold text-cwi-green underline-offset-4 hover:underline">{site.email}</Link> with the page URL, date, source link, and requested change.
        </p>
      </section>

      <div className="mt-10"><CwiSubmitCTA /></div>
    </CwiPageShell>
      </PageBackgroundGesture>
    );
  }