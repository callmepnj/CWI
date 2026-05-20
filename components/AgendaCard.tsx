import type { LucideIcon } from "lucide-react";
import { Card, CardLabel } from "@/components/ui/card";

export function AgendaCard({
  index,
  title,
  demand,
  concern,
  context,
  openQuestion,
  icon: Icon
}: {
  index: number;
  title: string;
  demand: string;
  concern: string;
  context: string;
  openQuestion: string;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <CardLabel>Point {index}</CardLabel>
        <Icon className="h-8 w-8 text-saffron" />
      </div>
      <h3 className="font-display text-3xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">{title}</h3>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <AgendaField label="Demand" value={demand} />
        <AgendaField label="Public Concern" value={concern} />
        <AgendaField label="CWI Context" value={context} />
        <AgendaField label="Open Question" value={openQuestion} />
      </div>
    </Card>
  );
}

function AgendaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-4">
      <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.18em] text-leaf">{label}</p>
      <p className="mt-2 text-sm leading-6 text-ink/76">{value}</p>
    </div>
  );
}
