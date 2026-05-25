import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { runCommandWorkflow, runSystemHealthWorkflow, runTopicToArticle, runUIUXAuditWorkflow } from "@/lib/ai/orchestrator";
import { runAgentAction } from "@/lib/cwi-admin-os";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { action?: string } | null;
  const action = body?.action?.trim() ?? "";

  try {
    if (action === "daily-workflow" || action === "daily-briefing") {
      const data = await runCommandWorkflow();
      return NextResponse.json({ ok: true, message: "Daily Command Briefing generated.", data });
    }

    if (action === "research-only" || action === "article-draft") {
      const data = await runTopicToArticle({
        topic: "CWI priority public-interest update",
        sourceNotes: `Admin-triggered ${action} workflow.`
      });
      return NextResponse.json({ ok: true, message: "AI workflow sent to approval queue.", data });
    }

    if (action === "uiux-audit") {
      const data = await runUIUXAuditWorkflow({ page: "Homepage", notes: "Admin-triggered UI/UX audit." });
      return NextResponse.json({ ok: true, message: "UI/UX audit sent to approval queue.", data });
    }

    if (action === "seo-check" || action === "system-health") {
      const data = await runSystemHealthWorkflow();
      return NextResponse.json({ ok: true, message: "System health check completed.", data });
    }

    const result = await runAgentAction(action);
    return NextResponse.json(result);
  } catch (error) {
    console.error("CWI agent action failed", error);
    return NextResponse.json({ ok: false, error: "Agent action failed." }, { status: 500 });
  }
}
