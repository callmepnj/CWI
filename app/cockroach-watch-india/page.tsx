import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const publishedDate = "2026-05-27";
const modifiedDate = "2026-05-27";
const pagePath = "/cockroach-watch-india";
const pageUrl = absoluteUrl(pagePath);
const logoUrl = absoluteUrl("/brand/logo.png");
const imageUrl = absoluteUrl("/brand/banner.png");

const searchTerms = [
  ["Cockroach Watch India", "Spaced brand name"],
  ["CockroachWatchIndia", "Unspaced brand/handle-style name"],
  ["CWI", "Short form"],
  ["@CockroachWatchIndia", "Social handle / brand handle"]
] as const;

const coverageAreas = [
  "Public-interest updates",
  "Youth voice",
  "Civic satire",
  "Indian internet culture",
  "Source-backed explainers",
  "Creator credit and archive trails",
  "Reader-submitted civic stories",
  "Public memory and issue tracking",
  "Commentary on trending public issues",
  "Fact-checking before amplification where possible"
];

const whatCwiIsNot = [
  "Not a government body",
  "Not an emergency service",
  "Not a court or police authority",
  "Not a political party unless officially declared",
  "Not a place to publish private personal data",
  "Not a platform for threats, hate speech or unverified allegations",
  "Not a replacement for official legal, police, medical or government channels"
];

const searchIntent = [
  "latest CWI news",
  "CockroachWatchIndia updates",
  "civic satire posts",
  "youth voice articles",
  "source-backed explainers",
  "public issue archives",
  "official website link",
  "social handle",
  "news articles published by CWI"
];

const faqItems = [
  {
    question: "What is Cockroach Watch India?",
    answer:
      "Cockroach Watch India is an independent civic watch, satire, commentary and public-memory platform focused on public issues, youth voice, source-backed updates and reader-submitted leads where verified."
  },
  {
    question: "Is Cockroach Watch India the same as CockroachWatchIndia?",
    answer:
      "Yes. Cockroach Watch India and CockroachWatchIndia refer to the same CWI platform. One version uses spaces and the other is an unspaced brand or handle-style version."
  },
  {
    question: "What does CWI mean?",
    answer:
      "CWI is the short form of Cockroach Watch India. Readers may see the platform written as Cockroach Watch India, CockroachWatchIndia, CWI or @CockroachWatchIndia."
  },
  {
    question: "Why does \"cockroachwatchindia\" show results but \"cockroach watch india\" may not?",
    answer:
      "Google can read the unspaced query as a unique brand word, while the spaced query can be mixed with unrelated results for cockroaches, watches, India news or satire topics. Clear entity pages help connect both versions."
  },
  {
    question: "Is Cockroach Watch India an official government platform?",
    answer:
      "No. Cockroach Watch India is not a government platform, police authority, court, emergency service or official legal body."
  },
  {
    question: "What type of news does Cockroach Watch India publish?",
    answer:
      "CWI publishes source-backed public-interest updates, civic commentary, satire/context posts, youth voice coverage, archive material, creator-credit notes, public advisories and India Unanswered Files coverage."
  },
  {
    question: "How can I find the official Cockroach Watch India website?",
    answer: `The official website is ${site.url}. Readers can also use this page, the About page and the Latest updates page to confirm the CWI platform identity.`
  },
  {
    question: "Can readers submit updates to Cockroach Watch India?",
    answer:
      "Yes. Readers can submit public-interest links, sources, corrections, creator-credit requests and civic leads through the Submit Report page. CWI should verify submissions before publishing them as fact."
  },
  {
    question: "Is @CockroachWatchIndia connected to Cockroach Watch India?",
    answer:
      "@CockroachWatchIndia is used as a brand-handle style reference for the same platform identity. Always check the official website and linked social profiles before trusting a lookalike account."
  }
];

export const metadata = createMetadata({
  title: "Cockroach Watch India: Latest CWI News, Updates and Official Platform Guide",
  description:
    "Cockroach Watch India, also written as CockroachWatchIndia or CWI, is an independent civic watch, satire, commentary and public-memory platform sharing source-backed updates, youth voice and public-interest stories from India.",
  path: pagePath,
  keywords: [
    "Cockroach Watch India",
    "CockroachWatchIndia",
    "cockroach watch india",
    "cockroachwatchindia",
    "CWI",
    "CWI India",
    "Cockroach Watch India news",
    "CockroachWatchIndia news",
    "Cockroach Watch India official",
    "CockroachWatchIndia official",
    "Cockroach Watch India updates",
    "CockroachWatchIndia updates",
    "Cockroach Watch India website",
    "CockroachWatchIndia online",
    "Cockroach Watch India civic watch",
    "@CockroachWatchIndia"
  ],
  type: "article",
  publishedTime: `${publishedDate}T00:00:00+05:30`
});

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: "Cockroach Watch India",
  alternateName: ["CockroachWatchIndia", "CWI", "@CockroachWatchIndia"],
  url: site.url,
  logo: {
    "@type": "ImageObject",
    url: logoUrl
  },
  sameAs: [site.instagram, site.x, site.youtube, site.telegram, site.reddit, site.facebook, site.bluesky]
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: "Cockroach Watch India",
  alternateName: ["CockroachWatchIndia", "CWI", "@CockroachWatchIndia"],
  url: site.url,
  publisher: {
    "@id": `${site.url}/#organization`
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${site.url}/latest?search={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "Cockroach Watch India", item: pageUrl }
  ]
};

