import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { updateCommentModeration } from "@/lib/cwi-admin-os";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { source?: string; id?: string; status?: string } | null;

  if (!body?.source || !body.id || !body.status) {
    return NextResponse.json({ ok: false, error: "Comment source, ID, and status are required." }, { status: 400 });
  }

  try {
    const result = await updateCommentModeration({
      source: body.source,
      id: body.id,
      status: body.status
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("CWI comment moderation failed", error);
    return NextResponse.json({ ok: false, error: "Comment status could not be updated." }, { status: 500 });
  }
}
