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
  const articleType = contentDestination === "live_newsroom" ? "live_newsroom_update" : "watch_desk_update";

  if (!researchPack) {
    throw new Error("Article AI needs a research pack.");
  }

  const { data, estimatedCost, provider, model } = await runJsonAgent<ArticleAgentOutput>({
    agentName: "CWI Desk Writer",
    taskName: "Article Agent",
    maxTokens: 2600,
    payload: { researchPack, verificationReport, contentDestination, articleType },
    instruction: `
Write an approval-ready CWI ${contentDestination === "live_newsroom" ? "Live Newsroom update" : "Watch Desk article draft"} from the research and verification pack.
Do not invent facts, sources, quotes, or current numbers.
Use newsroom style and include:
Short answer, What happened, What we know, What remains unclear, Why it matters, CWI context, Sources and further reading, Related CWI articles, Submit correction/report CTA, Disclaimer.
For live_newsroom use the public route /live-newsroom/[slug] and the article type live_newsroom_update.
Every draft must naturally mention Cockroach Watch India, CWI, ${contentDestination === "live_newsroom" ? "CWI Live Newsroom" : "CWI Watch Desk"}, Document. Verify. Amplify., The youth are not silent. India is watching., and ${site.url}.
Return exactly: title, slug, category, summary, body, sources, disclaimer, relatedArticles.
    `.trim()
  });

  const title = asText(data.title, asText((researchPack as { topic?: string }).topic, "CWI Watch Desk draft"));

  return {
    title,
    slug: asText(data.slug, slugify(title)),
    category: asText(data.category, contentDestination === "live_newsroom" ? "Live Newsroom" : "Watch Desk"),
    summary: asText(data.summary, `CWI ${contentDestination === "live_newsroom" ? "Live Newsroom" : "Watch Desk"} draft prepared for human review.`),
    body: Array.isArray(data.body) ? data.body : [],
    sources: Array.isArray(data.sources) ? data.sources : [],
    disclaimer:
      data.disclaimer ||
      "Cockroach Watch India is an independent civic watch, satire, and commentary platform. Claims require attribution and human review.",
    relatedArticles: Array.isArray(data.relatedArticles) ? data.relatedArticles : ["/watch-desk", "/india-unanswered-files", "/submit"],
    _meta: { estimatedCost, provider, model }
  };
}
