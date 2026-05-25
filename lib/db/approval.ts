import { getPool } from "@/lib/db";
import { ensureAdminDatabase } from "@/lib/db/admin";
import { optionalUuid, requireUuid } from "@/lib/db/ids";

const approvalStatusMap: Record<string, string> = {
  approve: "approved",
  approved: "approved",
  "approve publish": "approved",
  "approve & publish": "approved",
  "approved publish": "approved",
  approve_publish: "approved",
  "approve_&_publish": "approved",
  approved_publish: "approved",
  "approve article only": "approved_article_only",
  "approved article only": "approved_article_only",
  approve_article_only: "approved_article_only",
  approved_article_only: "approved_article_only",
  "approve social only": "approved_social_only",
  "approved social only": "approved_social_only",
  approve_social_only: "approved_social_only",
  approved_social_only: "approved_social_only",
  "request changes": "changes_requested",
  changes_requested: "changes_requested",
  rejected: "rejected",
  reject: "rejected",
  "save for later": "waiting_for_approval",
  waiting_for_approval: "waiting_for_approval",
  "waiting for approval": "waiting_for_approval",
  published: "published",
  archived: "archived",
  archive: "archived"
};

export function normalizeApprovalStatus(status: unknown) {
  if (typeof status !== "string") {
    return "waiting_for_approval";
  }

  const normalized = status.trim().toLowerCase().replace(/[-\s]+/g, "_");
  const spaced = status.trim().toLowerCase().replace(/[_-]+/g, " ");
  return approvalStatusMap[normalized] ?? approvalStatusMap[spaced] ?? normalized;
}

export function isPublishApproved(status: unknown) {
  return normalizeApprovalStatus(status) === "approved";
}

export async function saveApprovalItem(input: {
  topic: string;
  itemType: string;
  summary: string;
  researchPackId?: string;
  verificationReportId?: string;
  articleDraftId?: string;
  seoPackId?: string;
  socialPackId?: string;
  imagePackId?: string;
  uiuxAuditId?: string;
  verificationStatus: string;
  riskLevel: string;
  sourceCount?: number;
  status?: string;
  adminNotes?: string;
}) {
  await ensureAdminDatabase();
  const result = await getPool().query<{ id: string }>(
    `
      insert into approval_queue (
        topic, type, item_type, summary, research_pack_id, verification_report_id,
        article_draft_id, seo_pack_id, social_pack_id, image_pack_id, uiux_audit_id,
        verification_status, risk_level, source_count, status, notes, admin_notes
      )
      values ($1, $2, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $15)
      returning id;
    `,
    [
      input.topic,
      input.itemType,
      input.summary,
      optionalUuid(input.researchPackId),
      optionalUuid(input.verificationReportId),
      optionalUuid(input.articleDraftId),
      optionalUuid(input.seoPackId),
      optionalUuid(input.socialPackId),
      optionalUuid(input.imagePackId),
      optionalUuid(input.uiuxAuditId),
      input.verificationStatus,
      input.riskLevel,
      input.sourceCount ?? 0,
      normalizeApprovalStatus(input.status ?? "waiting_for_approval"),
      input.adminNotes ?? "Human approval required before publishing."
    ]
  );
  return result.rows[0].id;
}

export async function updateApprovalItem(id: string, status: string, adminNotes?: string) {
  await ensureAdminDatabase();
  const approvalQueueId = requireUuid(id, "approvalQueueId");
  const safeStatus = normalizeApprovalStatus(status);
  const result = await getPool().query(
    `
      update approval_queue
      set status = $2,
          notes = coalesce(nullif($3, ''), notes),
          admin_notes = coalesce(nullif($3, ''), admin_notes),
          approved_at = case when $2 = 'approved' then coalesce(approved_at, now()) else approved_at end,
          approved_by = case when $2 = 'approved' then coalesce(approved_by, 'CWI Admin') else approved_by end,
          updated_at = now()
      where id = $1
      returning *;
    `,
    [approvalQueueId, safeStatus, adminNotes ?? ""]
  );
  return result.rows[0] ?? null;
}

export async function attachDraftToApprovalItem(input: {
  approvalQueueId: string;
  articleDraftId: string;
  seoPackId?: string;
  socialPackId?: string;
  imagePackId?: string;
  summary?: string;
  adminNotes?: string;
}) {
  await ensureAdminDatabase();
  const approvalQueueId = requireUuid(input.approvalQueueId, "approvalQueueId");
  const articleDraftId = requireUuid(input.articleDraftId, "articleDraftId");
  const result = await getPool().query(
    `
      update approval_queue
      set article_draft_id = $2,
          seo_pack_id = coalesce($3, seo_pack_id),
          social_pack_id = coalesce($4, social_pack_id),
          image_pack_id = coalesce($5, image_pack_id),
          summary = coalesce(nullif($6, ''), summary),
          status = 'waiting_for_approval',
          notes = coalesce(nullif($7, ''), notes),
          admin_notes = coalesce(nullif($7, ''), admin_notes),
          updated_at = now()
      where id = $1
      returning *;
    `,
    [
      approvalQueueId,
      articleDraftId,
      optionalUuid(input.seoPackId),
      optionalUuid(input.socialPackId),
      optionalUuid(input.imagePackId),
      input.summary ?? "",
      input.adminNotes ?? "Article draft attached. Review, then use Approve & Publish if it is ready."
    ]
  );
  return result.rows[0] ?? null;
}

export async function getApprovalItem(id: string) {
  const approvalId = optionalUuid(id);
  if (!approvalId) {
    return null;
  }

  await ensureAdminDatabase();
  const result = await getPool().query(`select * from approval_queue where id = $1;`, [approvalId]);
  const row = result.rows[0];
  return row ? { ...row, status: normalizeApprovalStatus(row.status) } : null;
}
