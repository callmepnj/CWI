import type { Metadata } from "next";
import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, FileText, MapPin, ShieldCheck } from "lucide-react";
import { CwiButtonLink, CwiMasthead, CwiPageShell, CwiSectionHeader, CwiSourceChip, CwiStatusBadge, CwiSubmitCTA, CwiTimeline } from "@/components/CwiDesignSystem";
import { PageBackgroundGesture } from "@/components/PageBackgroundGesture";
import { UnansweredArticleActions } from "@/components/UnansweredArticleActions";
import { UnansweredComments } from "@/components/UnansweredComments";
import { getLiveUpdates } from "@/data/live-newsroom";
import { getFileFaqs, getUnansweredFile, unansweredFiles } from "@/data/unanswered-files";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

const pagePath = "/india-unanswered-files";
const lastUpdated = "2026-05-24T00:00:00+05:30";

export function generateStaticParams() {
  return unansweredFiles.map((file) => ({ slug: file.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const file = getUnansweredFile(slug);

  if (!file) {
    return createMetadata({ title: "India Unanswered Files - Cockroach Watch India", description: site.description, path: pagePath });
  }

  return createMetadata({
    title: file.seoTitle,
    description: file.seoDescription,
    path: `${pagePath}/${file.slug}`,
    type: "article",
    publishedTime: lastUpdated,
    modifiedTime: lastUpdated,
    keywords: file.keywords,
    image: { url: file.ogImage || "/opengraph-image", alt: file.altText }
  });
}

export default async function UnansweredFilePage({ params }: Props) {
  const { slug } = await params;
  const file = getUnansweredFile(slug);
  if (!file) notFound();

  const relatedUpdates = getLiveUpdates(3);
  const faqs = getFileFaqs(file);
  const relatedFiles = unansweredFiles.filter((item) => item.slug !== file.slug && item.category === file.category).slice(0, 3);
  const jsonLd = [buildJsonLd(file), buildFaqJsonLd(faqs)];

  return (
    <>
      {jsonLd.map((item) => <script key={item["@type"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />)}
      <PageBackgroundGesture intensity="subtle">
        <CwiPageShell>
        <div className="mb-5 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.12em] text-cwi-brown/70">
          <Link href="/" className="hover:text-cwi-green">Home</Link>
          <span>/</span>
          <Link href={pagePath} className="hover:text-cwi-green">India Unanswered Files</Link>
          <span>/</span>
          <span>{file.category}</span>
        </div>

        <CwiMasthead
          label="File open"
          title={file.title}
          subtitle={file.unansweredQuestion || file.summary}
          body={file.summary}
          primaryCta={{ href: "#sources", label: "Check sources" }}
          secondaryCta={{ href: "/submit", label: "Send source or correction" }}
          meta={[file.status, file.category, `${file.sourceCount} sources`, `Last updated ${formatDate(lastUpdated)}`]}
        />

        <article className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <section className="overflow-hidden rounded-lg border border-cwi-brown/18 bg-white/78 shadow-[0_16px_44px_rgba(29,18,10,0.08)]">
              <div className="relative min-h-72 bg-cwi-green/10">
                {file.heroImage ? (
                  <Image src={file.heroImage} alt={file.altText || file.title} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover" priority />
                ) : (
                  <div className="grid min-h-72 place-items-center bg-cwi-cream"><FileText className="h-14 w-14 text-cwi-green" /></div>
                )}
              </div>
              <div className="grid gap-4 border-t border-cwi-brown/14 p-5 text-sm font-bold text-cwi-ink/70 sm:grid-cols-4">
                <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-cwi-green" /> {file.year}</span>
                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-cwi-green" /> {file.location}</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cwi-green" /> {file.status}</span>
                <span className="inline-flex items-center gap-2"><FileText className="h-4 w-4 text-cwi-green" /> {file.sourceCount} sources</span>
              </div>
            </section>

            <section className="rounded-lg border border-cwi-brown/18 bg-white/78 p-5 shadow-sm sm:p-6">
              <CwiSectionHeader eyebrow="Reader actions" title="Save, share, or follow this file" subtitle="These controls use CWI's existing public metrics system. No supporter or donation numbers are shown here." />
              <UnansweredArticleActions slug={file.slug} title={file.title} summary={file.summary} path={`${pagePath}/${file.slug}`} trackView />
            </section>
            <FileSection title="Short answer">
              <p>{file.title} is tracked because available public records show unresolved questions around responsibility, public harm, official response, or accountability.</p>
            </FileSection>

            <FileSection title="Background">
              <p>{file.summary}</p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <MiniFact label="People affected" value={file.peopleAffected} />
                <MiniFact label="Main issue" value={file.mainIssue} />
                <MiniFact label="Ground reality" value={file.groundReality} />
                <MiniFact label="Official response" value={file.governmentResponse} />
              </div>
            </FileSection>

            <section>
              <CwiSectionHeader eyebrow="Timeline" title="How the file developed" />
              <CwiTimeline items={file.timeline.slice(0, 8).map((item) => ({ time: item.date, title: item.title, body: item.summary, badge: "File updated", meta: `Sources ${item.sourceIndex.map((index) => index + 1).join(", ")}` }))} />
            </section>

            <FileSection title="What CWI knows">
              <div className="space-y-5">
                {file.sections.slice(0, 3).map((section) => (
                  <div key={section.heading}>
                    <h3 className="font-display text-2xl font-black uppercase leading-tight text-cwi-ink">{section.heading}</h3>
                    <p className="mt-3">{section.body}</p>
                  </div>
                ))}
              </div>
            </FileSection>

            <FileSection title="What remains unanswered">
              <div className="grid gap-3 md:grid-cols-2">
                {file.unansweredQuestions.map((question) => <p key={question} className="rounded-lg border border-cwi-brown/14 bg-cwi-cream p-4 font-bold leading-7 text-cwi-ink/72">{question}</p>)}
              </div>
            </FileSection>

            <FileSection title="Legal/current status if available">
              <p>{file.sections.find((section) => /court|legal|status/i.test(section.heading))?.body ?? "CWI separates legal status from public reaction. If a stronger court/legal source is available, send it through the correction desk."}</p>
            </FileSection>

            <FileSection title="Official response if available">
              <p>{file.governmentResponse}</p>
            </FileSection>

            <FileSection title="Why it matters">
              <p>{file.mainIssue}. The open question is: {file.unansweredQuestion}</p>
            </FileSection>

            <section id="sources" className="rounded-lg border border-cwi-brown/18 bg-white/78 p-5 sm:p-6">
              <CwiSectionHeader eyebrow="Sources and further reading" title="Source trail" subtitle="Each source is listed with what it supports. Sources do not prove more than their own record shows." />
              <div className="grid gap-4">
                {file.sources.map((source, index) => (
                  <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="rounded-lg border border-cwi-brown/14 bg-cwi-cream p-4 transition hover:border-cwi-green/35">
                    <div className="flex flex-wrap gap-2"><CwiSourceChip>Source {index + 1}</CwiSourceChip><CwiSourceChip>{source.type}</CwiSourceChip></div>
                    <h3 className="mt-3 font-display text-xl font-black uppercase leading-tight text-cwi-ink">{source.name}</h3>
                    <p className="mt-2 text-sm font-bold text-cwi-green">{source.publisher}</p>
                    <p className="mt-3 leading-7 text-cwi-ink/68">{source.note}</p>
                  </a>
                ))}
              </div>
            </section>

            <FileSection title="CWI note">
              <p>CWI does not treat this file as a legal finding. The record should be read as public-interest tracking with source limits, open questions, and correction paths visible.</p>
            </FileSection>

            <section>
              <CwiSectionHeader eyebrow="Related Live Newsroom updates" title="Current updates" />
              <div className="grid gap-5 md:grid-cols-3">
                {relatedUpdates.map((item) => (
                  <Link key={item.id} href={`/live-newsroom/${item.slug}`} className="rounded-lg border border-cwi-brown/18 bg-white/78 p-5 transition hover:border-cwi-green/35">
                    <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-cwi-green">{item.status}</p>
                    <h3 className="mt-3 font-display text-xl font-black uppercase leading-tight text-cwi-ink">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-cwi-ink/68">{item.summary}</p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-cwi-brown/18 bg-white/78 p-5 shadow-sm sm:p-6">
              <CwiSectionHeader eyebrow="Public comments" title="Comments are moderated" subtitle="Do not post private data, threats, hate, or unsupported allegations as fact." />
              <UnansweredComments articleSlug={file.slug} />
            </section>
            <CwiSubmitCTA />
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-lg border border-cwi-brown/18 bg-white/78 p-5 shadow-sm">
              <CwiStatusBadge tone="saffron">File open</CwiStatusBadge>
              <h2 className="mt-4 font-display text-2xl font-black uppercase leading-tight text-cwi-ink">Newsroom record</h2>
              <div className="mt-4 grid gap-2 text-sm font-bold text-cwi-ink/70">
                <span>Category: {file.category}</span>
                <span>Status: {file.status}</span>
                <span>Location: {file.location}</span>
                <span>Source count: {file.sourceCount}</span>
                <span>Last updated: {formatDate(lastUpdated)}</span>
              </div>
              <CwiButtonLink href="/submit" variant="secondary" className="mt-5 w-full">Send correction</CwiButtonLink>
            </div>

            {relatedFiles.length ? (
              <div className="rounded-lg border border-cwi-brown/18 bg-white/78 p-5 shadow-sm">
                <h2 className="font-display text-2xl font-black uppercase leading-tight text-cwi-ink">Related files</h2>
                <div className="mt-4 grid gap-3">
                  {relatedFiles.map((item) => <Link key={item.slug} href={`${pagePath}/${item.slug}`} className="rounded-lg border border-cwi-brown/14 bg-cwi-cream p-4 font-bold text-cwi-ink hover:text-cwi-green">{item.title}</Link>)}
                </div>
              </div>
            ) : null}
          </aside>
        </article>
      </CwiPageShell>
      </PageBackgroundGesture>
    </>
  );
}
function FileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-cwi-brown/18 bg-white/78 p-5 leading-8 text-cwi-ink/72 shadow-sm sm:p-6">
      <h2 className="font-display text-3xl font-black uppercase leading-tight text-cwi-ink">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-cwi-brown/14 bg-cwi-cream p-4">
      <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-cwi-green">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-cwi-ink/68">{value}</p>
    </div>
  );
}

function buildJsonLd(file: NonNullable<ReturnType<typeof getUnansweredFile>>) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: file.title,
    description: file.summary,
    url: absoluteUrl(`${pagePath}/${file.slug}`),
    datePublished: lastUpdated,
    dateModified: lastUpdated,
    articleSection: file.category,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "NewsMediaOrganization", name: site.name, url: site.url },
    image: absoluteUrl(file.ogImage || "/opengraph-image"),
    mainEntityOfPage: absoluteUrl(`${pagePath}/${file.slug}`)
  };
}


function buildFaqJsonLd(faqs: ReturnType<typeof getFileFaqs>) {
  return {
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
  };
}
function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}