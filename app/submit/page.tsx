import { SubmitForm } from "@/components/SubmitForm";
import { Section } from "@/components/Section";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Submit a Report - Cockroach Watch India",
  description:
    "Submit public issues, viral civic moments, creator credit requests, corrections, and youth voice stories to Cockroach Watch India.",
  path: "/submit"
});

export default function SubmitPage() {
  return (
    <Section
      eyebrow="Archive Intake"
      title="Submit a Report"
      titleAs="h1"
      subtitle="Send CWI a public issue, viral claim, creator credit request, correction, or youth story for review."
    >
      <SubmitForm />
    </Section>
  );
}
