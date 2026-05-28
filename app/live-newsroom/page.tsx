import type React from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, Send } from "lucide-react";
import { createMetadata, absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { LeadStoryCard } from "@/components/LeadStoryCard";
import { VerificationDesk } from "@/components/VerificationDesk";
import { PublicAdvisoryBoard } from "@/components/PublicAdvisoryBoard";
import { SourceLedger } from "@/components/SourceLedger";
import { Corrections } from "@/components/Corrections";
import { SubmitCTA } from "@/components/SubmitCTA";
import { LiveNewsroomFeed } from "@/components/LiveNewsroomFeed";
import {
  corrections,
  getLeadStory,
  getLiveUpdates,
  getPublicAdvisories,
  getPublicLiveNewsroomItems,
  getTodaysTopItems,
  getVerificationDeskItems,
  getWhatChangedToday,
  sources,
  todaysBriefs,
  type LiveNewsroomItem
} from "@/data/live-newsroom";
import { unansweredFiles, type UnansweredFile } from "@/data/unanswered-files";
import { posts } from "@/data/posts";

type ArchivePreviewItem = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  updatedAt: string;
};

export const revalidate = 300;

const newsroomDescription =
  "Follow CWI Live Newsroom for daily source-backed updates, developing claims, public advisories, verification notes, India Unanswered Files, corrections, and civic issue tracking.";

export const metadata = createMetadata({
  title: "CWI Live Newsroom â€” Daily Source-Backed Updates from Cockroach Watch India",
  description: newsroomDescription,
  path: "/live-newsroom",
  keywords: [
    "CWI Live Newsroom",
    "Cockroach Watch India",
    "daily source-backed updates",
    "verification notes",
    "public advisories",
    "India Unanswered Files",
    "corrections",
    "civic issue tracking"
  ]
});

const fileFilters = ["Students", "Justice", "Environment", "Governance", "Digital Rights", "Public Safety"];

