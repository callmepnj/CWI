import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { updateApprovalItem } from "@/lib/db/approval";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { id?: string; status?: string; notes?: string } | null;

  if (!body?.id || !body.status) {
    return NextResponse.json({ ok: false, error: "Approval item ID and status are required." }, { status: 400 });
  }

  try {
    const item = await updateApprovalItem(body.id, normalizeStatus(body.status), body.notes);
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("CWI approval update failed", error);
    return NextResponse.json({ ok: false, error: "Approval status could not be updated." }, { status: 500 });
  }
}

function normalizeStatus(status: string) {
  const map: Record<string, string> = {
    "Approve Publish": "approved",
    "Approve & Publish": "approved",
    "Approved Publish": "approved",
    "Approve Article Only": "approved_article_only",
    "Approved Article Only": "approved_article_only",
    "Approve Social Only": "approved_social_only",
    "Approved Social Only": "approved_social_only",
    "Request Changes": "changes_requested",
    Reject: "rejected",
    Rejected: "rejected",
    Archive: "archived",
    Archived: "archived",
    "Save for Later": "waiting_for_approval",
    approved_publish: "approved",
    approved: "approved",
    approved_article_only: "approved_article_only",
    approved_social_only: "approved_social_only",
    rejected: "rejected",
    changes_requested: "changes_requested",
    archived: "archived",
    waiting_for_approval: "waiting_for_approval"
  };
  return map[status] || status;
}
