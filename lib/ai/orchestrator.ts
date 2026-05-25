import { runArticleAgent } from "@/lib/ai/agents/article-agent";
import { runCommandAgent } from "@/lib/ai/agents/command-agent";
import { runImageAgent } from "@/lib/ai/agents/image-agent";
import { runPublishAgent } from "@/lib/ai/agents/publish-agent";
import { runResearchAgent } from "@/lib/ai/agents/research-agent";
import { runSEOAgent } from "@/lib/ai/agents/seo-agent";
import { runSocialAgent } from "@/lib/ai/agents/social-agent";
import { runSystemHealthAgent } from "@/lib/ai/agents/system-health-agent";
import { runUIUXAgent } from "@/lib/ai/agents/uiux-agent";
import { runVerifyAgent } from "@/lib/ai/agents/verify-agent";
import { getPool } from "@/lib/db";
import { ensureAdminDatabase, getDayCostInr } from "@/lib/db/admin";
import { createAgentTask, completeAgentTask, failAgentTask } from "@/lib/db/agents";
import { saveApprovalItem } from "@/lib/db/approval";
import { saveArticleDraft, saveVerificationReport } from "@/lib/db/articles";
import { saveManualLink, saveResearchPack } from "@/lib/db/research";
import { saveSeoPack } from "@/lib/db/seo";
import { saveSocialPack } from "@/lib/db/social";

type ManualLinkInput = {
  url: string;
  topic?: string;
  platform?: string;
  creatorSource?: string;
  notes?: string;
  priority?: string;
  contentType?: string;
};

type TopicToArticleInput = {
  topic: string;
  category?: string;
  sourceNotes?: string;
  url?: string;
};

export async function runManualLinkToApproval(input: ManualLinkInput) {
  await ensureAdminDatabase();
  const url = normalizeUrl(input.url);
  const metadata = await extractUrlMetadata(url);
  const topic = clean(input.topic) || metadata.title || new URL(url).hostname;
  const platform = clean(input.platform) || detectPlatform(url);

  const manualLinkId = await saveManualLink({
    url,
    topic,
    platform,
    creatorSource: input.creatorSource,
    notes: input.notes,
    priority: input.priority,
    contentType: input.contentType,
    metadata
  });

  const research = await runTask("CWI Research AI", "manual_link_research", { url, topic, platform, metadata }, () =>
    runResearchAgent({ topic, url, platform, notes: input.notes, metadata, category: categoryFromContentType(input.contentType) })
  );
  const researchPackId = await saveResearchPack({
    topic: research.topic,
    category: research.category || categoryFromContentType(input.contentType),
    summary: research.summary,
    sources: research.sources,
    whatHappened: research.whatHappened,
    whatWeKnow: research.whatWeKnow,
    whatRemainsUnclear: research.whatRemainsUnclear,
    timeline: research.timeline,
    keyFacts: research.keyFacts,
    riskNotes: research.riskNotes,
    suggestedAngle: research.suggestedAngle
  });

  const verification = await runTask("CWI Verify AI", "manual_link_verify", { researchPackId }, () =>
    runVerifyAgent({ researchPack: { ...research, id: researchPackId } })
  );
  const verificationReportId = await saveVerificationReport({
    researchPackId,
    verificationStatus: verification.verificationStatus,
    riskLevel: verification.riskLevel,
    unsafeClaims: verification.unsafeClaims,
    saferWording: verification.saferWording,
    sourceGaps: verification.sourceGaps,
    publishRecommendation: verification.publishRecommendation
  });

  const article = await runTask("CWI Article AI", "manual_link_article", { researchPackId, verificationReportId }, () =>
    runArticleAgent({ researchPack: { ...research, id: researchPackId }, verificationReport: { ...verification, id: verificationReportId } })
  );
  const articleDraftId = await saveArticleDraft({
    researchPackId,
    title: article.title,
    slug: article.slug,
    category: article.category,
    summary: article.summary,
    body: article,
    verificationStatus: verification.verificationStatus,
    sourceCount: research.sourceCount
  });

  const seo = await runTask("CWI SEO AI", "manual_link_seo", { articleDraftId, title: article.title }, () =>
    runSEOAgent({ articleDraft: { id: articleDraftId, title: article.title, slug: article.slug, draft: article } })
  );
  const seoPackId = await saveSeoPack({ articleDraftId, ...seo });

  const social = await runTask("CWI Social AI", "manual_link_social", { articleDraftId, title: article.title }, () =>
    runSocialAgent({ articleDraft: { id: articleDraftId, title: article.title, draft: article } })
  );
  const socialPackId = await saveSocialPack({ articleDraftId, ...social });

  const image = await runTask("CWI Image AI", "manual_link_image", { topic: article.title }, () => runImageAgent({ topic: article.title, articleDraftId }));

  const approvalQueueId = await saveApprovalItem({
    topic: article.title,
    itemType: "Manual Link Workflow",
    summary: article.summary,
    researchPackId,
    verificationReportId,
    articleDraftId,
    seoPackId,
    socialPackId,
    imagePackId: image.imagePackId,
    verificationStatus: verification.verificationStatus,
    riskLevel: verification.riskLevel,
    sourceCount: research.sourceCount,
    status: "waiting_for_approval",
    adminNotes: "Human approval required. Publish AI cannot proceed until this is approved."
  });

  return {
    manualLinkId,
    researchPackId,
    verificationReportId,
    articleDraftId,
    seoPackId,
    socialPackId,
    imagePackId: image.imagePackId,
    approvalQueueId,
    status: "waiting_for_approval"
  };
}

