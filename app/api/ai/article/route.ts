import { fail, ok, requireAdminApi } from "@/lib/ai/admin-api";
import { runArticleAgent } from "@/lib/ai/agents/article-agent";
import { getPool } from "@/lib/db";
import { createAgentTask, completeAgentTask, failAgentTask } from "@/lib/db/agents";
import { saveApprovalItem } from "@/lib/db/approval";
import { saveArticleDraft } from "@/lib/db/articles";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const blocked = requireAdminApi(request);
  if (blocked) return blocked;

  const body = (await request.json().catch(() => null)) as { researchPackId?: string; verificationReportId?: string } | null;

  try {
    const researchPackId = body?.researchPackId || (await latestId("research_packs"));
    if (!researchPackId) return fail(new Error("No research pack found. Run Research AI first."), 400);
    const verificationReportId = body?.verificationReportId || (await latestId("verification_reports"));

    const taskId = await createAgentTask({ agentName: "CWI Article AI", taskType: "article_draft", input: { researchPackId, verificationReportId } });
    try {
      const article = await runArticleAgent({ researchPackId, verificationReportId });
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
      return ok({ articleDraftId, approvalQueueId, article }, "Article draft saved.");
    } catch (error) {
      await failAgentTask(taskId, error instanceof Error ? error.message : "Article AI failed.");
      throw error;
    }
  } catch (error) {
    console.error("CWI Article AI failed", error);
    return fail(error);
  }
}

async function latestId(table: string) {
  const result = await getPool().query<{ id: string }>(`select id::text from ${table} order by created_at desc limit 1;`);
  return result.rows[0]?.id ?? "";
}
