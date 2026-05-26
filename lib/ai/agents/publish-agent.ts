import { runArticleAgent } from "@/lib/ai/agents/article-agent";
import { posts } from "@/data/posts";
import { improveArticleDraft, saveQualityScore, scoreArticleQuality } from "@/lib/ai/quality-engine";
import { rememberArticleDraft } from "@/lib/ai/source-memory";
import { assertArticleDraftAllowed } from "@/lib/ai/verification-engine";
import { attachDraftToApprovalItem, getApprovalItem, isPublishApproved, updateApprovalItem } from "@/lib/db/approval";
import { getArticleDraft, saveArticleDraft, savePublishedArticle } from "@/lib/db/articles";
import { normalizeContentDestination } from "@/lib/ai/content-destination";
import { saveLiveNewsroomItemFromDraft } from "@/lib/db/live-newsroom";
import { site } from "@/lib/site";

export async function runPublishAgent(approvalQueueId: string) {
  const approval = await getApprovalItem(approvalQueueId);

  if (!approval) {
    throw new Error("Approval queue item not found.");
  }

  if (!isPublishApproved(approval.status)) {
    throw new Error("Publishing blocked. Human approval required.");
  }

  const { articleDraft, generatedArticleDraft } = await getOrCreatePublishableDraft(approval);

  if (!articleDraft) {
    throw new Error("Publishing blocked. Article draft not found.");
  }

  const contentDestination = normalizeContentDestination(approval.content_destination || articleDraft.content_destination);

  if (contentDestination === "live_newsroom") {
    const liveItem = await saveLiveNewsroomItemFromDraft({
      approval,
      articleDraft
    });

    await updateApprovalItem(
      approvalQueueId,
      "published",
      generatedArticleDraft
        ? "Publish AI generated the missing article draft, saved it to live_newsroom_items, and opened the public Live Newsroom route."
        : "Publish AI saved the approved item to live_newsroom_items and opened the public Live Newsroom route."
    );

    return {
      publishedArticleId: liveItem.id,
      publishedLiveNewsroomId: liveItem.id,
      articleDraftId: articleDraft.id,
      articleUrl: liveItem.url,
      contentDestination,
      generatedArticleDraft,
      sitemapStatus: "Live Newsroom route is dynamic. Static sitemap includes the Live Newsroom index and fallback source-backed items.",
      metadataStatus: "SEO pack remains attached to approval item.",
      buildStatus: "Not required for dynamic public visibility.",
      deploymentChecklist: [
        "Open the public Live Newsroom URL and review formatting.",
        "Confirm sources are visible on the detail page.",
        "Check the approval item is marked published.",
        "Run npm run build before deploy.",
        "Inspect the final URL in Google Search Console."
      ]
    };
  }

  const slug = publicSlugForDraft(articleDraft.slug, articleDraft.id);
  const url = `${site.url}/watch-desk/${slug}`;
  const publishedArticleId = await savePublishedArticle({
    articleDraftId: articleDraft.id,
    title: articleDraft.title,
    slug,
    url,
    category: articleDraft.category,
    metadata: {
      approvalQueueId,
      generatedArticleDraft,
      note: "Published to the CWI admin database and served by the dynamic Watch Desk public route."
    }
  });

  await updateApprovalItem(
    approvalQueueId,
    "published",
    generatedArticleDraft
      ? "Publish AI generated the missing article draft, saved it to published_articles, and opened the public Watch Desk route."
      : "Publish AI saved the approved item to the published_articles table and opened the public Watch Desk route."
  );

  return {
    publishedArticleId,
    articleDraftId: articleDraft.id,
    articleUrl: url,
    contentDestination,
    generatedArticleDraft,
    sitemapStatus: "Dynamic public route is live immediately. Static sitemap regeneration is still recommended before major deploys.",
    metadataStatus: "SEO pack remains attached to approval item.",
    buildStatus: "Not required for dynamic public visibility.",
    deploymentChecklist: [
      "Review published article row.",
      "Open the public article URL and review formatting.",
      "If this should be permanent static seed content, merge the article into the site content system later.",
      "Run npm run build before deploy.",
      "Inspect the final URL in Google Search Console."
    ]
  };
}

async function getOrCreatePublishableDraft(approval: Record<string, unknown>) {
  const attachedDraftId = asText(approval.article_draft_id);
  if (attachedDraftId) {
    return { articleDraft: await getArticleDraft(attachedDraftId), generatedArticleDraft: false };
  }

  const researchPackId = asText(approval.research_pack_id);
  if (!researchPackId) {
    throw new Error("Publishing blocked. Approved item has no article draft or research pack attached.");
  }

  await assertArticleDraftAllowed({
    researchPackId,
    verificationReportId: asText(approval.verification_report_id) || undefined
  });

  const rawArticle = await runArticleAgent({
    researchPackId,
    verificationReportId: asText(approval.verification_report_id) || undefined
  });
  const firstQuality = scoreArticleQuality(rawArticle);
  const article = improveArticleDraft(rawArticle, firstQuality);
  const quality = scoreArticleQuality(article);
  if (quality.status === "blocked") {
    throw new Error(`Publishing blocked. Article quality score is ${quality.publishReadinessScore}/100.`);
  }
  const articleDraftId = await saveArticleDraft({
    researchPackId,
    title: article.title,
    slug: article.slug,
    category: article.category,
    summary: article.summary,
    body: article,
    verificationStatus: asText(approval.verification_status) || "Developing",
    sourceCount: article.sources.length || Number(approval.source_count ?? 0),
    contentDestination: normalizeContentDestination(approval.content_destination)
  });
  await saveQualityScore(quality, { topic: article.title, articleDraftId, approvalQueueId: asText(approval.id) });
  await rememberArticleDraft(article, { articleDraftId, approvalQueueId: asText(approval.id) });

  await attachDraftToApprovalItem({
    approvalQueueId: asText(approval.id),
    articleDraftId,
    summary: article.summary,
    adminNotes: "Publish AI generated and attached an article draft during approved publishing."
  });

  return { articleDraft: await getArticleDraft(articleDraftId), generatedArticleDraft: true };
}

function publicSlugForDraft(value: unknown, articleDraftId: unknown) {
  const base = slugify(asText(value) || asText(articleDraftId) || "cwi-watch-desk-update");
  const suffix = asText(articleDraftId).slice(0, 8);

  if (posts.some((post) => post.slug === base)) {
    return suffix ? `${base}-${suffix}` : `${base}-published`;
  }

  return base;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "cwi-watch-desk-update";
}

function asText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}
