import type { Metadata } from "next";
import { Eye, FileSearch, Megaphone, ShieldAlert } from "lucide-react";
import { Section } from "@/components/Section";
import { Card, CardLabel } from "@/components/ui/card";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "What is Cockroach Watch India?",
  description: "A clear explanation of CWI as an independent youth-first civic watch, satire, commentary, and movement documentation platform."
};

const whatWeAre = [
  "Civic watch platform",
  "Youth voice archive",
  "Satire and commentary page",
  "Public issue tracker",
  "Creator-credit media hub",
  "Movement documentation platform"
];

const whatWeAreNot = [
  "Not an official political party website",
  "Not a fake news page",
  "Not a hate page",
  "Not a doxxing platform",
  "Not a place for threats",
  "Not a casual meme dump"
];

export default function WhatIsCwiPage() {
  return (
    <Section eyebrow="CWI Explained" title="What is Cockroach Watch India?" subtitle={site.shortDisclaimer}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardLabel>A. The Origin of the Watch</CardLabel>
          <Eye className="h-8 w-8 text-royal" />
          <p className="mt-5 text-lg leading-8 text-ink/70">
            CWI was founded to track the Cockroach wave and the wider youth-led civic conversation around it. We document the posts, public reactions, local issues, corrections, creator work, and civic anger that are shaping this moment.
          </p>
        </Card>
        <Card>
          <CardLabel>B. Why &quot;Watch&quot;?</CardLabel>
          <FileSearch className="h-8 w-8 text-royal" />
          <p className="mt-5 text-lg leading-8 text-ink/70">
            Because someone has to watch what is going viral, what is being ignored, what young people are saying, what public institutions are doing, what local citizens are reporting, what misinformation is spreading, and what creators are exposing.
          </p>
        </Card>
        <Card>
          <CardLabel>C. What We Are</CardLabel>
          <Megaphone className="h-8 w-8 text-leaf" />
          <div className="mt-5 grid gap-3">
            {whatWeAre.map((item) => (
              <p key={item} className="rounded-2xl border border-line bg-paper p-3 font-black uppercase tracking-[0.08em]">
                {item}
              </p>
            ))}
          </div>
        </Card>
        <Card>
          <CardLabel>D. What We Are Not</CardLabel>
          <ShieldAlert className="h-8 w-8 text-urgent" />
          <div className="mt-5 grid gap-3">
            {whatWeAreNot.map((item) => (
              <p key={item} className="rounded-2xl border border-line bg-paper p-3 font-black uppercase tracking-[0.08em]">
                {item}
              </p>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}
