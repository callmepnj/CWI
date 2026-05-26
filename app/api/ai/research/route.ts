import { fail, ok, requireAdminApi } from "@/lib/ai/admin-api";
import { runResearchAgent } from "@/lib/ai/agents/research-agent";
import { rememberApprovalItem, rememberResearchPack } from "@/lib/ai/source-memory";
import { createAgentTask, completeAgentTask, failAgentTask } from "@/lib/db/agents";
import { saveApprovalItem } from "@/lib/db/approval";
import { saveResearchPack } from "@/lib/db/research";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const blocked = requireAdminApi(request);
  if (blocked) return blocked;

  const body = (await request.json().catch(() => null)) as { topic?: string; url?: string; notes?: string; category?: string } | null;
  const topic = body?.topic?.trim() || "CWI priority research";

  try {
    const taskId = await createAgentTask({ agentName: "CWI Source Lens", taskType: "research_only", input: body ?? {} });
    try {
      const research = await runResearchAgent({ topic, url: body?.url, notes: body?.notes, category: body?.category });
      await completeAgentTask(taskId, research, research._meta?.estimatedCost ?? 0);
      const researchPackId = await saveResearchPack({
        topic: research.topic,
        category: research.category || body?.category || "Watch Desk",
        summary: research.summary,
        sources: research.sources,
        whatHappened: research.whatHappened,
        whatWeKnow: research.whatWeKnow,
        whatRemainsUnclear: research.whatRemainsUnclear,
        timeline: research.timeline,
        keyFacts: research.keyFacts,
        riskNotes: research.riskNotes,
        suggestedAngle: research.suggestedAngle
      });
      const approvalQueueId = await saveApprovalItem({
        topic: research.topic,
        itemType: "Research Pack",
        summary: research.summary,
        researchPackId,
        verificationStatus: "Research Ready",
        riskLevel: "Medium",
        sourceCount: research.sourceCount,
        status: "waiting_for_approval",
        adminNotes: "Review research before sending to Article AI."
      });
      await rememberResearchPack({ ...research, id: researchPackId, source_count: research.sourceCount });
      await rememberApprovalItem({ id: approvalQueueId, topic: research.topic, summary: research.summary, status: "waiting_for_approval", verification_status: "Research Ready", risk_level: "Medium", source_count: research.sourceCount });
      return ok({ researchPackId, approvalQueueId, research }, "Research pack saved and sent to approval queue.");
    } catch (error) {
      await failAgentTask(taskId, error instanceof Error ? error.message : "Research AI failed.");
      throw error;
    }
  } catch (error) {
    console.error("CWI Source Lens failed", error);
    return fail(error);
  }
}
