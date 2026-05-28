import { HeartHandshake, ReceiptText, ShieldCheck } from "lucide-react";
import { Section } from "@/components/Section";
import { SupportPaymentPanel } from "@/components/SupportPaymentPanel";
import { Card, CardLabel } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Support CWI - Cockroach Watch India",
  description:
    "Support Cockroach Watch India's independent civic documentation. Reader support does not buy coverage, influence, or editorial access.",
  path: "/support",
  keywords: ["Support Cockroach Watch India", "CWI support", "independent civic media India", "reader-supported journalism"]
});

const tickerItems = [
  "Source archive hosting",
  "Public records tracking",
  "Corrections review",
  "Image and media storage",
  "Community submissions",
  "Civic research tools"
];

const promises = [
  "Support never buys coverage or article priority.",
  "Supporters do not receive editorial control.",
  "CWI will publish support-use notes when quarterly reports begin.",
  "CWI remains independent from political parties unless officially declared."
];

const faqs = [
  {
    question: "Does support make me a member of any political party?",
    answer: "No. Supporting CWI supports this independent civic watch platform only. It does not create membership in CJP or any political organization."
  },
  {
    question: "Can a supporter request coverage?",
    answer: "Anyone can submit a public-interest lead, but payment does not influence whether CWI covers, ignores, or prioritizes a subject."
  },
  {
    question: "How will support be used?",
    answer: "Support is intended for hosting, source review, documentation tools, image storage, moderation, corrections work, and public-interest research costs."
  }
];

export default function SupportPage() {
  return (
    <Section
      eyebrow="Reader Support"
      title="Support CWI"
      titleAs="h1"
      subtitle="Independent civic documentation needs infrastructure, source review, corrections work, and time. Support helps the work continue without buying influence."
    >
      <div className="mb-8 overflow-hidden rounded-3xl border border-line bg-ink py-3 text-white shadow-card">
        <div className="flex flex-wrap justify-center gap-4 px-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-white/78">
          {tickerItems.map((item) => (
            <span key={item} className="rounded-full bg-white/10 px-3 py-1">{item}</span>
          ))}
        </div>
      </div>

      <SupportPaymentPanel />

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card>
          <ShieldCheck className="h-8 w-8 text-royal" />
          <CardLabel className="mt-5">Independence</CardLabel>
          <p className="leading-7 text-ink/70">CWI is independent. Support does not change editorial labels, sourcing standards, corrections, or publishing decisions.</p>
        </Card>
        <Card>
          <ReceiptText className="h-8 w-8 text-royal" />
          <CardLabel className="mt-5">Transparency</CardLabel>
          <p className="leading-7 text-ink/70">CWI will keep support-use notes separate from article coverage and publish updates when the reporting cycle begins.</p>
        </Card>
        <Card>
          <HeartHandshake className="h-8 w-8 text-royal" />
          <CardLabel className="mt-5">Supporter wall</CardLabel>
          <p className="leading-7 text-ink/70">Be the first to leave a note after supporting. Notes are reviewed before publication and do not affect coverage.</p>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardLabel>What support does not mean</CardLabel>
          <div className="grid gap-3">
            {promises.map((promise) => (
              <p key={promise} className="rounded-2xl border border-line bg-paper p-4 font-bold leading-6 text-ink/72">
                {promise}
              </p>
            ))}
          </div>
        </Card>
        <Card>
          <CardLabel>Support FAQ</CardLabel>
          <div className="grid gap-5">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-b border-line pb-5 last:border-b-0 last:pb-0">
                <h2 className="font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">{faq.question}</h2>
                <p className="mt-3 leading-7 text-ink/70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}
