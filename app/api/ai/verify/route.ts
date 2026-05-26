import { fail, ok, requireAdminApi } from "@/lib/ai/admin-api";
import { runVerifyAgent } from "@/lib/ai/agents/verify-agent";
import { runVerificationGate } from "@/lib/ai/verification-engine";
import { getPool } from "@/lib/db";
import { createAgentTask, completeAgentTask, failAgentTask } from "@/lib/db/agents";
import { saveApprovalItem } from "@/lib/db/approval";
import { saveVerificationReport } from "@/lib/db/articles";
import { normalizeContentDestination } from "@/lib/ai/content-destination";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const blocked = requireAdminApi(request);
  if (blocked) return blocked;

  const body = (await request.json().catch(() => null)) as { researchPackId?: string; contentDestination?: string } | null;

  try {
    const researchPackId = body?.researchPackId || (await latestId("research_packs"));
    if (!researchPackId) return fail(new Error("No research pack found. Run Research AI first."), 400);
    const contentDestination = normalizeContentDestination(body?.contentDestination);

    const taskId = await createAgentTask({ agentName: "CWI Verify Shield", taskType: "verify_pack", input: { researchPackId, contentDestination }, contentDestination });
    try {
      const verification = await runVerifyAgent({ researchPackId });
      await completeAgentTask(taskId, verification, verification._meta?.estimatedCost ?? 0);
      const verificationReportId = await saveVerificationReport({
        researchPackId,
        verificationStatus: verification.verificationStatus,
        riskLevel: verification.riskLevel,
        unsafeClaims: verification.unsafeClaims,
        saferWording: verification.saferWording,
        sourceGaps: verification.sourceGaps,
        publishRecommendation: verification.publishRecommendation,
        contentDestination
      });
      const verificationGate = await runVerificationGate({ researchPackId, verificationReportId });
      const approvalQueueId = await saveApprovalItem({
        topic: "Verification report",
        itemType: "Verification Report",
        summary: verification.publishRecommendation,
        researchPackId,
        verificationReportId,
        verificationStatus: verification.verificationStatus,
        riskLevel: verification.riskLevel,
        sourceCount: 0,
        status: "waiting_for_approval",
        contentDestination,
        adminNotes: "Review verification before drafting or publishing."
      });
      return ok({ verificationReportId, approvalQueueId, verification, verificationGate }, "Verification report saved.");
    } catch (error) {
      await failAgentTask(taskId, error instanceof Error ? error.message : "Verify AI failed.");
      throw error;
    }
  } catch (error) {
    console.error("CWI Verify Shield failed", error);
    return fail(error);
  }
}

async function latestId(table: string) {
  const result = await getPool().query<{ id: string }>(`select id::text from ${table} order by created_at desc limit 1;`);
  return result.rows[0]?.id ?? "";
}
