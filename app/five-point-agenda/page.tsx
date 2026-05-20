import type { Metadata } from "next";
import { AgendaCard } from "@/components/AgendaCard";
import { Section } from "@/components/Section";
import { agendaItems } from "@/data/agenda";

export const metadata: Metadata = {
  title: "Five-Point Agenda: Explained With Context",
  description: "CWI explains the viral five-point agenda circulating online as independent public-interest commentary, not official endorsement."
};

export default function FivePointAgendaPage() {
  return (
    <Section
      eyebrow="Public-Interest Explainer"
      title="Five-Point Agenda: Explained With Context"
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
