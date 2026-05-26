import { CheckCircle2 } from "lucide-react";
import { Card, CardLabel } from "@/components/ui/card";
import { MovementQuote } from "@/components/MovementQuote";

const principles = [
  "We verify before we amplify.",
  "We credit creators.",
  "We protect public interest.",
  "We reject hate, threats, and misinformation.",
  "We document what people in power want forgotten.",
  "We keep satire sharp, but responsible."
];

export function FounderStatement() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <CardLabel>Founder Statement</CardLabel>
        <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">Why CWI exists</h2>
        <div className="mt-6 space-y-5 text-lg leading-8 text-ink/72">
          <p>
            We created Cockroach Watch India because this moment is bigger than one meme, one post, or one trend. Across India, young people are recording injustice, questioning power, exposing local issues, correcting misinformation, and refusing to stay silent.
          </p>
          <p>CWI exists to watch, document, verify, archive, and amplify that energy.</p>
          <p className="rounded-3xl bg-skywash p-5 font-display text-2xl font-black uppercase text-ink">
            We are not here to create noise. We are here to create memory.
          </p>
        </div>
      </Card>
      <div className="space-y-6">
        <MovementQuote />
        <Card>
          <CardLabel>Founder Principles</CardLabel>
          <div className="grid gap-3">
            {principles.map((principle) => (
              <div key={principle} className="flex gap-3 rounded-2xl border border-line bg-paper p-3 font-bold">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-leaf" />
                {principle}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
