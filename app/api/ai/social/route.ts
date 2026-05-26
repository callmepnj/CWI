import { fail, ok, requireAdminApi } from "@/lib/ai/admin-api";
import { runSocialAgent } from "@/lib/ai/agents/social-agent";
import { createAgentTask, completeAgentTask, failAgentTask } from "@/lib/db/agents";
import { saveApprovalItem } from "@/lib/db/approval";
import { saveSocialPack } from "@/lib/db/social";
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
    const taskId = await createAgentTask({ agentName: "CWI Signal Studio", taskType: "social_pack", input: body, contentDestination });
    try {
      const social = await runSocialAgent({ articleDraftId: body.articleDraftId, topic: body.topic, contentDestination });
      await completeAgentTask(taskId, social, social._meta?.estimatedCost ?? 0);
      const socialPackId = await saveSocialPack({ articleDraftId: body.articleDraftId, contentDestination, ...social });
      const approvalQueueId = await saveApprovalItem({
        topic: body.topic || "Social pack",
        itemType: "Social Pack",
        summary: social.xCaption,
        articleDraftId: body.articleDraftId,
        socialPackId,
        verificationStatus: "Social Ready",
        riskLevel: "Low",
        sourceCount: 0,
        status: "waiting_for_approval",
        contentDestination,
        adminNotes: "Approve social captions manually before posting."
      });
      return ok({ socialPackId, approvalQueueId, social }, "Social pack saved.");
    } catch (error) {
      await failAgentTask(taskId, error instanceof Error ? error.message : "Social AI failed.");
      throw error;
    }
  } catch (error) {
    console.error("CWI Signal Studio failed", error);
    return fail(error);
  }
}
