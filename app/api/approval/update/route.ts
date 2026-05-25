import { fail, ok, requireAdminApi } from "@/lib/ai/admin-api";
import { updateApprovalItem } from "@/lib/db/approval";

export const runtime = "nodejs";

const statusMap: Record<string, string> = {
  "Approve Publish": "approved",
  "Approve & Publish": "approved",
  "Approved Publish": "approved",
  "Approve Article Only": "approved_article_only",
  "Approved Article Only": "approved_article_only",
  "Approve Social Only": "approved_social_only",
  "Approved Social Only": "approved_social_only",
  "Request Changes": "changes_requested",
  Rejected: "rejected",
  Reject: "rejected",
  "Save for Later": "waiting_for_approval",
  Archived: "archived",
  Archive: "archived",
  approved: "approved",
  rejected: "rejected",
  changes_requested: "changes_requested",
  published: "published",
  archived: "archived",
  waiting_for_approval: "waiting_for_approval",
  approved_publish: "approved",
  approved_article_only: "approved_article_only",
  approved_social_only: "approved_social_only"
};

export async function PATCH(request: Request) {
  const blocked = requireAdminApi(request);
  if (blocked) return blocked;

  const body = (await request.json().catch(() => null)) as { id?: string; status?: string; notes?: string } | null;

  if (!body?.id || !body.status) {
    return fail(new Error("Approval item ID and status are required."), 400);
  }

  try {
    const status = statusMap[body.status] || body.status;
    const item = await updateApprovalItem(body.id, status, body.notes);
    return ok(item, `Approval queue updated: ${status}.`);
  } catch (error) {
    console.error("CWI approval update failed", error);
    return fail(error);
  }
}
