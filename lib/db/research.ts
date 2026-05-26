import { getPool } from "@/lib/db";
import { ensureAdminDatabase } from "@/lib/db/admin";
import { optionalUuid } from "@/lib/db/ids";
import { normalizeContentDestination, type ContentDestination } from "@/lib/ai/content-destination";

export async function saveManualLink(input: {
  url: string;
  topic: string;
  platform: string;
  creatorSource?: string;
  notes?: string;
  priority?: string;
  contentType?: string;
  contentDestination?: ContentDestination;
  metadata?: { title?: string; description?: string; image?: string; sourceDomain?: string; status?: string };
}) {
  await ensureAdminDatabase();
  const result = await getPool().query<{ id: string }>(
    `
      insert into manual_links (
        url, topic, platform, creator_source, notes, priority, content_type,
        content_destination, extracted_title, extracted_description, extraction_status
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      returning id;
    `,
    [
      input.url,
      input.topic,
      input.platform,
      input.creatorSource ?? "",
      input.notes ?? "",
      input.priority ?? "normal",
      input.contentType ?? "manual link",
      normalizeContentDestination(input.contentDestination),
      input.metadata?.title ?? "",
      input.metadata?.description ?? "",
      input.metadata?.status ?? "pending"
    ]
  );
  return result.rows[0].id;
}

export async function saveResearchPack(pack: {
  topic: string;
  category: string;
  summary: string;
  sources: unknown[];
  whatHappened: string;
  whatWeKnow: string;
  whatRemainsUnclear: string;
  timeline: unknown[];
  keyFacts: unknown[];
  riskNotes: unknown[];
  suggestedAngle: string;
  contentDestination?: ContentDestination;
}) {
  await ensureAdminDatabase();
  const result = await getPool().query<{ id: string }>(
    `
      insert into research_packs (
        topic, category, content_destination, source_list, source_count, summary, what_happened,
        what_we_know, what_remains_unclear, timeline, key_facts, risks,
        suggested_article_angle, source_confidence, status
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'AI-generated from supplied sources - human verification required', 'Research Ready')
      returning id;
    `,
    [
      pack.topic,
      pack.category,
      normalizeContentDestination(pack.contentDestination),
      JSON.stringify(pack.sources),
      pack.sources.length,
      pack.summary,
      pack.whatHappened,
      pack.whatWeKnow,
      pack.whatRemainsUnclear,
      JSON.stringify(pack.timeline),
      JSON.stringify(pack.keyFacts),
      JSON.stringify(pack.riskNotes),
      pack.suggestedAngle
    ]
  );
  return result.rows[0].id;
}

export async function getResearchPack(id: string) {
  const researchPackId = optionalUuid(id);
  if (!researchPackId) {
    return null;
  }

  await ensureAdminDatabase();
  const result = await getPool().query(`select * from research_packs where id = $1;`, [researchPackId]);
  return result.rows[0] ?? null;
}
