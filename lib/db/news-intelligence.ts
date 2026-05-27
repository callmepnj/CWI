import type { AiishnessReport } from "@/lib/ai/aiishness";
import { ensureAdminDatabase } from "@/lib/db/admin";
import { getPool } from "@/lib/db";

export type NewsIntelligenceItem = {
  id: string;
  item_type: string;
  title: string;
  summary: string | null;
  status: string;
  category: string | null;
  source_count: number;
  sources_json: unknown;
  what_changed: string | null;
  what_we_know: string | null;
  what_we_dont_know: string | null;
  timeline_json: unknown;
  before_you_share: string | null;
  editor_note: string | null;
  related_live_newsroom_item_id: string | null;
  approval_status: string;
  created_at: string;
  updated_at: string;
};

export async function saveAiishnessReport(report: AiishnessReport) {
  await ensureAdminDatabase();
  const result = await getPool().query<{ id: string }>(
    `
      insert into aiishness_reports (
        content_type, content_id, page_url, score, flagged_lines_json,
        issues_json, rewrite_suggestions_json, status
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8)
      returning id::text;
    `,
    [
      report.contentType,
      report.contentId || null,
      report.pageUrl || null,
      report.score,
      JSON.stringify(report.flaggedLines),
      JSON.stringify(report.issues),
      JSON.stringify(report.rewriteSuggestions),
      report.status
    ]
  );

  return result.rows[0]?.id ?? "";
}

export async function getLatestAiishnessReports(limit = 40) {
  await ensureAdminDatabase();
  const result = await getPool().query(
    `
      select id::text, content_type, content_id, page_url, score, flagged_lines_json,
        issues_json, rewrite_suggestions_json, status, created_at::text, updated_at::text
      from aiishness_reports
      order by created_at desc
      limit $1;
    `,
    [limit]
  );

  return result.rows;
}

export async function getNewsIntelligenceItems(limit = 60) {
  await ensureAdminDatabase();
  const result = await getPool().query<NewsIntelligenceItem>(
    `
      select id::text, item_type, title, summary, status, category, source_count,
        sources_json, what_changed, what_we_know, what_we_dont_know, timeline_json,
        before_you_share, editor_note, related_live_newsroom_item_id::text,
        approval_status, created_at::text, updated_at::text
      from news_intelligence_items
      order by updated_at desc, created_at desc
      limit $1;
    `,
    [limit]
  );

  return result.rows;
}

export async function saveNewsIntelligenceItem(input: {
  itemType: string;
  title: string;
  summary?: string;
  status?: string;
  category?: string;
  sourceCount?: number;
  sources?: unknown[];
  whatChanged?: string;
  whatWeKnow?: string;
  whatWeDontKnow?: string;
  timeline?: unknown[];
  beforeYouShare?: string;
  editorNote?: string;
  relatedLiveNewsroomItemId?: string;
  approvalStatus?: string;
}) {
  await ensureAdminDatabase();
  const result = await getPool().query<{ id: string }>(
    `
      insert into news_intelligence_items (
        item_type, title, summary, status, category, source_count, sources_json,
        what_changed, what_we_know, what_we_dont_know, timeline_json,
        before_you_share, editor_note, related_live_newsroom_item_id, approval_status
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      returning id::text;
    `,
    [
      input.itemType,
      input.title,
      input.summary || null,
      input.status || "Developing",
      input.category || "Live Newsroom",
      input.sourceCount ?? 0,
      JSON.stringify(input.sources ?? []),
      input.whatChanged || null,
      input.whatWeKnow || null,
      input.whatWeDontKnow || null,
      JSON.stringify(input.timeline ?? []),
      input.beforeYouShare || null,
      input.editorNote || null,
      input.relatedLiveNewsroomItemId || null,
      input.approvalStatus || "waiting_for_approval"
    ]
  );

  return result.rows[0]?.id ?? "";
}
