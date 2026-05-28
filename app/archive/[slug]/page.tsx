import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, FileText, ShieldCheck } from "lucide-react";
import {
  CwiButtonLink,
  CwiEditorialCard,
  CwiMasthead,
  CwiPageShell,
  CwiSectionHeader,
  CwiSourceChip,
  CwiStatusBadge,
  CwiSubmitCTA,
  CwiTimeline
} from "@/components/CwiDesignSystem";
import { posts } from "@/data/posts";
import { getPublishedWatchPostBySlug } from "@/lib/db/articles";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

const removedDraftSlugs = new Set(["cwi-priority-public-interest-update"]);

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug) ?? (await getPublishedWatchPostBySlug(slug).catch(() => null));

  if (!post || removedDraftSlugs.has(slug)) {
    return createMetadata({
      title: "Archive item unavailable - Cockroach Watch India",
      description: "This CWI archive item is unavailable for indexing.",
      path: "/archive",
      index: false
    });
  }

  return createMetadata({
    title: post.seoTitle || `${post.title} - CWI Archive`,
    description: post.seoDescription || post.summary,
    path: `/archive/${post.slug}`,
    type: "article",
    publishedTime: `${post.publishedAt}T00:00:00+05:30`,
    modifiedTime: `${post.updatedAt}T00:00:00+05:30`,
    keywords: post.tags,
    image: {
      url: "/opengraph-image",
      alt: post.imageAlt
    }
  });
}

