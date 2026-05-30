import Link from "next/link";
import { CwiMasthead, CwiPageShell, CwiSectionHeader } from "@/components/CwiDesignSystem";
import { PageBackgroundGesture } from "@/components/PageBackgroundGesture";
import { Card, CardLabel } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Privacy Policy - Cockroach Watch India",
  description: "CWI privacy policy covering submit form data, supporter notes, cookies or analytics, sensitive data, and removal contacts.",
  path: "/privacy-policy",
  keywords: ["Cockroach Watch India privacy", "CWI privacy policy", "CWI submissions privacy"]
});

const sections = [
  ["What data is collected", "CWI may receive names or public handles, optional emails, submission type, source URLs, source dates, messages, uploaded evidence, comments, correction requests, and contact-form messages when users choose to submit them."],
  ["Submit form data", "Submission data is used to review sources, corrections, creator credit, public issues, and missing context. CWI asks users not to submit unnecessary sensitive personal data."],
  ["Supporter notes", "Supporter notes appear publicly only when approved, consented, and verified. CWI does not publish transaction IDs, emails, phone numbers, UPI IDs, bank details, or internal notes."],
  ["Cookies and analytics", "CWI may use basic analytics, logs, or security tools to understand site reliability and abuse patterns. These tools should not be used to collect political preferences."],
  ["Sensitive data", "Do not submit Aadhaar, PAN, voter details, private addresses, private phone numbers, medical details, threats, hate, or unsupported allegations as fact."],
  ["Retention and safety", "CWI keeps operational records as needed for editorial review, moderation, corrections, safety, and legal compliance. Unsafe or unnecessary material may be deleted or redacted."],
  ["Contact for removal", `For privacy, removal, correction, creator credit, or takedown requests, contact ${site.email}.`]
];

export default function PrivacyPolicyPage() {
  return (
    <PageBackgroundGesture intensity="subtle">
      <CwiPageShell>
      <CwiMasthead
        label="Privacy"
        title="Privacy Policy"
        subtitle="How CWI handles submissions, contact messages, supporter notes, and safety-sensitive data."
        primaryCta={{ href: "/submit", label: "Send privacy request" }}
        secondaryCta={{ href: "/credit-policy", label: "Credit policy" }}
        meta={["No political preference", "No unnecessary sensitive data", "Removal contact open"]}
      />
      <section className="mt-10">
        <CwiSectionHeader eyebrow="Privacy policy" title="Reader and submitter data" />
        <div className="grid gap-5 md:grid-cols-2">
          {sections.map(([title, body]) => (
            <Card key={title}>
              <CardLabel>Privacy</CardLabel>
              <h2 className="font-display text-2xl font-black uppercase leading-tight text-cwi-ink">{title}</h2>
              <p className="mt-4 leading-8 text-cwi-ink/70">{body}</p>
            </Card>
          ))}
        </div>
      </section>
      <section className="mt-10 rounded-lg border border-cwi-brown/18 bg-white/78 p-6">
        <p className="leading-8 text-cwi-ink/72">Email <Link href={`mailto:${site.email}`} className="font-bold text-cwi-green underline-offset-4 hover:underline">{site.email}</Link> for privacy, correction, or takedown requests.</p>
      </section>
    </CwiPageShell>
      </PageBackgroundGesture>
    );
  }