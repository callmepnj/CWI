import { AgendaCard } from "@/components/AgendaCard";
import { Section } from "@/components/Section";
import { agendaItems } from "@/data/agenda";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Five-Point Agenda Explained — CWI Context",
  description:
    "Cockroach Watch India explains the viral five-point agenda with civic context, public-interest commentary, and responsible verification notes.",
  path: "/five-point-agenda"
});

export default function FivePointAgendaPage() {
  return (
    <Section
      eyebrow="Public-Interest Explainer"
      title="Five-Point Agenda: Explained With Context"
      titleAs="h1"
      subtitle="This page explains the viral five-point agenda circulating online. CWI is an independent civic watch and commentary platform. This explainer is not an official endorsement and should be read as public-interest commentary."
    >
      <div className="grid gap-6">
        {agendaItems.map((item, index) => (
          <AgendaCard key={item.title} index={index + 1} {...item} />
        ))}
      </div>
    </Section>
  );
}
