import { fail, ok, requireAdminApi } from "@/lib/ai/admin-api";
import { runSEOAgent } from "@/lib/ai/agents/seo-agent";
import { createAgentTask, completeAgentTask, failAgentTask } from "@/lib/db/agents";
import { saveApprovalItem } from "@/lib/db/approval";
import { saveSeoPack } from "@/lib/db/seo";
import { normalizeContentDestination } from "@/lib/ai/content-destination";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const blocked = requireAdminApi(request);
  if (blocked) return blocked;

  const body = (await request.json().catch(() => null)) as { articleDraftId?: string; topic?: string; contentDestination?: string } | null;

  if (!body?.articleDraftId && !body?.topic) {
    return fail(new Error("articleDraftId or topic is required."), 400);
  }

  try {
    const contentDestination = normalizeContentDestination(body.contentDestination);
    const taskId = await createAgentTask({ agentName: "CWI Rank Engine", taskType: "seo_pack", input: body, contentDestination });
    try {
      const seo = await runSEOAgent({ articleDraftId: body.articleDraftId, topic: body.topic, contentDestination });
      await completeAgentTask(taskId, seo, seo._meta?.estimatedCost ?? 0);
      const seoPackId = await saveSeoPack({ articleDraftId: body.articleDraftId, contentDestination, ...seo });
      const approvalQueueId = await saveApprovalItem({
        topic: seo.seoTitle,
        itemType: "SEO Pack",
        summary: seo.metaDescription,
        articleDraftId: body.articleDraftId,
        seoPackId,
        verificationStatus: "SEO Ready",
        riskLevel: "Low",
        sourceCount: 0,
        status: "waiting_for_approval",
        contentDestination,
        adminNotes: "Review metadata, canonical, schema, and sitemap notes before publish."
      });
      return ok({ seoPackId, approvalQueueId, seo }, "SEO pack saved.");
    } catch (error) {
      await failAgentTask(taskId, error instanceof Error ? error.message : "SEO AI failed.");
      throw error;
    }
  } catch (error) {
    console.error("CWI Rank Engine failed", error);
    return fail(error);
  }
}
