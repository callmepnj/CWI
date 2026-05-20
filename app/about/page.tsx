import type { Metadata } from "next";
import { Archive, Eye, FileCheck, Megaphone, Newspaper, ShieldCheck } from "lucide-react";
import { Section } from "@/components/Section";
import { Card, CardLabel } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Cockroach Watch India",
  description: "About CWI: a founder-led, India-focused, youth-first, independent civic commentary and satire-with-responsibility platform."
};

const facts = ["Founded by CWI", "India-focused", "Youth-first", "Independent", "Serious civic commentary", "Satire with responsibility"];

const missions = [
  ["Track the movement", Eye],
  ["Verify before posting", FileCheck],
  ["Credit creators", ShieldCheck],
  ["Archive public memory", Archive],
  ["Amplify youth voice", Megaphone],
  ["Keep institutions watchable", Newspaper]
] as const;

export default function AboutPage() {
  return (
    <Section eyebrow="About CWI" title="About Cockroach Watch India" subtitle="Cockroach Watch India was founded as a serious civic watch and commentary platform for a generation that refuses to be ignored.">
      <Card>
        <CardLabel>Institutional Note</CardLabel>
        <div className="space-y-5 text-lg leading-8 text-ink/70">
          <p>
            We track the Cockroach wave, youth-led public conversations, viral satire, civic issues, creator work, public reactions, and the digital language of protest.
          </p>
          <p>
            We are here to document the moment, verify claims, credit creators, and preserve the public memory of what young India is saying.
          </p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((fact) => (
            <p key={fact} className="rounded-2xl border border-line bg-paper p-4 font-black uppercase tracking-[0.08em]">
              {fact}
            </p>
          ))}
        </div>
      </Card>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {missions.map(([mission, Icon]) => (
          <Card key={mission}>
            <Icon className="h-8 w-8 text-royal" />
            <h3 className="mt-5 font-display text-3xl font-black uppercase leading-tight tracking-[-0.04em]">{mission}</h3>
          </Card>
        ))}
      </div>
    </Section>
  );
}
