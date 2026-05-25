import { getPool } from "@/lib/db";
import { ensureAdminDatabase, getDayCostInr, getMonthCostInr } from "@/lib/db/admin";

export async function saveSystemHealthLog(input: {
  websiteStatus: string;
  databaseStatus: string;
  sitemapStatus: string;
  robotsStatus: string;
  oldUrlCheck: string;
  brokenLinks?: number;
  missingMetadata?: number;
  missingAltText?: number;
  failedTasks?: number;
  pendingApprovals?: number;
}) {
  await ensureAdminDatabase();
  const [monthCost, dayCost] = await Promise.all([getMonthCostInr(), getDayCostInr()]);
  const result = await getPool().query<{ id: string }>(
    `
      insert into system_health_logs (
        website_status, database_status, sitemap_status, robots_status, old_url_check,
        broken_links, missing_metadata, missing_alt_text, failed_tasks,
        monthly_budget_usage_inr, daily_ai_usage_inr, pending_approvals
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      returning id;
    `,
    [
      input.websiteStatus,
      input.databaseStatus,
      input.sitemapStatus,
      input.robotsStatus,
      input.oldUrlCheck,
      input.brokenLinks ?? 0,
      input.missingMetadata ?? 0,
      input.missingAltText ?? 0,
      input.failedTasks ?? 0,
      monthCost,
      dayCost,
      input.pendingApprovals ?? 0
    ]
  );
  return result.rows[0].id;
}
