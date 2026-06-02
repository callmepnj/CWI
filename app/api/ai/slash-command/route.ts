import { fail, ok, requireAdminApi } from "@/lib/ai/admin-api";
import { runPublishApprovedItem, runSystemHealthWorkflow, runUIUXAuditWorkflow } from "@/lib/ai/orchestrator";
import { getApprovalItem, saveApprovalItem, updateApprovalItem } from "@/lib/db/approval";
import {
  cjpExamSourcePackRecords,
  findSourcePackRecord,
  slashCommandHelp,
  sourcePackSourceLibrary,
  sourcePackTimeline,
  sourcePackUnansweredFileCard,
  type SourcePackRecord
} from "@/data/live-newsroom-source-pack";

export const runtime = "nodejs";

type SlashBody = {
  command?: string;
  selectedItem?: string;
  approvalQueueId?: string;
  notes?: string;
};

const approvalCommands: Record<string, string> = {
  approve: "approved",
  reject: "rejected",
  changes: "changes_requested"
};

export async function POST(request: Request) {
  const blocked = requireAdminApi(request);
  if (blocked) return blocked;

  const body = (await request.json().catch(() => null)) as SlashBody | null;
  const parsed = parseSlashCommand(body?.command || "");
  if (!parsed.name) {
    return fail(new Error("Type a slash command, for example /next or /newsroom cjp."), 400);
  }

  try {
    const result = await runSlashCommand({ ...parsed, selectedItem: body?.selectedItem, approvalQueueId: body?.approvalQueueId, notes: body?.notes });
    return ok(result, result.message);
  } catch (error) {
    console.error("CWI slash command failed", error);
    return fail(error, error instanceof Error && error.message.includes("Human approval") ? 403 : 500);
  }
}

async function runSlashCommand(input: { name: string; query: string; selectedItem?: string; approvalQueueId?: string; notes?: string }) {
  const command = input.name;
  const query = input.query || input.selectedItem || "";
  const record = findSourcePackRecord(query) || cjpExamSourcePackRecords[0];

  if (command === "help") {
    return response("Slash command help", "Choose a command, then add a slug or topic name.", "/next", { commands: slashCommandHelp });
  }

  if (command === "next") {
    const next = record.sourceGaps.length ? "/verify" : "/seo";
    return response(
      "Next recommended action",
      `Run ${next} ${record.slug} because this item is ${record.verificationStatus.toLowerCase()} with ${record.sourceGaps.length} open source gap${record.sourceGaps.length === 1 ? "" : "s"}.`,
      `${next} ${record.slug}`,
      { selectedItem: summarize(record), sourceGaps: record.sourceGaps }
    );
  }

  if (command === "status") {
    return response("Current status", `${record.headline} is pending approval. Public publishing is blocked until human approval.`, "/sources-needed", { selectedItem: summarize(record), seoPreview: record.seoPreview, socialPreview: record.socialPreview });
  }

  if (command === "sources-needed" || command === "legal-check" || command === "publish-check") {
    return response(
      command === "sources-needed" ? "Sources needed" : command === "legal-check" ? "Legal/safety check" : "Pre-publish check",
      `${record.sourceGaps.length} verification gap${record.sourceGaps.length === 1 ? "" : "s"} remain. Publishing must stay blocked until these are resolved or clearly labelled developing.`,
      "/verify " + record.slug,
      { selectedItem: summarize(record), sourceGaps: record.sourceGaps, riskLevel: record.riskLevel }
    );
  }

  if (command === "source") {
    return response("Source Library", "Visible source library prepared from attached source packs. Review URLs and source limits before approval.", "/timeline", { sources: sourcePackSourceLibrary });
  }

  if (command === "timeline") {
    return response("Timeline", "Paper Leak Pivot and June 6 Mobilization timeline prepared for approval.", "/verify", { timeline: sourcePackTimeline });
  }

  if (command === "unanswered") {
    const approvalQueueId = await trySaveApproval(record, "India Unanswered Files Pending Card", sourcePackUnansweredFileCard.summary, input.notes);
    return response("India Unanswered Files card queued", "National Exam Accountability Crisis is prepared as a pending file connection. It is not public until approved.", "/verify national-exam-accountability-crisis", { approvalQueueId, card: sourcePackUnansweredFileCard });
  }

  if (command === "health") {
    const health = await runSystemHealthWorkflow();
    return response("System health check", "System Health AI completed. Review the generated health record before acting on fixes.", "/fix-ui /live-newsroom", { health });
  }

  if (command === "fix-ui") {
    const audit = await runUIUXAuditWorkflow({ page: query || "/live-newsroom", notes: input.notes || "Slash-command UI/UX readability audit." });
    return response("UI/UX audit queued", "UI/UX audit result was sent to approval. No public UI changes are made by this command.", "/status", audit);
  }

  if (command === "publish") {
    if (!input.approvalQueueId) {
      return response("Publishing blocked. Human approval required.", "Provide an approved approvalQueueId before publishing. Source-pack slugs alone cannot publish.", "/status " + record.slug, { selectedItem: summarize(record), blocked: true });
    }
    const item = await getApprovalItem(input.approvalQueueId);
    if (!item || item.status !== "approved") {
      return response("Publishing blocked. Human approval required.", "The selected approval item is not approved. Use Approve Publish first.", "/status " + record.slug, { approvalQueueId: input.approvalQueueId, approvalStatus: item?.status || "missing", blocked: true });
    }
    const published = await runPublishApprovedItem(input.approvalQueueId);
    return response("Published approved item", "Approved item published through existing CWI Publish AI workflow.", "/status", published);
  }

  if (command in approvalCommands) {
    if (!input.approvalQueueId) {
      return response("Approval action needs an approvalQueueId", `/${command} is ready, but static source-pack records must be added to the DB approval queue first.`, "/add " + record.slug, { selectedItem: summarize(record) });
    }
    const item = await updateApprovalItem(input.approvalQueueId, approvalCommands[command], input.notes);
    return response("Approval queue updated", `Approval item moved to ${approvalCommands[command]}.`, command === "approve" ? "/publish" : "/next", { item });
  }

  if (["add", "research", "verify", "draft", "seo", "social", "image", "newsroom", "advisory", "caption", "reddit", "x", "ig"].includes(command)) {
    const itemType = itemTypeFor(command, record);
    const approvalQueueId = await trySaveApproval(record, itemType, approvalSummaryFor(command, record), input.notes);
    return response(
      `${itemType} queued`,
      `${record.headline} was prepared for approval. Nothing has been published.`,
      nextCommandFor(command, record),
      { approvalQueueId, selectedItem: summarize(record), draftPreview: record.draftPreview, seoPreview: record.seoPreview, socialPreview: socialPreviewFor(command, record), sourceGaps: record.sourceGaps }
    );
  }

  return response("Unknown command", `Supported commands include ${slashCommandHelp.slice(0, 8).join(", ")} ...`, "/help", { commands: slashCommandHelp });
}