export default function LiveNewsroomPage() {
  const publicItems = getPublicLiveNewsroomItems();
  const leadStory = getLeadStory();
  const todaysTop = getTodaysTopItems(3);
  const changedToday = getWhatChangedToday(6);
  const liveUpdates = getLiveUpdates(10);
  const verificationDesk = getVerificationDeskItems();
  const advisories = getPublicAdvisories();
  const priorityUnansweredFiles = unansweredFiles.slice(0, 6);
  const archiveItems = [...posts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)
    .map(({ title, slug, category, summary, updatedAt }) => ({ title, slug, category, summary, updatedAt }));
  const todayBrief = todaysBriefs[0];
  const latestUpdatedAt = publicItems[0]?.lastUpdatedAt ?? todayBrief?.updatedAt ?? new Date().toISOString();
  const newsroomJsonLd = buildNewsroomJsonLd(publicItems);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsroomJsonLd) }} />

      <main className="bg-cwi-cream/55 text-cwi-ink">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <DailyNewsroomMasthead latestUpdatedAt={latestUpdatedAt} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LiveTicker items={buildTickerItems(publicItems)} />

          <NewsroomBand id="todays-top-3" eyebrow="Daily priority" title="Today's Top 3" className="pt-10">
            <TodaysTopThree items={todaysTop} />
          </NewsroomBand>

          <NewsroomBand
            id="what-changed-today"
            eyebrow="Daily log"
            title="What changed today"
            subtitle="A short daily log of updates CWI added, corrected, or is still checking."
          >
            <WhatChangedToday items={changedToday} />
          </NewsroomBand>

          {leadStory ? (
            <NewsroomBand
              id="lead-story"
              eyebrow="Main record"
              title="Lead Story"
              subtitle="The highest-priority newsroom update with what changed and what remains unclear."
            >
              <LeadStoryCard item={leadStory} />
            </NewsroomBand>
          ) : null}

          <NewsroomBand
            id="latest-updates"
            eyebrow="Developing desk"
            title="Latest updates"
            subtitle="A compact feed for today, this week, verified items, developing checks, advisories, and file updates."
          >
            <LiveNewsroomFeed items={liveUpdates} />
          </NewsroomBand>

          <NewsroomBand
            id="verification-desk"
            eyebrow="Verification note"
            title="Verification Desk"
            subtitle="Claims CWI is checking before treating them as settled."
          >
            <VerificationDesk items={verificationDesk} />
          </NewsroomBand>

          <NewsroomBand
            id="public-advisory-board"
            eyebrow="Share carefully"
            title="Public Advisory Board"
            subtitle="Short caution notes before readers share screenshots, claims, links, or viral posts."
          >
            <PublicAdvisoryBoard advisories={advisories} />
          </NewsroomBand>

          <NewsroomBand
            id="india-unanswered-files"
            eyebrow="Dossier shelf"
            title="India Unanswered Files"
            subtitle="Public issues where records, responsibility, or official answers still need closer tracking."
          >
            <IndiaUnansweredFiles files={priorityUnansweredFiles} />
          </NewsroomBand>

          <NewsroomBand
            id="source-ledger"
            eyebrow="Receipts"
            title="Source Ledger"
            subtitle="Sources used across CWI reports without overwhelming readers."
          >
            <SourceLedger sources={sources.slice(0, 8)} />
          </NewsroomBand>

          <NewsroomBand
            id="corrections"
            eyebrow="Trust record"
            title="Corrections & Clarifications"
            subtitle="If something changes, the record should change too."
          >
            <Corrections corrections={corrections} />
          </NewsroomBand>

          <section className="py-8 lg:py-12">
            <SubmitCTA />
          </section>

          <NewsroomBand
            id="archive-preview"
            eyebrow="Context shelf"
            title="From the Archive"
            subtitle="Older explainers and context posts. Current updates live in the Live Newsroom."
            className="pb-16 lg:pb-20"
          >
            <ArchivePreview items={archiveItems} />
          </NewsroomBand>
        </div>
      </main>
    </>
  );
}

function DailyNewsroomMasthead({ latestUpdatedAt }: { latestUpdatedAt: string }) {
  return (
    <section className="relative overflow-hidden rounded-lg border-2 border-cwi-green bg-cwi-cream shadow-card">
      <div className="h-2 bg-cwi-saffron" />
      <div className="absolute right-4 top-6 hidden select-none font-display text-8xl font-black uppercase text-cwi-green/[0.055] sm:block lg:text-9xl">
        CWI
      </div>
      <div className="absolute inset-0 opacity-[0.26] [background-image:radial-gradient(circle_at_1px_1px,rgba(93,64,55,0.18)_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_0.34fr] lg:p-10">
        <div className="max-w-4xl">
          <div className="mb-5 inline-flex rounded-full border border-cwi-green/28 bg-white/70 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cwi-green">
            CWI LIVE NEWSROOM
          </div>
          <h1 className="font-display text-4xl font-black leading-[0.98] text-cwi-ink sm:text-5xl lg:text-6xl">
            What changed today. What is verified. What still needs answers.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-cwi-ink/72 sm:text-lg">
            Daily source-backed updates, public advisories, verification notes, and India Unanswered Files from Cockroach Watch India.
          </p>
          <p className="mt-3 text-sm font-black uppercase tracking-wide text-cwi-brown">Document. Verify. Amplify.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-cwi-green px-5 py-3 text-sm font-black text-cwi-cream transition hover:bg-cwi-green/90">
              <Send className="h-4 w-4" /> Submit source or correction
            </Link>
            <Link href="/live-newsroom#india-unanswered-files" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border-2 border-cwi-green px-5 py-3 text-sm font-black text-cwi-green transition hover:bg-cwi-green/8">
              <FileText className="h-4 w-4" /> View India Unanswered Files
            </Link>
            <Link href="/archive" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border-2 border-cwi-brown/28 px-5 py-3 text-sm font-black text-cwi-brown transition hover:bg-white/70">
              Browse Archive <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <aside className="rounded-lg border border-cwi-brown/14 bg-white/72 p-5 lg:self-end">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cwi-green">
            <CalendarDays className="h-4 w-4" /> Today
          </div>
          <p className="mt-2 font-display text-2xl font-black text-cwi-ink">{formatLongDate(latestUpdatedAt)}</p>
          <div className="mt-5 grid gap-3 text-sm font-semibold text-cwi-ink/70">
            <TrustPill label="Last updated" value={formatTime(latestUpdatedAt)} />
            <TrustPill label="Independent" value="Yes" />
            <TrustPill label="Source-led" value="Visible trail" />
            <TrustPill label="Human approved" value="Before publish" />
            <TrustPill label="Corrections open" value="Always" />
          </div>
        </aside>
      </div>
    </section>
  );
}

function TrustPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-cwi-border/70 pb-2 last:border-b-0 last:pb-0">
      <span>{label}</span>
      <span className="font-black text-cwi-ink">{value}</span>
    </div>
  );
}

function LiveTicker({ items }: { items: string[] }) {
  const loopItems = [...items, ...items];
  return (
    <section className="overflow-hidden rounded-lg border border-cwi-green bg-cwi-green text-cwi-cream shadow-sm" aria-label="Now tracking">
      <div className="flex items-center gap-4">
        <div className="shrink-0 border-r border-cwi-cream/18 bg-cwi-ink/16 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] sm:px-5">
          Now tracking
        </div>
        <div className="min-w-0 flex-1 overflow-hidden py-3">
          <div className="flex w-max animate-ticker items-center gap-4 pr-4 text-sm font-bold motion-reduce:animate-none hover:[animation-play-state:paused]">
            {loopItems.map((item, index) => (
              <span key={`${item}-${index}`} className="flex items-center gap-4 whitespace-nowrap">
                <span>{item}</span>
                <span className="text-cwi-saffron">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsroomBand({
  id,
  eyebrow,
  title,
  subtitle,
  className = "",
  children
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`py-10 lg:py-14 ${className}`}>
      <div className="mb-6 max-w-3xl lg:mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-cwi-green">
          <span className="h-2 w-2 rounded-full bg-cwi-saffron" /> {eyebrow}
        </div>
        <h2 className="font-display text-3xl font-black leading-tight text-cwi-ink sm:text-4xl">{title}</h2>
        {subtitle ? <p className="mt-2 text-base leading-7 text-cwi-ink/68">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function TodaysTopThree({ items }: { items: LiveNewsroomItem[] }) {
  if (items.length === 0) {
    return <EmptyBox>No approved Top 3 items are published today.</EmptyBox>;
  }

  const [first, ...rest] = items;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <TopCard item={first} prominent />
      {rest.length > 0 ? (
        <div className="grid gap-4">
          {rest.map((item) => (
            <TopCard key={item.id} item={item} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TopCard({ item, prominent = false }: { item: LiveNewsroomItem; prominent?: boolean }) {
  return (
    <Link
      href={`/live-newsroom/${item.slug}`}
      className={`group relative overflow-hidden rounded-lg border-2 border-cwi-brown/14 bg-white p-5 shadow-sm transition hover:border-cwi-green/35 hover:bg-cwi-cream/50 ${
        prominent ? "min-h-[310px] sm:p-7" : "min-h-[190px]"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-cwi-saffron" />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-cwi-green/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-cwi-green">{item.status}</span>
        {item.labels.slice(0, prominent ? 3 : 2).map((label) => (
          <span key={label} className="rounded-full border border-cwi-saffron/35 bg-cwi-saffron/10 px-2.5 py-1 text-[0.68rem] font-black text-cwi-brown">
            {label}
          </span>
        ))}
      </div>
      <h3 className={`font-display font-black leading-tight text-cwi-ink group-hover:text-cwi-green ${prominent ? "text-3xl" : "text-xl"}`}>
        {item.title}
      </h3>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-cwi-ink/68">{item.summary}</p>
      <div className="mt-5 rounded-md border border-cwi-brown/10 bg-cwi-cream/70 p-3">
        <div className="text-[0.68rem] font-black uppercase tracking-wide text-cwi-green">What changed</div>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-cwi-ink/74">{item.whatChanged}</p>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-cwi-border pt-4 text-xs font-bold text-cwi-ink/56">
        <span>{item.sourceTrail.length} source{item.sourceTrail.length === 1 ? "" : "s"}</span>
        <span>{formatDateTime(item.lastUpdatedAt)}</span>
        <span className="inline-flex items-center gap-1 text-cwi-green">Open update <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  );
}

function WhatChangedToday({ items }: { items: LiveNewsroomItem[] }) {
  if (items.length === 0) {
    return <EmptyBox>No approved changes are logged for today yet.</EmptyBox>;
  }

  return (
    <div className="relative grid gap-4 lg:pl-7">
      <div className="absolute left-2 top-1 hidden h-[calc(100%-0.5rem)] w-px bg-cwi-green/28 lg:block" />
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/live-newsroom/${item.slug}`}
          className="group relative rounded-lg border border-cwi-brown/14 bg-white p-4 shadow-sm transition hover:border-cwi-green/35 hover:bg-cwi-cream/55 lg:grid lg:grid-cols-[0.16fr_1fr_0.28fr] lg:gap-5"
        >
          <span className="absolute -left-[1.65rem] top-5 hidden h-3 w-3 rounded-full border-2 border-cwi-green bg-cwi-cream lg:block" />
          <div className="mb-3 lg:mb-0">
            <span className="inline-flex rounded-full border border-cwi-green/25 bg-cwi-green/8 px-3 py-1 text-xs font-black uppercase tracking-wide text-cwi-green">
              {formatTime(item.lastUpdatedAt)}
            </span>
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-cwi-saffron/12 px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-wide text-cwi-brown">{item.changeType}</span>
              <span className="text-xs font-black uppercase tracking-wide text-cwi-ink/50">{item.status}</span>
            </div>
            <h3 className="font-display text-xl font-black leading-tight text-cwi-ink group-hover:text-cwi-green">{item.title}</h3>
            <p className="mt-1 text-sm leading-6 text-cwi-ink/70">{item.whatChanged}</p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-cwi-border pt-3 text-xs font-bold text-cwi-ink/56 lg:mt-0 lg:block lg:border-t-0 lg:pt-0 lg:text-right">
            <span>{item.sourceTrail.length} sources</span>
            <span className="lg:mt-3 lg:block">Open update</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function IndiaUnansweredFiles({ files }: { files: UnansweredFile[] }) {
  if (files.length === 0) {
    return <EmptyBox>No priority files are published right now.</EmptyBox>;
  }

  return (
    <div>
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {fileFilters.map((filter) => (
          <Link
            key={filter}
            href={`/india-unanswered-files?filter=${encodeURIComponent(filter)}`}
            className="shrink-0 rounded-full border border-cwi-green/22 bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-cwi-green transition hover:bg-cwi-green/8"
          >
            {filter}
          </Link>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {files.map((file, index) => (
          <Link
            key={file.slug}
            href={`/india-unanswered-files/${file.slug}`}
            className={`group relative overflow-hidden rounded-lg border-2 border-cwi-brown/15 bg-[#fffaf0] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cwi-green/35 hover:shadow-card ${
              index >= 3 ? "hidden sm:block" : "block"
            }`}
          >
            <div className="absolute left-5 top-0 h-5 w-24 rounded-b-md bg-cwi-saffron/30" />
            <div className="mb-4 flex items-start justify-between gap-3 pt-3">
              <span className="rounded-full border border-cwi-brown/20 bg-white/70 px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-wide text-cwi-brown">{file.category}</span>
              <span className="rotate-[-2deg] rounded-sm border-2 border-cwi-green/45 px-2 py-1 text-[0.68rem] font-black uppercase tracking-wide text-cwi-green">FILE OPEN</span>
            </div>
            <h3 className="font-display text-xl font-black leading-tight text-cwi-ink group-hover:text-cwi-green">{file.title}</h3>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-cwi-ink/70">{file.unansweredQuestion}</p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-cwi-brown/12 pt-4 text-xs font-bold text-cwi-ink/56">
              <span>{file.sourceCount} sources</span>
              <span>Last updated {getFileLastUpdated(file)}</span>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-cwi-green">Open file <ArrowRight className="h-4 w-4" /></span>
          </Link>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link href="/india-unanswered-files" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border-2 border-cwi-green px-5 py-3 text-sm font-black text-cwi-green transition hover:bg-cwi-green/8">
          View all files <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function ArchivePreview({ items }: { items: ArchivePreviewItem[] }) {
  if (items.length === 0) {
    return <EmptyBox>No archive items are available right now.</EmptyBox>;
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((post) => (
          <Link key={post.slug} href={`/watch-desk/${post.slug}`} className="group rounded-lg border border-cwi-brown/12 bg-white/80 p-5 shadow-sm transition hover:border-cwi-green/32 hover:bg-cwi-cream/60">
            <div className="mb-3 text-xs font-black uppercase tracking-wide text-cwi-green">{post.category}</div>
            <h3 className="font-display text-xl font-black leading-tight text-cwi-ink group-hover:text-cwi-green">{post.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-cwi-ink/68">{post.summary}</p>
            <div className="mt-4 text-xs font-bold text-cwi-ink/52">Updated {formatDate(post.updatedAt)}</div>
          </Link>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link href="/archive" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-cwi-ink px-5 py-3 text-sm font-black text-cwi-cream transition hover:bg-cwi-ink/90">
          Browse Archive <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function EmptyBox({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border-2 border-dashed border-cwi-brown/20 bg-white/70 p-8 text-sm font-semibold text-cwi-ink/58">{children}</div>;
}

function buildTickerItems(items: LiveNewsroomItem[]) {
  const categories = items.map((item) => item.category).filter(Boolean);
  return Array.from(
    new Set([
      "NEET updates",
      "CBSE OSM claims",
      "Public advisory",
      "Source request open",
      "India Unanswered Files",
      "Corrections open",
      "Youth voice",
      "Digital rights",
      ...categories
    ])
  );
}

function buildNewsroomJsonLd(items: LiveNewsroomItem[]) {
  const itemList = {
    "@type": "ItemList",
    name: "CWI Live Newsroom updates",
    itemListElement: items.slice(0, 10).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/live-newsroom/${item.slug}`),
      name: item.title
    }))
  };

  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "CWI Live Newsroom",
      url: absoluteUrl("/live-newsroom"),
      description: newsroomDescription,
      mainEntity: itemList,
      isPartOf: {
        "@type": "WebSite",
        name: site.name,
        url: absoluteUrl("/")
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "NewsMediaOrganization",
      name: site.name,
      url: site.url,
      logo: absoluteUrl("/brand/logo.png"),
      sameAs: [site.x, site.instagram, site.youtube, site.telegram, site.reddit, site.facebook, site.bluesky].filter(Boolean)
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Live Newsroom", item: absoluteUrl("/live-newsroom") }
      ]
    },
    {
      "@context": "https://schema.org",
      ...itemList
    }
  ];
}

function getFileLastUpdated(file: UnansweredFile) {
  const lastTimeline = file.timeline[file.timeline.length - 1];
  return lastTimeline?.date ?? file.year;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata"
  }).format(new Date(value));
}

function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata"
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata"
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata"
  }).format(new Date(value));
}
