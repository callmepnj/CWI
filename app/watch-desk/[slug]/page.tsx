import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Clock, FileText, ShieldCheck, Tag } from "lucide-react";
import { ArticleProgress } from "@/components/ArticleProgress";
import { ArticleDiscussionPrompts } from "@/components/ArticleDiscussionPrompts";
import { ArticleRating } from "@/components/ArticleRating";
import { CommentSection } from "@/components/CommentSection";
import { ShareButtons } from "@/components/ShareButtons";
import { VerificationBadge } from "@/components/VerificationBadge";
import { WatchDeskCard } from "@/components/WatchDeskCard";
import { Card, CardLabel } from "@/components/ui/card";
import { posts } from "@/data/posts";
import { getPublishedWatchPostBySlug } from "@/lib/db/articles";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { slugifyTopic } from "@/lib/taxonomy";

type Props = {
  params: Promise<{ slug: string }>;
};

const articleDisclaimer =
  "Cockroach Watch India is an independent civic watch, satire, and commentary platform. This article discusses publicly available reports, official statements, social media trends, and public reactions. Claims are presented with attribution wherever possible and should not be treated as legal findings or official declarations unless clearly stated.";

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post =
    posts.find((item) => item.slug === slug) ??
    (await getPublishedWatchPostBySlug(slug).catch(() => null));

  if (!post) {
    return createMetadata({
      title: "Watch Desk Post - Cockroach Watch India",
      description: site.description,
      path: "/watch-desk"
    });
  }

  const baseMetadata = createMetadata({
    title: post.seoTitle,
    description: post.seoDescription,
    path: `/watch-desk/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    keywords: post.tags
  });

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      title: post.seoTitle,
      description: post.seoDescription,
      url: absoluteUrl(`/watch-desk/${post.slug}`),
      siteName: site.name,
      images: [
        {
          url: post.ogImage,
          width: 1200,
          height: 630,
          alt: post.imageAlt
        }
      ],
      locale: "en_IN",
      type: "article",
      publishedTime: post.publishedAt
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
      images: [post.ogImage],
      creator: "@CWatchIndia",
      site: "@CWatchIndia"
    }
  };
}

function jsonLdForPost(post: (typeof posts)[number]) {
  const url = absoluteUrl(`/watch-desk/${post.slug}`);
  const image = post.ogImage;
  const articleBase = {
    headline: post.seoTitle,
    description: post.metaDescription,
    image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author,
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
    url,
    mainEntityOfPage: url,
    articleSection: post.category,
    keywords: post.tags.join(", "),
    citation: post.sources.map((source) => source.url),
    isAccessibleForFree: true
  };

  return [
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      ...articleBase
    },
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      ...articleBase
    },
    {
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
          name: "Watch Desk",
          item: absoluteUrl("/watch-desk")
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: url
        }
      ]
    }
  ];
}

export default async function WatchPostPage({ params }: Props) {
  const { slug } = await params;
  const post =
    posts.find((item) => item.slug === slug) ??
    (await getPublishedWatchPostBySlug(slug).catch(() => null));

  if (!post) {
    notFound();
  }

  const relatedPosts = post.relatedSlugs
    .map((relatedSlug) => posts.find((item) => item.slug === relatedSlug))
    .filter((item): item is (typeof posts)[number] => Boolean(item))
    .slice(0, 3);
  const latestPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 5);
  const jsonLd = jsonLdForPost(post);
  const discussionPrompts = buildWatchDiscussionPrompts(post);
  const readerQuestions = buildWatchReaderQuestions(post);

  return (
    <>
      <ArticleProgress />
      {jsonLd.map((item) => (
        <script key={`${item["@type"]}-${post.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}

      <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.12em] text-ink/55">
          <Link href="/" className="hover:text-royal">Home</Link>
          <span>/</span>
          <Link href="/watch-desk" className="hover:text-royal">Watch Desk</Link>
          <span>/</span>
          <span>{post.category}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div>
            <div className="rounded-[2rem] border border-line bg-white p-6 shadow-card sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <CardLabel className="mb-0">{post.category}</CardLabel>
                <VerificationBadge status={post.verificationStatus} />
                <span className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.14em] text-ink/55 ring-1 ring-line">
                  <Clock className="h-3.5 w-3.5" /> {post.readingMinutes} min read
                </span>
              </div>

              <h1 className="mt-6 font-display text-4xl font-black uppercase leading-[0.95] tracking-[-0.05em] text-ink sm:text-6xl">
                {post.title} - CWI Watch Desk
              </h1>
              <p className="mt-6 max-w-4xl text-xl font-semibold leading-9 text-ink/75">{post.summary}</p>
              <p className="mt-5 font-mono text-xs font-black uppercase tracking-[0.16em] text-royal">
                By {post.author} / Published on CWI Watch Desk / Cockroach Watch India
              </p>

              <div className="mt-7 grid gap-3 border-y border-line py-5 text-sm font-bold uppercase tracking-[0.08em] text-ink/55 sm:grid-cols-3">
                <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-royal" /> Published {formatArticleDate(post.publishedAt)}</span>
                <span className="inline-flex items-center gap-2"><FileText className="h-4 w-4 text-royal" /> Last updated {formatArticleDate(post.updatedAt)}</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-royal" /> {post.sources.length} sources</span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/submit" className="inline-flex rounded-full bg-skywash px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.14em] text-royal ring-1 ring-royal/15">
                  Submit correction
                </Link>
                <Link href="/" className="inline-flex rounded-full bg-paper px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.14em] text-ink/62 ring-1 ring-line">
                  Read more at Cockroach Watch India
                </Link>
              </div>

              <div className="mt-8 rounded-[2rem] bg-gradient-to-br from-ink via-[#102a63] to-royal p-6 text-white shadow-soft">
                <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-saffron">Watch Desk Pull Quote</p>
                <p className="mt-4 font-display text-3xl font-black uppercase leading-tight tracking-[-0.03em]">{post.pullQuote}</p>
              </div>

              <div className="prose-cwi mt-10 space-y-10">
                {post.sections.map((section) => (
                  <section key={section.heading}>
                    <h2 className="font-display text-3xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">{section.heading}</h2>
                    <div className="mt-4 space-y-5 text-lg leading-8 text-ink/74">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-10 border-t border-line pt-8">
                <h2 className="font-display text-3xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">Sources & Further Reading</h2>
                <div className="mt-5 grid gap-4">
                  {post.sources.map((source) => (
                    <Link
                      key={source.url}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-3xl border border-line bg-paper p-4 transition hover:border-royal/40 hover:bg-skywash"
                    >
                      <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-royal">
                        {source.outlet} / {source.type}
                      </p>
                      <h3 className="mt-2 font-display text-xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">{source.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-ink/68">{source.note}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/watch-desk/tag/${slugifyTopic(tag)}`}
                    className="inline-flex items-center gap-1 rounded-full bg-paper px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-ink/62 ring-1 ring-line hover:bg-skywash hover:text-royal"
                  >
                    <Tag className="h-3.5 w-3.5" />
                    {tag}
                  </Link>
                ))}
              </div>

              <div className="mt-8 rounded-[2rem] border border-royal/15 bg-skywash p-6">
                <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-royal">CWI Note</p>
                <p className="mt-3 leading-8 text-ink/74">
                  The CWI Watch Desk documents public-interest updates with context, source attribution, and editorial caution. If you have corrections, sources, or creator credit requests, submit them through{" "}
                  <Link href="/submit" className="font-bold text-royal underline-offset-4 hover:underline">
                    Cockroach Watch India
                  </Link>
                  .
                </p>
              </div>
            </div>

            <ArticleDiscussionPrompts prompts={discussionPrompts} questions={readerQuestions} />

            <Card className="mt-8">
              <CardLabel>Article disclaimer</CardLabel>
              <p className="leading-8 text-ink/72">{articleDisclaimer}</p>
            </Card>

            <CommentSection articleSlug={post.slug} />

            <Card className="mt-8">
              <CardLabel>Social copy kit</CardLabel>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <h2 className="font-display text-2xl font-black uppercase">X thread</h2>
                  <ol className="mt-3 space-y-3 text-sm font-semibold leading-6 text-ink/70">
                    {post.social.xThread.map((line, index) => (
                      <li key={line}>{index + 1}. {line}</li>
                    ))}
                  </ol>
                </div>
                <div className="space-y-4 text-sm font-semibold leading-6 text-ink/70">
                  <p><strong className="text-ink">Instagram:</strong> {post.social.instagramCaption}</p>
                  <p><strong className="text-ink">Reddit:</strong> {post.social.redditPost}</p>
                  <p><strong className="text-ink">YouTube Shorts:</strong> {post.social.youtubeShortsDescription}</p>
                </div>
              </div>
            </Card>

            {relatedPosts.length > 0 ? (
              <section className="mt-10">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em]">Related Watch Desk articles</h2>
                  <Link href="/watch-desk" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-royal">
                    View all <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  {relatedPosts.map((relatedPost) => (
                    <WatchDeskCard key={relatedPost.slug} post={relatedPost} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Card>
              <CardLabel>Share this article</CardLabel>
              <ShareButtons title={post.title} path={`/watch-desk/${post.slug}`} summary={post.summary} />
            </Card>

            <ArticleRating articleType="watch-desk" articleSlug={post.slug} />

            <Card>
              <CardLabel>Author</CardLabel>
              <h2 className="font-display text-2xl font-black uppercase tracking-[-0.03em]">{post.author}</h2>
              <p className="mt-4 leading-7 text-ink/70">
                CWI&apos;s editorial desk documents youth voice, public issues, civic satire, creator-led commentary, and the Cockroach wave with public-interest context and careful labels.
              </p>
              <Link href="/about" className="mt-5 inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-[0.14em] text-royal">
                About CWI <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>

            <Card>
              <CardLabel>Internal links</CardLabel>
              <div className="grid gap-2">
                {[
                  ["Cockroach Watch India", "/"],
                  ["The Watch", "/watch"],
                  ["CWI Watch Desk", "/watch-desk"],
                  ["CWI India Unanswered Files", "/india-unanswered-files"],
                  ["Submit Report", "/submit"],
                  ["Issue Watch", "/issues"],
                  ["Youth Voice", "/youth-voice"],
                  ["CWI Charter", "/charter"]
                ].map(([label, href]) => (
                  <Link key={href} href={href} className="rounded-2xl bg-paper px-4 py-3 text-sm font-black uppercase tracking-[0.1em] text-ink/68 transition hover:bg-skywash hover:text-royal">
                    {label}
                  </Link>
                ))}
              </div>
            </Card>

            <Card>
              <CardLabel>Latest updates</CardLabel>
              <div className="space-y-4">
                {latestPosts.map((latestPost) => (
                  <Link key={latestPost.slug} href={`/watch-desk/${latestPost.slug}`} className="block border-b border-line pb-4 last:border-b-0 last:pb-0">
                    <p className="font-display text-lg font-black uppercase leading-tight tracking-[-0.03em]">{latestPost.title}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-ink/45">{latestPost.category}</p>
                  </Link>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </article>
    </>
  );
}

function buildWatchDiscussionPrompts(post: (typeof posts)[number]) {
  return [
    `Share a source, public statement, creator credit note, or correction that could improve CWI's context on "${post.title}".`,
    "Point out what is verified, what is only reported, and what still needs official clarification.",
    "If this topic is circulating in your feed, explain what people are misunderstanding without posting private data or unverified allegations."
  ];
}

function buildWatchReaderQuestions(post: (typeof posts)[number]) {
  return [
    `What does the CWI Watch Desk clearly know about ${post.title}?`,
    "Which claim in this article needs the strongest source before it is amplified further?",
    "What should Cockroach Watch India follow next: public reaction, creator credit, official response, or correction?",
    "Does this update affect youth voice, public issues, civic satire, or digital rights in a way CWI should archive?"
  ];
}

function formatArticleDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00+05:30`));
}
