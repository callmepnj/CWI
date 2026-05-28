import { CwiButtonLink, CwiMasthead, CwiPageShell, CwiSectionHeader, CwiSubmitCTA, CwiTrustStrip } from "@/components/CwiDesignSystem";
import { Card, CardLabel } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "About Cockroach Watch India - CWI",
  description: "About Cockroach Watch India, an independent civic watch, satire, commentary, Live Newsroom, and public archive platform.",
  path: "/about",
  keywords: ["About Cockroach Watch India", "CWI Live Newsroom", "CWI independent civic watch"]
});

const whatCwiIs = [
  "A small independent platform tracking public issues, viral claims, source trails, corrections, and unresolved civic questions.",
  "A Live Newsroom for daily updates and verification notes.",
  "A public archive for older explainers and context.",
  "A correction-friendly intake desk for sources, creator credit, and missing context."
];

const whatCwiIsNot = [
  "Not the official Cockroach Janta Party website.",
  "Not a political party or membership platform.",
  "Not a court, police agency, or law enforcement body.",
  "Not a place to publish private data, threats, hate, or unsupported allegations as fact."
];

export default function AboutPage() {
  return (
    <CwiPageShell>
      <CwiMasthead
        label="About CWI"
        title="About Cockroach Watch India"
        subtitle="CWI is an independent civic watch, satire, commentary, Live Newsroom, and public archive platform."
        body="The work is simple: track what changed, what CWI knows, what remains unclear, and what readers should verify before sharing."
        primaryCta={{ href: "/live-newsroom", label: "Enter Live Newsroom" }}
        secondaryCta={{ href: "/submit", label: "Send source or correction" }}
        meta={["Independent", "Human reviewed", "Correction open", `Editorial lead: ${site.editorialLead}`]}
      />

      <div className="mt-6">
        <CwiTrustStrip items={["Not official CJP", "Not a political party", "Sources matter", "Corrections stay open"]} />
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CwiSectionHeader eyebrow="What CWI is" title="A newsroom record for public issues" />
          <div className="grid gap-3">
            {whatCwiIs.map((item) => <p key={item} className="rounded-lg border border-cwi-brown/14 bg-cwi-cream p-4 font-bold leading-7 text-cwi-ink/72">{item}</p>)}
          </div>
        </Card>
        <Card>
          <CwiSectionHeader eyebrow="What CWI is not" title="Clear boundaries" />
          <div className="grid gap-3">
            {whatCwiIsNot.map((item) => <p key={item} className="rounded-lg border border-cwi-brown/14 bg-cwi-cream p-4 font-bold leading-7 text-cwi-ink/72">{item}</p>)}
          </div>
        </Card>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <InfoCard title="How CWI works" body="CWI separates direct evidence, official statements, media reports, public reaction, opinion, satire, and what remains unclear." />
        <InfoCard title="Why Live Newsroom exists" body="Fast-moving public claims need one daily place for updates, advisories, verification notes, corrections, and source requests." />
        <InfoCard title="How files work" body="India Unanswered Files keep unresolved public issues in dossier form, with timelines, sources, official response where available, and open questions." />
      </section>

      <section className="mt-10 rounded-lg border border-cwi-brown/18 bg-white/78 p-6">
        <CwiSectionHeader eyebrow="Independence note" title="Editorial distance matters" />
        <p className="max-w-4xl leading-8 text-cwi-ink/70">
          CWI may cover Cockroach Janta Party, viral political satire, student issues, platform restrictions, or public institutions, but coverage does not make CWI a spokesperson, campaign office, or official political website. Supporters, submitters, and readers do not receive editorial control.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <CwiButtonLink href="/editorial-policy" variant="secondary">Read editorial policy</CwiButtonLink>
          <CwiButtonLink href="/corrections" variant="secondary">View corrections</CwiButtonLink>
        </div>
      </section>

      <div className="mt-10"><CwiSubmitCTA /></div>
    </CwiPageShell>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <CardLabel>CWI method</CardLabel>
      <h2 className="font-display text-2xl font-black uppercase leading-tight text-cwi-ink">{title}</h2>
      <p className="mt-4 leading-7 text-cwi-ink/70">{body}</p>
    </Card>
  );
}