export default async function ArchiveArticlePage({ params }: Props) {
  const { slug } = await params;
  if (removedDraftSlugs.has(slug)) notFound();

  const post = posts.find((item) => item.slug === slug) ?? (await getPublishedWatchPostBySlug(slug).catch(() => null));
  if (!post) notFound();

  const related = posts.filter((item) => item.slug !== post.slug && (post.relatedSlugs.includes(item.slug) || item.category === post.category)).slice(0, 3);
  const articleJsonLd = buildArticleJsonLd(post);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <CwiPageShell>
        <div className="mb-5 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.12em] text-cwi-brown/70">
          <Link href="/" className="hover:text-cwi-green">Home</Link>
          <span>/</span>
          <Link href="/archive" className="hover:text-cwi-green">Archive</Link>
          <span>/</span>
          <span>{post.category}</span>
        </div>

        <CwiMasthead
          label="Archived context"
          title={post.title}
          subtitle={post.summary}
          body="This is older CWI context. Current updates live in the Live Newsroom."
          primaryCta={{ href: "/live-newsroom", label: "Check current updates" }}
          secondaryCta={{ href: "/submit", label: "Send source or correction" }}
          meta={[post.verificationStatus, post.category, `${post.sources.length} sources`, `Updated ${formatDate(post.updatedAt)}`]}
        />

        <article className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <section className="overflow-hidden rounded-lg border border-cwi-brown/18 bg-white/78 shadow-[0_16px_44px_rgba(29,18,10,0.08)]">
              <div className="relative min-h-72 bg-cwi-green/10">
                <Image src="/brand/logo.png" alt={post.imageAlt} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-contain p-10" priority />
              </div>
              <div className="grid gap-4 border-t border-cwi-brown/14 p-5 text-sm font-bold text-cwi-ink/70 sm:grid-cols-3">
                <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-cwi-green" /> Published {formatDate(post.date)}</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cwi-green" /> {post.verificationStatus}</span>
                <span className="inline-flex items-center gap-2"><FileText className="h-4 w-4 text-cwi-green" /> {post.readingMinutes} min read</span>
              </div>
            </section>

            <ArticleSection title="Short answer">
              <p>{post.content[0] ?? post.summary}</p>
            </ArticleSection>

            <ArticleSection title="What changed">
              <p>{post.pullQuote || "This archive item preserves earlier CWI context and source notes. Check the Live Newsroom before treating older details as current."}</p>
            </ArticleSection>

            <ArticleSection title="What CWI knows">
              <div className="space-y-4">
                {post.content.slice(0, 3).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </ArticleSection>

            <ArticleSection title="What remains unclear">
              <p>Dates, public claims, follower counts, platform actions, and official responses can change after an archive post is published. Use the source trail and Live Newsroom updates before sharing this as current status.</p>
            </ArticleSection>

            <ArticleSection title="Why it matters">
              <div className="space-y-4">
                {post.sections.slice(0, 2).map((section) => (
                  <div key={section.heading}>
                    <h3 className="font-display text-2xl font-black uppercase leading-tight text-cwi-ink">{section.heading}</h3>
                    {section.paragraphs.slice(0, 2).map((paragraph) => <p key={paragraph} className="mt-3">{paragraph}</p>)}
                  </div>
                ))}
              </div>
            </ArticleSection>

            <section className="rounded-lg border border-cwi-brown/18 bg-white/78 p-5 sm:p-6">
              <CwiSectionHeader eyebrow="Source trail" title="Sources and limits" subtitle="Source cards show what each record supports and what it does not prove." />
              <div className="grid gap-4">
                {post.sources.map((source) => (
                  <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="rounded-lg border border-cwi-brown/14 bg-cwi-cream p-4 transition hover:border-cwi-green/35">
                    <CwiSourceChip>{source.type}</CwiSourceChip>
                    <h3 className="mt-3 font-display text-xl font-black uppercase leading-tight text-cwi-ink">{source.name}</h3>
                    <p className="mt-2 text-sm font-bold text-cwi-green">{source.outlet}</p>
                    <p className="mt-3 leading-7 text-cwi-ink/68">{source.note}</p>
                  </a>
                ))}
              </div>
            </section>

            <section>
              <CwiSectionHeader eyebrow="Before you share" title="Check dates and source limits" />
              <CwiTimeline
                items={[
                  { time: formatDate(post.date), title: "Archive item published", body: post.summary, badge: "Archived context", meta: `${post.sources.length} sources` },
                  { time: formatDate(post.updatedAt), title: "Last updated", body: "CWI keeps older context available, but current checks belong in Live Newsroom.", badge: "Last checked" }
                ]}
              />
            </section>

            <CwiSubmitCTA />
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-lg border border-cwi-brown/18 bg-white/78 p-5 shadow-sm">
              <CwiStatusBadge tone="saffron">Archived context</CwiStatusBadge>
              <h2 className="mt-4 font-display text-2xl font-black uppercase leading-tight text-cwi-ink">Newsroom record</h2>
              <div className="mt-4 grid gap-2 text-sm font-bold text-cwi-ink/70">
                <span>Published: {formatDate(post.date)}</span>
                <span>Updated: {formatDate(post.updatedAt)}</span>
                <span>Source count: {post.sources.length}</span>
                <span>Category: {post.category}</span>
              </div>
              <CwiButtonLink href="/live-newsroom" variant="secondary" className="mt-5 w-full">Current updates</CwiButtonLink>
            </div>

            {related.length ? (
              <div className="rounded-lg border border-cwi-brown/18 bg-white/78 p-5 shadow-sm">
                <h2 className="font-display text-2xl font-black uppercase leading-tight text-cwi-ink">Related archive</h2>
                <div className="mt-4 grid gap-3">
                  {related.map((item) => (
                    <CwiEditorialCard key={item.slug} title={item.title} summary={item.summary} href={`/archive/${item.slug}`} label={item.category} />
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </article>
      </CwiPageShell>
    </>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-cwi-brown/18 bg-white/78 p-5 leading-8 text-cwi-ink/72 shadow-sm sm:p-6">
      <h2 className="font-display text-3xl font-black uppercase leading-tight text-cwi-ink">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function buildArticleJsonLd(post: (typeof posts)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    url: absoluteUrl(`/archive/${post.slug}`),
    datePublished: `${post.publishedAt}T00:00:00+05:30`,
    dateModified: `${post.updatedAt}T00:00:00+05:30`,
    articleSection: post.category,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "NewsMediaOrganization", name: site.name, url: site.url },
    image: absoluteUrl("/opengraph-image"),
    mainEntityOfPage: absoluteUrl(`/archive/${post.slug}`)
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00+05:30`));
}