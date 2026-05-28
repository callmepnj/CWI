import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  ExternalLink,
  FileText,
  FolderOpen,
  Newspaper,
} from "lucide-react";
import {
  getLiveNewsroomFallbackItems,
  getPublishedLiveNewsroomItems,
  type LiveNewsroomItem,
  type LiveNewsroomStatus
} from "@/lib/db/live-newsroom";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

const fileFilters = ["Justice", "Students", "Environment", "Governance", "Digital Rights", "Public Safety"];

export const metadata = createMetadata({
  title: "CWI Live Newsroom — Cockroach Watch India Latest Updates",
  description:
    "CWI Live Newsroom tracks verified updates, developing claims, public advisories, India Unanswered Files, source trails, corrections, and civic issues from Cockroach Watch India.",
  path: "/live-newsroom",
  keywords: [
    "CWI Live Newsroom",
    "Cockroach Watch India",
    "CWI",
    "verified updates",
    "public advisories",
    "India Unanswered Files",
    "source trails",
    "civic issues"
  ]
});

export default async function LiveNewsroomPage() {
  const dbItems = await getPublishedLiveNewsroomItems(80).catch(() => []);
  const fallbackItems = getLiveNewsroomFallbackItems(80);
  const items = mergeItems(dbItems, fallbackItems);
  const activeItems = items.filter((item) => !isArchiveContext(item));
  const newsroomItems = activeItems.filter((item) => !isUnansweredFile(item));
  const unansweredFiles = activeItems.filter(isUnansweredFile).slice(0, 6);
  const archiveItems = items.filter(isArchiveContext).slice(0, 3);
  const leadStory = pickLeadStory(newsroomItems, activeItems);
  const updateRail = uniqueBySlug([...(leadStory ? newsroomItems.filter((item) => item.slug !== leadStory.slug) : newsroomItems), ...activeItems]).slice(0, 5);
  const verificationItems = activeItems.filter(needsVerificationDesk).slice(0, 4);
  const advisoryItems = activeItems.filter(isPublicAdvisory).slice(0, 4);
  const reportItems = activeItems.filter(isSourceBackedReport).slice(0, 4);
  const claimRows = buildClaimRows(activeItems).slice(0, 6);
  const timelineItems = buildTimelineItems(activeItems).slice(0, 5);
  const sourceRows = buildSourceRows(activeItems).slice(0, 8);
  const correctionRows = buildCorrections(items).slice(0, 3);
  const brief = buildTodayBrief(newsroomItems, activeItems);
  const updatedDate = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeZone: "Asia/Kolkata"
  }).format(new Date());

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "CWI Live Newsroom",
    url: `${site.url}/live-newsroom`,
    description:
      "What is verified, what is still unclear, and what needs public attention from Cockroach Watch India.",
    isPartOf: {
      "@type": "NewsMediaOrganization",
      name: "Cockroach Watch India",
      url: site.url
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "CWI Live Newsroom", item: `${site.url}/live-newsroom` }
    ]
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "CWI Live Newsroom updates",
    itemListElement: activeItems.slice(0, 10).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${site.url}/live-newsroom/${item.slug}`,
      name: item.title
    }))
  };

  return (
    <main
      className="min-h-screen text-[#1C1712]"
      style={{
        background:
          "linear-gradient(180deg, rgba(246,241,231,0.98), rgba(251,248,240,0.98)), radial-gradient(circle at 1px 1px, rgba(90,59,36,0.08) 1px, transparent 0)",
        backgroundSize: "auto, 18px 18px"
      }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <EditorialMasthead updatedDate={updatedDate} />

      <section id="todays-brief" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <TodayBriefCard brief={brief} />
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)] lg:px-8">
        <LeadStoryCard item={leadStory} />
        <LiveUpdateRail items={updateRail} />
      </section>

      <NewsroomBand
        id="verification-desk"
        eyebrow="Verification Desk"
        title="Claims CWI is still checking"
        subtitle="Not everything fast is settled. This desk shows what is known, what is not known, and where the source gap is."
      >
        {verificationItems.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {verificationItems.map((item) => (
              <VerificationCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState text="No developing verification notes are public right now." />
        )}
      </NewsroomBand>

      <NewsroomSection
        id="public-advisory-board"
        eyebrow="Advisory Board"
        title="Public Advisory Board"
        subtitle="Read this before sharing fast-moving claims, screenshots, links, or account updates."
      >
        {advisoryItems.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {advisoryItems.map((item) => (
              <AdvisoryCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState text="No public advisories are active right now." />
        )}
      </NewsroomSection>

      <NewsroomSection
        id="source-backed-reports"
        eyebrow="Editorial Reports"
        title="Source-Backed Reports"
        subtitle="Reports with visible source trails, dates, and CWI verification notes."
      >
        {reportItems.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {reportItems.map((item) => (
              <ReportCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState text="More source-backed reports will appear after editorial review." />
        )}
      </NewsroomSection>

      <section id="india-unanswered-files" className="border-y border-[#DED6C7] bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Open files"
            title="India Unanswered Files"
            subtitle="Public issues where records, responsibility, or official answers still need closer tracking."
          />
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {fileFilters.map((filter) => (
              <span
                key={filter}
                className="shrink-0 rounded-full border border-[#1E6B4A]/20 bg-[#E9F4E8] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#1E6B4A]"
              >
                {filter}
              </span>
            ))}
          </div>
          {unansweredFiles.length ? (
            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {unansweredFiles.map((item) => (
                <UnansweredFileCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState text="More files will appear after editorial review." />
          )}
          <div className="mt-7">
            <Link href="/india-unanswered-files" className="inline-flex items-center gap-2 rounded-full bg-[#1E6B4A] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white">
              View all files <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <NewsroomBand
        id="claim-tracker"
        eyebrow="Claim Tracker"
        title="Verification ledger"
        subtitle="A public record of claims CWI is checking, verifying, correcting, or rejecting."
      >
        {claimRows.length ? <ClaimTracker rows={claimRows} /> : <EmptyState text="No approved claim tracker items are public yet." />}
      </NewsroomBand>

      <NewsroomSection
        id="research-timeline"
        eyebrow="Timeline"
        title="Research Timeline"
        subtitle="Major updates in order, with dates and source context."
      >
        {timelineItems.length ? (
          <div className="grid gap-3">
            {timelineItems.map((item) => (
              <TimelineItem key={`${item.slug}-${item.date}-${item.title}`} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState text="The timeline is being updated." />
        )}
      </NewsroomSection>

      <NewsroomSection
        id="source-ledger"
        eyebrow="Source Ledger"
        title="Source Ledger"
        subtitle="Sources used across CWI Live Newsroom reports and public files."
      >
        {sourceRows.length ? (
          <div className="overflow-hidden rounded-[1.5rem] border border-[#DED6C7] bg-white shadow-card">
            {sourceRows.map((source) => (
              <SourceLedgerRow key={source.url} source={source} />
            ))}
          </div>
        ) : (
          <EmptyState text="Source ledger is being updated." />
        )}
      </NewsroomSection>

      <NewsroomBand
        id="corrections"
        eyebrow="Corrections"
        title="Corrections & Clarifications"
        subtitle="CWI keeps corrections visible. If something changes, the record should change too."
      >
        {correctionRows.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {correctionRows.map((correction) => (
              <CorrectionCard key={`${correction.slug}-${correction.date}-${correction.whatChanged}`} correction={correction} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-[#DED6C7] bg-white p-6 shadow-card">
            <p className="font-display text-2xl font-black uppercase tracking-[-0.03em]">No public corrections have been logged yet.</p>
            <Link href="/corrections" className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#1E6B4A]/25 bg-[#E9F4E8] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-[#1E6B4A]">
              View correction log <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </NewsroomBand>

      <SubmitCorrectionCta />

      <NewsroomSection
        id="archive-preview"
        eyebrow="Archive"
        title="From the Archive"
        subtitle="Older explainers and context posts. Current updates live in the Live Newsroom."
      >
        {archiveItems.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {archiveItems.map((item) => (
              <ArchivePreviewCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState text="Archived context will appear here after review." />
        )}
        <div className="mt-7">
          <Link href="/archive" className="inline-flex items-center gap-2 rounded-full border border-[#1E6B4A]/25 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-[#1E6B4A]">
            Browse Archive <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </NewsroomSection>
    </main>
  );
}

function EditorialMasthead({ updatedDate }: { updatedDate: string }) {
  return (
    <section className="relative overflow-hidden border-b border-[#DED6C7] bg-[#F9F5EC]">
      <div className="pointer-events-none absolute right-4 top-6 hidden rounded-full border border-[#1E6B4A]/10 px-8 py-6 font-display text-7xl font-black uppercase tracking-[-0.06em] text-[#1E6B4A]/5 lg:block">
        CWI
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#1E6B4A]">CWI Live Newsroom</p>
        <h1 className="mt-4 max-w-5xl font-display text-5xl font-black uppercase leading-[0.95] tracking-[-0.05em] text-[#1C1712] sm:text-7xl lg:text-8xl">
          What is verified. What is still unclear. What needs public attention.
        </h1>
        <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-[#5A3B24]/80">
          A source-led civic newsroom by Cockroach Watch India tracking public issues, viral claims, youth voice, platform updates, advisories, and India Unanswered Files.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3 border-y border-[#DED6C7] py-4">
          {["Independent", "Source-led", "Human approved", "Corrections open"].map((item) => (
            <span key={item} className="rounded-full border border-[#1E6B4A]/20 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#1E6B4A]">
              {item}
            </span>
          ))}
          <span className="text-sm font-bold text-[#74695E]">Updated {updatedDate}</span>
        </div>
        <p className="mt-5 font-mono text-xs font-black uppercase tracking-[0.18em] text-[#D9862B]">Document. Verify. Amplify.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link className="rounded-full bg-[#1E6B4A] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white shadow-card" href="/submit">
            Submit source or correction
          </Link>
          <Link className="rounded-full border border-[#1E6B4A]/25 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-[#1E6B4A]" href="#todays-brief">
            View today&apos;s brief
          </Link>
          <Link className="rounded-full border border-[#DED6C7] bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-[#5A3B24]" href="/archive">
            Browse archive
          </Link>
        </div>
      </div>
      <div className="h-3 bg-[#D9862B]" />
    </section>
  );
}

function TodayBriefCard({ brief }: { brief: TodayBrief }) {
  return (
    <section className="rounded-[2rem] border border-[#DED6C7] bg-white p-6 shadow-card lg:p-8">
      <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="border-l-4 border-[#1E6B4A] pl-5">
          <span className="rounded-full bg-[#FFF1D6] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#8A5B00]">Today</span>
          <h2 className="mt-4 font-display text-4xl font-black uppercase tracking-[-0.04em]">Today&apos;s Watch Brief</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#74695E]">
            The fastest way to know what changed, what is verified, and what CWI is still checking.
          </p>
          <p className="mt-5 font-mono text-xs font-black uppercase tracking-[0.14em] text-[#1E6B4A]">{brief.date}</p>
        </div>
        <div>
          {brief.topUpdates.length ? (
            <div className="grid gap-3">
              {brief.topUpdates.map((item) => (
                <Link key={item.slug} href={`/live-newsroom/${item.slug}`} className="rounded-2xl border border-[#DED6C7] bg-[#F9F5EC] p-4 transition hover:border-[#1E6B4A]/40">
                  <p className="font-display text-xl font-black uppercase leading-tight tracking-[-0.02em]">{item.title}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#74695E]">{item.whatChanged}</p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState text="Today’s Watch Brief is being prepared. Check the latest verified updates below." />
          )}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <BriefBox label="What changed today" text={brief.whatChanged} />
            <BriefBox label="What remains unclear" text={brief.whatRemainsUnclear} />
          </div>
          {brief.editorNote ? <p className="mt-5 rounded-2xl border border-[#DED6C7] bg-white p-4 text-sm font-semibold leading-6 text-[#5A3B24]">{brief.editorNote}</p> : null}
        </div>
      </div>
    </section>
  );
}

function LeadStoryCard({ item }: { item: LiveNewsroomItem | null }) {
  if (!item) {
    return (
      <section className="rounded-[2rem] border border-dashed border-[#DED6C7] bg-white p-8 shadow-card">
        <SectionHeader eyebrow="Lead Story" title="Lead story is being selected" subtitle="A lead update appears here after editorial review." />
      </section>
    );
  }

  return (
    <article className="overflow-hidden rounded-[2rem] border border-[#1E6B4A]/25 bg-white shadow-card">
      <div className="grid lg:grid-cols-[0.96fr_1.04fr]">
        <div className="min-h-[280px] bg-[#E9F4E8] lg:min-h-full">
          <NewsroomImage src={item.heroImage || item.thumbnailImage} alt={item.altText} className="h-full min-h-[280px] w-full object-cover" />
        </div>
        <div className="p-6 lg:p-8">
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#D9862B]">Lead Story</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge status={item.verificationStatus} />
            <Badge>{item.category}</Badge>
          </div>
          <h2 className="mt-5 font-display text-4xl font-black uppercase leading-tight tracking-[-0.04em] sm:text-5xl">{item.title}</h2>
          <p className="mt-4 text-base font-semibold leading-7 text-[#5A3B24]/80">{item.summary}</p>
          <div className="mt-5 grid gap-3 rounded-2xl border border-[#DED6C7] bg-[#F9F5EC] p-4">
            <EditorialLine label="What changed" text={item.whatChanged} />
            <EditorialLine label="Still unclear" text={item.whatRemainsUnclear || item.whatWeDontKnow[0] || "CWI is keeping the source trail open."} />
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.12em] text-[#74695E]">
            <span>{item.sourceCount} sources</span>
            <span>Last updated {formatDate(item.updatedAt)}</span>
          </div>
          <Link href={`/live-newsroom/${item.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1E6B4A] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white">
            Read full update <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function LiveUpdateRail({ items }: { items: LiveNewsroomItem[] }) {
  return (
    <aside className="rounded-[2rem] border border-[#DED6C7] bg-white p-5 shadow-card lg:sticky lg:top-24 lg:self-start">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-[#1E6B4A]">Live Update Rail</p>
          <h2 className="mt-1 font-display text-3xl font-black uppercase tracking-[-0.03em]">Latest checks</h2>
        </div>
        <Newspaper className="h-7 w-7 text-[#D9862B]" />
      </div>
      <div className="mt-5 flex gap-3 overflow-x-auto pb-2 lg:grid lg:overflow-visible lg:pb-0">
        {items.length ? (
          items.map((item) => (
            <Link key={item.id} href={`/live-newsroom/${item.slug}`} className="min-w-[260px] border-l-2 border-[#DED6C7] bg-[#F9F5EC] p-4 transition hover:border-[#1E6B4A] lg:min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#74695E]">{formatDate(item.updatedAt)}</p>
              <div className="mt-2"><StatusBadge status={item.verificationStatus} compact /></div>
              <h3 className="mt-3 font-display text-lg font-black uppercase leading-tight tracking-[-0.02em]">{item.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-[#74695E]">{item.whatChanged || item.summary}</p>
              <p className="mt-3 text-xs font-black uppercase tracking-[0.1em] text-[#1E6B4A]">{item.sourceCount} sources</p>
            </Link>
          ))
        ) : (
          <EmptyState text="No quick updates are public yet." />
        )}
      </div>
      <Link href="#source-backed-reports" className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-[#1E6B4A]">
        View all updates <ArrowRight className="h-4 w-4" />
      </Link>
    </aside>
  );
}

function VerificationCard({ item }: { item: LiveNewsroomItem }) {
  return (
    <Link href={`/live-newsroom/${item.slug}`} className="rounded-[1.5rem] border border-[#DED6C7] bg-white p-5 shadow-card transition hover:border-[#1E6B4A]/40">
      <div className="flex flex-wrap gap-2"><StatusBadge status={item.verificationStatus} /><Badge>{item.category}</Badge></div>
      <h3 className="mt-4 font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em]">{item.title}</h3>
      <div className="mt-4 grid gap-3 text-sm font-semibold leading-6 text-[#5A3B24]/80">
        <EditorialLine label="Known" text={item.whatWeKnow || item.summary} />
        <EditorialLine label="Not known" text={item.whatWeDontKnow[0] || item.whatRemainsUnclear} />
        <EditorialLine label="Source gap" text={item.sourceCount > 0 ? `${item.sourceCount} visible source records. More context may still be needed.` : "Needs source before article treatment."} />
      </div>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-[#1E6B4A]">
        Open verification note <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

function AdvisoryCard({ item }: { item: LiveNewsroomItem }) {
  return (
    <Link href={`/live-newsroom/${item.slug}`} className="rounded-[1.5rem] border border-[#D9862B]/35 bg-[#FFF7E8] p-5 shadow-card transition hover:border-[#D9862B]">
      <AlertTriangle className="h-6 w-6 text-[#8A5B00]" />
      <p className="mt-4 font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#8A5B00]">{item.category}</p>
      <h3 className="mt-2 font-display text-xl font-black uppercase leading-tight tracking-[-0.02em]">{item.title}</h3>
      <p className="mt-3 text-sm font-semibold leading-6 text-[#5A3B24]/80">{item.beforeYouShare[0] || item.summary}</p>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.1em] text-[#74695E]">Updated {formatDate(item.updatedAt)}</p>
    </Link>
  );
}

function ReportCard({ item }: { item: LiveNewsroomItem }) {
  return (
    <Link href={`/live-newsroom/${item.slug}`} className="grid overflow-hidden rounded-[1.5rem] border border-[#DED6C7] bg-white shadow-card transition hover:border-[#1E6B4A]/40 md:grid-cols-[210px_1fr]">
      <div className="min-h-[180px] bg-[#E9F4E8]">
        <NewsroomImage src={item.thumbnailImage || item.heroImage} alt={item.altText} className="h-full min-h-[180px] w-full object-cover" />
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2"><StatusBadge status={item.verificationStatus} compact /><Badge>{sourceQuality(item)}</Badge></div>
        <h3 className="mt-3 font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em]">{item.title}</h3>
        <div className="mt-4 grid gap-2 rounded-2xl border border-[#DED6C7] bg-[#F9F5EC] p-3 text-sm font-semibold leading-6 text-[#5A3B24]/80">
          <EditorialLine label="Proves" text={item.sourceTrail[0]?.supports || item.whatWeKnow || item.summary} />
          <EditorialLine label="Does not prove" text={item.sourceTrail[0]?.doesNotProve || item.whatRemainsUnclear} />
        </div>
        <p className="mt-4 text-xs font-black uppercase tracking-[0.1em] text-[#74695E]">{item.sourceCount} sources / Updated {formatDate(item.updatedAt)}</p>
      </div>
    </Link>
  );
}

function UnansweredFileCard({ item }: { item: LiveNewsroomItem }) {
  return (
    <Link href={`/live-newsroom/${item.slug}`} className="group rounded-[1.5rem] border border-[#DED6C7] bg-[#F9F5EC] p-5 shadow-card transition hover:border-[#1E6B4A]/40">
      <div className="flex items-center justify-between gap-3">
        <FolderOpen className="h-7 w-7 text-[#1E6B4A]" />
        <span className="rounded-full border border-[#1E6B4A]/20 bg-white px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#1E6B4A]">File open</span>
      </div>
      <h3 className="mt-5 font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em]">{item.title}</h3>
      <p className="mt-3 text-sm font-semibold leading-6 text-[#74695E]">{item.whatRemainsUnclear || item.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.1em] text-[#74695E]">
        <span>{item.sourceCount} sources</span>
        <span>{item.verificationStatus}</span>
        <span>Updated {formatDate(item.updatedAt)}</span>
      </div>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-[#1E6B4A]">
        Open File <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function ClaimTracker({ rows }: { rows: ClaimRow[] }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[#DED6C7] bg-white shadow-card">
      {rows.map((row) => (
        <Link key={`${row.slug}-${row.claim}`} href={`/live-newsroom/${row.slug}`} className="grid gap-3 border-b border-[#DED6C7] p-4 last:border-b-0 lg:grid-cols-[1.25fr_0.35fr_0.4fr_1fr_0.35fr] lg:items-center">
          <div>
            <p className="font-display text-lg font-black uppercase leading-tight tracking-[-0.02em]">{row.claim}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-[#74695E]">First seen: {row.firstSeen}</p>
          </div>
          <StatusBadge status={row.status as LiveNewsroomStatus} compact />
          <p className="text-sm font-black uppercase tracking-[0.08em] text-[#5A3B24]">{row.evidenceLevel}</p>
          <p className="text-sm font-semibold leading-6 text-[#74695E]">{row.cwiNote}</p>
          <p className="text-xs font-black uppercase tracking-[0.1em] text-[#1E6B4A]">Last checked</p>
        </Link>
      ))}
    </div>
  );
}

function TimelineItem({ item }: { item: TimelineRow }) {
  return (
    <Link href={`/live-newsroom/${item.slug}`} className="grid gap-4 rounded-[1.5rem] border border-[#DED6C7] bg-white p-5 shadow-card transition hover:border-[#1E6B4A]/40 md:grid-cols-[160px_1fr_180px] md:items-center">
      <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#1E6B4A]">{item.date}</p>
      <div>
        <h3 className="font-display text-2xl font-black uppercase tracking-[-0.03em]">{item.title}</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#74695E]">{item.summary}</p>
      </div>
      <p className="rounded-2xl border border-[#DED6C7] bg-[#F9F5EC] px-4 py-3 text-xs font-black uppercase tracking-[0.1em] text-[#5A3B24]">{item.status}</p>
    </Link>
  );
}

function SourceLedgerRow({ source }: { source: SourceRow }) {
  return (
    <a href={source.url} target="_blank" rel="noreferrer" className="grid gap-3 border-b border-[#DED6C7] p-4 last:border-b-0 transition hover:bg-[#F9F5EC] md:grid-cols-[0.8fr_0.4fr_1fr_0.45fr] md:items-center">
      <div>
        <p className="font-display text-lg font-black uppercase leading-tight tracking-[-0.02em]">{source.name}</p>
        <p className="mt-1 text-xs font-bold text-[#74695E]">{source.url.replace(/^https?:\/\//, "").slice(0, 70)}</p>
      </div>
      <p className="rounded-full border border-[#1E6B4A]/20 bg-[#E9F4E8] px-3 py-1 text-center text-xs font-black uppercase tracking-[0.1em] text-[#1E6B4A]">{source.type}</p>
      <p className="text-sm font-semibold leading-6 text-[#74695E]">{source.usedFor}</p>
      <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-[#1E6B4A]">
        Open <ExternalLink className="h-3.5 w-3.5" />
      </span>
    </a>
  );
}

function CorrectionCard({ correction }: { correction: CorrectionRow }) {
  return (
    <Link href={correction.slug ? `/live-newsroom/${correction.slug}` : "/corrections"} className="rounded-[1.5rem] border border-[#DED6C7] bg-white p-5 shadow-card transition hover:border-[#1E6B4A]/40">
      <ClipboardCheck className="h-7 w-7 text-[#1E6B4A]" />
      <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[#74695E]">{correction.date}</p>
      <h3 className="mt-2 font-display text-xl font-black uppercase leading-tight tracking-[-0.02em]">{correction.title}</h3>
      <p className="mt-3 text-sm font-semibold leading-6 text-[#74695E]">{correction.whatChanged}</p>
    </Link>
  );
}

function SubmitCorrectionCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-[#1E6B4A]/30 bg-[#1E6B4A] p-8 text-white shadow-card">
        <FileText className="h-9 w-9 text-[#F6C15D]" />
        <h2 className="mt-5 font-display text-4xl font-black uppercase tracking-[-0.04em]">Seen a source, correction, or update?</h2>
        <p className="mt-4 max-w-3xl leading-8 text-white/80">
          Send CWI the link, date, creator credit, or missing context. Do not submit private data, threats, hate, or unverified allegations as fact.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link className="inline-flex items-center gap-2 rounded-full bg-[#F6C15D] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-[#1C1712]" href="/submit">
            Submit source or correction <ArrowRight className="h-4 w-4" />
          </Link>
          <Link className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white" href="/editorial-policy">
            Read editorial policy
          </Link>
        </div>
      </div>
    </section>
  );
}

function ArchivePreviewCard({ item }: { item: LiveNewsroomItem }) {
  return (
    <Link href={`/archive/${item.slug}`} className="rounded-[1.5rem] border border-[#DED6C7] bg-white p-5 shadow-card transition hover:border-[#1E6B4A]/40">
      <BookOpen className="h-7 w-7 text-[#5A3B24]" />
      <p className="mt-4 font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#74695E]">Archived context</p>
      <h3 className="mt-2 font-display text-xl font-black uppercase leading-tight tracking-[-0.02em]">{item.title}</h3>
      <p className="mt-3 text-sm font-semibold leading-6 text-[#74695E]">{item.summary}</p>
    </Link>
  );
}

function NewsroomSection({ id, eyebrow, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="mt-7">{children}</div>
    </section>
  );
}

function NewsroomBand({ id, eyebrow, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="border-y border-[#DED6C7] bg-white/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="mt-7">{children}</div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div>
      <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-[#1E6B4A]">{eyebrow}</p>
      <h2 className="mt-2 max-w-4xl font-display text-4xl font-black uppercase leading-tight tracking-[-0.04em] text-[#1C1712] sm:text-5xl">{title}</h2>
      <p className="mt-3 max-w-3xl leading-7 text-[#74695E]">{subtitle}</p>
    </div>
  );
}

function BriefBox({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#DED6C7] bg-[#F9F5EC] p-4">
      <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#1E6B4A]">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#5A3B24]/80">{text}</p>
    </div>
  );
}

function EditorialLine({ label, text }: { label: string; text: string }) {
  return (
    <p>
      <span className="font-black uppercase tracking-[0.08em] text-[#1C1712]">{label}: </span>
      {text}
    </p>
  );
}

function StatusBadge({ status, compact = false }: { status: string; compact?: boolean }) {
  const tone = statusTone(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-black uppercase tracking-[0.12em] ring-1 ${compact ? "text-[0.62rem]" : "text-[0.68rem]"} ${tone}`}>
      {status}
    </span>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[#DED6C7] bg-[#F9F5EC] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#5A3B24]">
      {children}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-[#DED6C7] bg-white p-6 shadow-card">
      <p className="font-semibold leading-7 text-[#74695E]">{text}</p>
    </div>
  );
}

function NewsroomImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src || "/brand/logo.png"} alt={alt || "CWI Live Newsroom visual"} className={className} loading="lazy" />
  );
}

function mergeItems(primary: LiveNewsroomItem[], fallback: LiveNewsroomItem[]) {
  const map = new Map<string, LiveNewsroomItem>();
  for (const item of [...primary, ...fallback]) {
    if (!map.has(item.slug)) map.set(item.slug, item);
  }
  return Array.from(map.values()).sort((first, second) => dateValue(second.updatedAt) - dateValue(first.updatedAt));
}

function uniqueBySlug(items: LiveNewsroomItem[]) {
  const map = new Map<string, LiveNewsroomItem>();
  for (const item of items) {
    if (!map.has(item.slug)) map.set(item.slug, item);
  }
  return Array.from(map.values());
}

function pickLeadStory(newsroomItems: LiveNewsroomItem[], activeItems: LiveNewsroomItem[]) {
  const candidates = newsroomItems.length ? newsroomItems : activeItems;
  return (
    candidates.find((item) => isPublicAdvisory(item)) ??
    candidates.find((item) => ["Verified", "Source-backed", "Developing"].includes(item.verificationStatus)) ??
    candidates[0] ??
    null
  );
}

function isArchiveContext(item: LiveNewsroomItem) {
  return item.type === "archived_context" || item.verificationStatus === "Archived" || item.category === "Archive";
}

function isUnansweredFile(item: LiveNewsroomItem) {
  return item.type === "india_unanswered_file" || item.category === "India Unanswered Files";
}

function isPublicAdvisory(item: LiveNewsroomItem) {
  return item.type === "public_advisory" || item.category === "Public Advisory" || item.verificationStatus === "Public Advisory";
}

function isSourceBackedReport(item: LiveNewsroomItem) {
  return !isPublicAdvisory(item) && !isUnansweredFile(item) && ["Verified", "Source-backed"].includes(item.verificationStatus);
}

function needsVerificationDesk(item: LiveNewsroomItem) {
  return ["Developing", "Reported", "Unverified"].includes(item.verificationStatus) || item.sourceCount === 0 || item.whatWeDontKnow.length > 0;
}

function buildTodayBrief(newsroomItems: LiveNewsroomItem[], activeItems: LiveNewsroomItem[]): TodayBrief {
  const topUpdates = (newsroomItems.length ? newsroomItems : activeItems).slice(0, 3);
  const first = topUpdates[0];
  const date = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date());

  return {
    date,
    topUpdates,
    whatChanged: first?.whatChanged || "Today’s Watch Brief is being prepared. Check the latest verified updates below.",
    whatRemainsUnclear:
      first?.whatWeDontKnow?.[0] || first?.whatRemainsUnclear || "CWI is waiting for stronger source links before treating unclear claims as settled.",
    editorNote: first?.editorNote || ""
  };
}

function buildClaimRows(items: LiveNewsroomItem[]): ClaimRow[] {
  return items.flatMap((item) =>
    item.claimTracker.map((claim) => ({
      slug: item.slug,
      claim: claim.claim,
      firstSeen: claim.firstSeen,
      status: claim.status,
      evidenceLevel: claim.evidenceLevel,
      cwiNote: claim.cwiNote
    }))
  );
}

function buildTimelineItems(items: LiveNewsroomItem[]): TimelineRow[] {
  return items.flatMap((item) =>
    item.timeline
      .filter((event) => !/archive publication/i.test(`${event.title} ${event.summary}`))
      .slice(0, 2)
      .map((event) => ({
        slug: item.slug,
        date: event.date,
        title: event.title || item.title,
        summary: event.summary || item.summary,
        status: item.verificationStatus
      }))
  );
}

function buildSourceRows(items: LiveNewsroomItem[]): SourceRow[] {
  const map = new Map<string, SourceRow>();
  for (const item of items) {
    for (const source of item.sourceTrail.length ? item.sourceTrail : item.sources.map((source) => ({
      name: source.name,
      type: source.type,
      date: item.updatedAt,
      url: source.url,
      supports: source.note,
      doesNotProve: "It does not prove claims outside the source itself."
    }))) {
      if (!source.url || map.has(source.url)) continue;
      map.set(source.url, {
        name: source.name,
        type: source.type,
        url: source.url,
        usedFor: item.title,
        reliability: reliabilityLabel(source.type),
        lastUsed: source.date || item.updatedAt
      });
    }
  }
  return Array.from(map.values());
}

function buildCorrections(items: LiveNewsroomItem[]): CorrectionRow[] {
  return items.flatMap((item) => {
    const history = item.correctionHistory.map((correction) => ({
      slug: item.slug,
      title: item.title,
      date: correction.date,
      whatChanged: correction.whatChanged,
      whyChanged: correction.whyChanged
    }));

    if (item.verificationStatus === "Correction") {
      history.unshift({
        slug: item.slug,
        title: item.title,
        date: item.updatedAt,
        whatChanged: item.whatChanged || "Correction issued.",
        whyChanged: item.whatRemainsUnclear || "Editorial record updated."
      });
    }

    return history;
  });
}

function sourceQuality(item: LiveNewsroomItem) {
  if (item.sourceCount >= 4) return "Strong trail";
  if (item.sourceCount >= 2) return "Visible trail";
  if (item.sourceCount === 1) return "Single source";
  return "Sources awaited";
}

function statusTone(status: string) {
  if (status === "Verified" || status === "Source-backed") {
    return "bg-[#E9F4E8] text-[#1E6B4A] ring-[#1E6B4A]/15";
  }
  if (status === "Public Advisory" || status === "Correction" || status === "Developing" || status === "Reported") {
    return "bg-[#FFF1D6] text-[#8A5B00] ring-[#D9862B]/20";
  }
  if (status === "Unverified") {
    return "bg-[#FDECEC] text-[#8B1E1E] ring-[#8B1E1E]/15";
  }
  return "bg-[#F9F5EC] text-[#5A3B24] ring-[#DED6C7]";
}

function reliabilityLabel(type: string) {
  const normalized = type.toLowerCase();
  if (normalized.includes("official")) return "Official";
  if (normalized.includes("court") || normalized.includes("legal")) return "Court/legal";
  if (normalized.includes("fact")) return "Fact-check";
  if (normalized.includes("social")) return "Social post";
  return "Established media";
}

function formatDate(value: string) {
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}

function dateValue(value: string) {
  const date = parseDate(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function parseDate(value: string) {
  return new Date(value.includes("T") ? value : `${value}T00:00:00+05:30`);
}

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

type TodayBrief = {
  date: string;
  topUpdates: LiveNewsroomItem[];
  whatChanged: string;
  whatRemainsUnclear: string;
  editorNote: string;
};

type ClaimRow = {
  slug: string;
  claim: string;
  firstSeen: string;
  status: string;
  evidenceLevel: string;
  cwiNote: string;
};

type TimelineRow = {
  slug: string;
  date: string;
  title: string;
  summary: string;
  status: string;
};

type SourceRow = {
  name: string;
  type: string;
  url: string;
  usedFor: string;
  reliability: string;
  lastUsed: string;
};

type CorrectionRow = {
  slug: string;
  title: string;
  date: string;
  whatChanged: string;
  whyChanged: string;
};