const newsArticleJsonLd = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: "Cockroach Watch India: Latest CWI News, Updates and Platform Guide",
  alternativeHeadline: "CockroachWatchIndia, CWI and @CockroachWatchIndia official platform guide",
  description:
    "Cockroach Watch India, also written as CockroachWatchIndia or CWI, is an independent civic watch, satire, commentary and public-memory platform sharing source-backed updates, youth voice and public-interest stories from India.",
  image: [imageUrl],
  datePublished: `${publishedDate}T00:00:00+05:30`,
  dateModified: `${modifiedDate}T00:00:00+05:30`,
  author: {
    "@type": "Organization",
    name: "Cockroach Watch India Editorial Desk",
    url: site.url
  },
  publisher: {
    "@id": `${site.url}/#organization`
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": pageUrl
  },
  articleSection: "CWI Platform Guide",
  keywords:
    "Cockroach Watch India, CockroachWatchIndia, cockroach watch india, cockroachwatchindia, CWI, @CockroachWatchIndia, CWI India, Cockroach Watch India news",
  about: {
    "@type": "Organization",
    name: "Cockroach Watch India",
    alternateName: ["CockroachWatchIndia", "CWI", "@CockroachWatchIndia"],
    url: site.url
  }
};

export default function CockroachWatchIndiaGuidePage() {
  return (
    <main className="bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }} />

      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-skywash px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-royal">
              CWI entity guide
            </p>
            <h1 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-ink sm:text-6xl">
              Cockroach Watch India: Latest CWI News, Updates and Platform Guide
            </h1>
            <p className="mt-6 text-lg font-semibold leading-8 text-ink/74">
              A clear guide for readers searching Cockroach Watch India, CockroachWatchIndia, CWI or @CockroachWatchIndia and trying to find the same independent platform.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/latest">Open Latest CWI Updates</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/about-cockroach-watch-india">About Cockroach Watch India</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-[2rem] border border-line bg-paper p-4 shadow-soft">
            <Image
              src="/brand/banner.png"
              alt="Cockroach Watch India official CWI platform guide banner"
              width={900}
              height={560}
              className="aspect-[16/10] w-full rounded-[1.5rem] object-cover"
              priority
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["Cockroach Watch India", "CockroachWatchIndia", "CWI", "@CockroachWatchIndia"].map((item) => (
                <div key={item} className="rounded-2xl border border-line bg-white p-4 font-black uppercase tracking-[0.08em] text-ink">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-6 text-lg leading-9 text-ink/78">
          <p>
            Cockroach Watch India is becoming searchable under more than one name. Some readers type the spaced brand name, Cockroach Watch India. Others search the unspaced version, CockroachWatchIndia, or simply use CWI. This page is a direct guide for readers looking for CWI updates, news, civic commentary, satire, archives and source-backed public-interest posts from India.
          </p>
          <p className="rounded-3xl border border-royal/15 bg-skywash p-5 font-black text-ink">
            Cockroach Watch India, also written as CockroachWatchIndia, is the same platform as CWI.
          </p>
        </section>

        <SectionBlock title="What is Cockroach Watch India?">
          <p>
            Cockroach Watch India is an independent civic watch, commentary, satire and public-memory platform. It documents youth voice, public issues, civic satire, creator credit trails, source-backed updates and reader-submitted leads where verified.
          </p>
          <p>
            The platform is not presented as an official government source, legal authority, police body or emergency service. It is a public-interest commentary and archive project that should make careful distinctions between verified updates, opinion, satire, developing claims and archived material.
          </p>
          <p>
            CWI is useful for readers who want context around public issues, Indian internet culture, youth-led civic discussion and the record of what is being shared online. The responsible approach is simple: add sources where possible, say what is unknown, correct mistakes, and avoid treating viral claims as confirmed facts without reliable backing.
          </p>
        </SectionBlock>

        <SectionBlock title="Cockroach Watch India and CockroachWatchIndia are the same">
          <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
            <table className="w-full border-collapse text-left text-sm sm:text-base">
              <thead className="bg-ink text-white">
                <tr>
                  <th className="p-4 font-black uppercase tracking-[0.08em]">Search Term</th>
                  <th className="p-4 font-black uppercase tracking-[0.08em]">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {searchTerms.map(([term, meaning]) => (
                  <tr key={term} className="border-t border-line">
                    <td className="p-4 font-black text-ink">{term}</td>
                    <td className="p-4 text-ink/70">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="rounded-3xl border border-saffron/35 bg-[#FFF7D6] p-5 font-black text-ink">
            If you searched for ‘cockroach watch india’ with spaces or ‘cockroachwatchindia’ without spaces, you are looking for the same CWI platform.
          </p>
        </SectionBlock>

        <SectionBlock title="Why Google may show different results for Cockroach Watch India searches">
          <p>
            Google can treat spaced and unspaced searches differently. CockroachWatchIndia looks like a unique brand keyword because all words appear together as one term. Cockroach Watch India looks like three separate words, so Google may also consider unrelated results about cockroaches, watches, India news, videos, satire pages or general civic topics.
          </p>
          <p>
            That does not mean Google is wrong. It means the web needs clearer signals that the spaced brand, the unspaced brand, the short form and the social handle all refer to one entity. A page like this helps connect the names in human-readable text, internal links, image alt text, metadata and structured data.
          </p>
        </SectionBlock>

        <SectionBlock title="What does Cockroach Watch India cover?">
          <ul className="grid gap-3 sm:grid-cols-2">
            {coverageAreas.map((item) => (
              <li key={item} className="rounded-2xl border border-line bg-white p-4 font-semibold text-ink/74">
                {item}
              </li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock title="What Cockroach Watch India is not">
          <p>
            Clear boundaries matter for public trust. CWI should not be used as a shortcut for legal complaints, emergency reporting, harassment, private data exposure or unverified allegations.
          </p>
          <ul className="grid gap-3">
            {whatCwiIsNot.map((item) => (
              <li key={item} className="flex gap-3 rounded-2xl border border-line bg-white p-4 font-semibold text-ink/74">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-royal" />
                {item}
              </li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock title="Why people search for Cockroach Watch India">
          <p>
            Search intent is practical. Many readers want the official website, a recent article, a social handle, a public issue archive, or the latest CWI update they saw mentioned elsewhere.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {searchIntent.map((item) => (
              <span key={item} className="rounded-full border border-line bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-ink/70">
                {item}
              </span>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="Latest Cockroach Watch India updates">
          <p>
            At the time of writing, readers should check the official Cockroach Watch India website and verified social handles for the latest posts, explainers and public-interest updates.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/latest">Latest CWI Updates <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/live-newsroom">CWI Live Newsroom</Link>
            </Button>
          </div>
        </SectionBlock>

        <SectionBlock title="Cockroach Watch India editorial policy">
          <p>
            Responsible publishing requires clear labels. CWI should separate verified news, opinion, satire, public submissions, archived material and developing updates. A reader should be able to see what is known, what remains unclear, which source supports a claim, and where a correction can be submitted.
          </p>
          <p>
            This is especially important when posts involve viral screenshots, public allegations, creator credit, platform restrictions or sensitive civic issues. The safer standard is to use source links, dates, attribution and correction notes rather than dramatic certainty.
          </p>
        </SectionBlock>

        <SectionBlock title="How to follow Cockroach Watch India">
          <p>
            Readers can bookmark the official website, search both Cockroach Watch India and CockroachWatchIndia, and check official social handles linked from the website.
          </p>
          <div className="grid gap-3">
            <LinkRow label="Official website" href={site.url} />
            <LinkRow label="Instagram" href={site.instagram} />
            <LinkRow label="X" href={site.x} />
            <LinkRow label="YouTube" href={site.youtube} />
            <LinkRow label="Telegram" href={site.telegram} />
          </div>
        </SectionBlock>

        <SectionBlock title="Cockroach Watch India FAQ">
          <div className="grid gap-4">
            {faqItems.map((faq) => (
              <details key={faq.question} className="rounded-3xl border border-line bg-white p-5 shadow-card">
                <summary className="cursor-pointer font-display text-xl font-black uppercase tracking-[-0.02em] text-ink">
                  {faq.question}
                </summary>
                <p className="mt-4 leading-8 text-ink/72">{faq.answer}</p>
              </details>
            ))}
          </div>
        </SectionBlock>

        <section className="mt-12 rounded-[2rem] border border-line bg-white p-6 shadow-card">
          <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">Conclusion: Cockroach Watch India, CockroachWatchIndia and CWI</h2>
          <p className="mt-4 leading-8 text-ink/74">
            Cockroach Watch India, CockroachWatchIndia and CWI refer to the same platform. Readers searching either spaced or unspaced versions can use this page to understand the platform, follow verified updates and find the official CWI website.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/about-cockroach-watch-india">Read About CWI</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/latest">See Latest</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/submit">Submit Source or Correction</Link>
            </Button>
          </div>
        </section>
      </article>
    </main>
  );
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 space-y-5 text-lg leading-9 text-ink/78">
      <h2 className="font-display text-3xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">{title}</h2>
      {children}
    </section>
  );
}

function LinkRow({ label, href }: { label: string; href: string }) {
  const isExternal = href.startsWith("http");
  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4 font-bold text-ink/74 transition hover:border-royal/40 hover:text-royal"
    >
      <span>{label}</span>
      <ExternalLink className="h-4 w-4 shrink-0" />
    </Link>
  );
}