async function trySaveApproval(record: SourcePackRecord, itemType: string, summary: string, notes?: string) {
  try {
    return await saveApprovalItem({
      topic: record.headline,
      itemType,
      summary,
      verificationStatus: record.verificationStatus,
      riskLevel: record.riskLevel,
      sourceCount: record.sourceCount,
      status: "waiting_for_approval",
      adminNotes: notes || `Source-pack command output. Public publishing blocked until human approval. Source gaps: ${record.sourceGaps.join("; ")}`
    });
  } catch {
    return `fallback-${record.slug}`;
  }
}

function parseSlashCommand(value: string) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) return { name: "", query: trimmed };
  const [raw, ...rest] = trimmed.slice(1).split(/\s+/);
  return { name: raw.toLowerCase(), query: rest.join(" ").trim() };
}

function summarize(record: SourcePackRecord) {
  return {
    title: record.headline,
    slug: record.slug,
    type: record.type,
    category: record.category,
    verificationStatus: record.verificationStatus,
    riskLevel: record.riskLevel,
    sourceCount: record.sourceCount,
    approvalStatus: record.approvalStatus
  };
}

function response(title: string, message: string, nextCommand: string, data: Record<string, unknown>) {
  return { title, message, nextCommand, data, approvalRequired: true, autoPublished: false };
}

function itemTypeFor(command: string, record: SourcePackRecord) {
  if (command === "seo") return "SEO Preview Pack";
  if (command === "social" || command === "caption" || command === "reddit" || command === "x" || command === "ig") return "Social Preview Pack";
  if (command === "image") return "Image Assignment Pack";
  if (command === "verify" || command === "legal-check") return "Verification Pack";
  if (command === "advisory" || record.category === "Public Advisory") return "Public Advisory Draft";
  if (command === "research" || command === "add") return "Research Pack";
  return "Live Newsroom Draft";
}

function approvalSummaryFor(command: string, record: SourcePackRecord) {
  if (command === "seo") return `${record.metaDescription} Canonical preview: ${record.seoPreview.canonical}`;
  if (command === "social" || command === "caption" || command === "reddit" || command === "x" || command === "ig") return record.socialCaption;
  if (command === "verify" || command === "legal-check") return `Verification required. Source gaps: ${record.sourceGaps.join("; ")}`;
  return record.draftPreview || record.whatHappened;
}

function socialPreviewFor(command: string, record: SourcePackRecord) {
  if (command === "reddit") return { reddit: record.socialPreview.reddit };
  if (command === "x") return { x: record.socialPreview.x, bluesky: record.socialPreview.bluesky };
  if (command === "ig") return { instagram: record.socialPreview.instagram, facebook: record.socialPreview.facebook };
  return record.socialPreview;
}

function nextCommandFor(command: string, record: SourcePackRecord) {
  if (command === "add" || command === "research") return `/verify ${record.slug}`;
  if (command === "verify" || command === "legal-check") return `/draft ${record.slug}`;
  if (command === "draft" || command === "newsroom" || command === "advisory") return `/seo ${record.slug}`;
  if (command === "seo") return `/social ${record.slug}`;
  if (command === "social" || command === "caption") return `/publish-check ${record.slug}`;
  return `/next ${record.slug}`;
}


