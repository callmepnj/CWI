import { getPool } from "@/lib/db";
import { ensureAdminDatabase } from "@/lib/db/admin";
import { optionalUuid } from "@/lib/db/ids";

export async function saveSeoPack(pack: {
  articleDraftId?: string;
  seoTitle: string;
  metaDescription: string;
  slug: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  schemaJson: unknown;
  internalLinks: unknown[];
  altText: unknown[];
}) {
  await ensureAdminDatabase();
  const result = await getPool().query<{ id: string }>(
    `
      insert into seo_packs (
        article_draft_id, seo_title, meta_description, slug, canonical_url,
        open_graph_title, open_graph_description, open_graph_image,
        twitter_card, schema_json, internal_links, image_alt_text, sitemap_status
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Pending approval')
      returning id;
    `,
    [
      optionalUuid(pack.articleDraftId),
      pack.seoTitle,
      pack.metaDescription,
      pack.slug,
      pack.canonicalUrl,
      pack.ogTitle,
      pack.ogDescription,
      pack.ogImage,
      JSON.stringify({ title: pack.twitterTitle, description: pack.twitterDescription, card: "summary_large_image" }),
      JSON.stringify(pack.schemaJson),
      JSON.stringify(pack.internalLinks),
      JSON.stringify(pack.altText)
    ]
  );
  return result.rows[0].id;
}
