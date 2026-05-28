import Link from "next/link";
import { Archive, Eye, FileCheck, Megaphone, Newspaper, ShieldCheck, UserRound } from "lucide-react";
import { Section } from "@/components/Section";
import { Card, CardLabel } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "About Cockroach Watch India - CWI",
  description:
    "Learn about Cockroach Watch India, a founder-led civic watch and commentary platform documenting youth voice, public issues, creator credit, and India's unanswered files.",
  path: "/about",
  keywords: ["About Cockroach Watch India", "What is CWI", "CWI founder", "India Unanswered Files", "civic watch India"]
});

const facts = [
  `Founder/editor: ${site.editorialLead}`,
  "India-focused",
  "Youth-first",
  "Independent",
  "Source-backed civic commentary",
  "Satire labelled with responsibility"
];

const missions = [
  ["Track public issues", Eye],
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
      "Cockroach Watch India, also known as CWI, is an independent civic watch, satire, commentary, and public archive platform documenting youth voice, public issues, creator credit, viral claims, and civic memory."
  },
  {
    question: "Who is responsible for CWI?",
    answer:
      `CWI is founder-led. The public editorial lead listed for the platform is ${site.editorialLead}. Published work may still be signed by the CWI Editorial Desk when multiple review steps are involved.`
  },
  {
    question: "What is India Unanswered Files?",
    answer:
      "India Unanswered Files is CWI's source-backed archive of public issues and unanswered civic questions across India, with timelines, source cards, official responses, and related public-interest context."
  },
  {
    question: "Is CWI a political party?",
    answer:
      "No. Cockroach Watch India is not a political party and is not the official website of Cockroach Janta Party. CWI documents public-interest conversations with independent editorial distance."
  },
  {
    question: "How can someone submit reports to CWI?",
    answer:
      "Readers can submit public issues, viral claims, creator credit requests, corrections, and youth stories through the Submit Report page or by contacting CWI by email."
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
    name: site.name,
    alternateName: site.shortName,
    url: absoluteUrl("/"),
    founder: {
      "@type": "Person",
      name: site.founderName,
      alternateName: site.founderHandle
    }
  }
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Section eyebrow="About CWI" title="About Cockroach Watch India" titleAs="h1" subtitle="A founder-led independent civic watch, satire, commentary, and public archive platform.">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardLabel>What is CWI?</CardLabel>
            <div className="space-y-5 text-lg leading-8 text-ink/72">
              <p>
                Cockroach Watch India, also known as CWI, documents youth voice, public issues, civic satire, creator credit, viral claims, and public memory across India. The platform exists for readers who want public-interest context without confusing commentary, satire, reporting, and official claims.
              </p>
              <p>
                CWI was built around a simple editorial need: fast-moving internet conversations should not become public memory without source trails. When a claim travels through posts, clips, screenshots, creator explainers, or local reports, CWI tries to separate what is verified, what is reported, what remains unclear, and what should not be amplified yet.
              </p>
              <p>
                The platform is founder-led by {site.editorialLead}. Public articles may be signed by the CWI Editorial Desk when they depend on shared review, source checks, image review, corrections, or public submissions. That desk label is an accountability label, not a way to hide that CWI has a named person responsible for the platform.
              </p>
              <p>
                CWI is independent from political parties and organizations unless officially declared. It may cover Cockroach Janta Party, the Cockroach wave, youth-led satire, civic anger, or public institutions, but coverage does not make CWI a spokesperson, campaign office, or official political website.
              </p>
              <p>
                The strongest part of CWI is India Unanswered Files: source-backed case files where public records, official responses, court timelines, human impact, and unanswered questions are kept together. The goal is not to manufacture certainty. The goal is to preserve a readable record that citizens, students, creators, local reporters, and public-interest readers can check.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/live-newsroom">Enter Live Newsroom</Link>
              </Button>
              <Button asChild variant="green">
                <Link href="/india-unanswered-files">Open India Unanswered Files</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/submit">Submit a report</Link>
              </Button>
            </div>
          </Card>

          <div className="grid gap-6">
            <Card>
              <CardLabel>Founder and editor</CardLabel>
              <UserRound className="h-8 w-8 text-royal" />
              <h2 className="mt-5 font-display text-3xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
                {site.editorialLead}
              </h2>
              <p className="mt-4 leading-8 text-ink/70">
                The founder/editor is responsible for CWI&apos;s public positioning, independence statement, correction path, and source-led publishing standard. As the team grows, this page should add named editors, reviewers, contributors, and advisory roles.
              </p>
            </Card>
            <Card>
              <CardLabel>Platform facts</CardLabel>
              <div className="grid gap-3">
                {facts.map((fact) => (
                  <p key={fact} className="rounded-2xl border border-line bg-paper p-4 font-black uppercase tracking-[0.08em]">
                    {fact}
                  </p>
                ))}
              </div>
            </Card>
          </div>
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
