import { SubmitForm } from "@/components/SubmitForm";
import { Section } from "@/components/Section";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Submit a Report — Cockroach Watch India",
  description:
    "Submit public issues, viral civic moments, creator credit requests, corrections, and youth voice stories to Cockroach Watch India.",
  path: "/submit"
});

export default function SubmitPage() {
  return (
    <Section
      eyebrow="Watch Desk Intake"
      title="Submit a Report To CWI"
      titleAs="h1"
      subtitle="Send us a public issue, viral post, correction, creator credit request, or civic story. CWI does not collect sensitive political affiliation data."
    >
      <SubmitForm />
    </Section>
  );
}
