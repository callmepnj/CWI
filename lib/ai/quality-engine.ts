import { getPool } from "@/lib/db";
import { ensureAdminDatabase } from "@/lib/db/admin";
import { optionalUuid } from "@/lib/db/ids";

type ArticleDraftLike = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  body: Array<{ heading?: string; body?: string; paragraphs?: string[] }>;
  sources: Array<Record<string, unknown>>;
  disclaimer: string;
  relatedArticles: string[];
  _meta?: {
    estimatedCost?: number;
    provider?: string;
    model?: string;
  };
};

export type QualityScore = {
  factualAccuracyScore: number;
  sourceStrengthScore: number;
  legalRiskScore: number;
  seoScore: number;
  readabilityScore: number;
  cwiVoiceScore: number;
  publishReadinessScore: number;
  status: "approval_ready" | "needs_revision" | "blocked";
  issues: string[];
  improvements: string[];
};

export function scoreArticleQuality(article: ArticleDraftLike): QualityScore {
  const bodyText = [
    article.title,
    article.summary,
    ...article.body.map((section) => `${section.heading ?? ""} ${section.body ?? ""} ${(section.paragraphs ?? []).join(" ")}`)
  ].join(" ");
  const headings = article.body.map((section) => clean(section.heading).toLowerCase());
  const sourceCount = article.sources.length;
  const issues: string[] = [];
  const improvements: string[] = [];

  if (sourceCount < 2) issues.push("Add at least two reliable sources before high-confidence publishing.");
  if (!headings.some((heading) => heading.includes("what remains unclear"))) issues.push("Missing uncertainty section.");
  if (!headings.some((heading) => heading.includes("sources"))) improvements.push("Add a visible sources/further reading section.");
  if (!/Cockroach Watch India|CWI/.test(bodyText)) improvements.push("Strengthen CWI voice and context.");
  if (!/reported|according to|source|official|publicly/.test(bodyText.toLowerCase())) issues.push("Attribution language is weak.");
  if (bodyText.length < 1800) improvements.push("Draft is short; add context before approval.");

  const factualAccuracyScore = clamp(45 + Math.min(30, sourceCount * 10) - (issues.length * 5));
  const sourceStrengthScore = clamp(35 + Math.min(45, sourceCount * 15));
  const legalRiskScore = clamp(legalRiskScoreFor(bodyText));
  const seoScore = clamp((article.title.length > 30 ? 25 : 15) + (article.summary.length > 90 ? 25 : 10) + (article.slug ? 25 : 0) + 15);
  const readabilityScore = clamp(bodyText.length > 1200 ? 78 : 58);
  const cwiVoiceScore = clamp(/Cockroach Watch India/.test(bodyText) && /CWI/.test(bodyText) ? 82 : 52);
  const publishReadinessScore = clamp(
    Math.round((factualAccuracyScore + sourceStrengthScore + legalRiskScore + seoScore + readabilityScore + cwiVoiceScore) / 6) -
      Math.min(15, issues.length * 4)
  );
  const status = publishReadinessScore >= 75 && issues.length === 0 ? "approval_ready" : publishReadinessScore >= 50 ? "needs_revision" : "blocked";

  return {
    factualAccuracyScore,
    sourceStrengthScore,
    legalRiskScore,
    seoScore,
    readabilityScore,
    cwiVoiceScore,
    publishReadinessScore,
    status,
    issues,
    improvements
  };
}

export function improveArticleDraft(article: ArticleDraftLike, score: QualityScore): ArticleDraftLike {
  if (score.status === "approval_ready") {
    return article;
  }

  const existingHeadings = new Set(article.body.map((section) => clean(section.heading).toLowerCase()));
  const body = [...article.body];

  if (!existingHeadings.has("what remains unclear")) {
    body.push({
      heading: "What remains unclear",
      body: "CWI is keeping this section separate from confirmed details. Any claim that is not directly supported by the listed sources needs further verification before it is amplified."
    });
  }

  if (![...existingHeadings].some((heading) => heading.includes("sources"))) {
    body.push({
      heading: "Sources and further reading",
      body:
        article.sources.length > 0
          ? article.sources
              .slice(0, 6)
              .map((source, index) => `${index + 1}. ${clean(source.title ?? source.name ?? source.url) || "Source"}${clean(source.url) ? ` - ${clean(source.url)}` : ""}`)
              .join("\n")
          : "Sources must be attached before final publication."
    });
  }

  if (!/Cockroach Watch India|CWI/.test(`${article.summary} ${body.map((section) => section.body).join(" ")}`)) {
    body.push({
      heading: "CWI context",
      body:
        "Cockroach Watch India - CWI documents public-interest issues with source attribution, editorial caution, and a correction path."
    });
  }

  return {
    ...article,
    summary: article.summary || "CWI Live Newsroom draft prepared with source checks, verification notes, and human approval required.",
    body,
    disclaimer:
      article.disclaimer ||
      "Cockroach Watch India is an independent civic watch, satire, and commentary platform. Claims require attribution and human review before publication."
  };
}

export async function saveQualityScore(score: QualityScore, input: { topic: string; articleDraftId?: string; approvalQueueId?: string }) {
  await ensureAdminDatabase();
  await getPool().query(
    `
      insert into cwi_quality_scores (
        article_draft_id, approval_queue_id, topic, factual_accuracy_score,
        source_strength_score, legal_risk_score, seo_score, readability_score,
        cwi_voice_score, publish_readiness_score, status, issues, improvements
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
    `,
    [
      optionalUuid(input.articleDraftId),
      optionalUuid(input.approvalQueueId),
      input.topic,
      score.factualAccuracyScore,
      score.sourceStrengthScore,
      score.legalRiskScore,
      score.seoScore,
      score.readabilityScore,
      score.cwiVoiceScore,
      score.publishReadinessScore,
      score.status,
      JSON.stringify(score.issues),
      JSON.stringify(score.improvements)
    ]
  );
}

function legalRiskScoreFor(text: string) {
  const lower = text.toLowerCase();
  if (/(alleged|accused|rape|murder|terror|communal|caste|religion|uapa|court|police|corruption|fraud|scam)/.test(lower)) return 55;
  if (/(reported|claim|viral|protest|violence|leak)/.test(lower)) return 68;
  return 88;
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}
