import Link from "next/link";
import { ArrowRight, FileSearch, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { getLiveNewsroomFallbackItems, getPublishedLiveNewsroomItems } from "@/lib/db/live-newsroom";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Latest Cockroach Watch India News and CWI Updates",
  description:
    "Latest Cockroach Watch India updates from CWI Live Newsroom, with source-backed reports, public advisories, India Unanswered Files and corrections.",
  path: "/latest",
  keywords: [
    "Cockroach Watch India news",
    "CockroachWatchIndia news",
    "CWI updates",
    "cockroach watch india",
    "cockroachwatchindia",
    "CWI Live Newsroom"
  ]
});

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Latest Cockroach Watch India News and CWI Updates",
  url: absoluteUrl("/latest"),
  description: "Latest CWI Live Newsroom updates, public advisories, corrections and source-backed reports.",
  isPartOf: {
    "@type": "WebSite",
    name: site.name,
    url: site.url
  },
  about: {
    "@type": "Organization",
    name: "Cockroach Watch India",
    alternateName: ["CockroachWatchIndia", "CWI", "@CockroachWatchIndia"],
    url: site.url
  }
};

export default async function LatestPage() {
  const dbItems = await getPublishedLiveNewsroomItems(18).catch(() => []);
  const items = mergeBySlug(dbItems, getLiveNewsroomFallbackItems(18))
    .sort((first, second) => dateValue(second.updatedAt || second.publishedAt) - dateValue(first.updatedAt || first.publishedAt))
    .slice(0, 18);

  return (
    <main className="bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="mb-4 inline-flex rounded-full bg-skywash px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-royal">
            Latest CWI updates
          </p>
          <h1 className="max-w-4xl font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-ink sm:text-6xl">
            Latest Cockroach Watch India news and CWI updates
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-ink/74">
            A fast route into current Cockroach Watch India coverage. For full source trails, advisories and India Unanswered Files, use the CWI Live Newsroom.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/cockroach-watch-india">Cockroach Watch India guide</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/about-cockroach-watch-india">About CWI</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/live-newsroom">Live Newsroom <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-5 md:grid-cols-2">
          <Card>
            <FileSearch className="h-8 w-8 text-royal" />
            <h2 className="mt-5 font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">How to read this page</h2>
            <p className="mt-4 leading-8 text-ink/70">
              CWI should publish only after source review and human approval. Developing items may change as stronger information becomes available.
            </p>
          </Card>
          <Card>
            <ShieldCheck className="h-8 w-8 text-royal" />
            <h2 className="mt-5 font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">Looking for the brand?</h2>
            <p className="mt-4 leading-8 text-ink/70">
              Cockroach Watch India, CockroachWatchIndia, CWI and @CockroachWatchIndia refer to the same platform identity.
            </p>
          </Card>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Link key={item.id} href={`/live-newsroom/${item.slug}`} className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-royal/35 hover:shadow-soft">
              <CardLabel>{item.verificationStatus}</CardLabel>
              <h2 className="font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">{item.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-ink/66">{item.summary}</p>
              <p className="mt-4 font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-ink/50">
                {item.sourceCount} sources / Updated {formatDate(item.updatedAt || item.publishedAt)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function mergeBySlug<T extends { slug: string }>(primary: T[], fallback: T[]) {
  const seen = new Set<string>();
  return [...primary, ...fallback].filter((item) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
}

function dateValue(value: string) {
  return new Date(value).getTime();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}
