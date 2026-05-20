import type { Metadata } from "next";
import { IssueCard } from "@/components/IssueCard";
import { Section } from "@/components/Section";
import { issues } from "@/data/issues";

export const metadata: Metadata = {
  title: "Issue Watch",
  description: "CWI issue tracker for bribe demands, broken roads, garbage dumps, paper leaks, job scams, fake news, campus issues, and public service failures."
};

export default function IssuesPage() {
  return (
    <Section eyebrow="Issue Watch" title="Issue Watch" subtitle="The problems people record when institutions stop listening. Local issues are national signals.">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {issues.map((issue) => (
          <IssueCard key={issue.title} {...issue} />
        ))}
      </div>
    </Section>
  );
}
