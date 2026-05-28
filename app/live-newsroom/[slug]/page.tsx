import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, ExternalLink, FileText } from "lucide-react";
import {
  getLiveNewsroomFallbackItem,
  getLiveNewsroomFallbackItems,
  getPublishedLiveNewsroomItem
} from "@/lib/db/live-newsroom";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const item = (await getPublishedLiveNewsroomItem(slug).catch(() => null)) ?? getLiveNewsroomFallbackItem(slug);

  if (!item) {
    return createMetadata({
      title: "CWI Live Newsroom - Cockroach Watch India",
      description: "CWI Live Newsroom update from Cockroach Watch India.",
      path: `/live-newsroom/${slug}`
    });
  }

  return createMetadata({
    title: `${item.title} - CWI Live Newsroom | Cockroach Watch India`,
    description:
      item.seoDescription ||
      `Cockroach Watch India Live Newsroom explains ${item.title}, what is known, what remains unclear, and what readers should check before sharing.`,
    path: `/live-newsroom/${item.slug}`,
    keywords: ["CWI Live Newsroom", "Cockroach Watch India", "CWI", item.category, ...item.tags]
  });
}

export default async function LiveNewsroomDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = (await getPublishedLiveNewsroomItem(slug).catch(() => null)) ?? getLiveNewsroomFallbackItem(slug);

  if (!item) notFound();

  const related = getLiveNewsroomFallbackItems(80)
    .filter((candidate) => candidate.slug !== item.slug)
    .filter((candidate) => candidate.category === item.category || candidate.tags.some((tag) => item.tags.includes(tag)))
    .slice(0, 3);
  const storySections = item.body.filter(
    (section) =>
      ![
        "short answer",
        "what happened",
        "what changed",
        "what we know",
        "what cwi knows",
        "what remains unclear",
        "what cwi does not know",
        "source trail",
        "sources and further reading",
        "before you share",
        "cwi context",
        "disclaimer"
      ].includes(section.heading.toLowerCase())
  );

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.summary,
    url: `${site.url}/live-newsroom/${item.slug}`,
    datePublished: item.publishedAt,
    dateModified: item.updatedAt,
    author: {
      "@type": "Organization",
      name: item.author
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "Cockroach Watch India",
      url: site.url
    },
    image: item.ogImage,
    citation: item.sources.map((source) => source.url),
    mainEntityOfPage: `${site.url}/live-newsroom/${item.slug}`
  };

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: item.title,
    description: item.summary,
    url: `${site.url}/live-newsroom/${item.slug}`,
    datePublished: item.publishedAt,
    dateModified: item.updatedAt,
    author: {
      "@type": "Organization",
      name: item.author
    },
    publisher: {
      "@type": "Organization",
      name: "Cockroach Watch India",
      url: site.url
    },
    image: item.ogImage
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "CWI Live Newsroom", item: `${site.url}/live-newsroom` },
      { "@type": "ListItem", position: 3, name: item.title, item: `${site.url}/live-newsroom/${item.slug}` }
    ]
  };

  return (
    <main
      className="text-ink"
      style={{
        background:
          "linear-gradient(180deg, rgba(246,241,231,0.98), rgba(251,248,240,0.98)), radial-gradient(circle at 1px 1px, rgba(90,59,36,0.08) 1px, transparent 0)",
        backgroundSize: "auto, 18px 18px"
      }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <article>
        <header className="border-b border-[#DED6C7] bg-[#F9F5EC]">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <Link href="/live-newsroom" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-[#1E6B4A]">
              <ArrowLeft className="h-4 w-4" />
              Back to Live Newsroom
            </Link>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge>{item.verificationStatus}</Badge>
              <Badge>{item.category}</Badge>
              <Badge>{item.sourceCount} sources</Badge>
              {item.riskLevel !== "Low" ? <Badge>Risk: {item.riskLevel}</Badge> : null}
            </div>
            <h1 className="mt-5 font-display text-5xl font-black uppercase leading-none tracking-[-0.05em] text-ink sm:text-7xl">
              {item.title}
            </h1>
            <p className="mt-6 text-xl font-semibold leading-8 text-ink/72">{item.summary}</p>
            <div className="mt-6 grid gap-3 text-sm font-black uppercase tracking-[0.1em] text-ink/48 sm:grid-cols-3">
              <span>Published {formatDate(item.publishedAt)}</span>
              <span>Updated {formatDate(item.updatedAt)}</span>
              <span>{item.author}</span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.heroImage} alt={item.altText} className="max-h-[520px] w-full object-cover" />
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 px-4 pb-12 sm:px-6 lg:px-8">
          {["Developing", "Reported", "Unverified", "Public Advisory"].includes(item.verificationStatus) ? (
            <section className="rounded-[1.5rem] border border-saffron/35 bg-saffron/10 p-5 text-[#7A5200] shadow-card">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-1 h-5 w-5 shrink-0" />
                <p className="font-bold leading-7">
                  This is a developing update. CWI is tracking public sources and will update this page when stronger information is available.
                </p>
              </div>
            </section>
          ) : null}

          <InfoPanel title="Short answer" body={item.summary} />
          <InfoPanel title="What changed" body={item.whatChanged} />
          <InfoPanel title="What happened" body={item.whatHappened} />
          <InfoPanel title="What CWI knows" body={item.whatWeKnow} />

          <section className="rounded-[2rem] border border-saffron/35 bg-saffron/10 p-6 shadow-card">
            <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em]">What CWI does not know yet</h2>
            <ul className="mt-4 grid gap-3 leading-7 text-ink/72">
              {(item.whatWeDontKnow.length ? item.whatWeDontKnow : [item.whatRemainsUnclear]).map((point) => (
                <li key={point} className="rounded-2xl border border-saffron/25 bg-white/70 p-4 font-semibold">{point}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-[2rem] border border-line bg-white p-6 shadow-card">
            <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em]">Why it matters</h2>
            <div className="mt-4 grid gap-5 leading-8 text-ink/72">
              {(storySections.length ? storySections : [{ heading: "Why it matters", paragraphs: [item.summary] }]).map((section) => (
                <div key={section.heading}>
                  <h3 className="font-display text-xl font-black uppercase tracking-[-0.02em] text-ink">{section.heading}</h3>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="mt-2">{paragraph}</p>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {item.editorNote ? (
            <section className="rounded-[2rem] border border-line bg-white p-6 shadow-card">
              <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em]">Editor&apos;s note</h2>
              <p className="mt-4 leading-8 text-ink/72">{item.editorNote}</p>
            </section>
          ) : null}

          <section className="rounded-[2rem] border border-line bg-white p-6 shadow-card">
            <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em]">Source trail</h2>
            <p className="mt-3 leading-7 text-ink/66">Sources are visible because CWI does not publish unsourced claims as fact.</p>
            <div className="mt-5 grid gap-3">
              {item.sourceTrail.length ? (
                item.sourceTrail.map((source) => (
                  <a key={`${source.name}-${source.url}`} href={source.url} target="_blank" rel="noreferrer" className="rounded-3xl border border-line bg-paper p-4 transition hover:border-[#1E6B4A]/40">
                    <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#1E6B4A]">{source.type} - {source.date}</p>
                    <h3 className="mt-1 font-display text-xl font-black uppercase tracking-[-0.02em]">{source.name}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-ink/64">{source.supports}</p>
                    <p className="mt-2 text-xs font-bold leading-5 text-ink/48">Does not prove: {source.doesNotProve}</p>
                    <span className="mt-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-[#1E6B4A]">
                      Open source <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </a>
                ))
              ) : item.sources.length ? (
                item.sources.map((source) => (
                  <a key={`${source.name}-${source.url}`} href={source.url} target="_blank" rel="noreferrer" className="rounded-3xl border border-line bg-paper p-4 transition hover:border-[#1E6B4A]/40">
                    <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#1E6B4A]">{source.outlet}</p>
                    <h3 className="mt-1 font-display text-xl font-black uppercase tracking-[-0.02em]">{source.name}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-ink/64">{source.note}</p>
                  </a>
                ))
              ) : (
                <p className="rounded-3xl border border-saffron/35 bg-saffron/10 p-4 text-sm font-bold leading-6 text-[#8A5B00]">
                  This item is missing visible sources and should not be treated as publish-ready until the source pack is reviewed.
                </p>
              )}
            </div>
          </section>

          {item.timeline.length ? (
            <section className="rounded-[2rem] border border-line bg-white p-6 shadow-card">
              <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em]">Timeline</h2>
              <div className="mt-5 grid gap-3">
                {item.timeline.map((event, index) => (
                  <div key={`${event.date}-${index}`} className="rounded-3xl border border-line bg-paper p-4">
                    <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#1E6B4A]">{event.date}</p>
                    <h3 className="mt-1 font-display text-xl font-black uppercase">{event.title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-ink/66">{event.summary}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-[2rem] border border-line bg-white p-6 shadow-card">
            <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em]">Before you share</h2>
            <ul className="mt-4 grid gap-3 leading-7 text-ink/72">
              {item.beforeYouShare.map((point) => (
                <li key={point} className="rounded-2xl border border-line bg-paper p-4 font-semibold">{point}</li>
              ))}
            </ul>
          </section>

          {related.length ? (
            <section className="rounded-[2rem] border border-line bg-white p-6 shadow-card">
              <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em]">Related Live Newsroom updates</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {related.map((candidate) => (
                  <Link key={candidate.slug} href={`/live-newsroom/${candidate.slug}`} className="rounded-3xl border border-line bg-paper p-4 transition hover:border-[#1E6B4A]/40">
                    <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#1E6B4A]">{candidate.category}</p>
                    <h3 className="mt-2 font-display text-lg font-black uppercase leading-tight">{candidate.title}</h3>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-[2rem] border border-[#1E6B4A]/30 bg-[#1E6B4A] p-7 text-white shadow-soft">
            <FileText className="h-8 w-8 text-[#F6C15D]" />
            <h2 className="mt-4 font-display text-3xl font-black uppercase tracking-[-0.03em]">Submit correction or report</h2>
            <p className="mt-3 leading-8 text-white/76">Seen a source, correction, or public-interest update? Send it to CWI with context and dates.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/submit" className="inline-flex rounded-full bg-[#F6C15D] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-ink">
                Submit Update
              </Link>
              <Link href="/support" className="inline-flex rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white">
                Support CWI
              </Link>
            </div>
          </section>

          <section className="rounded-[2rem] border border-line bg-white p-6 shadow-card">
            <h2 className="font-display text-2xl font-black uppercase tracking-[-0.03em]">Disclaimer</h2>
            <p className="mt-3 leading-8 text-ink/68">
              Cockroach Watch India is an independent civic watch, satire, and commentary platform. This Live Newsroom update discusses publicly available reports, official statements, social media trends, and public reactions. Claims are presented with attribution wherever possible and should not be treated as legal findings or official declarations unless clearly stated.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

function InfoPanel({ title, body, tone = "normal" }: { title: string; body: string; tone?: "normal" | "warning" }) {
  return (
    <section className={`rounded-[2rem] border p-6 shadow-card ${tone === "warning" ? "border-saffron/35 bg-saffron/10" : "border-line bg-white"}`}>
      <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em]">{title}</h2>
      <p className="mt-4 leading-8 text-ink/72">{body}</p>
    </section>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-[#E9F4E8] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#1E6B4A] ring-1 ring-[#1E6B4A]/15">
      {children}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00+05:30`));
}
