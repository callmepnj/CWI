import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Eye, FileText, Flag, Newspaper, Send } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { WatchTicker } from "@/components/WatchTicker";
import { FounderStatement } from "@/components/FounderStatement";
import { Section } from "@/components/Section";
import { CharterCard } from "@/components/CharterCard";
import { RoleCard } from "@/components/RoleCard";
import { IssueCard } from "@/components/IssueCard";
import { WatchDeskCard } from "@/components/WatchDeskCard";
import { AgendaCard } from "@/components/AgendaCard";
import { PollCard } from "@/components/PollCard";
import { SocialLinks } from "@/components/SocialLinks";
import { ArchiveCard } from "@/components/ArchiveCard";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { charterPrinciples } from "@/data/charter";
import { roles } from "@/data/roles";
import { issues } from "@/data/issues";
import { posts } from "@/data/posts";
import { agendaItems } from "@/data/agenda";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cockroach Watch India — Civic Watch, Youth Voice & Movement Archive",
  description: site.description
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WatchTicker />
      <Section title="A Statement From The Founders">
        <FounderStatement />
      </Section>
      <Section
        eyebrow="What is CWI?"
        title="Not a meme page. A civic watch."
        subtitle="CWI tracks the Cockroach wave and the wider youth-led civic conversation around it: what is viral, what is ignored, what requires verification, and what should not disappear."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            ["Document", "Public issues, viral moments, creator work, and civic reactions."],
            ["Verify", "Source trails, correction requests, context notes, and careful labels."],
            ["Amplify", "Youth voice, public-interest satire, and reports that deserve attention."]
          ].map(([title, body]) => (
            <Card key={title}>
              <CardLabel>CWI Desk</CardLabel>
              <h3 className="font-display text-3xl font-black uppercase">{title}</h3>
              <p className="mt-4 leading-7 text-ink/70">{body}</p>
            </Card>
          ))}
        </div>
        <Button asChild className="mt-8" variant="green">
          <Link href="/what-is-cwi">Read what CWI is <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </Section>
      <Section eyebrow="Manifesto Preview" title="The Watch Charter" subtitle="A serious charter for a generation that refuses to be ignored.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {charterPrinciples.slice(0, 6).map((principle, index) => (
            <CharterCard key={principle.title} index={index + 1} {...principle} />
          ))}
        </div>
        <Button asChild className="mt-8">
          <Link href="/charter">Read all 10 principles</Link>
        </Button>
      </Section>
      <Section eyebrow="Join The Watch" title="Who are you in the Watch?" subtitle="You do not need power to watch power. You need a phone, a conscience, and proof.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {roles.map((role) => (
            <RoleCard key={role.title} {...role} />
          ))}
        </div>
      </Section>
      <Section eyebrow="Issue Watch" title="Local issues are national signals." subtitle="The problems people record when institutions stop listening.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {issues.slice(0, 6).map((issue) => (
            <IssueCard key={issue.title} {...issue} />
          ))}
        </div>
        <Button asChild className="mt-8" variant="outline">
          <Link href="/issues">View issue tracker</Link>
        </Button>
      </Section>
      <Section eyebrow="Watch Desk" title="Latest from the Watch Desk" subtitle="Verified notes, explainers, public reactions, corrections, and movement updates.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {posts.slice(0, 4).map((post) => (
            <WatchDeskCard key={post.slug} post={post} />
          ))}
        </div>
      </Section>
      <Section eyebrow="Agenda Explainer" title="Five-point agenda, with context." subtitle="CWI explains the viral agenda as public-interest commentary, not official endorsement.">
        <div className="grid gap-6">
          {agendaItems.slice(0, 2).map((item, index) => (
            <AgendaCard key={item.title} index={index + 1} {...item} />
          ))}
        </div>
        <Button asChild className="mt-8" variant="green">
          <Link href="/five-point-agenda">Read full agenda explainer</Link>
        </Button>
      </Section>
      <Section eyebrow="Youth Voice" title="Not silent. Not invisible. Not disposable.">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <PollCard />
          <Card>
            <CardLabel>Question of the week</CardLabel>
            <h3 className="font-display text-4xl font-black uppercase leading-none">What issue should India&apos;s youth discuss first?</h3>
            <p className="mt-5 leading-8 text-ink/70">
              Youth voice is not background noise. CWI archives the questions young citizens are asking before the internet forgets them.
            </p>
            <Button asChild className="mt-7" variant="outline">
              <Link href="/youth-voice">Open Youth Voice</Link>
            </Button>
          </Card>
        </div>
      </Section>
      <Section eyebrow="Media Bank" title="The visual archive of the movement.">
        <div className="grid gap-6 md:grid-cols-3">
          <ArchiveCard title="CWI Official Poster Set" kind="Posters" credit="Cockroach Watch India" platform="CWI" permission="Official asset" />
          <ArchiveCard title="Public Reaction Clip Log" kind="Clips" credit="Community-submitted" platform="Public platforms" permission="Requires review" />
          <ArchiveCard title="Explainer Graphic Archive" kind="Graphics" credit="Creator credited where visible" platform="Instagram / X" permission="Commentary archive" />
        </div>
      </Section>
      <Section title="Submit a Report To CWI" subtitle="Send a public issue, viral post, correction, creator credit request, or civic story.">
        <div className="rounded-[2rem] bg-gradient-to-br from-ink via-[#102a63] to-royal p-8 text-white shadow-soft">
          <Send className="h-9 w-9 text-saffron" />
          <h3 className="mt-5 font-display text-4xl font-black uppercase leading-tight tracking-[-0.04em]">The Watch Desk is open.</h3>
          <p className="mt-4 max-w-3xl text-white/76">
            Submit public evidence, source links, issue details, and creator credit requests. Do not submit private data, threats, hate, or unverified allegations as fact.
          </p>
          <Button asChild className="mt-7" variant="saffron">
            <Link href="/submit">Submit report</Link>
          </Button>
        </div>
      </Section>
      <Section eyebrow="Follow CWI" title="Watch with us.">
        <SocialLinks />
      </Section>
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-3xl border border-line bg-white p-5 font-mono text-xs font-black uppercase tracking-[0.14em] shadow-card sm:grid-cols-4">
          <span><Eye className="mb-2 h-5 w-5 text-royal" /> Civic watch</span>
          <span><FileText className="mb-2 h-5 w-5 text-royal" /> Creator credit</span>
          <span><Newspaper className="mb-2 h-5 w-5 text-royal" /> Public archive</span>
          <span><Flag className="mb-2 h-5 w-5 text-royal" /> India-focused</span>
        </div>
      </div>
    </>
  );
}
