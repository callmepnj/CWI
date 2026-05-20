import { RoleCard } from "@/components/RoleCard";
import { Section } from "@/components/Section";
import { roles } from "@/data/roles";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Join The Watch — Cockroach Watch India",
  description:
    "Join Cockroach Watch India as a Field Watcher, Digital Watcher, Creator Watcher, Rights Watcher, or Quiet Watcher.",
  path: "/join"
});

export default function JoinPage() {
  return (
    <Section
      eyebrow="Join The Watch"
      title="Who Are You In The Watch?"
      titleAs="h1"
      subtitle="Every movement has many roles. Pick how you want to contribute. You do not need power to watch power. You need a phone, a conscience, and proof."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {roles.map((role) => (
          <RoleCard key={role.title} {...role} />
        ))}
      </div>
    </Section>
  );
}
