import { getPool } from "@/lib/db";
import { ensureAdminDatabase } from "@/lib/db/admin";

export async function runCommandAgent() {
  await ensureAdminDatabase();
  const [approvals, reports, failedTasks] = await Promise.all([
    getPool().query(`select topic, item_type, status, risk_level from approval_queue order by created_at desc limit 8;`),
    getPool().query(`select type, city, state, message, status from cwi_report_submissions order by created_at desc limit 8;`).catch(() => ({ rows: [] })),
    getPool().query(`select agent_name, task_type, error_message from agent_tasks where status = 'failed' order by created_at desc limit 5;`)
  ]);

  const briefing = {
    topTopicsToday: approvals.rows.map((row) => row.topic),
    urgentUpdates: reports.rows.slice(0, 3),
    articlesToPrepare: approvals.rows.filter((row) => String(row.item_type || "").toLowerCase().includes("article")).slice(0, 4),
    socialPostsToPrepare: approvals.rows.filter((row) => String(row.item_type || "").toLowerCase().includes("social")).slice(0, 4),
    imagesNeeded: ["Review image packs attached to approval items before publishing."],
    seoTasks: ["Check sitemap after approved articles are merged into the public content system."],
    uiuxIssuesFound: failedTasks.rows,
    risksToAvoid: ["Do not auto-publish.", "Do not publish weakly sourced claims.", "Do not reuse creator content without credit/context."],
    itemsWaitingForApproval: approvals.rows
  };

  const result = await getPool().query<{ id: string }>(
    `
      insert into daily_briefings (
        top_topics, urgent_updates, articles_to_prepare, social_posts_to_prepare,
        images_needed, seo_tasks, uiux_issues, risks_to_avoid, approval_items
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      returning id;
    `,
    [
      JSON.stringify(briefing.topTopicsToday),
      JSON.stringify(briefing.urgentUpdates),
      JSON.stringify(briefing.articlesToPrepare),
      JSON.stringify(briefing.socialPostsToPrepare),
      JSON.stringify(briefing.imagesNeeded),
      JSON.stringify(briefing.seoTasks),
      JSON.stringify(briefing.uiuxIssuesFound),
      JSON.stringify(briefing.risksToAvoid),
      JSON.stringify(briefing.itemsWaitingForApproval)
    ]
  );

  return { ...briefing, dailyBriefingId: result.rows[0].id };
}
