import Link from "next/link";
import { Section } from "@/components/Section";
import { Card, CardLabel } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Terms - Cockroach Watch India",
  description:
    "Read the Cockroach Watch India terms for use of CWI Live Newsroom updates, CWI Archive articles, India Unanswered Files, comments, submissions, creator credit, and public-interest content.",
  path: "/terms",
  keywords: ["Cockroach Watch India terms", "CWI terms", "CWI Live Newsroom usage", "CWI Archive usage"]
});

const terms = [
  {
    title: "Use of CWI content",
    body: "CWI content is provided for public-interest information, commentary, satire, civic education, and archive purposes. Do not misrepresent CWI articles as official statements from a political party, government body, court, or platform."
  },
  {
    title: "No legal findings",
    body: "CWI articles may discuss reports, allegations, public reactions, source archives, satire, and commentary. Unless clearly stated with reliable attribution, content should not be treated as a legal finding, court conclusion, or official declaration."
  },
  {
    title: "User submissions",
    body: "By submitting reports, comments, evidence, or corrections, users confirm they are sharing information truthfully to the best of their knowledge and that they have permission to share submitted material."
  },
  {
    title: "Comment rules",
    body: "CWI may reject or remove comments containing hate speech, threats, doxxing, targeted harassment, private personal data, spam, or unverified allegations presented as fact."
  },
  {
    title: "Creator credit and takedowns",
    body: "CWI respects creator credit and source attribution. Creators can request correction, updated credit, review, or takedown through the contact email or Submit Report form."
  },
  {
    title: "Independent platform",
    body: "Cockroach Watch India is independent from political parties and organizations unless officially declared. CWI does not impersonate Cockroach Janta Party or any public institution."
  }
];

export default function TermsPage() {
  return (
    <Section
      eyebrow="Terms"
      title="Terms"
      titleAs="h1"
      subtitle="Terms for using Cockroach Watch India — CWI Live Newsroom, CWI Archive, CWI India Unanswered Files, submissions, comments, and public-interest archive content."
    >
      <Card>
        <CardLabel>CWI terms note</CardLabel>
        <p className="text-lg leading-8 text-ink/72">
          Cockroach Watch India documents, verifies, and amplifies public-interest conversations with context. The youth are not silent. India is watching. These terms protect the integrity of that public record.
        </p>
      </Card>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {terms.map((term) => (
          <Card key={term.title}>
            <CardLabel>Terms</CardLabel>
            <h2 className="font-display text-3xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
              {term.title}
            </h2>
            <p className="mt-4 leading-8 text-ink/70">{term.body}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-8">
        <CardLabel>Contact CWI</CardLabel>
        <p className="leading-8 text-ink/72">
          Questions about these terms can be sent to{" "}
          <Link href={`mailto:${site.email}`} className="font-bold text-royal underline-offset-4 hover:underline">
            {site.email}
          </Link>
          .
        </p>
      </Card>
    </Section>
  );
}
