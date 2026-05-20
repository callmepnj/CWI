import type { Metadata } from "next";
import { PollCard } from "@/components/PollCard";
import { Section } from "@/components/Section";
import { Card, CardLabel } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Youth Voice",
  description: "Questions, public reaction cards, student voice, first-time voter voice, unemployed youth voice, creator voice, and quiet watcher submissions."
};

const questions = [
  "What issue should India's youth discuss first?",
  "Is satire becoming the new protest language?",
  "What does dignity mean for unemployed youth?",
  "What should be archived before the internet forgets?",
  "What do young citizens expect from institutions?"
];

const sections = [
  "Question of the week",
  "Public reaction cards",
  "Student voice",
  "First-time voter voice",
  "Unemployed youth voice",
  "Creator voice",
  "Quiet watcher submissions"
];

export default function YouthVoicePage() {
  return (
    <Section eyebrow="Youth Voice" title="Youth Voice" subtitle="Not silent. Not invisible. Not disposable.">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <PollCard />
        <Card>
          <CardLabel>Questions</CardLabel>
          <div className="grid gap-3">
            {questions.map((question) => (
              <p key={question} className="rounded-2xl border border-line bg-paper p-4 font-display text-xl font-black uppercase leading-tight tracking-[-0.03em]">
                {question}
              </p>
            ))}
          </div>
        </Card>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <Card key={section} className="p-5">
            <CardLabel>Voice Desk</CardLabel>
            <h3 className="font-display text-2xl font-black uppercase leading-none">{section}</h3>
            <p className="mt-4 text-sm leading-6 text-ink/70">
              A moderated space for public-interest submissions, careful context, and youth-led civic memory.
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
