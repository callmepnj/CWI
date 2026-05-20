import type { Metadata } from "next";
import { SubmitForm } from "@/components/SubmitForm";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Submit a Report To CWI",
  description: "Submit a public issue, viral post, correction, creator credit request, collaboration, youth story, or local civic report to CWI."
};

export default function SubmitPage() {
  return (
    <Section
      eyebrow="Watch Desk Intake"
      title="Submit a Report To CWI"
      subtitle="Send us a public issue, viral post, correction, creator credit request, or civic story. CWI does not collect sensitive political affiliation data."
    >
      <SubmitForm />
    </Section>
  );
}
