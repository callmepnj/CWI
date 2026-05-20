import { Card, CardLabel } from "@/components/ui/card";

export function CharterCard({ index, title, body }: { index: number; title: string; body: string }) {
  return (
    <Card>
      <CardLabel>CWI Charter / {String(index).padStart(2, "0")}</CardLabel>
      <h3 className="font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">{title}</h3>
      <p className="mt-4 leading-7 text-ink/70">{body}</p>
    </Card>
  );
}
