import Link from "next/link";
import { ArrowRight, Eye, FileText, Flag, Newspaper, Send } from "lucide-react";
import { AgendaCard } from "@/components/AgendaCard";
import { ArchiveCard } from "@/components/ArchiveCard";
import { CharterCard } from "@/components/CharterCard";
import { FounderStatement } from "@/components/FounderStatement";
import { HeroSection } from "@/components/HeroSection";
import { IssueCard } from "@/components/IssueCard";
import { PollCard } from "@/components/PollCard";
import { RoleCard } from "@/components/RoleCard";
import { Section } from "@/components/Section";
import { SocialLinks } from "@/components/SocialLinks";
import { WatchDeskCard } from "@/components/WatchDeskCard";
import { WatchHighlightSection } from "@/components/WatchHighlightSection";
import { WatchTicker } from "@/components/WatchTicker";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { agendaItems } from "@/data/agenda";
import { charterPrinciples } from "@/data/charter";
import { issues } from "@/data/issues";
import { posts, trendingTopics } from "@/data/posts";
import { roles } from "@/data/roles";
import { unansweredFiles } from "@/data/unanswered-files";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { getLiveNewsroomFallbackItems, getPublishedLiveNewsroomItems } from "@/lib/db/live-newsroom";

const homepageFaqs = [
  {
    question: "What is Cockroach Watch India?",
    answer:
      "Cockroach Watch India, also known as CWI, is a founder-led civic watch, satire, and commentary platform documenting youth voice, public issues, viral civic moments, creator-led commentary, civic satire, creator credit, and the Cockroach wave across India."
  },
  {
    question: "Is CWI the official Cockroach Janta Party website?",
    answer:
      "No. CWI is independent from Cockroach Janta Party unless officially declared otherwise. Cockroach Watch India does not impersonate any political party and exists as a public-interest civic watch, satire, and commentary platform."
  },
  {
    question: "What does CWI document?",
    answer:
      "CWI documents public issues, youth reactions, civic satire, viral political and civic moments, correction requests, fact-check leads, creator-credit requests, local accountability stories, and movement archive material."
  },
  {
    question: "How can someone submit a report to CWI?",
    answer:
      "Citizens can submit a public issue, viral post, source link, correction, creator credit request, or youth story through the Submit a Report page. CWI asks for evidence, context, consent, and responsible public-interest submissions."
  },
  {
    question: "Why does creator credit matter to Cockroach Watch India?",
    answer:
      "Creator credit protects public memory and respects the people who record, explain, design, satirize, and document civic moments. CWI does not remove watermarks or claim ownership of user-created work."
  }
];

const homepageFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homepageFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
};

const homepageWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Cockroach Watch India - CWI Civic Watch Platform",
  url: absoluteUrl("/"),
  description: site.description,
  isPartOf: {
    "@type": "WebSite",
    name: site.name,
    url: site.url
  },
  about: [
    "Cockroach Watch India",
    "CWI",
    "Cockroach wave",
    "Youth voice India",
    "Civic watch India",
    "Political satire India",
    "Public issues India",
    "Creator credit"
  ],
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: absoluteUrl("/opengraph-image"),
    width: 1200,
    height: 630
  }
};

export const metadata = createMetadata({
  title: "Cockroach Watch India — CWI Civic Watch Platform",
  description:
    "Cockroach Watch India, also known as CWI, is an independent civic watch, satire, and commentary platform documenting youth voice, public issues, creator credit, viral claims, and India's unanswered files.",
  path: "/",
  keywords: [
    "Cockroach Watch India",
    "CWI",
    "CWI Watch Desk",
    "CWI articles",
    "India Unanswered Files",
    "public issues India",
    "youth voice India",
    "civic watch India",
    "Document Verify Amplify"
  ]
});

