import { fail, ok, requireAdminApi } from "@/lib/ai/admin-api";
import { runCommandWorkflow } from "@/lib/ai/orchestrator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const blocked = requireAdminApi(request);
  if (blocked) return blocked;

  try {
    const result = await runCommandWorkflow();
    return ok(result, "Daily Command Briefing generated.");
  } catch (error) {
    console.error("CWI Command AI failed", error);
    return fail(error);
  }
}
