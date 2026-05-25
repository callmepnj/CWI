import Link from "next/link";
import { ArrowRight, FileSearch, Sparkles } from "lucide-react";
import { UnansweredFileVisual } from "@/components/UnansweredFileVisual";
import { UnansweredFilesGrid } from "@/components/UnansweredFilesGrid";
import { UnansweredResearchBox } from "@/components/UnansweredResearchBox";
import { UnansweredSourceArchive, type UnansweredSourceRecord } from "@/components/UnansweredSourceArchive";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { unansweredFiles, unansweredFilesKeywords } from "@/data/unanswered-files";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const pagePath = "/india-unanswered-files";
const pageTitle = "CWI India Unanswered Files — Cockroach Watch India";
const pageDescription =
  "CWI India Unanswered Files by Cockroach Watch India documents public issues, civic memory, source-backed questions, and unresolved stories from across India.";

export const metadata = createMetadata({
  title: pageTitle,
  description: pageDescription,
  path: pagePath,
  keywords: [
    ...unansweredFilesKeywords,
    "Manipur violence",
    "Ladakh statehood",
    "Joshimath subsidence",
    "Great Nicobar project",
    "NEET paper leak",
    "Electoral Bonds",
    "bulldozer justice"
  ]
});

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: pageTitle,
  url: absoluteUrl(pagePath),
  description: pageDescription,
  publisher: {
    "@type": "Organization",
    name: site.name,
    url: site.url
  },
  hasPart: unansweredFiles.map((file) => ({
    "@type": "Article",
    headline: file.title,
    url: absoluteUrl(`${pagePath}/${file.slug}`),
    articleSection: file.category,
    keywords: file.keywords.join(", ")
  }))
};

const sourceRecords = unansweredFiles.flatMap((file) =>
  file.sources.map<UnansweredSourceRecord>((source, index) => ({
    id: `${file.slug}-${index}`,
    fileTitle: file.title,
    fileSlug: file.slug,
    fileCategory: file.category,
    fileStatus: file.status,
    source
  }))
);

const featuredFiles = unansweredFiles.slice(0, 3);
const overviewTimeline = [
  { year: "2020-2021", title: "Justice-delay files", cases: ["Delhi riots/UAPA", "Hathras", "Lakhimpur Kheri"] },
  { year: "2022-2023", title: "Ecology and displacement files", cases: ["Joshimath", "Vizhinjam", "Manipur", "Hasdeo"] },
  { year: "2024", title: "Transparency and institutional files", cases: ["Electoral Bonds", "NEET", "Bulldozer justice", "Wayanad"] },
  { year: "2025-2026", title: "Federalism, unrest, and unresolved return", cases: ["Ladakh", "Jammu and Kashmir", "Manipur follow-up", "Lakhimpur trial delay"] }
];

