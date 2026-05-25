import { asText, runJsonAgent, slugify } from "@/lib/ai/agents/helpers";
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

export async function runSEOAgent(input: { articleDraftId?: string; articleDraft?: unknown; topic?: string }) {
  const articleDraft = input.articleDraft ?? (input.articleDraftId ? await getArticleDraft(input.articleDraftId) : null);
  const title = asText((articleDraft as { title?: string } | null)?.title, input.topic || "CWI Watch Desk update");

  const { data, estimatedCost, provider, model } = await runJsonAgent<SeoAgentOutput>({
    agentName: "CWI SEO AI",
    taskName: "SEO Agent",
    payload: { articleDraft, topic: title },
    instruction: `
Prepare a Google-ready SEO pack for this CWI article.
Use only ${site.url} for canonical URLs. No legacy Vercel or localhost URLs.
Return exactly:
seoTitle, metaDescription, canonicalUrl, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription, schemaJson, internalLinks, altText, slug.
SEO title should include CWI Watch Desk or Cockroach Watch India.
Meta description must mention Cockroach Watch India, CWI, and Watch Desk naturally.
    `.trim()
  });

  const slug = asText(data.slug, slugify(title));
  const canonicalUrl = asText(data.canonicalUrl, `${site.url}/watch-desk/${slug}`);

  return {
    seoTitle: asText(data.seoTitle, `${title} - CWI Watch Desk | Cockroach Watch India`),
    metaDescription: asText(
      data.metaDescription,
      `Cockroach Watch India explains ${title}, what is known, what remains unclear, and why the CWI Watch Desk is tracking this update.`
    ),
    canonicalUrl,
    ogTitle: asText(data.ogTitle, `${title} - CWI Watch Desk`),
    ogDescription: asText(data.ogDescription, `CWI Watch Desk context for ${title}.`),
    ogImage: asText(data.ogImage, `${site.url}/opengraph-image`),
    twitterTitle: asText(data.twitterTitle, `${title} - Cockroach Watch India`),
    twitterDescription: asText(data.twitterDescription, `CWI Watch Desk context for ${title}.`),
    schemaJson: typeof data.schemaJson === "object" && data.schemaJson ? data.schemaJson : { "@type": "NewsArticle", headline: title, url: canonicalUrl },
    internalLinks: Array.isArray(data.internalLinks) ? data.internalLinks : ["/", "/watch", "/watch-desk", "/submit"],
    altText: Array.isArray(data.altText) ? data.altText : [`Cockroach Watch India CWI Watch Desk visual on ${title}.`],
    slug,
    _meta: { estimatedCost, provider, model }
  };
}
