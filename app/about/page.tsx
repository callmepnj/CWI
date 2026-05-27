import Link from "next/link";
import { Archive, Eye, FileCheck, Megaphone, Newspaper, ShieldCheck } from "lucide-react";
import { Section } from "@/components/Section";
import { Card, CardLabel } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About Cockroach Watch India — CWI",
  description:
    "Learn about Cockroach Watch India, a founder-led civic watch and commentary platform documenting youth voice, public issues, creator credit, and the Cockroach wave.",
  path: "/about",
  keywords: ["About Cockroach Watch India", "What is CWI", "CWI Live Newsroom", "CWI Archive", "CWI India Unanswered Files"]
});

const facts = ["Founded by CWI", "India-focused", "Youth-first", "Independent", "Serious civic commentary", "Satire with responsibility"];

const missions = [
  ["Track the movement", Eye],
  ["Verify before posting", FileCheck],
  ["Credit creators", ShieldCheck],
  ["Archive public memory", Archive],
  ["Amplify youth voice", Megaphone],
  ["Keep institutions watchable", Newspaper]
] as const;

const aboutFaqs = [
  {
    question: "What is Cockroach Watch India?",
    answer:
      "Cockroach Watch India, also known as CWI, is an independent civic watch, satire, and commentary platform documenting youth voice, public issues, creator credit, viral claims, and civic memory."
  },
  {
    question: "What is CWI Live Newsroom?",
    answer:
      "The CWI Live Newsroom is the main source-backed update section of Cockroach Watch India. It documents CJP updates, the Cockroach wave, youth voice, civic satire, public issues, public advisories, and creator-credit questions."
  },
  {
    question: "What is CWI India Unanswered Files?",
    answer:
      "CWI India Unanswered Files is an archive of public issues and unanswered civic questions across India, with timelines, source cards, official responses, and related public-interest context."
  },
  {
    question: "Is CWI a political party?",
    answer:
      "No. Cockroach Watch India is not a political party. It is an independent civic watch, satire, commentary, and public archive platform."
  },
  {
    question: "How can someone submit reports to CWI?",
    answer:
      "Readers can submit public issues, viral claims, creator credit requests, corrections, and youth stories through the Submit Report page or by contacting Cockroach Watch India by email."
  }
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: aboutFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Cockroach Watch India",
  url: absoluteUrl("/about"),
  description:
    "About Cockroach Watch India, also known as CWI, an independent civic watch, satire, commentary, and public archive platform.",
  about: {
    "@type": "Organization",
    name: "Cockroach Watch India",
    alternateName: "CWI",
    url: absoluteUrl("/")
  }
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Section eyebrow="About CWI" title="About Cockroach Watch India" titleAs="h1" subtitle="Cockroach Watch India — CWI is a founder-led independent civic watch, satire, commentary, and public archive platform.">
        <Card>
          <CardLabel>What is CWI?</CardLabel>
          <div className="space-y-5 text-lg leading-8 text-ink/70">
            <p>
              Cockroach Watch India, also known as CWI, documents youth voice, public issues, civic satire, creator credit, viral claims, and public memory across India.
            </p>
            <p>
              CWI is for young citizens, creators, students, public-interest readers, local reporters, civic volunteers, and quiet watchers who want source-backed context instead of noise.
            </p>
            <p>
              The CWI Live Newsroom publishes source-backed updates, public advisories, correction notes, and India Unanswered Files coverage. The CWI Archive preserves older explainers and context posts.
            </p>
            <p>
              We are here to document the moment, verify claims, credit creators, and preserve the public memory of what young India is saying. Document. Verify. Amplify. The youth are not silent. India is watching.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map((fact) => (
              <p key={fact} className="rounded-2xl border border-line bg-paper p-4 font-black uppercase tracking-[0.08em]">
                {fact}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/live-newsroom">Enter Live Newsroom</Link>
            </Button>
            <Button asChild variant="green">
              <Link href="/india-unanswered-files">Open CWI India Unanswered Files</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/submit">Submit a report to CWI</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/support">Support independent CWI work</Link>
            </Button>
          </div>
        </Card>
        <div className="mt-8">
          <Link href="/charter" className="font-mono text-xs font-black uppercase tracking-[0.16em] text-royal">
            Read the CWI Watch Charter
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {missions.map(([mission, Icon]) => (
            <Card key={mission}>
              <Icon className="h-8 w-8 text-royal" />
              <h2 className="mt-5 font-display text-3xl font-black uppercase leading-tight tracking-[-0.04em]">{mission}</h2>
            </Card>
          ))}
        </div>
        <div className="mt-12">
          <p className="mb-6 font-mono text-xs font-black uppercase tracking-[0.2em] text-royal">CWI FAQ</p>
          <div className="grid gap-6 md:grid-cols-2">
            {aboutFaqs.map((faq) => (
              <Card key={faq.question}>
                <CardLabel>About Cockroach Watch India</CardLabel>
                <h2 className="font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em]">{faq.question}</h2>
                <p className="mt-4 leading-7 text-ink/72">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
