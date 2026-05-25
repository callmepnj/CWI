import { getPool } from "@/lib/db";
import { ensureAdminDatabase } from "@/lib/db/admin";

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
      input.researchPackId ?? null,
      input.verificationReportId ?? null,
      input.articleDraftId ?? null,
      input.seoPackId ?? null,
      input.socialPackId ?? null,
      input.imagePackId ?? null,
      input.uiuxAuditId ?? null,
      input.verificationStatus,
      input.riskLevel,
      input.sourceCount ?? 0,
      input.status ?? "waiting_for_approval",
      input.adminNotes ?? "Human approval required before publishing."
    ]
  );
  return result.rows[0].id;
}

export async function updateApprovalItem(id: string, status: string, adminNotes?: string) {
  await ensureAdminDatabase();
  const result = await getPool().query(
    `
      update approval_queue
      set status = $2,
          notes = coalesce(nullif($3, ''), notes),
          admin_notes = coalesce(nullif($3, ''), admin_notes),
          approved_at = case when $2 = 'approved' then now() else approved_at end,
          updated_at = now()
      where id = $1
      returning *;
    `,
    [id, status, adminNotes ?? ""]
  );
  return result.rows[0] ?? null;
}

export async function getApprovalItem(id: string) {
  await ensureAdminDatabase();
  const result = await getPool().query(`select * from approval_queue where id = $1;`, [id]);
  return result.rows[0] ?? null;
}
