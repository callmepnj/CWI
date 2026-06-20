import { PageBackgroundGesture } from "@/components/PageBackgroundGesture";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { NewsArticleSchema } from "@/components/seo/NewsArticleSchema";
import { createMetadata, absoluteUrl } from "@/lib/seo";
import { liveNewsroomItems, getItemBySlug } from "@/data/live-newsroom";
import { site } from "@/lib/site";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type DetailItem = NonNullable<ReturnType<typeof getItemBySlug>>;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = getItemBySlug(slug);

  if (!item) {
    return createMetadata({
      title: "Not found - CWI Live Newsroom",
      description: "This newsroom update could not be found.",
      path: `/live-newsroom/${slug}`
    });
  }

  const socialImage = item.ogImage ?? item.heroImage ?? item.displayImage ?? `/live-newsroom/${item.slug}/opengraph-image`;
  const socialAlt = item.altText ?? item.displayImageAlt ?? `${item.title} - CWI Live Newsroom social preview`;

  return createMetadata({
    title: `${item.title} - CWI Live Newsroom`,
    description: item.summary,
    path: `/live-newsroom/${slug}`,
    type: "article",
    publishedTime: item.publishedAt ?? item.createdAt,
    modifiedTime: item.lastUpdatedAt ?? item.updatedAt,
    keywords: [item.title, item.category, item.status, "CWI Live Newsroom", "Cockroach Watch India"],
    section: item.category,
    tags: [item.category, item.status, item.changeType, ...item.labels, "CWI Live Newsroom"],
    image: {
      url: absoluteUrl(socialImage),
      alt: socialAlt
    }
  });
}

export async function generateStaticParams() {
  return liveNewsroomItems.map((item) => ({ slug: item.slug }));
}