export async function runTopicToArticle(input: TopicToArticleInput) {
  return runManualLinkToApproval({
    url: input.url || "https://www.cockroachwatchindia.online/watch-desk",
    topic: input.topic,
    platform: "Manual Topic",
    notes: input.sourceNotes,
    contentType: input.category || "Watch Desk"
  });
}

export async function runArticleToSocial(articleDraftId: string) {
  await ensureAdminDatabase();
  const social = await runTask("CWI Social AI", "article_to_social", { articleDraftId }, () => runSocialAgent({ articleDraftId }));
  const socialPackId = await saveSocialPack({ articleDraftId, ...social });
  const approvalQueueId = await saveApprovalItem({
    topic: "Social pack",
    itemType: "Social Pack",
    summary: "CWI Social AI generated captions for an article draft. Human review required.",
    articleDraftId,
    socialPackId,
    verificationStatus: "Opinion",
    riskLevel: "Low",
    sourceCount: 0,
    status: "waiting_for_approval",
    adminNotes: "Approve social captions before posting manually."
  });
  return { socialPackId, approvalQueueId };
}

export async function runUIUXAuditWorkflow(input: { page: string; notes?: string }) {
  await ensureAdminDatabase();
  const audit = await runTask("CWI UI/UX AI", "uiux_audit", input, () => runUIUXAgent(input));
  const result = await getPool().query<{ id: string }>(
    `
      insert into uiux_audits (page, issue, severity, suggested_text, fix_status)
      values ($1, $2, $3, $4, 'UI Review Ready')
      returning id;
    `,
    [
      audit.page,
      audit.issues.join("\n") || "No specific issue returned.",
      audit.severity,
      [...audit.suggestedFixes, ...audit.correctedCopy].join("\n\n")
    ]
  );
  const approvalQueueId = await saveApprovalItem({
    topic: `${audit.page} UI/UX audit`,
    itemType: "UI/UX Fix Pack",
    summary: audit.issues.join(" ") || "UI/UX audit generated for approval.",
    uiuxAuditId: result.rows[0].id,
    verificationStatus: "Opinion",
    riskLevel: audit.severity,
    sourceCount: 0,
    status: "waiting_for_approval",
    adminNotes: "No UI changes should be applied until approved."
  });
  return { uiuxAuditId: result.rows[0].id, approvalQueueId };
}

export async function runPublishApprovedItem(approvalQueueId: string) {
  await ensureAdminDatabase();
  return runTask("CWI Publish AI", "publish_approved_item", { approvalQueueId }, () => runPublishAgent(approvalQueueId), false);
}

export async function runSystemHealthWorkflow() {
  return runSystemHealthAgent();
}

export async function runCommandWorkflow() {
  return runTask("CWI Command AI", "daily_command_briefing", {}, () => runCommandAgent(), false);
}

async function runTask<T>(
  agentName: string,
  taskType: string,
  input: unknown,
  runner: () => Promise<T>,
  enforceBudget = true
) {
  if (enforceBudget) {
    await assertBudgetAllowsWork();
  }

  const taskId = await createAgentTask({ agentName, taskType, input, status: "running" });

  try {
    const output = await runner();
    const meta = (output as { _meta?: { estimatedCost?: number } })._meta;
    await completeAgentTask(taskId, output, meta?.estimatedCost ?? 0);
    return output;
  } catch (error) {
    const message = error instanceof Error ? error.message : `${agentName} failed.`;
    await failAgentTask(taskId, message);
    throw error;
  }
}

async function assertBudgetAllowsWork() {
  const dayCost = await getDayCostInr();
  if (dayCost >= 250) {
    throw new Error("Daily AI budget cap reached. Non-essential AI calls are paused until admin approval.");
  }
}

async function extractUrlMetadata(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6500);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "user-agent": "Cockroach Watch India manual link processor; contact cockroachwatchindia@gmail.com" }
    });
    const html = await response.text();
    return {
      title: clean(decodeHtml(match(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || matchMeta(html, "og:title"))) || new URL(url).hostname,
      description:
        clean(decodeHtml(matchMeta(html, "description") || matchMeta(html, "og:description"))) ||
        "No public metadata found. Manual context is required.",
      image: clean(matchMeta(html, "og:image")),
      sourceDomain: new URL(url).hostname,
      status: response.ok ? "extracted" : `http_${response.status}`
    };
  } catch {
    return {
      title: new URL(url).hostname,
      description: "Metadata extraction failed. Admin should add manual title, date, creator/source, and context.",
      image: "",
      sourceDomain: new URL(url).hostname,
      status: "manual_required"
    };
  } finally {
    clearTimeout(timeout);
  }
}

function match(html: string, pattern: RegExp) {
  return html.match(pattern)?.[1] ?? "";
}

function matchMeta(html: string, name: string) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const propertyPattern = new RegExp(`<meta[^>]+(?:name|property)=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i");
  const contentFirstPattern = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${escaped}["']`, "i");
  return match(html, propertyPattern) || match(html, contentFirstPattern);
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeUrl(value: string) {
  const trimmed = clean(value);
  const withProtocol = trimmed.startsWith("http://") || trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`;
  return new URL(withProtocol).toString();
}

function detectPlatform(url: string) {
  const lower = url.toLowerCase();
  if (lower.includes("instagram.com")) return "Instagram";
  if (lower.includes("x.com") || lower.includes("twitter.com")) return "X";
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "YouTube";
  if (lower.includes("reddit.com")) return "Reddit";
  if (lower.includes("bsky.app")) return "Bluesky";
  return "Website";
}

function categoryFromContentType(value?: string) {
  const lower = clean(value).toLowerCase();
  if (lower.includes("unanswered")) return "India Unanswered Files";
  if (lower.includes("advisory")) return "Public Advisory";
  if (lower.includes("social")) return "Social Pack";
  return "Watch Desk";
}

function clean(value?: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}