export default function UnansweredFilesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />

      <main className="bg-paper text-ink">
        <section className="relative isolate overflow-hidden bg-ink px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_18%,rgba(11,92,255,0.42),transparent_28rem),radial-gradient(circle_at_78%_5%,rgba(255,210,63,0.20),transparent_26rem),linear-gradient(135deg,#050816,#071123_60%,#0b1220)]" />
          <div className="absolute inset-0 -z-10 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center">
            <div>
              <Link
                href="/watch"
                className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-saffron transition hover:border-saffron/60"
              >
                CWI Investigative Watch / Public-interest archive
              </Link>
              <h1 className="mt-7 max-w-5xl font-display text-5xl font-black uppercase leading-[0.88] tracking-[-0.07em] sm:text-7xl lg:text-8xl">
                CWI India Unanswered Files
              </h1>
              <p className="mt-6 max-w-3xl text-xl font-semibold leading-9 text-white/76">
                India Unanswered Files is a Cockroach Watch India archive tracking public issues, civic memory, and the questions that still need answers.
              </p>
              <p className="mt-6 max-w-3xl border-l-4 border-urgent pl-5 text-lg leading-8 text-white/70">
                This CWI section covers public-interest cases where action, accountability, rehabilitation, or transparency appeared delayed, weak, incomplete, or politically selective. The record is source-backed, not propaganda.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="saffron">
                  <Link href="#cases">Explore Cases</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 bg-white/[0.08] text-white hover:bg-white/[0.14]">
                  <Link href="#timeline">View Timeline</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 bg-white/[0.08] text-white hover:bg-white/[0.14]">
                  <Link href="#sources">Check Sources</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 bg-white/[0.08] text-white hover:bg-white/[0.14]">
                  <Link href="#ai">Ask CWI AI</Link>
                </Button>
              </div>
              <div className="mt-8 grid gap-3 text-sm font-semibold leading-7 text-white/70 sm:grid-cols-3">
                {["Verified facts first", "Government response shown separately", "Ground reality compared carefully"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {featuredFiles.map((file, index) => (
                <div key={file.slug} className={index === 0 ? "lg:ml-0" : index === 1 ? "lg:ml-12" : "lg:ml-24"}>
                  <UnansweredFileVisual file={file} priority={index === 0} className="border-white/15 shadow-[0_24px_90px_rgba(0,0,0,0.35)]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-9 max-w-4xl">
            <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.24em] text-royal">Case grid</p>
            <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-ink sm:text-5xl">
              Investigations CWI is tracking
            </h2>
            <p className="mt-5 text-lg leading-8 text-ink/70">
              Each case file separates verified facts, official responses, court/legal status, human cost, media framing, and unanswered questions. No whole community is blamed. No party is treated as automatically guilty or automatically clean.
            </p>
          </div>
          <UnansweredFilesGrid files={unansweredFiles} />
        </section>

        <section id="timeline" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-9 max-w-4xl">
            <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.24em] text-royal">Timeline view</p>
            <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-ink sm:text-5xl">
              A public memory timeline
            </h2>
            <p className="mt-5 text-lg leading-8 text-ink/70">
              These are not isolated headlines. They are recurring tests of due process, rehabilitation, federalism, transparency, ecology, and citizen trust.
            </p>
          </div>
          <div className="relative rounded-[2rem] border border-line bg-white p-5 shadow-card sm:p-8">
            <div className="absolute left-8 top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-urgent via-royal to-saffron md:block" />
            <div className="grid gap-5">
              {overviewTimeline.map((item) => (
                <div key={item.year} className="relative rounded-[1.5rem] border border-line bg-paper p-5 md:ml-12">
                  <div className="absolute -left-[3.2rem] top-7 hidden h-6 w-6 rounded-full border border-royal/35 bg-white shadow-[0_0_24px_rgba(11,92,255,0.26)] md:block" />
                  <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-royal">{item.year}</p>
                  <h3 className="mt-3 font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">{item.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.cases.map((caseName) => (
                      <span key={caseName} className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-ink/58 ring-1 ring-line">
                        {caseName}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-9 max-w-4xl">
            <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.24em] text-royal">Source archive</p>
            <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-ink sm:text-5xl">
              Search the evidence trail
            </h2>
            <p className="mt-5 text-lg leading-8 text-ink/70">
              CWI shows sources visibly so readers can check the record themselves. The archive includes independent reporting, court/legal records, official responses, human-rights reports, and explainers.
            </p>
          </div>
          <UnansweredSourceArchive records={sourceRecords} />
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-9 max-w-4xl">
            <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.24em] text-royal">CWI AI research</p>
            <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-ink sm:text-5xl">
              Ask only from verified sources
            </h2>
            <p className="mt-5 text-lg leading-8 text-ink/70">
              This is a source-bound research interface. It does not generate free-form accusations. It answers only from the case file selected.
            </p>
          </div>
          <UnansweredResearchBox files={unansweredFiles} />
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24">
          <Card className="bg-gradient-to-br from-ink via-[#102a63] to-royal text-white before:from-urgent before:via-saffron before:to-royal">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div>
                <CardLabel className="bg-white/12 text-saffron ring-white/15">Final message</CardLabel>
                <div className="space-y-4 font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] sm:text-5xl">
                  <p>We are not against a party. We are against silence.</p>
                  <p>We are not here to create hate. We are here to ask questions.</p>
                  <p>If citizens suffer, journalism must not sleep.</p>
                </div>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5">
                <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-saffron">
                  Submit evidence
                </p>
                <p className="mt-4 text-sm font-semibold leading-7 text-white/72">
                  Have a source, correction, court record, public report, or creator-credit request? Send it to CWI for review.
                </p>
                <Button asChild className="mt-5" variant="saffron">
                  <Link href="/submit">
                    Submit to CWI <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-16 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            ["Document", "We collect public records, timelines, official responses, independent reporting, and human-impact details."],
            ["Verify", "We separate confirmed records, reported claims, legal status, official statements, and unanswered questions."],
            ["Amplify", "We publish responsibly with source labels, editorial caution, correction paths, and public-interest context."]
          ].map(([title, copy]) => (
            <Card key={title}>
              <Sparkles className="h-5 w-5 text-royal" />
              <h2 className="mt-4 font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">{title}</h2>
              <p className="mt-3 leading-7 text-ink/70">{copy}</p>
            </Card>
          ))}
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <Link
            href="/watch"
            className="group flex flex-col gap-4 rounded-[2rem] border border-line bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-royal/35 hover:shadow-soft sm:flex-row sm:items-center sm:justify-between"
          >
            <span>
              <span className="block font-mono text-xs font-black uppercase tracking-[0.18em] text-royal">
                Back to The Watch
              </span>
              <span className="mt-2 block text-base font-semibold leading-7 text-ink/70">
                Follow CWI&apos;s live hub for public advisories, source-backed articles, creator credit requests, and civic updates.
              </span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition group-hover:bg-royal">
              Open Watch <FileSearch className="h-4 w-4" />
            </span>
          </Link>
        </section>
      </main>
    </>
  );
}