export default async function LiveNewsroomDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) notFound();

  const statusColors: Record<string, { bg: string; text: string }> = {
    "Source-backed": { bg: "bg-cwi-green/10", text: "text-cwi-green" },
    Verified: { bg: "bg-cwi-green/10", text: "text-cwi-green" },
    Developing: { bg: "bg-cwi-saffron/12", text: "text-cwi-brown" },
    Reported: { bg: "bg-cwi-cream", text: "text-cwi-brown" },
    "Public Advisory": { bg: "bg-cwi-saffron/12", text: "text-cwi-brown" },
    "Needs Source": { bg: "bg-cwi-cream", text: "text-cwi-brown" },
    Blocked: { bg: "bg-cwi-brown/10", text: "text-cwi-brown" },
    Correction: { bg: "bg-cwi-saffron/12", text: "text-cwi-brown" }
  };

  const status = statusColors[item.status] || statusColors.Reported;
  const narrative = buildArticleNarrative(item);
  const heroImage = item.heroImage ?? item.displayImage;
  const heroAlt = item.altText ?? item.displayImageAlt ?? item.title;
  const articleUrl = absoluteUrl(`/live-newsroom/${item.slug}`);
  const schemaImage = absoluteUrl(item.ogImage ?? heroImage ?? `/live-newsroom/${item.slug}/opengraph-image`);

  return (
    <>
      <NewsArticleSchema
        headline={item.title}
        datePublished={item.publishedAt ?? item.createdAt}
        dateModified={item.lastUpdatedAt ?? item.updatedAt}
        description={item.summary}
        url={articleUrl}
        imageUrl={schemaImage}
        authorName={site.editorialDesk}
        sectionName="Live Newsroom"
        sectionUrl={absoluteUrl("/live-newsroom")}
      />
      <PageBackgroundGesture intensity="subtle">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <Link href="/live-newsroom" className="mb-8 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-cwi-green transition-all hover:bg-cwi-green/5">
            <ArrowLeft className="h-4 w-4" /> Back to Live Newsroom
          </Link>

          <header className="mb-8">
            <div className="mb-6 flex flex-wrap gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${status.bg} ${status.text}`}>{item.status}</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-cwi-saffron/10 px-3 py-1.5 text-sm font-medium text-cwi-brown">{item.category}</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-cwi-green/10 px-3 py-1.5 text-sm font-medium text-cwi-green">
                {item.sourceTrail.length} source{item.sourceTrail.length !== 1 ? "s" : ""}
              </span>
              {item.isLeadStory ? <span className="inline-flex items-center gap-2 rounded-full bg-cwi-saffron/10 px-3 py-1.5 text-sm font-medium text-cwi-brown">Lead Story</span> : null}
            </div>
            <h1 className="mb-4 font-display text-3xl font-black leading-tight text-cwi-ink sm:text-4xl lg:text-5xl">{item.title}</h1>
            <p className="mb-6 max-w-2xl text-xl leading-8 text-cwi-ink/70">{item.summary}</p>
            <div className="flex flex-col gap-4 border-b-2 border-cwi-green/10 pb-6 text-sm text-cwi-ink/60 sm:flex-row">
              <span>By {site.editorialDesk}</span>
              <span>/</span>
              <span>Published {new Date(item.publishedAt || item.createdAt).toLocaleDateString("en-IN")}</span>
              <span>/</span>
              <span>Updated {formatDistanceToNow(new Date(item.lastUpdatedAt), { addSuffix: true })}</span>
              <span>/</span>
              <span>Last checked {formatDistanceToNow(new Date(item.lastCheckedAt), { addSuffix: true })}</span>
            </div>
          </header>

          {heroImage ? (
            <div className="relative mb-12 h-96 overflow-hidden rounded-lg border-2 border-cwi-green/20 bg-cwi-muted">
              <Image src={heroImage} alt={heroAlt} fill sizes="(max-width: 1024px) 100vw, 896px" className="object-cover" />
            </div>
          ) : null}

          <ArticleSection title="Short answer" tone="highlight">
            {splitParagraphs(narrative.shortAnswer).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </ArticleSection>

          <ArticleSection title="What happened">
            {narrative.whatHappened.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </ArticleSection>

          <ArticleSection title="Why this matters to readers">
            <p>{narrative.whyPeopleCare}</p>
          </ArticleSection>

          <div className="mb-12 grid gap-6 md:grid-cols-2">
            <InfoCard title="What we know" tone="green" items={narrative.whatWeKnow} />
            <InfoCard title="What remains unclear" tone="amber" items={narrative.whatRemainsUnclear} />
          </div>

          <ArticleSection title="Why it matters">
            <p>{narrative.whyItMatters}</p>
          </ArticleSection>

          <ArticleSection title="CWI context">
            <p>{narrative.cwiContext}</p>
          </ArticleSection>

          <section className="mb-12 rounded-lg border border-cwi-brown/18 bg-white/78 p-6 shadow-sm">
            <h2 className="font-display text-2xl font-black uppercase leading-tight text-cwi-ink">Timeline</h2>
            <div className="mt-4 grid gap-3">
              {narrative.timeline.map((event) => (
                <div key={`${event.date}-${event.title}`} className="rounded-lg border border-cwi-brown/14 bg-cwi-cream p-4">
                  <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-cwi-brown/70">{event.date}</p>
                  <h3 className="mt-2 font-display text-xl font-black text-cwi-ink">{event.title}</h3>
                  <p className="mt-2 leading-7 text-cwi-ink/72">{event.body}</p>
                </div>
              ))}
            </div>
          </section>

          {item.editorNote ? (
            <div className="mb-12 rounded-lg border-l-4 border-cwi-saffron bg-cwi-saffron/5 p-6">
              <h3 className="mb-2 font-display text-lg font-bold text-cwi-brown">Editor note</h3>
              <p className="text-cwi-ink/80">{item.editorNote}</p>
            </div>
          ) : null}

          {item.sourceTrail.length > 0 ? (
            <section className="mb-12 rounded-lg border border-cwi-brown/18 bg-white/78 p-6 shadow-sm">
              <h2 className="font-display text-2xl font-black uppercase leading-tight text-cwi-ink">Sources and further reading</h2>
              <div className="mt-5 space-y-3">
                {item.sourceTrail.map((source) => (
                  <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 rounded-lg border-2 border-cwi-green/20 bg-white p-4 transition-all hover:border-cwi-green/40 hover:bg-cwi-cream/50 hover:shadow-sm">
                    <span className="mt-1 inline-flex min-w-10 justify-center rounded-full bg-cwi-green/10 px-2 py-1 text-xs font-bold uppercase text-cwi-green" aria-hidden="true">{sourceBadge(source.type)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-cwi-ink transition-colors hover:text-cwi-green">{source.name}</span>
                      <span className="mt-1 block text-sm text-cwi-ink/60">{source.type}</span>
                      <span className="mt-2 block text-sm leading-6 text-cwi-ink/70">Used for: {source.supports || source.usedIn || source.usedFor?.join(", ") || "source-backed context for this Live Newsroom item."}</span>
                      {source.doesNotProve ? <span className="mt-1 block text-xs font-bold leading-5 text-cwi-brown">Does not prove: {source.doesNotProve}</span> : null}
                    </span>
                    <ExternalLink className="mt-1 h-5 w-5 flex-shrink-0 text-cwi-green/50" />
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          <ArticleSection title="CWI verification note" tone="muted">
            <p>This Live Newsroom item is based on publicly available reporting and source material available at the time of publication. CWI will update this page if official clarification, corrections, or new verified sources become available.</p>
            <p>Check the update time, source trail, and what remains unclear. Do not treat developing, reported, or needs-source labels as final proof.</p>
          </ArticleSection>

          <div className="rounded-lg border-2 border-cwi-green/30 bg-cwi-green/5 p-8 text-center">
            <h3 className="mb-3 font-display text-lg font-bold text-cwi-ink">Have a correction, source, document, or verified update?</h3>
            <p className="mx-auto mb-6 max-w-2xl text-cwi-ink/70">Help CWI keep the record accurate. Submit an official update, correction, or additional source context.</p>
            <Link href="/submit" className="inline-flex items-center gap-2 rounded-lg bg-cwi-green px-6 py-3 font-semibold text-white transition-all hover:bg-cwi-green/90">
              Submit Update <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {liveNewsroomItems.length > 1 ? (
            <div className="mt-16 border-t-2 border-cwi-border pt-12">
              <h2 className="mb-6 font-display text-2xl font-bold text-cwi-ink">More from Live Newsroom</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {liveNewsroomItems.filter((related) => related.id !== item.id).slice(0, 2).map((relatedItem) => (
                  <Link key={relatedItem.id} href={`/live-newsroom/${relatedItem.slug}`} className="group rounded-lg border-2 border-cwi-green/20 bg-white p-6 transition-all hover:border-cwi-green/40 hover:bg-cwi-cream/30 hover:shadow-md">
                    <div className="relative mb-4 h-36 overflow-hidden rounded-md border border-cwi-brown/12 bg-cwi-muted">
                      <Image
                        src={relatedItem.thumbnailImage ?? relatedItem.displayImage ?? "/images/cwi/newsroom/thumbnails/cwi-live-newsroom-fallback.jpg"}
                        alt={relatedItem.altText ?? relatedItem.displayImageAlt ?? relatedItem.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="mb-2 text-xs font-bold uppercase tracking-wide text-cwi-green">{relatedItem.category}</div>
                    <h3 className="mb-2 line-clamp-2 font-display text-lg font-bold text-cwi-ink transition-colors group-hover:text-cwi-green">{relatedItem.title}</h3>
                    <p className="mb-3 line-clamp-2 text-sm text-cwi-ink/70">{relatedItem.summary}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-cwi-green">Open update <ArrowRight className="h-4 w-4" /></span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </PageBackgroundGesture>
    </>
  );
}

function ArticleSection({ title, children, tone = "default" }: { title: string; children: React.ReactNode; tone?: "default" | "highlight" | "muted" }) {
  const toneClass = tone === "highlight" ? "border-cwi-green/24 bg-cwi-green/8" : tone === "muted" ? "border-cwi-brown/18 bg-cwi-cream" : "border-cwi-brown/18 bg-white/78";
  return (
    <section className={`mb-12 rounded-lg border p-6 leading-8 text-cwi-ink/76 shadow-sm ${toneClass}`}>
      <h2 className="font-display text-2xl font-black uppercase leading-tight text-cwi-ink">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function InfoCard({ title, items, tone }: { title: string; items: string[]; tone: "green" | "amber" }) {
  const colorClass = tone === "green" ? "border-cwi-green/20 bg-cwi-green/10 text-cwi-green" : "border-cwi-saffron/24 bg-cwi-saffron/10 text-cwi-brown";
  return (
    <section className={`rounded-lg border p-6 ${colorClass}`}>
      <h3 className="mb-3 font-display text-lg font-bold">{title}</h3>
      <ul className="space-y-2 text-cwi-ink/80">
        {items.map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </section>
  );
}

function buildArticleNarrative(item: DetailItem) {
  const isStudent = /student|neet|cbse|exam|nta|cuet|ssc/i.test(`${item.title} ${item.category} ${item.summary}`);
  const isDigital = /x account|platform|withheld|social|quote|portal|screenshot/i.test(`${item.title} ${item.summary}`);
  const isJustice = /encounter|police|death|custody|justice|accountability|fir|court|legal/i.test(`${item.title} ${item.category} ${item.summary}`);
  const whatWeKnow = splitFacts(item.whatWeKnow, item.sourceTrail.map((source) => `${source.name} is used for ${source.supports || source.usedIn || source.usedFor?.join(", ") || "source-backed context"}.`));
  const whatRemainsUnclear = splitFacts(item.whatWeDontKnow, item.sourceGap ? [item.sourceGap] : []);

  return {
    shortAnswer: item.content || item.summary,
    whatHappened: [
      item.summary,
      item.whatChanged,
      item.editorNote || "CWI is keeping the update in a source-backed format so readers can separate what is reported, what is official, and what still needs verification."
    ].filter(Boolean),
    whyPeopleCare: isStudent
      ? "Students and families are affected by more than headlines. Preparation time, application fees, travel, coaching costs, family pressure, mental stress, and future uncertainty all increase when exam systems appear unreliable or unclear. That is why CWI treats student-facing updates as public-interest records, not quick viral posts."
      : isDigital
        ? "Readers care because platform restrictions, technical claims, and viral screenshots can shape public memory quickly. If the source trail is weak, people may share claims that later turn out to be incomplete, disputed, or wrongly framed."
        : isJustice
          ? "Readers care because a contested death, police action, FIR, court record, or public-accountability claim cannot be reduced to viral anger. The public needs a separated record of official versions, family or public allegations, source-backed facts, and what still needs independent verification."
        : "The public impact is trust. When civic updates move quickly, readers need a clear record of what happened, who is affected, what sources support it, and what remains unresolved.",
    whatWeKnow,
    whatRemainsUnclear,
    whyItMatters: isStudent
      ? "This matters because an exam failure is not just a technical problem. It affects trust, money, preparation, families, and the future of students who already operate under extreme pressure."
      : isDigital
        ? "This matters because online platform restrictions and technical disputes can affect speech, public memory, civic participation, and the way young people understand a developing issue."
        : isJustice
          ? "This matters because accountability protects citizens and honest institutions at the same time. When the official version and public allegations conflict, evidence, due process, medical records, FIRs, and inquiry findings matter more than noise."
        : "This matters because public records should remain readable after the news cycle moves on. CWI documents the source trail so future readers can see what was known, what was unclear, and what changed.",
    cwiContext: `Cockroach Watch India - CWI is tracking this update through the CWI Live Newsroom as part of its public archive on youth voice, civic issues, digital rights, exam accountability, and India's unanswered questions. CWI's role is to document, verify, and amplify public-interest updates with source attribution and editorial caution.`,
    timeline: buildTimeline(item)
  };
}

function splitFacts(primary: string, extras: string[]) {
  const points = primary
    .split(/\.\s+/)
    .map((point) => point.trim().replace(/\.$/, ""))
    .filter((point) => point.length > 12);
  return Array.from(new Set([...points, ...extras])).slice(0, 6);
}

function splitParagraphs(value: string) {
  return value.split(/\n{2,}|\r{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

function buildTimeline(item: DetailItem) {
  if (item.timeline?.length) {
    return item.timeline.map((event) => ({
      date: event.date,
      title: event.verificationLabel || event.source || "Timeline update",
      body: event.event
    }));
  }

  return [
    { date: formatDate(item.createdAt), title: "Record opened", body: item.summary },
    { date: formatDate(item.lastCheckedAt), title: "Last source check", body: item.whatChanged },
    { date: formatDate(item.lastUpdatedAt), title: "Latest CWI update", body: item.whatWeDontKnow }
  ];
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function sourceBadge(type: string) {
  if (type === "Official") return "OFF";
  if (type === "Court/legal") return "LAW";
  if (type === "Established media") return "MED";
  if (type === "Fact-check") return "CHK";
  if (type === "Public statement") return "PUB";
  if (type === "Social post") return "SOC";
  if (type === "User-submitted") return "USR";
  return "SRC";
}
