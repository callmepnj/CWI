import { existsSync } from "node:fs";
import { join } from "node:path";
import { HeartHandshake, ReceiptText, ShieldCheck } from "lucide-react";
import { CwiMasthead, CwiPageShell, CwiSectionHeader, CwiSubmitCTA, CwiTrustStrip } from "@/components/CwiDesignSystem";
import { SupportPaymentPanel } from "@/components/SupportPaymentPanel";
import { Card, CardLabel } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Support CWI - Voluntary Reader Support",
  description: "Support Cockroach Watch India's independent civic newsroom. Support is voluntary and does not buy coverage, influence, or membership.",
  path: "/support",
  keywords: ["Support Cockroach Watch India", "CWI support", "independent civic newsroom India", "voluntary reader support"]
});

const tickerItems = ["Hosting", "Source review", "Corrections", "Image storage", "Submission moderation", "Research tools"];
const qrPublicPath = "/images/support/cwi-support-qr.png";

const supportUse = [
  "Site hosting, domain, and security costs.",
  "Source review, correction checks, and public record organization.",
  "Image storage, newsroom tooling, and accessibility improvements."
];

const supportLimits = [
  "Support does not buy coverage or article priority.",
  "Supporters do not receive editorial control.",
  "Support does not create party membership or political affiliation.",
  "CWI may decline support-linked requests that conflict with editorial policy."
];

const faqs = [
  { question: "Does support make me a member of any party?", answer: "No. Supporting CWI supports this independent civic newsroom and archive only." },
  { question: "Can supporters request coverage?", answer: "Anyone can send a source or correction, but support never changes whether CWI covers, labels, or prioritizes a subject." },
  { question: "Will supporter notes be public?", answer: "Only approved notes with consent and verified support status appear publicly. No transaction IDs, emails, phone numbers, UPI IDs, or bank details are shown." }
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer }
  }))
};

export default function SupportPage() {
  const qrPath = existsSync(join(process.cwd(), "public", "images", "support", "cwi-support-qr.png")) ? qrPublicPath : undefined;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CwiPageShell>
        <CwiMasthead
          label="Voluntary reader support"
          title="Support CWI"
          subtitle="Help keep the Live Newsroom, source trail, corrections desk, and public archive online."
          body="Support keeps CWI online. It does not buy coverage, influence, or membership."
          meta={["Voluntary", "Non-political", "No editorial control", "Transparent rules"]}
        />

        <div className="mt-6">
          <CwiTrustStrip items={["No party membership", "No fake totals", "No fake supporter notes", "Support is voluntary"]} />
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-cwi-brown/18 bg-cwi-green py-3 text-cwi-cream shadow-sm">
          <div className="flex flex-wrap justify-center gap-3 px-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-cwi-cream/78">
            {tickerItems.map((item) => <span key={item} className="rounded-full bg-cwi-cream/10 px-3 py-1">{item}</span>)}
          </div>
        </div>

        <section className="mt-8">
          <SupportPaymentPanel qrPath={qrPath} />
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <Card>
            <ShieldCheck className="h-8 w-8 text-cwi-green" />
            <CardLabel className="mt-5">Independence</CardLabel>
            <p className="leading-7 text-cwi-ink/70">CWI is independent. Support does not change labels, sourcing standards, corrections, or publishing decisions.</p>
          </Card>
          <Card>
            <ReceiptText className="h-8 w-8 text-cwi-green" />
            <CardLabel className="mt-5">Transparency</CardLabel>
            <p className="leading-7 text-cwi-ink/70">Support-use notes stay separate from coverage and should be published only when the reporting cycle is ready.</p>
          </Card>
          <Card>
            <HeartHandshake className="h-8 w-8 text-cwi-green" />
            <CardLabel className="mt-5">Supporter notes</CardLabel>
            <p className="leading-7 text-cwi-ink/70">No supporter notes yet. When approved supporters choose to share a message, it will appear here.</p>
          </Card>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card>
            <CwiSectionHeader eyebrow="Where support goes" title="Infrastructure, review, and record keeping" />
            <div className="grid gap-3">
              {supportUse.map((item) => <p key={item} className="rounded-lg border border-cwi-brown/14 bg-cwi-cream p-4 font-bold leading-6 text-cwi-ink/72">{item}</p>)}
            </div>
          </Card>
          <Card>
            <CwiSectionHeader eyebrow="What support does not mean" title="No influence, no membership" />
            <div className="grid gap-3">
              {supportLimits.map((item) => <p key={item} className="rounded-lg border border-cwi-brown/14 bg-cwi-cream p-4 font-bold leading-6 text-cwi-ink/72">{item}</p>)}
            </div>
          </Card>
        </section>

        <section className="mt-10">
          <Card>
            <CwiSectionHeader eyebrow="Support FAQ" title="Common questions" />
            <div className="grid gap-5 md:grid-cols-3">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg border border-cwi-brown/14 bg-cwi-cream p-4">
                  <h2 className="font-display text-xl font-black uppercase leading-tight text-cwi-ink">{faq.question}</h2>
                  <p className="mt-3 leading-7 text-cwi-ink/70">{faq.answer}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <div className="mt-10">
          <CwiSubmitCTA title="Support question or correction?" body="Send CWI payment-context questions, correction requests, creator credit, missing context, or source links through the same reviewed intake desk." />
        </div>
      </CwiPageShell>
    </>
  );
}