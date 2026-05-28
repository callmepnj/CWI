import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { createMetadata, absoluteUrl } from "@/lib/seo";
import { liveNewsroomItems, getItemBySlug } from "@/data/live-newsroom";
import { site } from "@/lib/site";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

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

  return createMetadata({
    title: `${item.title} - CWI Live Newsroom`,
    description: item.summary,
    path: `/live-newsroom/${slug}`,
    type: "article",
    publishedTime: item.publishedAt ?? item.createdAt,
    modifiedTime: item.lastUpdatedAt ?? item.updatedAt,
    keywords: [item.title, item.category, item.status, "CWI Live Newsroom", "Cockroach Watch India"],
    image: {
      url: absoluteUrl(`/live-newsroom/${item.slug}/opengraph-image`),
      alt: `${item.title} - CWI Live Newsroom social preview`
    }
  });
}

export async function generateStaticParams() {
  return liveNewsroomItems.map((item) => ({
    slug: item.slug
  }));
}
function jsonLdForItem(item: NonNullable<ReturnType<typeof getItemBySlug>>) {
  const url = absoluteUrl(`/live-newsroom/${item.slug}`);
  const image = absoluteUrl(`/live-newsroom/${item.slug}/opengraph-image`);
  const articleBase = {
    headline: item.title,
    description: item.summary,
    image,
    datePublished: item.publishedAt ?? item.createdAt,
    dateModified: item.lastUpdatedAt ?? item.updatedAt,
    author: {
      "@type": "Organization",
      name: site.name,
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
    articleSection: item.category,
    keywords: [item.title, item.category, item.status, "CWI Live Newsroom"].join(", "),
    citation: item.sourceTrail.map((source) => source.url),
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
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Live Newsroom", item: absoluteUrl("/live-newsroom") },
        { "@type": "ListItem", position: 3, name: item.title, item: url }
      ]
    }
  ];
}
export default async function LiveNewsroomDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getItemBySlug(slug);

  if (!item) {
    notFound();
  }

  const statusColors: Record<string, { bg: string; text: string }> = {
    "Source-backed": { bg: "bg-cwi-green/10", text: "text-cwi-green" },
    "Verified": { bg: "bg-cwi-green/10", text: "text-cwi-green" },
    "Developing": { bg: "bg-cwi-saffron/12", text: "text-cwi-brown" },
    "Reported": { bg: "bg-cwi-cream", text: "text-cwi-brown" },
    "Public Advisory": { bg: "bg-cwi-saffron/12", text: "text-cwi-brown" },
    "Needs Source": { bg: "bg-cwi-cream", text: "text-cwi-brown" },
    "Blocked": { bg: "bg-cwi-brown/10", text: "text-cwi-brown" },
    "Correction": { bg: "bg-cwi-saffron/12", text: "text-cwi-brown" }
  };

  const status = statusColors[item.status] || statusColors["Reported"];
  const jsonLd = jsonLdForItem(item);

  return (
    <>
      {jsonLd.map((item) => (
        <script key={`${item["@type"]}-${slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">

        {/* Back navigation */}
        <Link
          href="/live-newsroom"
          className="inline-flex items-center gap-2 mb-8 rounded-lg px-4 py-2 text-sm font-semibold text-cwi-green hover:bg-cwi-green/5 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Live Newsroom
        </Link>

        {/* Header */}
        <div className="mb-8">
          {/* Metadata badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${status.bg} ${status.text}`}>
              {item.status}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium bg-cwi-saffron/10 text-cwi-brown">
              {item.category}
            </span>
            {item.sourceTrail.length > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium bg-cwi-green/10 text-cwi-green">
                {item.sourceTrail.length} source{item.sourceTrail.length !== 1 ? "s" : ""}
              </span>
            )}
            {item.isLeadStory && (
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium bg-cwi-saffron/10 text-cwi-brown">
                Lead Story
              </span>
            )}
          </div>

          {/* Headline */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-cwi-ink mb-4">
            {item.title}
          </h1>

          {/* Summary */}
          <p className="text-xl text-cwi-ink/70 mb-6 max-w-2xl">
            {item.summary}
          </p>

          {/* Metadata line */}
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-cwi-ink/60 border-b-2 border-cwi-green/10 pb-6">
            <span>
              Published {new Date(item.publishedAt || item.createdAt).toLocaleDateString("en-IN")}
            </span>
            <span>/</span>
            <span>
              Updated {formatDistanceToNow(new Date(item.lastUpdatedAt), { addSuffix: true })}
            </span>
            <span>/</span>
            <span>
              Last checked {formatDistanceToNow(new Date(item.lastCheckedAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Display image if available */}
        {item.displayImage && (
          <div className="relative mb-12 h-96 overflow-hidden rounded-lg border-2 border-cwi-green/20 bg-cwi-muted">
            <Image
              src={item.displayImage}
              alt={item.displayImageAlt || item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* Short answer */}
        <section className="mb-12 rounded-lg border border-cwi-brown/18 bg-white/78 p-6 shadow-sm">
          <h2 className="font-display text-2xl font-black uppercase leading-tight text-cwi-ink">Short answer</h2>
          <p className="mt-4 text-lg leading-relaxed text-cwi-ink/80">{item.content}</p>
        </section>

        {/* What/Know/Don't Know boxes */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <div className="rounded-lg border border-cwi-green/18 bg-cwi-green/10 p-6">
            <h3 className="font-display font-bold text-cwi-green text-lg mb-3">What Changed</h3>
            <p className="text-cwi-ink/80">{item.whatChanged}</p>
          </div>
          <div className="rounded-lg border-2 border-cwi-green/20 bg-cwi-cream/70 p-6">
            <h3 className="font-display font-bold text-cwi-green text-lg mb-3">What CWI knows</h3>
            <p className="text-cwi-ink/80">{item.whatWeKnow}</p>
          </div>
          <div className="rounded-lg border border-cwi-saffron/22 bg-cwi-saffron/10 p-6">
            <h3 className="font-display font-bold text-cwi-brown text-lg mb-3">What CWI does not know</h3>
            <p className="text-cwi-ink/80">{item.whatWeDontKnow}</p>
          </div>
        </div>

        {/* Editor note if available */}
        {item.editorNote && (
          <div className="mb-12 rounded-lg border-l-4 border-cwi-saffron bg-cwi-saffron/5 p-6">
            <h3 className="font-display font-bold text-cwi-brown text-lg mb-2">Editor Note</h3>
            <p className="text-cwi-ink/80">{item.editorNote}</p>
          </div>
        )}

        {/* Source trail */}
        {item.sourceTrail.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display font-bold text-2xl text-cwi-ink mb-6">Source Trail</h2>
            <div className="space-y-3">
              {item.sourceTrail.map((source) => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 items-start rounded-lg border-2 border-cwi-green/20 bg-white p-4 transition-all hover:bg-cwi-cream/50 hover:border-cwi-green/40 hover:shadow-sm"
                >
                  <div className="mt-1">
                    <span className="inline-flex min-w-10 justify-center rounded-full bg-cwi-green/10 px-2 py-1 text-xs font-bold uppercase text-cwi-green" aria-hidden="true">
                      {source.type === "Official" && "OFF"}
                      {source.type === "Court/legal" && "LAW"}
                      {source.type === "Established media" && "MED"}
                      {source.type === "Fact-check" && "CHK"}
                      {source.type === "Public statement" && "PUB"}
                      {source.type === "Social post" && "SOC"}
                      {source.type === "User-submitted" && "USR"}
                      {!["Official", "Court/legal", "Established media", "Fact-check", "Public statement", "Social post", "User-submitted"].includes(source.type) && "SRC"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-cwi-ink hover:text-cwi-green transition-colors">
                          {source.name}
                        </h4>
                        <p className="text-sm text-cwi-ink/60 mt-1">{source.type}</p>
                        {source.usedFor && source.usedFor.length > 0 && (
                          <p className="text-xs text-cwi-ink/50 mt-1">
                            Used for: {source.usedFor.join(", ")}
                          </p>
                        )}
                      </div>
                      <ExternalLink className="h-5 w-5 text-cwi-green/50 mt-1 flex-shrink-0" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Before sharing */}
        <section className="mb-12 rounded-lg border border-cwi-brown/18 bg-cwi-cream p-6 shadow-sm">
          <h2 className="font-display text-2xl font-black uppercase leading-tight text-cwi-ink">Before you share</h2>
          <p className="mt-4 leading-7 text-cwi-ink/72">Check the update time, source trail, and what remains unclear. Do not treat developing, reported, or needs-source labels as final proof.</p>
          <p className="mt-3 text-sm font-bold leading-6 text-cwi-ink/62">CWI is an independent civic watch, satire, commentary, Live Newsroom, and public archive platform. This record is not a legal finding or official party statement.</p>
        </section>


        {/* Footer CTA */}
        <div className="rounded-lg border-2 border-cwi-green/30 bg-cwi-green/5 p-8 text-center">
          <h3 className="font-display font-bold text-cwi-ink text-lg mb-3">
            Found an error or have a source?
          </h3>
          <p className="text-cwi-ink/70 mb-6 max-w-2xl mx-auto">
            Help CWI keep the record accurate. Submit a correction or additional source context.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 rounded-lg bg-cwi-green px-6 py-3 font-semibold text-white transition-all hover:bg-cwi-green/90"
          >
            Submit source or correction
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Related items */}
        {liveNewsroomItems.length > 1 && (
          <div className="mt-16 pt-12 border-t-2 border-cwi-border">
            <h2 className="font-display font-bold text-2xl text-cwi-ink mb-6">
              More from Live Newsroom
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {liveNewsroomItems
                .filter((i) => i.id !== item.id)
                .slice(0, 2)
                .map((relatedItem) => (
                  <Link
                    key={relatedItem.id}
                    href={`/live-newsroom/${relatedItem.slug}`}
                    className="group rounded-lg border-2 border-cwi-green/20 bg-white p-6 transition-all hover:shadow-md hover:border-cwi-green/40 hover:bg-cwi-cream/30"
                  >
                    <div className="text-xs font-bold uppercase tracking-wide text-cwi-green mb-2">
                      {relatedItem.category}
                    </div>
                    <h3 className="font-display font-bold text-cwi-ink text-lg mb-2 group-hover:text-cwi-green transition-colors line-clamp-2">
                      {relatedItem.title}
                    </h3>
                    <p className="text-sm text-cwi-ink/70 mb-3 line-clamp-2">
                      {relatedItem.summary}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-cwi-green">
                      Open update
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
