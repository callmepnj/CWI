import { fail, ok, requireAdminApi } from "@/lib/ai/admin-api";
import { runManualLinkToApproval } from "@/lib/ai/orchestrator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const blocked = requireAdminApi(request);
  if (blocked) return blocked;

  const body = (await request.json().catch(() => null)) as {
    url?: string;
    topic?: string;
    platform?: string;
    creatorSource?: string;
    notes?: string;
    priority?: string;
    contentType?: string;
    contentDestination?: string;
  } | null;

  if (!body?.url) {
    return fail(new Error("URL is required."), 400);
  }

  try {
    const result = await runManualLinkToApproval({ ...body, url: body.url });
    return ok(result, "Manual link processed and sent to approval queue.");
  } catch (error) {
    console.error("CWI manual link workflow failed", error);
    return fail(error);
  }
}
