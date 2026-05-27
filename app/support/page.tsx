import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  HeartHandshake,
  Landmark,
  Newspaper,
  ShieldCheck
} from "lucide-react";
import { SupportUpiPanel } from "@/components/SupportUpiPanel";
import { Button } from "@/components/ui/button";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const qrPath = "/images/support/upi-qr.png";

const whereSupportGoes = [
  ["Website and hosting", "Keeping CWI online, fast, and readable.", Newspaper],
  ["Source tracking", "Maintaining source trails, timelines, and correction notes.", ShieldCheck],
  ["Live Newsroom", "Publishing careful updates without rushing unverified claims.", FileText],
  ["India Unanswered Files", "Improving public-issue files with clearer timelines and better sources.", Landmark],
  ["Creator credit and takedowns", "Handling credit requests, corrections, and removal requests responsibly.", CheckCircle],
  ["Design and accessibility", "Making pages, images, and explainers cleaner on mobile and desktop.", HeartHandshake]
] as const;

const supportDoesNotMean = [
  "No political membership",
  "No guaranteed coverage",
  "No paid allegations",
  "No harassment campaigns",
  "No private data collection",
  "No editorial control"
];

const faqs = [
  {
    question: "Is this a political donation?",
    answer:
      "No. Support for CWI is voluntary reader support for an independent civic-watch, satire, commentary, and public archive platform. It is not a political donation or party membership."
  },
  {
    question: "Is CWI official CJP?",
    answer: "No. CWI is independent and is not the official Cockroach Janta Party."
  },
  {
    question: "Will supporting CWI give me editorial control?",
    answer: "No. Support does not buy coverage, takedowns, allegations, or editorial influence."
  },
  {
    question: "Can I support anonymously?",
    answer:
      "UPI payments may show payment details to the receiver depending on the app and bank. Do not send support if you are uncomfortable with that."
  },
  {
    question: "Can I request a correction or takedown?",
    answer: "Yes. Use the Submit Report / Correction page or email CWI with the link, reason, and source."
  },
  {
    question: "Can brands support CWI?",
    answer: "Potentially, but sponsorships must be clearly labelled and cannot control editorial coverage."
  },
  {
    question: "What if I sent money by mistake?",
    answer: `Email CWI at ${site.email} with the transaction reference. Refund handling depends on verification and payment method.`
  }
];

export const metadata = createMetadata({
  title: "Support CWI - Cockroach Watch India",
  description:
    "Support Cockroach Watch India's independent civic-watch, Live Newsroom, India Unanswered Files, creator-credit, and public archive work. Voluntary reader support, not political membership.",
  path: "/support",
  keywords: [
    "Support CWI",
    "Cockroach Watch India support",
    "CWI reader support",
    "independent civic watch",
    "Live Newsroom support",
    "India Unanswered Files"
  ]
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
};

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Support CWI",
  url: absoluteUrl("/support"),
  description:
    "Voluntary reader support page for Cockroach Watch India's independent civic-watch, Live Newsroom, public archive, and creator-credit work.",
  about: {
    "@type": "Organization",
    name: site.name,
    alternateName: site.shortName,
    url: site.url
  }
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  email: site.email,
  description: "Independent civic watch, satire, commentary, and public archive platform."
};

