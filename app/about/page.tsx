import { Archive, Eye, FileCheck, Megaphone, Newspaper, ShieldCheck } from "lucide-react";
import { Section } from "@/components/Section";
import { Card, CardLabel } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About Cockroach Watch India — CWI",
  description:
    "Learn about Cockroach Watch India, a founder-led civic watch and commentary platform documenting youth voice, public issues, creator credit, and the Cockroach wave.",
  path: "/about"
});

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
    <Section eyebrow="About CWI" title="About Cockroach Watch India" titleAs="h1" subtitle="Cockroach Watch India was founded as a serious civic watch and commentary platform for a generation that refuses to be ignored.">
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
      <div className="mt-8">
        <a href="/charter" className="font-mono text-xs font-black uppercase tracking-[0.16em] text-royal">
          Read the CWI Watch Charter
        </a>
      </div>
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
