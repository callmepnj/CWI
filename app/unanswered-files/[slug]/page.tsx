import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, ExternalLink, FileText, Scale, ShieldCheck } from "lucide-react";
import { ArticleProgress } from "@/components/ArticleProgress";
import { UnansweredArticleActions } from "@/components/UnansweredArticleActions";
import { UnansweredComments } from "@/components/UnansweredComments";
import { UnansweredFileVisual } from "@/components/UnansweredFileVisual";
import { UnansweredResearchBox } from "@/components/UnansweredResearchBox";
import { UnansweredSourceArchive, type UnansweredSourceRecord } from "@/components/UnansweredSourceArchive";
import { UnansweredStatusBadge } from "@/components/UnansweredStatusBadge";
import { UnansweredTimeline } from "@/components/UnansweredTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import {
  getFileSources,
  getFileVisual,
  getFileFaqs,
  getInlineVisuals,
  getOgVisual,
  getUnansweredFile,
  unansweredFiles
} from "@/data/unanswered-files";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

const articleDisclaimer =
  "Cockroach Watch India is an independent civic watch, satire, and commentary platform. This article discusses publicly available reports, official statements, social media trends, and public reactions. Claims are presented with attribution wherever possible and should not be treated as legal findings or official declarations unless clearly stated.";
const unansweredFilesPath = "/indias-unanswered-files";

