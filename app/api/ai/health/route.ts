import { fail, ok, requireAdminApi } from "@/lib/ai/admin-api";
import { runSystemHealthWorkflow } from "@/lib/ai/orchestrator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const blocked = requireAdminApi(request);
  if (blocked) return blocked;

  try {
    const result = await runSystemHealthWorkflow();
    return ok(result, "System health check completed.");
  } catch (error) {
    console.error("CWI System Health AI failed", error);
    return fail(error);
  }
}

export async function GET(request: Request) {
  return POST(request);
}
