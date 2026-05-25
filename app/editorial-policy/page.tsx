import Link from "next/link";
import { Section } from "@/components/Section";
import { Card, CardLabel } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Editorial Policy - Cockroach Watch India",
  description:
    "Read the Cockroach Watch India editorial policy for source attribution, correction requests, verification labels, creator credit, and responsible handling of public claims.",
  path: "/editorial-policy",
  keywords: ["Cockroach Watch India editorial policy", "CWI verification", "CWI corrections", "CWI Watch Desk"]
});

const policies = [
  {
    title: "Source attribution",
    body: "CWI identifies sources wherever possible and separates official statements, public reporting, creator commentary, public reaction, and opinion. Source links are shown on Watch Desk and India Unanswered Files pages."
  },
  {
    title: "Verification labels",
    body: "Cockroach Watch India uses labels such as Verified, Reported, Developing, Claimed, Opinion/Analysis, and Satire/Context so readers can understand the certainty level of a public-interest update."
  },
  {
    title: "Corrections",
    body: "Readers can submit corrections, source links, creator-credit requests, and context through the CWI Submit Report page or by emailing the editorial desk."
  },
  {
    title: "Claims and allegations",
    body: "CWI does not publish unverified allegations as confirmed facts. Developing claims are attributed and written with careful language such as reported, alleged, publicly circulating, or requires verification."
  },
  {
    title: "Creator credit",
    body: "CWI does not remove watermarks or claim ownership of user-created content. Creator credit is part of public memory and source integrity."
  },
  {
    title: "Independence",
    body: "Cockroach Watch India is independent from political parties and organizations unless officially declared. CWI documents public-interest conversations without impersonating Cockroach Janta Party or any institution."
  }
];

export default function EditorialPolicyPage() {
  return (
    <Section
      eyebrow="Editorial Trust"
      title="Editorial Policy"
      titleAs="h1"
      subtitle="Cockroach Watch India — CWI documents, verifies, and amplifies public-interest updates with source attribution, correction paths, and cautious labels."
    >
      <Card>
        <CardLabel>CWI Watch Desk standard</CardLabel>
        <p className="text-lg leading-8 text-ink/72">
          The CWI Watch Desk and CWI India Unanswered Files exist to preserve public memory, not to manufacture certainty. Document. Verify. Amplify. The youth are not silent. India is watching.
        </p>
        <p className="mt-4 text-lg leading-8 text-ink/72">
          For corrections, creator credit, takedown review, or additional sources, contact{" "}
          <Link href={`mailto:${site.email}`} className="font-bold text-royal underline-offset-4 hover:underline">
            {site.email}
          </Link>{" "}
          or use the{" "}
          <Link href="/submit" className="font-bold text-royal underline-offset-4 hover:underline">
            Submit Report
          </Link>{" "}
          form.
        </p>
      </Card>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {policies.map((policy) => (
          <Card key={policy.title}>
            <CardLabel>Editorial policy</CardLabel>
            <h2 className="font-display text-3xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
              {policy.title}
            </h2>
            <p className="mt-4 leading-8 text-ink/70">{policy.body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
