import type { Metadata } from "next";
import { RoleCard } from "@/components/RoleCard";
import { Section } from "@/components/Section";
import { roles } from "@/data/roles";

export const metadata: Metadata = {
  title: "Join The Watch",
  description: "Choose your role in Cockroach Watch India: Field Watcher, Digital Watcher, Creator Watcher, Rights Watcher, or Quiet Watcher."
};

export default function JoinPage() {
  return (
    <Section
      eyebrow="Join The Watch"
      title="Who Are You In The Watch?"
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
