import type { Metadata } from "next";
import type React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  ExternalLink,
  Scale,
  UsersRound
} from "lucide-react";
import { ManipurResearchBox } from "@/components/ManipurResearchBox";
import { ManipurSourceArchive } from "@/components/ManipurSourceArchive";
import { ManipurTimeline } from "@/components/ManipurTimeline";
import { Button } from "@/components/ui/button";
import {
  accountabilityFrames,
  communityExplainers,
  getManipurSources,
  governmentResponsePanels,
  humanCostPanels,
  manipurImages,
  manipurSeoKeywords,
  manipurSources,
  manipurTimeline,
  mediaBiasPanels,
  quickFacts,
  researchAnswers,
  type ManipurPanel
} from "@/data/manipur";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const pagePath = "/watch/manipur-crisis";
const pageUrl = absoluteUrl(pagePath);
const pageTitle = "Manipur Crisis Explained: Timeline, Human Cost & Political Accountability";
const pageDescription =
  "A complete evidence-based investigation into the Manipur violence from 2023 to 2026, covering the timeline, displacement, relief camps, political response, BJP criticism, and unanswered questions.";
const publishedDate = "2026-05-24T00:00:00+05:30";

const baseMetadata = createMetadata({
  title: pageTitle,
  description: pageDescription,
  path: pagePath,
  type: "article",
  publishedTime: publishedDate,
  keywords: manipurSeoKeywords
});

export const metadata: Metadata = {
  ...baseMetadata,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: site.name,
    images: [
      {
        url: absoluteUrl(manipurImages.hero.src),
        width: 1200,
        height: 630,
        alt: "Cockroach Watch India Manipur crisis investigation preview"
      }
    ],
    locale: "en_IN",
    type: "article",
    publishedTime: publishedDate
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [absoluteUrl(manipurImages.hero.src)],
    creator: "@CWatchIndia",
    site: "@CWatchIndia"
  }
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: pageTitle,
  description: pageDescription,
  datePublished: publishedDate,
  dateModified: publishedDate,
  author: {
    "@type": "Organization",
    name: "Cockroach Watch India Editorial Desk",
    url: site.url
  },
  publisher: {
    "@type": "Organization",
    name: site.name,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/brand/logo.png")
    }
  },
  url: pageUrl,
  mainEntityOfPage: pageUrl,
  image: absoluteUrl(manipurImages.hero.src),
  articleSection: "Investigative Watch",
  keywords: manipurSeoKeywords.join(", "),
  citation: manipurSources.map((source) => source.href),
  isAccessibleForFree: true
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: site.url
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "The Watch",
      item: absoluteUrl("/watch")
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Manipur Crisis Investigation",
      item: pageUrl
    }
  ]
};

const quickNav = [
  ["Read Full Timeline", "#timeline"],
  ["See Human Cost", "#human-cost"],
  ["View Political Accountability", "#accountability"],
  ["Open Source Archive", "#source-archive"]
];

const visualCards = [
  {
    title: "Destroyed homes and worship spaces",
    image: manipurImages.burnedPlace,
    caption: "Documentary visual from the CWI asset archive. Used to show scale of destruction without graphic content."
  },
  {
    title: "Security deployment and guarded zones",
    image: manipurImages.security,
    caption: "Security presence became part of ordinary life, but deployment alone did not rebuild trust."
  },
  {
    title: "Roads, debris, and disrupted mobility",
    image: manipurImages.road,
    caption: "Movement, trade, schooling, and return all became harder where fear and damage persisted."
  }
];

const unansweredQuestions = [
  "Why did it take so long to restore peace?",
  "Why were so many people displaced for so long?",
  "Why were weapons allowed to circulate?",
  "Why did relief and rehabilitation move slowly?",
  "Why did communities lose trust in the state?",
  "Why was Manipur not treated as a national emergency from day one?"
];

