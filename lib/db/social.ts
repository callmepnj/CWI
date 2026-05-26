import { getPool } from "@/lib/db";
import { ensureAdminDatabase } from "@/lib/db/admin";
import { optionalUuid } from "@/lib/db/ids";
import { site } from "@/lib/site";
import { normalizeContentDestination, type ContentDestination } from "@/lib/ai/content-destination";

export async function saveSocialPack(pack: {
  articleDraftId?: string;
  instagramCaption: string;
  facebookCaption: string;
  xCaption: string;
  redditTitle: string;
  redditBody: string;
  youtubeTitle: string;
  youtubeDescription: string;
  blueskyCaption: string;
  discordMessage: string;
  hashtags: string[];
  contentDestination?: ContentDestination;
}) {
  await ensureAdminDatabase();
  const result = await getPool().query<{ id: string }>(
    `
      insert into social_packs (
        article_draft_id, content_destination, instagram_caption, facebook_caption, x_caption,
        reddit_title, reddit_body, youtube_shorts_title, youtube_shorts_description,
        bluesky_caption, discord_announcement, hashtag_set, credit_line, website_line,
        risk_note
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Source/creator credit required where applicable', $13, 'Human review required before posting')
      returning id;
    `,
    [
      optionalUuid(pack.articleDraftId),
      normalizeContentDestination(pack.contentDestination),
      pack.instagramCaption,
      pack.facebookCaption,
      pack.xCaption,
      pack.redditTitle,
      pack.redditBody,
      pack.youtubeTitle,
      pack.youtubeDescription,
      pack.blueskyCaption,
      pack.discordMessage,
      JSON.stringify(pack.hashtags),
      `Website: ${site.url}`
    ]
  );
  return result.rows[0].id;
}
