import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, FileText, ShieldCheck, Siren, Sparkles } from "lucide-react";
import {
  getLiveNewsroomFallbackItems,
  getPublishedLiveNewsroomItems,
  type LiveNewsroomItem
} from "@/lib/db/live-newsroom";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "CWI Live Newsroom - Cockroach Watch India Latest Updates",
  description:
    "CWI Live Newsroom by Cockroach Watch India tracks source-backed updates, public advisories, CJP news, Cockroach wave coverage, India Unanswered Files, and civic issues with verified context.",
  path: "/live-newsroom",
  keywords: [
    "CWI Live Newsroom",
    "Cockroach Watch India",
    "CWI",
    "CJP news",
    "Cockroach Janta Party",
    "Cockroach wave",
    "India Unanswered Files",
    "public advisories",
    "civic news",
    "youth voice"
  ]
});

export default async function LiveNewsroomPage() {
  const dbItems = await getPublishedLiveNewsroomItems(80).catch(() => []);
  const items = mergeItems(dbItems, getLiveNewsroomFallbackItems(80));
  const topItems = items.slice(0, 4);
  const developing = items.filter((item) => ["Developing", "Reported", "Public Advisory"].includes(item.verificationStatus)).slice(0, 4);
  const sourceBacked = items.filter((item) => ["Verified", "Source-backed"].includes(item.verificationStatus)).slice(0, 4);
  const corrections = items.filter((item) => item.verificationStatus === "Correction" || item.category === "Corrections").slice(0, 4);
  const unanswered = items.filter((item) => item.category === "India Unanswered Files").slice(0, 6);
  const advisories = items.filter((item) => item.verificationStatus === "Public Advisory" || item.category === "Public Advisory").slice(0, 4);
  const timelineItems = items.flatMap((item) => item.timeline.slice(0, 2).map((event) => ({ ...event, slug: item.slug, title: event.title || item.title }))).slice(0, 10);
  const sources = uniqueSources(items).slice(0, 12);
  const sourceTrail = uniqueSourceTrail(items).slice(0, 8);
  const claims = items.flatMap((item) => item.claimTracker.map((claim) => ({ ...claim, slug: item.slug }))).slice(0, 8);
  const brief = buildTodayBrief(items);
  const statusCounts = {
    verified: items.filter((item) => ["Verified", "Source-backed"].includes(item.verificationStatus)).length,
    developing: items.filter((item) => ["Developing", "Reported"].includes(item.verificationStatus)).length,
    corrections: corrections.length,
    sourceRequests: items.filter((item) => item.sourceCount === 0 || item.whatWeDontKnow.length > 0).length
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "CWI Live Newsroom",
    url: `${site.url}/live-newsroom`,
    description:
      "Latest source-backed updates, public advisories, verified context, and India Unanswered Files coverage from Cockroach Watch India.",
    isPartOf: {
      "@type": "NewsMediaOrganization",
      name: "Cockroach Watch India",
      url: site.url
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "CWI Live Newsroom", item: `${site.url}/live-newsroom` }
      ]
    }
  };

  return (
    <main className="bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-royal">Document. Verify. Amplify.</p>
            <h1 className="mt-4 font-display text-5xl font-black uppercase leading-none tracking-[-0.05em] text-ink sm:text-7xl">
              CWI Live Newsroom
            </h1>
            <p className="mt-5 max-w-3xl leading-8 text-ink/68">
              The CWI Live Newsroom tracks what is happening now, what is verified, what remains unclear, and what needs public attention.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="rounded-full bg-royal px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white shadow-soft" href="/submit">
                Submit Source or Correction
              </Link>
              <Link className="rounded-full border border-line bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-royal" href="/live-newsroom#india-unanswered-files">
                View India Unanswered Files
              </Link>
              <Link className="rounded-full border border-line bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-royal" href="/archive">
                Browse Archive
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-line bg-gradient-to-br from-skywash via-white to-[#F6FFF9] p-6 shadow-card">
            <p className="font-mono text-[0.7rem] font-black uppercase tracking-[0.16em] text-royal">
              LIVE UPDATES - SOURCE TRAILS - VERIFY BEFORE SHARING - CORRECTIONS OPEN
            </p>
            <div className="mt-6 grid gap-4">
              {topItems.slice(0, 3).map((item) => (
                <Link key={item.id} href={`/live-newsroom/${item.slug}`} className="rounded-3xl border border-line bg-white p-4 transition hover:border-royal/40 hover:shadow-soft">
                  <StatusBadge status={item.verificationStatus} />
                  <h2 className="mt-3 font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em]">{item.title}</h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-ink/66">{item.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <NewsroomSection title={`Today's Watch Brief - ${brief.date}`} subtitle="A compact editor-facing snapshot from the published Live Newsroom record.">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[1.5rem] border border-line bg-white p-6 shadow-card">
            <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">What changed today</h2>
            <p className="mt-3 leading-7 text-ink/68">{brief.whatChanged}</p>
            <h3 className="mt-6 font-display text-2xl font-black uppercase tracking-[-0.03em]">Still unclear</h3>
            <p className="mt-3 leading-7 text-ink/68">{brief.whatRemainsUnclear}</p>
            <p className="mt-5 rounded-2xl border border-saffron/35 bg-saffron/10 p-4 text-sm font-bold leading-6 text-[#7A5200]">{brief.publicReminder}</p>
            {brief.editorNote ? <p className="mt-4 text-sm font-semibold leading-6 text-ink/62">{brief.editorNote}</p> : null}
          </div>
          <div className="grid gap-3">
            {brief.topUpdates.map((item) => (
              <Link key={item.slug} href={`/live-newsroom/${item.slug}`} className="rounded-3xl border border-line bg-white p-4 shadow-card transition hover:border-royal/35">
                <StatusBadge status={item.verificationStatus} />
                <h3 className="mt-2 font-display text-xl font-black uppercase leading-tight tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-ink/64">{item.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </NewsroomSection>

      <NewsroomSection title="Lead Story" subtitle="The first update CWI is asking readers to inspect carefully.">
        <CardGrid items={topItems.slice(0, 1)} />
      </NewsroomSection>

      <NewsroomSection title="Breaking / Developing" subtitle="Reported and developing updates. Read the unknowns before sharing.">
        <CardGrid items={developing.length ? developing : topItems.slice(0, 3)} />
      </NewsroomSection>

      <NewsroomSection title="Public Advisories" subtitle="Caution notes, digital safety, platform confusion, and verification warnings.">
        <CardGrid items={advisories.length ? advisories : developing.slice(0, 3)} />
      </NewsroomSection>

      <NewsroomSection title="Source-Backed Reports" subtitle="Items with visible source trails and verification labels.">
        <CardGrid items={sourceBacked.length ? sourceBacked : topItems.slice(0, 3)} />
      </NewsroomSection>

      <section id="news-intelligence" className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-royal">CWI News Intelligence</p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase tracking-[-0.04em] text-ink">Claims, sources, timelines</h2>
          <p className="mt-3 max-w-3xl leading-7 text-ink/68">A public view of what CWI is tracking from approved records. No automatic breaking claims.</p>
          <div className="mt-7 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="grid gap-3">
              <MiniBoard label="Verified updates" value={statusCounts.verified} />
              <MiniBoard label="Developing updates" value={statusCounts.developing} />
              <MiniBoard label="Corrections issued" value={statusCounts.corrections} />
              <MiniBoard label="Source requests open" value={statusCounts.sourceRequests} />
            </div>
            <div className="grid gap-4">
              <h3 className="font-display text-2xl font-black uppercase tracking-[-0.03em]">Claim Tracker</h3>
              {claims.length ? (
                claims.map((claim) => (
                  <Link key={`${claim.slug}-${claim.claim}`} href={`/live-newsroom/${claim.slug}`} className="rounded-3xl border border-line bg-paper p-4 transition hover:border-royal/35">
                    <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-royal">{claim.status} - {claim.evidenceLevel}</p>
                    <h4 className="mt-2 font-display text-xl font-black uppercase tracking-[-0.02em]">{claim.claim}</h4>
                    <p className="mt-2 text-sm font-semibold leading-6 text-ink/64">{claim.cwiNote}</p>
                  </Link>
                ))
              ) : (
                <p className="rounded-3xl border border-line bg-paper p-4 font-semibold text-ink/64">No approved public claims are listed yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="india-unanswered-files" className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-royal">Unanswered Files</p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase tracking-[-0.04em] text-ink">India Unanswered Files</h2>
          <p className="mt-3 max-w-3xl leading-7 text-ink/68">Major public issues where the record still has gaps, disputes, or pending official answers.</p>
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {unanswered.map((item) => (
              <LiveCard key={item.id} item={item} cta="Open File" />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-royal">Research Timeline</p>
            <h2 className="mt-2 font-display text-4xl font-black uppercase tracking-[-0.04em]">Research Timeline</h2>
            <p className="mt-3 leading-7 text-ink/68">Timeline-based updates from published Live Newsroom records and CWI public archive files.</p>
          </div>
          <div className="grid gap-3">
            {timelineItems.map((event, index) => (
              <Link key={`${event.slug}-${index}`} href={`/live-newsroom/${event.slug}`} className="rounded-3xl border border-line bg-paper p-4 transition hover:border-royal/40">
                <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-royal">{event.date}</p>
                <h3 className="mt-1 font-display text-xl font-black uppercase tracking-[-0.02em]">{event.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-ink/64">{event.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-royal">Source Library</p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase tracking-[-0.04em]">Source Library</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(sourceTrail.length ? sourceTrail : sources.map((source) => ({
              name: source.name,
              type: source.type,
              date: "Date listed in source",
              url: source.url,
              supports: source.note,
              doesNotProve: "It does not prove claims outside the source itself."
            }))).map((source) => (
              <a key={`${source.name}-${source.url}`} href={source.url} target="_blank" rel="noreferrer" className="rounded-3xl border border-line bg-white p-5 shadow-card transition hover:border-royal/35">
                <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-royal">{source.type} - {source.date}</p>
                <h3 className="mt-2 font-display text-xl font-black uppercase leading-tight tracking-[-0.02em]">{source.name}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-ink/62">{source.supports}</p>
                <p className="mt-2 text-xs font-bold leading-5 text-ink/48">Does not prove: {source.doesNotProve}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <NewsroomSection title="Corrections & Clarifications" subtitle="Public correction notes and clarification records from the CWI Editorial Desk.">
        {corrections.length ? (
          <CardGrid items={corrections} />
        ) : (
          <div className="rounded-[1.5rem] border border-line bg-white p-6 shadow-card">
            <p className="font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">No public correction log entry is posted yet.</p>
            <p className="mt-3 max-w-3xl leading-7 text-ink/66">
              CWI will show correction and clarification records here after editorial review. Submit a correction if a source, date, credit, or context needs review.
            </p>
            <Link className="mt-5 inline-flex items-center gap-2 rounded-full bg-royal px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white" href="/corrections">
              View Correction Log <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </NewsroomSection>

      <NewsroomSection title="Archive Preview" subtitle="Older CWI explainers and context posts remain accessible, but current updates live here.">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {topItems.slice(0, 3).map((item) => (
            <Link key={`archive-${item.slug}`} href="/archive" className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card transition hover:border-royal/35">
              <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-royal">CWI Archive</p>
              <h3 className="mt-2 font-display text-xl font-black uppercase tracking-[-0.02em]">{item.category}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-ink/64">Browse older notes and context posts without treating them as current updates.</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-royal">
                Browse Archive <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </NewsroomSection>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-line bg-gradient-to-br from-ink via-[#102A63] to-royal p-8 text-white shadow-soft">
            <FileText className="h-9 w-9 text-saffron" />
            <h2 className="mt-5 font-display text-4xl font-black uppercase tracking-[-0.04em]">Seen an update, source, correction, or report?</h2>
            <p className="mt-4 max-w-3xl leading-8 text-white/78">Submit it to CWI. Add source links, dates, creator credit, and what remains unclear.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-ink" href="/submit">
                Submit Update <ArrowRight className="h-4 w-4" />
              </Link>
              <Link className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white" href="/support">
                Support independent CWI work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function NewsroomSection({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-royal">Newsroom</p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase tracking-[-0.04em] text-ink">{title}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-ink/68">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function CardGrid({ items }: { items: LiveNewsroomItem[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <LiveCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function LiveCard({ item, cta = "Read More" }: { item: LiveNewsroomItem; cta?: string }) {
  return (
    <Link href={`/live-newsroom/${item.slug}`} className="group overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:border-royal/35 hover:shadow-soft">
      <div className="aspect-[16/9] bg-skywash">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.thumbnailImage || item.heroImage} alt={item.altText} className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={item.verificationStatus} />
          <span className="rounded-full bg-paper px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-ink/58">{item.category}</span>
        </div>
        <h3 className="mt-3 font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">{item.title}</h3>
        <p className="mt-3 text-sm font-semibold leading-6 text-ink/66">{item.summary}</p>
        <div className="mt-4 grid gap-2 rounded-2xl border border-line bg-paper p-3 text-xs font-bold leading-5 text-ink/62">
          <p><span className="font-black uppercase tracking-[0.08em] text-ink">What changed?</span> {item.whatChanged}</p>
          <p><span className="font-black uppercase tracking-[0.08em] text-ink">What remains unclear?</span> {item.whatRemainsUnclear}</p>
        </div>
        <div className="mt-4 grid gap-2 text-xs font-black uppercase tracking-[0.1em] text-ink/48 sm:grid-cols-2">
          <span>{item.sourceCount} sources</span>
          <span>Updated {formatDate(item.updatedAt)}</span>
        </div>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-royal">
          {cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const iconClass = "h-3.5 w-3.5";
  const Icon = status === "Public Advisory" ? Siren : status === "Verified" || status === "Source-backed" ? ShieldCheck : Sparkles;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-royal/10 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-royal ring-1 ring-royal/15">
      <Icon className={iconClass} />
      {status}
    </span>
  );
}

function MiniBoard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-line bg-paper p-4">
      <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-ink/48">{label}</p>
      <p className="mt-1 text-3xl font-black text-ink">{value}</p>
    </div>
  );
}

function mergeItems(primary: LiveNewsroomItem[], fallback: LiveNewsroomItem[]) {
  const map = new Map<string, LiveNewsroomItem>();
  for (const item of [...primary, ...fallback]) {
    if (!map.has(item.slug)) map.set(item.slug, item);
  }
  return Array.from(map.values());
}

function uniqueSourceTrail(items: LiveNewsroomItem[]) {
  const map = new Map<string, LiveNewsroomItem["sourceTrail"][number]>();
  for (const item of items) {
    for (const source of item.sourceTrail) {
      if (!map.has(source.url)) map.set(source.url, source);
    }
  }
  return Array.from(map.values());
}

function uniqueSources(items: LiveNewsroomItem[]) {
  const map = new Map<string, ArticleSource>();
  for (const item of items) {
    for (const source of item.sources) {
      if (!map.has(source.url)) map.set(source.url, source);
    }
  }
  return Array.from(map.values());
}

function buildTodayBrief(items: LiveNewsroomItem[]) {
  const topUpdates = items.slice(0, 3);
  const first = topUpdates[0];
  const date = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date());
  return {
    date,
    topUpdates,
    whatChanged: first?.whatChanged || "No editor-approved change has been posted yet.",
    whatRemainsUnclear:
      first?.whatWeDontKnow?.[0] || first?.whatRemainsUnclear || "CWI is waiting for stronger source links before treating unclear claims as verified.",
    publicReminder: "Before sharing, check the date, original source, and whether private personal details are involved.",
    editorNote: first?.editorNote || ""
  };
}

type ArticleSource = LiveNewsroomItem["sources"][number];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00+05:30`));
}
