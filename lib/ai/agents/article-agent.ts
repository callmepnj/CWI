import { asText, runJsonAgent, slugify } from "@/lib/ai/agents/helpers";
import { normalizeContentDestination, type ContentDestination } from "@/lib/ai/content-destination";
import { getResearchPack } from "@/lib/db/research";
import { getVerificationReport } from "@/lib/db/articles";
import { site } from "@/lib/site";

export type ArticleAgentOutput = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  body: Array<{ heading: string; body: string }>;
  whatChanged?: string;
  whatWeDontKnow?: string[] | string;
  beforeYouShare?: string[] | string;
  editorNote?: string;
  sourceTrail?: Array<Record<string, unknown>>;
  claimTracker?: Array<Record<string, unknown>>;
  regionTags?: string[];
  topicTags?: string[];
  sources: Array<Record<string, unknown>>;
  disclaimer: string;
  relatedArticles: string[];
};

export async function runArticleAgent(input: {
  researchPackId?: string;
  verificationReportId?: string;
  researchPack?: unknown;
  verificationReport?: unknown;
  contentDestination?: ContentDestination;
}) {
  const researchPack = input.researchPack ?? (input.researchPackId ? await getResearchPack(input.researchPackId) : null);
  const verificationReport =
    input.verificationReport ?? (input.verificationReportId ? await getVerificationReport(input.verificationReportId) : null);
  const contentDestination = normalizeContentDestination(
    input.contentDestination ||
      (researchPack as { content_destination?: string } | null)?.content_destination ||
      (verificationReport as { content_destination?: string } | null)?.content_destination
  );
  const articleType = contentDestination === "live_newsroom" ? "live_newsroom_update" : "archived_context";

  if (!researchPack) {
    throw new Error("Article AI needs a research pack.");
  }

  if (!verificationReport) {
    throw new Error("Verification Report required before article generation.");
  }

  const sourceCount = Number(
    (researchPack as { source_count?: unknown; sourceCount?: unknown } | null)?.source_count ??
      (researchPack as { source_count?: unknown; sourceCount?: unknown } | null)?.sourceCount ??
      0
  );

  if (sourceCount < 1) {
    throw new Error("Article AI blocked. Reliable source required before article generation.");
  }

  const { data, estimatedCost, provider, model } = await runJsonAgent<ArticleAgentOutput>({
    agentName: "CWI Desk Writer",
    taskName: "Article Agent",
    maxTokens: 2600,
    payload: { researchPack, verificationReport, contentDestination, articleType },
    instruction: `
Write an approval-ready CWI Live Newsroom update from the research and verification pack.
Do not invent facts, sources, quotes, or current numbers.
Write like a human editor: start with what changed, use dates when possible, name sources naturally, mention what remains unknown, and avoid repeated slogans or keyword stuffing.
Use newsroom structure and include:
Short answer, What changed, What happened, What CWI knows, What CWI does not know, Why it matters, Source trail, Timeline, Before you share, Correction/source CTA, one disclaimer.
For live_newsroom use the public route /live-newsroom/[slug] and the article type live_newsroom_update.
Archive is passive. Do not create fresh archive-first content.
Do not force slogans or repeated brand phrases into the article. Use ${site.url} only for canonical or correction links.
Return exactly: title, slug, category, summary, body, whatChanged, whatWeDontKnow, beforeYouShare, editorNote, sourceTrail, claimTracker, regionTags, topicTags, sources, disclaimer, relatedArticles.
    `.trim()
  });

  const title = asText(data.title, asText((researchPack as { topic?: string }).topic, "CWI Live Newsroom draft"));

  return {
    title,
    slug: asText(data.slug, slugify(title)),
    category: asText(data.category, contentDestination === "public_advisory" ? "Public Advisory" : "Live Newsroom"),
    summary: asText(data.summary, "CWI Live Newsroom draft prepared for human review."),
    body: Array.isArray(data.body) ? data.body : [],
    whatChanged: asText(data.whatChanged),
    whatWeDontKnow: Array.isArray(data.whatWeDontKnow) ? data.whatWeDontKnow : asText(data.whatWeDontKnow),
    beforeYouShare: Array.isArray(data.beforeYouShare) ? data.beforeYouShare : asText(data.beforeYouShare),
    editorNote: asText(data.editorNote),
    sourceTrail: Array.isArray(data.sourceTrail) ? data.sourceTrail : [],
    claimTracker: Array.isArray(data.claimTracker) ? data.claimTracker : [],
    regionTags: Array.isArray(data.regionTags) ? data.regionTags.map((tag) => asText(tag)).filter(Boolean) : [],
    topicTags: Array.isArray(data.topicTags) ? data.topicTags.map((tag) => asText(tag)).filter(Boolean) : [],
    sources: Array.isArray(data.sources) ? data.sources : [],
    disclaimer:
      data.disclaimer ||
      "Cockroach Watch India is an independent civic watch, satire, and commentary platform. Claims require attribution and human review.",
    relatedArticles: Array.isArray(data.relatedArticles) ? data.relatedArticles : ["/live-newsroom", "/india-unanswered-files", "/archive", "/submit"],
    _meta: { estimatedCost, provider, model }
  };
}
