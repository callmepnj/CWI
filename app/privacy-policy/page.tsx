import Link from "next/link";
import { Section } from "@/components/Section";
import { Card, CardLabel } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Privacy Policy - Cockroach Watch India",
  description:
    "Read the Cockroach Watch India privacy policy for report submissions, comments, contact details, analytics, and public-interest safety practices.",
  path: "/privacy-policy",
  keywords: ["Cockroach Watch India privacy", "CWI privacy policy", "CWI report submissions"]
});

const sections = [
  {
    title: "Information people submit",
    body: "CWI may receive names or public handles, optional contact details, city or state context, report descriptions, source links, uploaded evidence, comments, and correction requests when users choose to submit them."
  },
  {
    title: "How CWI uses information",
    body: "Cockroach Watch India uses submitted information to review public-interest reports, verify context, contact submitters when clarification is needed, moderate comments, process creator-credit requests, and improve the public archive."
  },
  {
    title: "Sensitive data",
    body: "CWI asks users not to submit private personal data, doxxing material, threats, hate speech, or unverified allegations as confirmed facts. Materials may be declined, blurred, edited for clarity, or withheld for safety."
  },
  {
    title: "Comments and moderation",
    body: "Comments may be moderated before publication. Email addresses, if provided for comments or follow-up, are not intended to be shown publicly."
  },
  {
    title: "Security and retention",
    body: "CWI keeps operational records only as needed for editorial review, correction handling, moderation, and site functionality. No public page should expose private contact details submitted through forms."
  },
  {
    title: "Contact",
    body: `For privacy, correction, creator credit, or takedown questions, contact ${site.email}.`
  }
];

export default function PrivacyPolicyPage() {
  return (
    <Section
      eyebrow="Privacy"
      title="Privacy Policy"
      titleAs="h1"
      subtitle="Cockroach Watch India — CWI handles public-interest submissions, comments, corrections, and creator-credit requests with safety and editorial caution."
    >
      <Card>
        <CardLabel>CWI privacy note</CardLabel>
        <p className="text-lg leading-8 text-ink/72">
          CWI is a civic watch, satire, commentary, and public archive platform. This policy explains how submitted information may be used when readers interact with the CWI Archive, CWI India Unanswered Files, report forms, and comment sections.
        </p>
      </Card>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardLabel>Privacy policy</CardLabel>
            <h2 className="font-display text-3xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
              {section.title}
            </h2>
            <p className="mt-4 leading-8 text-ink/70">{section.body}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-8">
        <CardLabel>Need help?</CardLabel>
        <p className="leading-8 text-ink/72">
          Email{" "}
          <Link href={`mailto:${site.email}`} className="font-bold text-royal underline-offset-4 hover:underline">
            {site.email}
          </Link>{" "}
          for privacy, correction, or takedown requests.
        </p>
      </Card>
    </Section>
  );
}
