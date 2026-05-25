import { getApprovalItem, updateApprovalItem } from "@/lib/db/approval";
import { getArticleDraft, savePublishedArticle } from "@/lib/db/articles";
import { site } from "@/lib/site";

export async function runPublishAgent(approvalQueueId: string) {
  const approval = await getApprovalItem(approvalQueueId);

  if (!approval) {
    throw new Error("Approval queue item not found.");
  }

  if (approval.status !== "approved") {
    throw new Error("Publishing blocked. Human approval required.");
  }

  if (!approval.article_draft_id) {
    throw new Error("Publishing blocked. Approved item has no article draft attached.");
  }

  const articleDraft = await getArticleDraft(approval.article_draft_id);

  if (!articleDraft) {
    throw new Error("Publishing blocked. Article draft not found.");
  }

  const slug = articleDraft.slug || String(articleDraft.id);
  const url = `${site.url}/watch-desk/${slug}`;
  const publishedArticleId = await savePublishedArticle({
    articleDraftId: articleDraft.id,
    title: articleDraft.title,
    slug,
    url,
    category: articleDraft.category,
    metadata: {
      approvalQueueId,
      note: "Published to the CWI admin database and served by the dynamic Watch Desk public route."
    }
  });

  await updateApprovalItem(approvalQueueId, "published", "Publish AI saved the approved item to the published_articles table.");

  return {
    publishedArticleId,
    articleUrl: url,
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
