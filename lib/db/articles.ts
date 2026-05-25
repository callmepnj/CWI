import { getPool } from "@/lib/db";
import { ensureAdminDatabase } from "@/lib/db/admin";

export async function saveVerificationReport(report: {
  researchPackId: string;
  verificationStatus: string;
  riskLevel: string;
  unsafeClaims: unknown[];
  saferWording: unknown[];
  sourceGaps: unknown[];
  publishRecommendation: string;
}) {
  await ensureAdminDatabase();
  const result = await getPool().query<{ id: string }>(
    `
      insert into verification_reports (
        research_pack_id, verification_status, risk_level, unsafe_claims,
        safer_wording, source_gaps, publish_recommendation, human_review_required
      )
      values ($1, $2, $3, $4, $5, $6, $7, true)
      returning id;
    `,
    [
      report.researchPackId,
      report.verificationStatus,
      report.riskLevel,
      JSON.stringify(report.unsafeClaims),
      JSON.stringify(report.saferWording),
      JSON.stringify(report.sourceGaps),
      report.publishRecommendation
    ]
  );
  return result.rows[0].id;
}

export async function getVerificationReport(id: string) {
  await ensureAdminDatabase();
  const result = await getPool().query(`select * from verification_reports where id = $1;`, [id]);
  return result.rows[0] ?? null;
}

export async function saveArticleDraft(article: {
  researchPackId?: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  body: unknown;
  verificationStatus: string;
  sourceCount: number;
}) {
  await ensureAdminDatabase();
  const result = await getPool().query<{ id: string }>(
    `
      insert into article_drafts (
        research_pack_id, title, slug, category, draft, verification_status,
        source_count, approval_status, publish_status
      )
      values ($1, $2, $3, $4, $5, $6, $7, 'Draft Ready', 'Not published')
      returning id;
    `,
    [
      article.researchPackId ?? null,
      article.title,
      article.slug,
      article.category,
      JSON.stringify({ summary: article.summary, body: article.body }),
      article.verificationStatus,
      article.sourceCount
    ]
  );
  return result.rows[0].id;
}

export async function getArticleDraft(id: string) {
  await ensureAdminDatabase();
  const result = await getPool().query(`select * from article_drafts where id = $1;`, [id]);
  return result.rows[0] ?? null;
}

export async function savePublishedArticle(input: { articleDraftId: string; title: string; slug: string; url: string; category?: string; metadata?: unknown }) {
  await ensureAdminDatabase();
  const result = await getPool().query<{ id: string }>(
    `
      insert into published_articles (article_draft_id, title, slug, url, category, metadata)
      values ($1, $2, $3, $4, $5, $6)
      returning id;
    `,
    [input.articleDraftId, input.title, input.slug, input.url, input.category ?? "", JSON.stringify(input.metadata ?? {})]
  );
  return result.rows[0].id;
}