export default function SupportPage() {
  const rawUpiId = process.env.NEXT_PUBLIC_CWI_UPI_ID || process.env.CWI_UPI_ID || "";
  const rawPayeeName = process.env.NEXT_PUBLIC_CWI_UPI_PAYEE_NAME || process.env.CWI_UPI_PAYEE_NAME || "";
  const upiId = isConfigured(rawUpiId) ? rawUpiId.trim() : "";
  const payeeName = isConfigured(rawPayeeName) ? rawPayeeName.trim() : "";
  const qrAvailable = existsSync(join(process.cwd(), "public", "images", "support", "upi-qr.png"));

  return (
    <main className="bg-[#F6F1E7] bg-paper-grain text-ink [background-size:18px_18px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="border-b border-[#DED6C7] bg-[#F9F5EC]/90">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="mb-5 flex w-fit items-center gap-3 rounded-full border border-[#B9C9B5] bg-white px-4 py-2 shadow-card">
              <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-xl bg-[#E9F4E8]">
                <Image src="/brand/logo.png" alt="Cockroach Watch India CWI logo" width={32} height={32} className="h-full w-full object-cover" />
              </span>
              <span className="font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#1E6B4A]">Reader support</span>
            </div>
            <h1 className="font-display text-5xl font-black uppercase leading-none tracking-[-0.05em] text-ink sm:text-7xl">
              Support CWI
            </h1>
            <p className="mt-5 max-w-3xl font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-[#1E6B4A]">
              Help keep Cockroach Watch India independent, careful, and useful.
            </p>
            <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-ink/72">
              CWI tracks public issues, viral claims, youth voice, creator credit, and verified updates through the Live Newsroom and India Unanswered Files. Reader support helps us keep the site running, improve verification, maintain the archive, and publish cleaner public-interest updates.
            </p>
            <p className="mt-4 max-w-3xl leading-8 text-ink/68">
              Cockroach Watch India is built around one simple job: track what is being said, what is verified, what is still unclear, and what deserves public attention.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="bg-[#1E6B4A] hover:bg-[#16563B]">
                <a href="#upi">Support via UPI</a>
              </Button>
              <Button asChild variant="outline">
                <a href="#where-support-goes">See how support is used</a>
              </Button>
            </div>
            <p className="mt-5 rounded-2xl border border-[#D9CFAE] bg-white/76 p-4 text-sm font-bold leading-6 text-ink/68">
              Support is voluntary. It does not create political membership, party membership, or formal affiliation.
            </p>
          </div>

          <SupportUpiPanel upiId={upiId} payeeName={payeeName} qrAvailable={qrAvailable} qrPath={qrPath} />
        </div>
      </section>

      <section id="where-support-goes" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="How support is used" title="Where your support goes" />
        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {whereSupportGoes.map(([title, body, Icon]) => (
            <article key={title} className="rounded-[1.5rem] border border-[#DED6C7] bg-white p-5 shadow-card">
              <Icon className="h-7 w-7 text-[#1E6B4A]" />
              <h2 className="mt-5 font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">{title}</h2>
              <p className="mt-3 leading-7 text-ink/68">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#DED6C7] bg-white/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <SectionHeader eyebrow="Independence" title="What support does not mean" />
            <p className="mt-5 leading-8 text-ink/70">
              Supporting CWI does not make you a member of any political party or organization. It does not buy editorial control, guaranteed coverage, or influence over what CWI publishes. CWI may decline support, correction requests, submissions, or collaborations that conflict with its safety, credit, and editorial rules.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {supportDoesNotMean.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#DED6C7] bg-[#FAF7EF] p-4 shadow-card">
                <ShieldCheck className="h-5 w-5 shrink-0 text-[#1E6B4A]" />
                <p className="font-black uppercase tracking-[0.08em] text-ink/72">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <article className="rounded-[1.5rem] border border-[#DED6C7] bg-white p-6 shadow-card">
          <SectionHeader eyebrow="Transparency" title="Transparency" />
          <p className="mt-5 leading-8 text-ink/70">
            CWI is a small independent project. Reader support helps with hosting, research tools, design, public archive work, and newsroom maintenance. As the project grows, CWI should publish periodic support-use notes so readers know how support is being used.
          </p>
          <div className="mt-6 rounded-2xl border border-[#D9CFAE] bg-[#FFF7D6] p-4">
            <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#7A5200]">Coming soon</p>
            <p className="mt-1 font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">Quarterly support-use note</p>
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-[#CAD8C7] bg-[#E9F4E8] p-6 shadow-card">
          <HeartHandshake className="h-8 w-8 text-[#1E6B4A]" />
          <h2 className="mt-5 font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">A note from CWI</h2>
          <p className="mt-4 leading-8 text-ink/72">
            CWI is being built carefully because speed without verification creates noise. Support helps us slow down where needed, check sources properly, and keep useful public records online.
          </p>
          <p className="mt-6 font-mono text-xs font-black uppercase tracking-[0.14em] text-[#1E6B4A]">- Cockroach Watch India Editorial Desk</p>
        </article>
      </section>

      <section className="border-y border-[#DED6C7] bg-[#FAF7EF]">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Support FAQ" title="Questions before you support" />
          <div className="mt-7 grid gap-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-[#DED6C7] bg-white p-5 shadow-card">
                <summary className="cursor-pointer list-none font-display text-xl font-black uppercase tracking-[-0.02em] text-ink">
                  {faq.question}
                </summary>
                <p className="mt-4 leading-7 text-ink/70">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-[1.5rem] border border-[#DED6C7] bg-white p-6 shadow-card">
            <SectionHeader eyebrow="Contact" title="Have a correction, source, or support question?" />
            <p className="mt-4 leading-8 text-ink/70">
              Email{" "}
              <Link href={`mailto:${site.email}`} className="font-black text-[#1E6B4A] underline-offset-4 hover:underline">
                {site.email}
              </Link>{" "}
              or use the public forms below.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-[#1E6B4A] hover:bg-[#16563B]">
                <Link href="/submit">Submit correction</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Contact CWI</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/editorial-policy">Read Editorial Policy</Link>
              </Button>
            </div>
          </article>

          <article className="rounded-[1.5rem] border border-[#D9CFAE] bg-[#FFF7D6] p-6 shadow-card">
            <AlertTriangle className="h-7 w-7 text-[#7A5200]" />
            <h2 className="mt-5 font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">Safety and legal note</h2>
            <p className="mt-4 leading-8 text-ink/70">
              This page does not collect PAN, Aadhaar, address, voter details, political preference, or payment records. UPI payments happen in your payment app, not on this site.
            </p>
          </article>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-[#DED6C7] bg-white p-6 shadow-card">
          <p className="text-sm font-bold leading-7 text-ink/68">
            Cockroach Watch India is an independent civic watch, satire, commentary, and public archive platform. CWI is not the official Cockroach Janta Party and is not affiliated with any political party or organization unless clearly declared. Reader support is voluntary and does not create membership, editorial control, or formal affiliation.
          </p>
        </div>
      </section>
    </main>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-[#1E6B4A]">{eyebrow}</p>
      <h2 className="mt-2 font-display text-4xl font-black uppercase tracking-[-0.04em] text-ink">{title}</h2>
    </div>
  );
}

function isConfigured(value: string) {
  const normalized = value.trim();
  return Boolean(normalized && !/^(\[?ADD_|CHANGE_ME|your-|placeholder)/i.test(normalized));
}
