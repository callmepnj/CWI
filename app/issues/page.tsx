import { IssueCard } from "@/components/IssueCard";
import { Section } from "@/components/Section";
import { issues } from "@/data/issues";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Issue Watch — Public Issues Tracked by CWI",
  description:
    "Submit and explore public issues, civic concerns, youth problems, viral reports, and local accountability stories tracked by Cockroach Watch India.",
  path: "/issues"
});

export default function IssuesPage() {
  return (
    <Section eyebrow="Issue Watch" title="Issue Watch" titleAs="h1" subtitle="The problems people record when institutions stop listening. Local issues are national signals.">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {issues.map((issue) => (
          <IssueCard key={issue.title} {...issue} />
        ))}
      </div>
    </Section>
  );
}
