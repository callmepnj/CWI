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
      note: "Published to CWI admin database. Static website content updates still require a deploy step."
    }
  });

  await updateApprovalItem(approvalQueueId, "published", "Publish AI saved the approved item to the published_articles table.");

  return {
    publishedArticleId,
    articleUrl: url,
    sitemapStatus: "Needs deploy/regeneration if this article should become a static public page.",
    metadataStatus: "SEO pack remains attached to approval item.",
    buildStatus: "Not run by API route.",
    deploymentChecklist: [
      "Review published article row.",
      "If public static page is needed, merge the article into the site content system.",
      "Run npm run build before deploy.",
      "Inspect the final URL in Google Search Console."
    ]
  };
}
