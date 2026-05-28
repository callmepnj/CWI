import { fail, ok, requireAdminApi } from "@/lib/ai/admin-api";
import { runPublishApprovedItem } from "@/lib/ai/orchestrator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const blocked = requireAdminApi(request);
  if (blocked) return blocked;

  const body = (await request.json().catch(() => null)) as { approvalQueueId?: string } | null;

  if (!body?.approvalQueueId) {
    return fail(new Error("approvalQueueId is required."), 400);
  }

  try {
    const result = await runPublishApprovedItem(body.approvalQueueId);
    return ok(result, "Approved item is published and available on the approved public route.");
  } catch (error) {
    console.error("CWI Publish AI failed", error);
    return fail(error, error instanceof Error && error.message.includes("Human approval") ? 403 : 500);
  }
}
