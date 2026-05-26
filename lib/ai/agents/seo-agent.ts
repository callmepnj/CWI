import { asText, runJsonAgent, slugify } from "@/lib/ai/agents/helpers";
import { normalizeContentDestination, type ContentDestination } from "@/lib/ai/content-destination";
import { getArticleDraft } from "@/lib/db/articles";
import { site } from "@/lib/site";

export type SeoAgentOutput = {
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  schemaJson: Record<string, unknown>;
  internalLinks: string[];
  altText: string[];
  slug: string;
};

export async function runSEOAgent(input: { articleDraftId?: string; articleDraft?: unknown; topic?: string; contentDestination?: ContentDestination }) {
  const articleDraft = input.articleDraft ?? (input.articleDraftId ? await getArticleDraft(input.articleDraftId) : null);
  const contentDestination = normalizeContentDestination(
    input.contentDestination || (articleDraft as { content_destination?: string } | null)?.content_destination
  );
  const title = asText((articleDraft as { title?: string } | null)?.title, input.topic || "CWI Live Newsroom update");
  const routePrefix = contentDestination === "archive" ? "/archive" : "/live-newsroom";
  const destinationName = contentDestination === "archive" ? "CWI Archive" : "CWI Live Newsroom";

  const { data, estimatedCost, provider, model } = await runJsonAgent<SeoAgentOutput>({
    agentName: "CWI Rank Engine",
    taskName: "SEO Agent",
    payload: { articleDraft, topic: title, contentDestination },
    instruction: `
Prepare a Google-ready SEO pack for this CWI article.
Use only ${site.url} for canonical URLs. No legacy preview or local development URLs.
Return exactly:
seoTitle, metaDescription, canonicalUrl, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription, schemaJson, internalLinks, altText, slug.
SEO title should include ${destinationName} or Cockroach Watch India.
For live_newsroom use canonical ${site.url}/live-newsroom/[slug] and NewsArticle + BlogPosting + BreadcrumbList schema.
Archive is passive. Do not create fresh archive-first SEO growth packages unless the admin is migrating older content.
Meta description must mention Cockroach Watch India, CWI, and ${destinationName} naturally.
    `.trim()
  });

  const slug = asText(data.slug, slugify(title));
  const canonicalUrl = asText(data.canonicalUrl, `${site.url}${routePrefix}/${slug}`);

  return {
    seoTitle: asText(data.seoTitle, `${title} - ${destinationName} | Cockroach Watch India`),
    metaDescription: asText(
      data.metaDescription,
      `Cockroach Watch India explains ${title}, what is known, what remains unclear, and why ${destinationName} is tracking this public-interest update.`
    ),
    canonicalUrl,
    ogTitle: asText(data.ogTitle, `${title} - ${destinationName}`),
    ogDescription: asText(data.ogDescription, `${destinationName} context for ${title}.`),
    ogImage: asText(data.ogImage, `${site.url}/opengraph-image`),
    twitterTitle: asText(data.twitterTitle, `${title} - Cockroach Watch India`),
    twitterDescription: asText(data.twitterDescription, `${destinationName} context for ${title}.`),
    schemaJson: typeof data.schemaJson === "object" && data.schemaJson ? data.schemaJson : { "@type": "NewsArticle", headline: title, url: canonicalUrl },
    internalLinks: Array.isArray(data.internalLinks) ? data.internalLinks : ["/", "/live-newsroom", "/archive", "/india-unanswered-files", "/submit"],
    altText: Array.isArray(data.altText) ? data.altText : [`Cockroach Watch India ${destinationName} visual on ${title}.`],
    slug,
    _meta: { estimatedCost, provider, model }
  };
}
