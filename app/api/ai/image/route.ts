import { fail, ok, requireAdminApi } from "@/lib/ai/admin-api";
import { runImageAgent } from "@/lib/ai/agents/image-agent";
import { createAgentTask, completeAgentTask, failAgentTask } from "@/lib/db/agents";
import { saveApprovalItem } from "@/lib/db/approval";
import { normalizeContentDestination } from "@/lib/ai/content-destination";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const blocked = requireAdminApi(request);
  if (blocked) return blocked;

  const body = (await request.json().catch(() => null)) as { topic?: string; articleDraftId?: string; contentDestination?: string } | null;
  const topic = body?.topic || "CWI image pack";
  const contentDestination = normalizeContentDestination(body?.contentDestination);

  try {
    const taskId = await createAgentTask({ agentName: "CWI Visual Desk", taskType: "image_pack", input: body ?? {}, contentDestination });
    try {
      const image = await runImageAgent({ topic, articleDraftId: body?.articleDraftId, contentDestination });
      await completeAgentTask(taskId, image, 0);
      const approvalQueueId = await saveApprovalItem({
        topic,
        itemType: "Image Pack",
        summary: image.imageNotes,
        articleDraftId: body?.articleDraftId,
        imagePackId: image.imagePackId,
        verificationStatus: "Image Ready",
        riskLevel: "Low",
        sourceCount: 0,
        status: "waiting_for_approval",
        contentDestination,
        adminNotes: "Check image relevance, credit, and topic match before use."
      });
      return ok({ imagePackId: image.imagePackId, approvalQueueId, image }, "Image pack saved.");
    } catch (error) {
      await failAgentTask(taskId, error instanceof Error ? error.message : "Image AI failed.");
      throw error;
    }
  } catch (error) {
    console.error("CWI Visual Desk failed", error);
    return fail(error);
  }
}
