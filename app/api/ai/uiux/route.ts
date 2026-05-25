import { fail, ok, requireAdminApi } from "@/lib/ai/admin-api";
import { runUIUXAuditWorkflow } from "@/lib/ai/orchestrator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const blocked = requireAdminApi(request);
  if (blocked) return blocked;

  const body = (await request.json().catch(() => null)) as { page?: string; notes?: string } | null;

  try {
    const result = await runUIUXAuditWorkflow({ page: body?.page || "Homepage", notes: body?.notes });
    return ok(result, "UI/UX audit saved and sent to approval queue.");
  } catch (error) {
    console.error("CWI UI/UX AI failed", error);
    return fail(error);
  }
}