export default function ManipurCrisisPage() {
  return (
    <>
      {[articleJsonLd, breadcrumbJsonLd].map((item) => (
        <script
          key={item["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

      <article className="bg-paper text-ink">
        <HeroSection />
        <QuickFactsSection />
        <TimelineSection />
        <HumanCostSection />
        <AccountabilitySection />
        <CommunityExplainerSection />
        <MediaBiasSection />
        <VisualEvidenceSection />
        <SourceArchiveSection />
        <ResearchSection />
        <FinalSection />
      </article>
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_14%_15%,rgba(11,92,255,0.18),transparent_28rem),radial-gradient(circle_at_85%_12%,rgba(255,210,63,0.30),transparent_24rem),radial-gradient(circle_at_72%_86%,rgba(0,194,168,0.14),transparent_30rem),linear-gradient(135deg,#ffffff,#f8fafc_58%,#eaf2ff)]" />
      <div className="absolute inset-0 -z-10 opacity-70 [background-image:linear-gradient(rgba(11,92,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(11,92,255,0.05)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1.05fr)_0.95fr] lg:items-center">
        <div>
          <Link
            href="/watch"
            className="inline-flex rounded-full border border-royal/20 bg-skywash px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.16em] text-royal transition hover:border-royal/50"
          >
            CWI Investigative Watch / Source-backed archive
          </Link>
          <h1 className="mt-7 max-w-5xl font-display text-5xl font-black uppercase leading-[0.88] tracking-[-0.07em] text-ink sm:text-7xl lg:text-8xl">
            Manipur: The State India Forgot?
          </h1>
          <p className="mt-6 max-w-3xl text-xl font-semibold leading-9 text-ink/74">
            A complete evidence-based timeline of the Manipur violence, displacement, silence, delayed response, political failure, and unanswered questions.
          </p>
          <p className="mt-6 max-w-3xl border-l-4 border-urgent pl-5 text-lg leading-8 text-ink/70">
            Manipur has been burning since 2023. The question is not only who started the violence. The question is why peace was allowed to fail for years.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {quickNav.map(([label, href], index) => (
              <Button key={label} asChild variant={index === 0 ? "default" : "outline"}>
                <Link href={href}>{label}</Link>
              </Button>
            ))}
          </div>

          <div className="mt-7 rounded-[1.5rem] border border-saffron/30 bg-saffron/20 p-4 text-sm font-semibold leading-7 text-ink/72">
            This page is based on verified reports and cross-checked sources. The goal is truth, not propaganda. CWI does not blame any whole community and does not publish hate speech or unverified allegations as fact.
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-royal/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2.3rem] border border-line bg-white p-4 shadow-hard">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-ink">
              <Image
                src={manipurImages.hero.src}
                alt={manipurImages.hero.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/88 via-ink/20 to-transparent" />
              <div className="absolute left-5 top-5 rounded-full bg-white/92 px-3 py-1 font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-urgent ring-1 ring-white/50">
                Crisis timeline / 2023-2026
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-white/92 p-4 text-ink shadow-card backdrop-blur">
                <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-royal">
                  CWI source scan
                </p>
                <p className="mt-2 text-sm leading-6 text-ink/70">
                  Violence, displacement, internet shutdowns, relief camps, political accountability, and unresolved peace.
                </p>
              </div>
              <div className="absolute right-5 top-5 h-28 w-24">
                <AbstractManipurMap />
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {["Document", "Verify", "Question"].map((item) => (
                <div key={item} className="rounded-2xl border border-line bg-paper p-4">
                  <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-royal">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickFactsSection() {
  return (
    <DarkSection
      id="quick-facts"
      eyebrow="Quick facts"
      title="What the record shows"
      subtitle="These cards use source-dated language because death tolls, displacement figures, and incident details can change as official and independent records update."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quickFacts.map((item, index) => (
          <div key={item.fact} className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
            <span className="inline-flex rounded-full bg-skywash px-3 py-1 font-mono text-[0.66rem] font-black uppercase tracking-[0.16em] text-royal ring-1 ring-royal/15">
              Fact {index + 1}
            </span>
            <p className="mt-4 text-base font-semibold leading-8 text-ink/75">{item.fact}</p>
            <p className="mt-4 font-mono text-[0.66rem] font-black uppercase tracking-[0.16em] text-urgent">
              Citation: {item.sourceLabel}
            </p>
            <SourcePills ids={item.sourceIds} />
          </div>
        ))}
      </div>
    </DarkSection>
  );
}

function TimelineSection() {
  return (
    <DarkSection
      id="timeline"
      eyebrow="2023 to 2026"
      title="Full crisis timeline"
      subtitle="A scroll-based timeline of verified events, reported developments, and still-developing questions."
    >
      <ManipurTimeline items={manipurTimeline} />
    </DarkSection>
  );
}

function HumanCostSection() {
  return (
    <DarkSection
      id="human-cost"
      eyebrow="Human cost"
      title="Manipur is not just a political crisis. It is a human crisis."
      subtitle="CWI avoids graphic display. The point is to document harm with dignity, not turn suffering into spectacle."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {humanCostPanels.map((panel) => (
          <InfoPanel key={panel.title} panel={panel} icon={<UsersRound className="h-5 w-5" />} />
        ))}
      </div>
    </DarkSection>
  );
}

function AccountabilitySection() {
  return (
    <DarkSection
      id="accountability"
      eyebrow="Accountability"
      title="Why critics say the BJP-led response failed Manipur"
      subtitle="This section does not treat criticism as a court finding. It compares official claims with source-backed ground realities and unanswered public-interest questions."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {accountabilityFrames.map((panel) => (
          <InfoPanel key={panel.title} panel={panel} icon={<Scale className="h-5 w-5" />} />
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {governmentResponsePanels.map((panel) => (
          <div key={panel.title} className="rounded-[1.75rem] border border-saffron/30 bg-saffron/10 p-6 shadow-card">
            <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#8A5B00]">
              Fair record
            </p>
            <h3 className="mt-3 font-display text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
              {panel.title}
            </h3>
            <p className="mt-3 text-base leading-8 text-ink/72">{panel.body}</p>
            <SourcePills ids={panel.sourceIds ?? []} />
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[2rem] border border-urgent/20 bg-urgent/10 p-6 shadow-card">
        <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-urgent">
          Unanswered questions
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {unansweredQuestions.map((question) => (
            <div key={question} className="rounded-2xl border border-line bg-white p-4 text-sm font-bold leading-7 text-ink/72">
              {question}
            </div>
          ))}
        </div>
      </div>
    </DarkSection>
  );
}

function CommunityExplainerSection() {
  return (
    <DarkSection
      id="community-explainer"
      eyebrow="Community explainer"
      title="Communities are not the accused. Hate, armed violence, misinformation, and failed governance are."
      subtitle="CWI does not blame Meitei, Kuki-Zo, Naga, Hindu, Christian, tribal, or any whole community. This page explains context without communal targeting."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {communityExplainers.map((panel) => (
          <InfoPanel key={panel.title} panel={panel} icon={<BookOpenCheck className="h-5 w-5" />} />
        ))}
      </div>
    </DarkSection>
  );
}

function MediaBiasSection() {
  return (
    <DarkSection
      id="media-bias"
      eyebrow="Narrative watch"
      title="How narratives were manufactured"
      subtitle="Real journalism must show every victim, every failure, and every unanswered question."
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {mediaBiasPanels.map((panel) => (
          <div key={panel.title} className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
            <AlertTriangle className="h-5 w-5 text-urgent" />
            <h3 className="mt-4 font-display text-xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">
              {panel.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-ink/70">{panel.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-[2rem] border border-royal/15 bg-gradient-to-br from-white to-skywash p-6 shadow-card">
        <p className="font-display text-3xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
          When media chooses silence, power becomes comfortable.
        </p>
      </div>
    </DarkSection>
  );
}

function VisualEvidenceSection() {
  return (
    <DarkSection
      id="visual-evidence"
      eyebrow="Documentary visuals"
      title="Before peace, there must be a public record"
      subtitle="These visuals are used as context only. CWI does not publish graphic content or identify private victims without clear public-interest reason."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {visualCards.map((card) => (
          <figure key={card.title} className="overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-card">
            <div className="relative aspect-[4/3]">
              <Image src={card.image.src} alt={card.image.alt} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <figcaption className="absolute bottom-4 left-4 right-4">
                <p className="font-display text-xl font-black uppercase leading-tight tracking-[-0.03em] text-white">{card.title}</p>
              </figcaption>
            </div>
            <p className="p-5 text-sm leading-7 text-ink/68">{card.caption}</p>
          </figure>
        ))}
      </div>
    </DarkSection>
  );
}

function SourceArchiveSection() {
  return (
    <DarkSection
      id="source-archive"
      eyebrow="Open source archive"
      title="Search the evidence trail"
      subtitle="Each source record lists what it supports, where it came from, the affected community context, and a bias note. Readers should open original sources before forming conclusions."
    >
      <ManipurSourceArchive sources={manipurSources} />
    </DarkSection>
  );
}

function ResearchSection() {
  return (
    <DarkSection
      id="ai-research"
      eyebrow="CWI AI research"
      title="Ask only from verified sources"
      subtitle="This is a source-bound research interface, not a free-form claim generator. It answers only from the archive on this page and shows citations."
    >
      <ManipurResearchBox answers={researchAnswers} />
    </DarkSection>
  );
}

function FinalSection() {
  return (
    <section className="px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-line bg-gradient-to-br from-white via-skywash to-white p-6 shadow-hard sm:p-10 lg:p-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-royal">Final record</p>
            <div className="mt-5 space-y-4 font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-ink sm:text-5xl">
              <p>Manipur did not need speeches after years of pain.</p>
              <p>Manipur needed protection when the fire started.</p>
              <p>Manipur needed justice when victims cried.</p>
              <p>Manipur needed leadership when communities broke apart.</p>
            </div>
            <p className="mt-8 max-w-3xl text-xl font-semibold leading-9 text-ink/72">
              The question is not only what happened in Manipur. The question is: why was Manipur allowed to suffer for so long?
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="saffron">
                <Link href="#source-archive">Read. Verify. Question.</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/submit">Submit correction or source</Link>
              </Button>
              <Button asChild variant="green">
                <Link href="/watch">Return to The Watch</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-[2rem] border border-line bg-white p-5 shadow-card">
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-royal">
              CWI editorial note
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              Cockroach Watch India is an independent civic watch, satire, and commentary platform. This page discusses publicly available reports, official statements, human-rights documentation, court-linked material, and public reactions. Claims are attributed where possible and should not be treated as legal findings unless clearly stated.
            </p>
            <Link
              href="/credit-policy"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-royal"
            >
              Read CWI policy <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function DarkSection({
  id,
  eyebrow,
  title,
  subtitle,
  children
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mb-8 max-w-4xl">
        <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.2em] text-royal">{eyebrow}</p>
        <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-ink sm:text-5xl">
          {title}
        </h2>
        <p className="mt-5 text-base leading-8 text-ink/70 sm:text-lg">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function InfoPanel({ panel, icon }: { panel: ManipurPanel; icon: React.ReactNode }) {
  return (
    <div className="rounded-[1.75rem] border border-line bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-skywash text-royal ring-1 ring-royal/15">
        {icon}
      </span>
      <h3 className="mt-5 font-display text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
        {panel.title}
      </h3>
      <p className="mt-3 text-base leading-8 text-ink/72">{panel.body}</p>
      {panel.sourceIds ? <SourcePills ids={panel.sourceIds} /> : null}
    </div>
  );
}

function SourcePills({ ids }: { ids: string[] }) {
  const sources = getManipurSources(ids);

  if (!sources.length) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {sources.map((source) => (
        <a
          key={source.id}
          href={source.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-line bg-paper px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.12em] text-ink/58 transition hover:border-royal/35 hover:bg-skywash hover:text-royal"
        >
          {source.publisher}
          <ExternalLink className="h-3 w-3" />
        </a>
      ))}
    </div>
  );
}

function AbstractManipurMap() {
  return (
    <svg viewBox="0 0 96 120" role="img" aria-label="Abstract Manipur map outline" className="h-full w-full">
      <path
        d="M52 4C39 12 34 22 36 34c-12 8-18 17-16 29 2 11 12 17 10 29-1 8 5 17 18 22 13-5 18-15 23-26 7-15 5-27-2-39 5-15-1-32-17-45Z"
        fill="rgba(14,165,233,0.12)"
        stroke="rgba(125,211,252,0.9)"
        strokeWidth="3"
      />
      <circle cx="50" cy="62" r="24" fill="none" stroke="rgba(251,191,36,0.65)" strokeDasharray="4 6" strokeWidth="2" />
      <path d="M10 62h76" stroke="rgba(248,113,113,0.7)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="50" cy="62" r="4" fill="rgb(248,113,113)" />
    </svg>
  );
}