export default async function HomePage() {
  const dateSortedPosts = [...posts].sort((first, second) => dateValue(second.date) - dateValue(first.date));
  const featuredPost = dateSortedPosts[0];
  const latestIssuePost = dateSortedPosts.find((post) => post.category === "Civic Issue") ?? dateSortedPosts[0];
  const latestYouthPost = dateSortedPosts.find((post) => post.category === "Youth Voice") ?? dateSortedPosts[1];
  const dbLiveItems = await getPublishedLiveNewsroomItems(6).catch(() => []);
  const liveNewsroomItems = mergeLiveItems(dbLiveItems, getLiveNewsroomFallbackItems(6)).slice(0, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageWebPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqJsonLd) }}
      />
      <HeroSection />
      <WatchHighlightSection />
      <WatchTicker />
      <Section
        eyebrow="CWI Live Newsroom"
        title="Live from CWI Newsroom"
        subtitle="Latest source-backed updates, public advisories, and India Unanswered Files coverage."
      >
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="bg-gradient-to-br from-white via-skywash to-[#F7FFF9]">
            <CardLabel>Source-backed operating desk</CardLabel>
            <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
              One central newsroom for updates, verification, sources, and public memory.
            </h2>
            <p className="mt-4 leading-8 text-ink/70">
              CWI Live Newsroom brings Watch Desk updates, public advisories, India Unanswered Files, and source trails into one approval-first public desk.
            </p>
            <Button asChild className="mt-7">
              <Link href="/live-newsroom">Enter Live Newsroom</Link>
            </Button>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            {liveNewsroomItems.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={`/live-newsroom/${item.slug}`}
                className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-royal/35 hover:shadow-soft"
              >
                <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-royal">
                  {item.verificationStatus} / {item.sourceCount} sources
                </p>
                <h3 className="mt-2 font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-ink/66">{item.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </Section>
      <Section title="A Statement From The Founders">
        <FounderStatement />
      </Section>
      <Section
        eyebrow="What is CWI?"
        title="What is Cockroach Watch India?"
        subtitle="CWI tracks the Cockroach wave and the wider youth-led civic conversation around it: what is viral, what is ignored, what requires verification, and what should not disappear."
      >
        <div className="mb-8 rounded-3xl border border-line bg-white p-6 leading-8 text-ink/72 shadow-card">
          <p>
            Cockroach Watch India, also known as CWI, is a founder-led civic watch platform built around a simple public duty: Document. Verify. Amplify. The youth are not silent. India is watching.
          </p>
          <p className="mt-4">
            We document youth voice, public issues, civic satire, creator credit, and the Cockroach wave with responsible context so searchers, citizens, creators, and reporters can understand the movement without confusing CWI with any political party.
          </p>
        </div>
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
      <Section eyebrow="Manifesto Preview" title="The CWI Watch Charter" subtitle="A serious charter for a generation that refuses to be ignored.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {charterPrinciples.slice(0, 6).map((principle, index) => (
            <CharterCard key={principle.title} index={index + 1} {...principle} />
          ))}
        </div>
        <Button asChild className="mt-8">
          <Link href="/charter">Read the CWI Watch Charter</Link>
        </Button>
      </Section>
      <Section eyebrow="Join The Watch" title="Who are you in the Watch?" subtitle="You do not need power to watch power. You need a phone, a conscience, and proof.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {roles.map((role) => (
            <RoleCard key={role.title} {...role} />
          ))}
        </div>
      </Section>
      <Section eyebrow="Issue Watch" title="Issue Watch" subtitle="The problems people record when institutions stop listening. Local issues are national signals.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {issues.slice(0, 6).map((issue) => (
            <IssueCard key={issue.title} {...issue} />
          ))}
        </div>
        <Button asChild className="mt-8" variant="outline">
          <Link href="/issues">Explore public issues tracked by CWI</Link>
        </Button>
      </Section>
      <Section eyebrow="Watch Desk" title="Latest from CWI Watch Desk" subtitle="Editorial notes, explainers, public reactions, corrections, and archive updates from Cockroach Watch India articles.">
        <div className="mb-6 rounded-[2rem] border border-line bg-gradient-to-br from-ink via-[#102a63] to-royal p-6 text-white shadow-soft">
          <CardLabel className="bg-white/12 text-saffron ring-white/15">Source-backed Watch Desk</CardLabel>
          <h3 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.04em]">{featuredPost.title}</h3>
          <p className="mt-4 max-w-3xl leading-8 text-white/76">{featuredPost.summary}</p>
          <p className="mt-3 font-mono text-xs font-black uppercase tracking-[0.12em] text-saffron">
            {featuredPost.sources.length} public sources / comments now open / corrections welcome
          </p>
          <Button asChild className="mt-6" variant="saffron">
            <Link href={`/watch-desk/${featuredPost.slug}`}>Read featured Watch Desk article</Link>
          </Button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardLabel>What we know</CardLabel>
            <p className="font-display text-3xl font-black uppercase leading-tight">CJP is publicly reported as a satirical online phenomenon</p>
            <p className="mt-3 leading-7 text-ink/70">CWI uses Reuters, Economic Times, official CJP pages, Al Jazeera, AP, and other public sources where relevant.</p>
          </Card>
          <Card>
            <CardLabel>What remains unclear</CardLabel>
            <p className="font-display text-3xl font-black uppercase leading-tight">Fast-moving details need attribution</p>
            <p className="mt-3 leading-7 text-ink/70">Follower counts, platform actions, and public claims are treated as date-specific and developing unless clearly confirmed.</p>
          </Card>
          <Card>
            <CardLabel>Trending topics</CardLabel>
            <p className="font-display text-3xl font-black uppercase leading-tight">CJP / Cockroach wave</p>
            <p className="mt-3 leading-7 text-ink/70">{trendingTopics.slice(0, 5).join(", ")}</p>
          </Card>
          <Card>
            <CardLabel>Corrections and discussion</CardLabel>
            <p className="font-display text-3xl font-black uppercase leading-tight">Submit context</p>
            <p className="mt-3 leading-7 text-ink/70">Every article now has moderated comments and visible source links for correction, context, and public-interest discussion.</p>
            <Link href="/submit" className="mt-4 inline-flex font-mono text-xs font-black uppercase tracking-[0.14em] text-royal">Submit correction</Link>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {dateSortedPosts.slice(0, 8).map((post) => (
            <WatchDeskCard key={post.slug} post={post} />
          ))}
        </div>
      </Section>
      <Section
        eyebrow="CWI India Unanswered Files"
        title="CWI India Unanswered Files"
        subtitle="India Unanswered Files is a Cockroach Watch India archive tracking public issues, civic memory, and the questions that still need answers."
      >
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="bg-gradient-to-br from-white via-skywash to-white">
            <CardLabel>Public memory archive</CardLabel>
            <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
              Source-backed files for unanswered civic questions.
            </h2>
            <p className="mt-4 leading-8 text-ink/70">
              CWI India Unanswered Files documents public issues, civic memory, official responses, source archives, and unresolved stories across India. It links readers from Cockroach Watch India articles to deeper case timelines.
            </p>
            <Button asChild className="mt-7" variant="green">
              <Link href="/india-unanswered-files">Explore CWI India Unanswered Files</Link>
            </Button>
          </Card>
          <div className="grid gap-4">
            {unansweredFiles.slice(0, 3).map((file) => (
              <Link
                key={file.slug}
                href={`/india-unanswered-files/${file.slug}`}
                className="group rounded-[1.5rem] border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-royal/35 hover:shadow-soft"
              >
                <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-royal">
                  {file.category} / {file.sourceCount} sources
                </p>
                <h3 className="mt-2 font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">
                  {file.title} - CWI India Unanswered Files
                </h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-ink/66">{file.unansweredQuestion}</p>
              </Link>
            ))}
          </div>
        </div>
      </Section>
      <Section eyebrow="Latest Signals" title="Latest public issue and youth voice">
        <div className="grid gap-6 lg:grid-cols-2">
          <WatchDeskCard post={latestIssuePost} />
          <WatchDeskCard post={latestYouthPost} />
        </div>
      </Section>
      <Section eyebrow="Agenda Explainer" title="Five-point agenda, with context." subtitle="CWI explains the viral agenda as public-interest commentary, not official endorsement.">
        <div className="grid gap-6">
          {agendaItems.slice(0, 2).map((item, index) => (
            <AgendaCard key={item.title} index={index + 1} {...item} />
          ))}
        </div>
        <Button asChild className="mt-8" variant="green">
          <Link href="/five-point-agenda">Read the five-point agenda explainer</Link>
        </Button>
      </Section>
      <Section eyebrow="Youth Voice" title="Youth Voice">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <PollCard />
          <Card>
            <CardLabel>Question of the week</CardLabel>
            <h3 className="font-display text-4xl font-black uppercase leading-none">What issue should India&apos;s youth discuss first?</h3>
            <p className="mt-5 leading-8 text-ink/70">
              Youth voice is not background noise. CWI archives the questions young citizens are asking before the internet forgets them.
            </p>
            <Button asChild className="mt-7" variant="outline">
              <Link href="/youth-voice">Read CWI youth voice submissions</Link>
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
      <Section title="Submit a Report" subtitle="Send a public issue, viral post, correction, creator credit request, or civic story to Cockroach Watch India.">
        <div className="rounded-[2rem] bg-gradient-to-br from-ink via-[#102a63] to-royal p-8 text-white shadow-soft">
          <Send className="h-9 w-9 text-saffron" />
          <h3 className="mt-5 font-display text-4xl font-black uppercase leading-tight tracking-[-0.04em]">The Watch Desk is open.</h3>
          <p className="mt-4 max-w-3xl text-white/76">
            Submit public evidence, source links, issue details, and creator credit requests. Do not submit private data, threats, hate, or unverified allegations as fact.
          </p>
          <Button asChild className="mt-7" variant="saffron">
            <Link href="/submit">Submit a civic report to CWI</Link>
          </Button>
        </div>
      </Section>
      <Section
        eyebrow="Public Questions"
        title="Cockroach Watch India FAQ"
        subtitle="Clear answers for searchers, creators, citizens, and readers trying to understand CWI without confusing it with any political party."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {homepageFaqs.map((faq) => (
            <Card key={faq.question}>
              <CardLabel>CWI FAQ</CardLabel>
              <h3 className="font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em]">{faq.question}</h3>
              <p className="mt-4 leading-7 text-ink/72">{faq.answer}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/about">Learn about Cockroach Watch India</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/credit-policy">Read the creator credit policy</Link>
          </Button>
          <Button asChild variant="green">
            <Link href="/submit">Submit a public issue to CWI</Link>
          </Button>
        </div>
      </Section>
      <Section eyebrow="Follow CWI" title="Follow CWI">
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

function dateValue(value: string) {
  return new Date(`${value}T00:00:00+05:30`).getTime();
}

function mergeLiveItems<T extends { slug: string }>(primary: T[], fallback: T[]) {
  const seen = new Set<string>();
  return [...primary, ...fallback].filter((item) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
}
