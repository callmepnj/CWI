import { fail, ok, requireAdminApi } from "@/lib/ai/admin-api";
import { runArticleAgent } from "@/lib/ai/agents/article-agent";
import { improveArticleDraft, saveQualityScore, scoreArticleQuality } from "@/lib/ai/quality-engine";
import { rememberArticleDraft } from "@/lib/ai/source-memory";
import { assertArticleDraftAllowed } from "@/lib/ai/verification-engine";
import { getPool } from "@/lib/db";
import { createAgentTask, completeAgentTask, failAgentTask } from "@/lib/db/agents";
import { attachDraftToApprovalItem, getApprovalItem, saveApprovalItem } from "@/lib/db/approval";
import { saveArticleDraft } from "@/lib/db/articles";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const blocked = requireAdminApi(request);
  if (blocked) return blocked;

  const body = (await request.json().catch(() => null)) as {
    approvalQueueId?: string;
    researchPackId?: string;
    verificationReportId?: string;
  } | null;

  try {
    const approvalItem = body?.approvalQueueId ? await getApprovalItem(body.approvalQueueId) : null;
    const researchPackId = body?.researchPackId || approvalItem?.research_pack_id || (await latestId("research_packs"));
    if (!researchPackId) return fail(new Error("No research pack found. Run Research AI first."), 400);
    const verificationReportId = body?.verificationReportId || approvalItem?.verification_report_id || (await latestId("verification_reports"));

    const taskId = await createAgentTask({ agentName: "CWI Desk Writer", taskType: "article_draft", input: { researchPackId, verificationReportId } });
    try {
      const verificationGate = await assertArticleDraftAllowed({ researchPackId, verificationReportId });
      const rawArticle = await runArticleAgent({ researchPackId, verificationReportId });
      const firstQuality = scoreArticleQuality(rawArticle);
      const article = improveArticleDraft(rawArticle, firstQuality);
      const quality = scoreArticleQuality(article);
      if (quality.status === "blocked") {
        throw new Error(`Article quality gate blocked the draft. Readiness ${quality.publishReadinessScore}/100.`);
      }
      await completeAgentTask(taskId, article, article._meta?.estimatedCost ?? 0);
      const articleDraftId = await saveArticleDraft({
        researchPackId,
        title: article.title,
        slug: article.slug,
        category: article.category,
        summary: article.summary,
        body: article,
        verificationStatus: "Developing",
        sourceCount: article.sources.length
      });
      await saveQualityScore(quality, { topic: article.title, articleDraftId, approvalQueueId: approvalItem?.id });
      await rememberArticleDraft(article, { articleDraftId, approvalQueueId: approvalItem?.id });

      if (approvalItem?.id) {
        const updatedApproval = await attachDraftToApprovalItem({
          approvalQueueId: approvalItem.id,
          articleDraftId,
          summary: article.summary,
          adminNotes: "Article AI attached a draft to this approval item. Review it, then use Approve & Publish if ready."
        });

        return ok({ articleDraftId, approvalQueueId: updatedApproval?.id, article, updatedApproval, verificationGate, quality }, "Article draft attached to this approval item.");
      }

      const approvalQueueId = await saveApprovalItem({
        topic: article.title,
        itemType: "Article Draft",
        summary: article.summary,
        researchPackId,
        verificationReportId,
        articleDraftId,
        verificationStatus: "Draft Ready",
        riskLevel: "Medium",
        sourceCount: article.sources.length,
        status: "waiting_for_approval",
        adminNotes: "Review article before SEO/social/publish."
      });
      return ok({ articleDraftId, approvalQueueId, article, verificationGate, quality }, "Article draft saved.");
    } catch (error) {
      await failAgentTask(taskId, error instanceof Error ? error.message : "Article AI failed.");
      throw error;
    }
  } catch (error) {
    console.error("CWI Desk Writer failed", error);
    return fail(error);
  }
}

async function latestId(table: string) {
  const result = await getPool().query<{ id: string }>(`select id::text from ${table} order by created_at desc limit 1;`);
  return result.rows[0]?.id ?? "";
}
