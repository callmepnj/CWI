import { runArticleAgent } from "@/lib/ai/agents/article-agent";
import { posts } from "@/data/posts";
import { attachDraftToApprovalItem, getApprovalItem, isPublishApproved, updateApprovalItem } from "@/lib/db/approval";
import { getArticleDraft, saveArticleDraft, savePublishedArticle } from "@/lib/db/articles";
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
    articleUrl: url,
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

  const article = await runArticleAgent({
    researchPackId,
    verificationReportId: asText(approval.verification_report_id) || undefined
  });
  const articleDraftId = await saveArticleDraft({
    researchPackId,
    title: article.title,
    slug: article.slug,
    category: article.category,
    summary: article.summary,
    body: article,
    verificationStatus: asText(approval.verification_status) || "Developing",
    sourceCount: article.sources.length || Number(approval.source_count ?? 0)
  });

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