export async function generateStaticParams() {
  return unansweredFiles.map((file) => ({ slug: file.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const file = getUnansweredFile(slug);

  if (!file) {
    return createMetadata({
      title: "India's Unanswered Files - Cockroach Watch India",
      description: site.description,
      path: unansweredFilesPath
    });
  }

  const visual = getOgVisual(file);
  const baseMetadata = createMetadata({
    title: file.seoTitle,
    description: file.seoDescription,
    path: `${unansweredFilesPath}/${file.slug}`,
    type: "article",
    publishedTime: "2026-05-24T00:00:00+05:30",
    keywords: file.keywords
  });

  return {
    ...baseMetadata,
    openGraph: {
      title: file.seoTitle,
      description: file.seoDescription,
      url: absoluteUrl(`${unansweredFilesPath}/${file.slug}`),
      siteName: site.name,
      images: [
        {
          url: absoluteUrl(visual.src),
          width: 1200,
          height: 750,
          alt: visual.alt
        }
      ],
      locale: "en_IN",
      type: "article",
      publishedTime: "2026-05-24T00:00:00+05:30"
    },
    twitter: {
      card: "summary_large_image",
      title: file.seoTitle,
      description: file.seoDescription,
      images: [absoluteUrl(visual.src)],
      creator: "@CWatchIndia",
      site: "@CWatchIndia"
    }
  };
}

export default async function UnansweredFilePage({ params }: Props) {
  const { slug } = await params;
  const file = getUnansweredFile(slug);

  if (!file) {
    notFound();
  }

  const sourceRecords = file.sources.map<UnansweredSourceRecord>((source, index) => ({
    id: `${file.slug}-${index}`,
    fileTitle: file.title,
    fileSlug: file.slug,
    fileCategory: file.category,
    fileStatus: file.status,
    source
  }));
  const relatedFiles = unansweredFiles
    .filter((item) => item.slug !== file.slug)
    .sort((first, second) => Number(second.category === file.category) - Number(first.category === file.category))
    .slice(0, 3);
  const ogVisual = getOgVisual(file);
  const inlineVisuals = getInlineVisuals(file);
  const faqs = getFileFaqs(file);
  const inlineVisualByHeading = new Map(
    ["What happened?", "Human cost", "Political accountability", "Government response", "Media silence/bias"].map((heading, index) => [
      heading,
      inlineVisuals[index]
    ])
  );
  const pageUrl = absoluteUrl(`${unansweredFilesPath}/${file.slug}`);
  const jsonLd = buildJsonLd(file, ogVisual.src, pageUrl, faqs);

  return (
    <>
      <ArticleProgress />
      {jsonLd.map((item) => (
        <script key={`${item["@type"]}-${file.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}

      <article className="bg-paper text-ink">
        <section className="relative isolate overflow-hidden bg-ink px-4 py-12 text-white sm:px-6 lg:px-8 lg:py-20">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_15%,rgba(11,92,255,0.42),transparent_28rem),radial-gradient(circle_at_80%_12%,rgba(255,210,63,0.18),transparent_24rem),linear-gradient(135deg,#050816,#071123_58%,#0b1220)]" />
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center">
            <div>
              <div className="mb-6 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.12em] text-white/58">
                <Link href="/" className="hover:text-saffron">Home</Link>
                <span>/</span>
                <Link href={unansweredFilesPath} className="hover:text-saffron">India&apos;s Unanswered Files</Link>
                <span>/</span>
                <span>{file.category}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <UnansweredStatusBadge status={file.status} className="ring-white/15" />
                <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-white/76 ring-1 ring-white/15">
                  {file.category}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-white/76 ring-1 ring-white/15">
                  {file.sourceCount} sources
                </span>
              </div>

              <h1 className="mt-6 max-w-5xl font-display text-5xl font-black uppercase leading-[0.9] tracking-[-0.06em] sm:text-7xl">
                {file.title}
              </h1>
              <p className="mt-6 max-w-3xl text-xl font-semibold leading-9 text-white/76">{file.summary}</p>

              <div className="mt-7 grid gap-3 border-y border-white/10 py-5 text-sm font-bold uppercase tracking-[0.08em] text-white/58 sm:grid-cols-3">
                <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-saffron" /> {file.year}</span>
                <span className="inline-flex items-center gap-2"><FileText className="h-4 w-4 text-saffron" /> {file.location}</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-saffron" /> {file.status}</span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild variant="saffron">
                  <Link href="#timeline">View Timeline</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 bg-white/[0.08] text-white hover:bg-white/[0.14]">
                  <Link href="#sources">Check Sources</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 bg-white/[0.08] text-white hover:bg-white/[0.14]">
                  <Link href="#ai">Ask CWI AI</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 bg-white/[0.08] text-white hover:bg-white/[0.14]">
                  <Link href="/submit">Submit correction</Link>
                </Button>
              </div>
              <div className="mt-7 rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-4">
                <p className="mb-3 font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-saffron">
                  Like / Save / Share this investigation
                </p>
                <UnansweredArticleActions
                  slug={file.slug}
                  title={file.title}
                  summary={file.summary}
                  path={`${unansweredFilesPath}/${file.slug}`}
                  compact
                  trackView
                />
              </div>
            </div>

            <UnansweredFileVisual file={file} priority showCaption className="border-white/15 shadow-[0_24px_90px_rgba(0,0,0,0.35)]" />
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:px-8 lg:py-16">
          <div className="space-y-10">
            <Card>
              <CardLabel>Short answer</CardLabel>
              <p className="text-xl font-semibold leading-9 text-ink/74">
                {file.title} is a CWI public-interest case file because the available record shows citizen harm, official response, and unresolved questions that require sustained public scrutiny.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <MiniFact label="People affected" value={file.peopleAffected} />
                <MiniFact label="Main issue" value={file.mainIssue} />
                <MiniFact label="Government response" value={file.governmentResponse} />
                <MiniFact label="Ground reality" value={file.groundReality} />
              </div>
            </Card>

            <section className="rounded-[2rem] border border-line bg-white p-6 shadow-card sm:p-8">
              <div className="space-y-10">
                {file.sections.map((section) => (
                  <section key={section.heading}>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-3xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
                        {section.heading}
                      </h2>
                      <SourcePills file={file} indexes={section.sourceIndex} />
                    </div>
                    <p className="mt-4 text-lg leading-9 text-ink/74">{section.body}</p>
                    {inlineVisualByHeading.get(section.heading) ? (
                      <div className="mt-6">
                        <UnansweredFileVisual
                          file={file}
                          visual={inlineVisualByHeading.get(section.heading)}
                          showCaption
                          imageClassName="transition duration-500 hover:scale-[1.02]"
                        />
                      </div>
                    ) : null}
                  </section>
                ))}
              </div>
            </section>

            <section id="timeline">
              <div className="mb-6 max-w-3xl">
                <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.2em] text-royal">Timeline</p>
                <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-ink">
                  How the file developed
                </h2>
              </div>
              <UnansweredTimeline file={file} />
            </section>

            <Card>
              <CardLabel>Unanswered questions</CardLabel>
              <div className="grid gap-3 md:grid-cols-2">
                {file.unansweredQuestions.map((question) => (
                  <div key={question} className="rounded-2xl border border-line bg-paper p-4 text-sm font-bold leading-7 text-ink/70">
                    {question}
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardLabel>FAQ</CardLabel>
              <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">
                Frequently asked questions
              </h2>
              <div className="mt-5 grid gap-3">
                {faqs.map((faq) => (
                  <details key={faq.question} className="rounded-2xl border border-line bg-paper p-4">
                    <summary className="cursor-pointer font-black uppercase tracking-[0.05em] text-ink">
                      {faq.question}
                    </summary>
                    <p className="mt-3 leading-7 text-ink/70">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </Card>

            <section>
              <div className="mb-6 max-w-3xl">
                <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.2em] text-royal">Source archive</p>
                <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-ink">
                  Evidence trail
                </h2>
              </div>
              <UnansweredSourceArchive records={sourceRecords} />
            </section>

            <section>
              <div className="mb-6 max-w-3xl">
                <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.2em] text-royal">CWI AI explainer</p>
                <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-ink">
                  Ask only from this file
                </h2>
              </div>
              <UnansweredResearchBox files={[file]} initialSlug={file.slug} />
            </section>

            <Card>
              <CardLabel>CWI editorial note</CardLabel>
              <p className="leading-8 text-ink/72">
                CWI is not against a community or party. CWI is against silence, delayed transparency, and public suffering without sustained accountability. This file uses source labels and cautious language because public-interest journalism should question power without inventing facts.
              </p>
              <p className="mt-4 leading-8 text-ink/72">{articleDisclaimer}</p>
            </Card>

            <UnansweredComments articleSlug={file.slug} />

            <section>
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em]">Related Unanswered Files</h2>
                <Link href={unansweredFilesPath} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-royal">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedFiles.map((relatedFile) => (
                  <Link
                    key={relatedFile.slug}
                    href={`${unansweredFilesPath}/${relatedFile.slug}`}
                    className="group overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-card transition hover:-translate-y-1 hover:border-royal/30 hover:shadow-soft"
                  >
                    <UnansweredFileVisual file={relatedFile} imageClassName="transition duration-500 group-hover:scale-[1.03]" />
                    <div className="p-5">
                      <UnansweredStatusBadge status={relatedFile.status} />
                      <h3 className="mt-4 font-display text-xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">
                        {relatedFile.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-ink/68">{relatedFile.unansweredQuestion}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Card>
              <CardLabel>Reader actions</CardLabel>
              <UnansweredArticleActions
                slug={file.slug}
                title={file.title}
                summary={file.summary}
                path={`${unansweredFilesPath}/${file.slug}`}
              />
            </Card>

            <Card>
              <CardLabel>Case status</CardLabel>
              <div className="space-y-4">
                <MiniFact label="Location" value={file.location} />
                <MiniFact label="Period" value={file.year} />
                <MiniFact label="Category" value={file.category} />
                <MiniFact label="Source count" value={`${file.sourceCount} visible sources`} />
              </div>
            </Card>

            <Card>
              <CardLabel>Political accountability</CardLabel>
              <Scale className="h-5 w-5 text-royal" />
              <p className="mt-4 leading-7 text-ink/70">
                CWI shows the government response separately, then compares it with ground reality, court status, and unanswered public-interest questions.
              </p>
            </Card>

            <Card>
              <CardLabel>Internal links</CardLabel>
              <div className="grid gap-2">
                {[
                  ["India's Unanswered Files", unansweredFilesPath],
                  ["The Watch", "/watch"],
                  ["Watch Desk", "/watch-desk"],
                  ["Submit Report", "/submit"],
                  ["Issue Watch", "/issues"],
                  ["Contact CWI", "/contact"]
                ].map(([label, href]) => (
                  <Link key={href} href={href} className="rounded-2xl bg-paper px-4 py-3 text-sm font-black uppercase tracking-[0.1em] text-ink/68 transition hover:bg-skywash hover:text-royal">
                    {label}
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

function buildJsonLd(
  file: NonNullable<ReturnType<typeof getUnansweredFile>>,
  imagePath: string,
  pageUrl: string,
  faqs: ReturnType<typeof getFileFaqs>
) {
  const articleBase = {
    headline: file.title,
    description: file.seoDescription,
    image: [
      {
        "@type": "ImageObject",
        url: absoluteUrl(imagePath),
        caption: getFileVisual(file).caption
      }
    ],
    datePublished: "2026-05-24T00:00:00+05:30",
    dateModified: "2026-05-24T00:00:00+05:30",
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
    articleSection: file.category,
    keywords: file.keywords.join(", "),
    citation: file.sources.map((source) => source.url),
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
          name: "India's Unanswered Files",
          item: absoluteUrl(unansweredFilesPath)
        },
        {
          "@type": "ListItem",
          position: 3,
          name: file.title,
          item: pageUrl
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer
        }
      }))
    }
  ];
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-4">
      <p className="font-mono text-[0.66rem] font-black uppercase tracking-[0.16em] text-royal">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-7 text-ink/70">{value}</p>
    </div>
  );
}

function SourcePills({ file, indexes }: { file: NonNullable<ReturnType<typeof getUnansweredFile>>; indexes: number[] }) {
  const sources = getFileSources(file, indexes);

  if (!sources.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {sources.map((source) => (
        <a
          key={source.url}
          href={source.url}
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
