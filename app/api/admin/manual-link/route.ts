import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { runManualLinkToApproval } from "@/lib/ai/orchestrator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    url?: string;
    topic?: string;
    platform?: string;
    creatorSource?: string;
    notes?: string;
    priority?: string;
    contentType?: string;
  } | null;

  if (!body?.url) {
    return NextResponse.json({ ok: false, error: "URL is required." }, { status: 400 });
  }

  try {
    const result = await runManualLinkToApproval({ ...body, url: body.url });
    return NextResponse.json({ ok: true, message: "Manual link processed and sent to approval queue.", data: result });
  } catch (error) {
    console.error("CWI manual link failed", error);
    return NextResponse.json(
      { ok: false, error: "Manual link could not be processed. Add title, creator, date, context, and screenshot manually." },
      { status: 500 }
    );
  }
}
