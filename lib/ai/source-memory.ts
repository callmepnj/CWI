import { createHash } from "node:crypto";
import { posts } from "@/data/posts";
import { unansweredFiles } from "@/data/unanswered-files";
import { getPool } from "@/lib/db";
import { ensureAdminDatabase } from "@/lib/db/admin";

type MemorySource = {
  title?: string;
  name?: string;
  publisher?: string;
  outlet?: string;
  url?: string;
  sourceUrl?: string;
  reliability?: string;
  note?: string;
  date?: string;
};

export async function rememberResearchPack(pack: Record<string, unknown>) {
  await ensureAdminDatabase();
  const topic = clean(pack.topic) || "CWI research topic";
  const topicNodeId = await upsertMemoryNode({
    nodeType: "topic",
    label: topic,
    summary: clean(pack.summary),
    confidenceScore: confidenceFromSourceCount(Number(pack.source_count ?? pack.sourceCount ?? 0)),
    sourceCount: Number(pack.source_count ?? pack.sourceCount ?? 0),
    metadata: {
      category: clean(pack.category),
      whatHappened: clean(pack.what_happened ?? pack.whatHappened),
      whatWeKnow: clean(pack.what_we_know ?? pack.whatWeKnow),
      whatRemainsUnclear: clean(pack.what_remains_unclear ?? pack.whatRemainsUnclear)
    }
  });

  const sources = sourcesFrom(pack.source_list ?? pack.sources);
  for (const source of sources) {
    const sourceNodeId = await upsertMemoryNode({
      nodeType: "source",
      label: clean(source.publisher ?? source.outlet ?? source.title ?? source.name ?? source.url) || "CWI source",
      summary: clean(source.note ?? source.reliability),
      sourceUrl: clean(source.url ?? source.sourceUrl),
      confidenceScore: sourceReliabilityScore(source),
      sourceCount: 1,
      metadata: source
    });
    await upsertMemoryEdge(topicNodeId, sourceNodeId, "supported_by", sourceReliabilityScore(source), [source]);
  }

  for (const fact of textList(pack.key_facts ?? pack.keyFacts).slice(0, 12)) {
    await upsertClaim({
      topic,
      claimText: fact,
      status: "source_backed_pending_review",
      confidenceScore: confidenceFromSourceCount(sources.length),
      riskLevel: riskLevelFromText(fact),
      sourceUrls: sources.map((source) => clean(source.url ?? source.sourceUrl)).filter(Boolean),
      metadata: { from: "research_pack" }
    });
  }

  return { topicNodeId, sourceCount: sources.length };
}

export async function rememberArticleDraft(article: Record<string, unknown>, input: { articleDraftId?: string; approvalQueueId?: string } = {}) {
  await ensureAdminDatabase();
  const title = clean(article.title) || "CWI article draft";
  const slug = clean(article.slug) || slugify(title);
  const articleNodeId = await upsertMemoryNode({
    nodeType: "article",
    label: title,
    slug,
    summary: clean(article.summary),
    sourceCount: sourcesFrom(article.sources).length,
    confidenceScore: confidenceFromSourceCount(sourcesFrom(article.sources).length),
    metadata: { articleDraftId: input.articleDraftId, approvalQueueId: input.approvalQueueId, category: clean(article.category) }
  });

  for (const section of sectionsFrom(article.body ?? article.sections).slice(0, 12)) {
    await upsertClaim({
      topic: title,
      claimText: `${section.heading}: ${section.body}`.slice(0, 1200),
      status: "draft_claim_pending_review",
      confidenceScore: 55,
      riskLevel: riskLevelFromText(section.body),
      articleSlug: slug,
      sourceUrls: sourcesFrom(article.sources).map((source) => clean(source.url ?? source.sourceUrl)).filter(Boolean),
      metadata: { from: "article_draft", heading: section.heading }
    });
  }

  return { articleNodeId };
}

export async function rememberApprovalItem(item: Record<string, unknown>) {
  await ensureAdminDatabase();
  return upsertMemoryNode({
    nodeType: "approval",
    label: clean(item.topic) || "Approval item",
    summary: clean(item.summary),
    confidenceScore: confidenceFromSourceCount(Number(item.source_count ?? 0)),
    sourceCount: Number(item.source_count ?? 0),
    metadata: {
      approvalQueueId: clean(item.id),
      status: clean(item.status),
      verificationStatus: clean(item.verification_status),
      riskLevel: clean(item.risk_level)
    }
  });
}

export async function syncStaticPublicMemory() {
  await ensureAdminDatabase();
  let synced = 0;

  for (const post of posts.slice(0, 120)) {
    await upsertMemoryNode({
      nodeType: "public_article",
      label: post.title,
      slug: post.slug,
      summary: post.summary,
      sourceUrl: `/watch-desk/${post.slug}`,
      sourceCount: post.sources.length,
      confidenceScore: confidenceFromSourceCount(post.sources.length),
      metadata: { category: post.category, tags: post.tags, date: post.date }
    });
    synced += 1;
  }

  for (const file of unansweredFiles) {
    await upsertMemoryNode({
      nodeType: "unanswered_file",
      label: file.title,
      slug: file.slug,
      summary: file.summary,
      sourceUrl: `/india-unanswered-files/${file.slug}`,
      sourceCount: file.sourceCount,
      confidenceScore: confidenceFromSourceCount(file.sourceCount),
      metadata: { category: file.category, location: file.location, status: file.status }
    });
    synced += 1;
  }

  return { synced };
}

export async function buildMemorySnapshot(limit = 8) {
  await ensureAdminDatabase();
  const [nodes, claims] = await Promise.all([
    getPool().query(
      `select node_type, label, summary, confidence_score, source_count, last_seen_at from cwi_memory_nodes order by last_seen_at desc limit $1;`,
      [limit]
    ),
    getPool().query(
      `select topic, claim_text, status, confidence_score, risk_level from cwi_memory_claims order by last_seen_at desc limit $1;`,
      [limit]
    )
  ]);

  return { nodes: nodes.rows, claims: claims.rows };
}

async function upsertMemoryNode(input: {
  nodeType: string;
  label: string;
  slug?: string;
  summary?: string;
  confidenceScore?: number;
  sourceCount?: number;
  sourceUrl?: string;
  metadata?: unknown;
}) {
  const slug = input.slug || slugify(input.label);
  const result = await getPool().query<{ id: string }>(
    `
      insert into cwi_memory_nodes (
        node_type, label, slug, summary, confidence_score, source_count, source_url, metadata
      )
      values ($1, $2, $3, $4, $5, $6, nullif($7, ''), $8)
      on conflict (node_type, slug) do update set
        label = excluded.label,
        summary = coalesce(nullif(excluded.summary, ''), cwi_memory_nodes.summary),
        confidence_score = greatest(cwi_memory_nodes.confidence_score, excluded.confidence_score),
        source_count = greatest(cwi_memory_nodes.source_count, excluded.source_count),
        source_url = coalesce(excluded.source_url, cwi_memory_nodes.source_url),
        metadata = cwi_memory_nodes.metadata || excluded.metadata,
        mention_count = cwi_memory_nodes.mention_count + 1,
        last_seen_at = now()
      returning id;
    `,
    [
      input.nodeType,
      input.label,
      slug,
      input.summary ?? "",
      clampScore(input.confidenceScore ?? 50),
      input.sourceCount ?? 0,
      input.sourceUrl ?? "",
      JSON.stringify(input.metadata ?? {})
    ]
  );

  return result.rows[0].id;
}

async function upsertMemoryEdge(fromNodeId: string, toNodeId: string, relationType: string, confidenceScore: number, evidence: unknown[]) {
  await getPool().query(
    `
      insert into cwi_memory_edges (from_node_id, to_node_id, relation_type, confidence_score, evidence)
      values ($1, $2, $3, $4, $5)
      on conflict (from_node_id, to_node_id, relation_type) do update set
        confidence_score = greatest(cwi_memory_edges.confidence_score, excluded.confidence_score),
        evidence = cwi_memory_edges.evidence || excluded.evidence,
        updated_at = now();
    `,
    [fromNodeId, toNodeId, relationType, clampScore(confidenceScore), JSON.stringify(evidence)]
  );
}

async function upsertClaim(input: {
  topic: string;
  claimText: string;
  status: string;
  confidenceScore: number;
  riskLevel: string;
  sourceUrls: string[];
  articleSlug?: string;
  metadata?: unknown;
}) {
  const claimText = clean(input.claimText).slice(0, 1200);
  if (!claimText) return null;

  const result = await getPool().query<{ id: string }>(
    `
      insert into cwi_memory_claims (
        topic, claim_text, claim_hash, status, confidence_score, risk_level,
        source_count, source_urls, article_slug, metadata
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, nullif($9, ''), $10)
      on conflict (claim_hash) do update set
        status = excluded.status,
        confidence_score = greatest(cwi_memory_claims.confidence_score, excluded.confidence_score),
        risk_level = excluded.risk_level,
        source_count = greatest(cwi_memory_claims.source_count, excluded.source_count),
        source_urls = excluded.source_urls,
        metadata = cwi_memory_claims.metadata || excluded.metadata,
        last_seen_at = now()
      returning id;
    `,
    [
      input.topic,
      claimText,
      hashClaim(`${input.topic}:${claimText}`),
      input.status,
      clampScore(input.confidenceScore),
      input.riskLevel,
      input.sourceUrls.length,
      JSON.stringify(input.sourceUrls),
      input.articleSlug ?? "",
      JSON.stringify(input.metadata ?? {})
    ]
  );

  return result.rows[0]?.id ?? null;
}

function sourcesFrom(value: unknown): MemorySource[] {
  const parsed = parseMaybeJson(value);
  return Array.isArray(parsed) ? parsed.filter((item): item is MemorySource => Boolean(item && typeof item === "object")) : [];
}

function sectionsFrom(value: unknown) {
  const parsed = parseMaybeJson(value);
  if (!Array.isArray(parsed)) return [];
  return parsed
    .map((item) => (item && typeof item === "object" ? (item as Record<string, unknown>) : {}))
    .map((item) => ({ heading: clean(item.heading ?? item.title), body: clean(item.body ?? item.text ?? item.content) }))
    .filter((item) => item.heading || item.body);
}

function textList(value: unknown) {
  const parsed = parseMaybeJson(value);
  if (Array.isArray(parsed)) return parsed.map((item) => clean(item)).filter(Boolean);
  return clean(parsed)
    .split(/\n+|;+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseMaybeJson(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function sourceReliabilityScore(source: MemorySource) {
  const text = `${source.publisher ?? ""} ${source.outlet ?? ""} ${source.url ?? ""} ${source.reliability ?? ""}`.toLowerCase();
  if (text.includes("official") || text.includes("gov.in") || text.includes("pib.gov.in") || text.includes("court")) return 85;
  if (text.includes("reuters") || text.includes("apnews") || text.includes("bbc") || text.includes("the hindu")) return 78;
  if (text.includes("needs review") || !clean(source.url ?? source.sourceUrl)) return 45;
  return 62;
}

function confidenceFromSourceCount(sourceCount: number) {
  if (sourceCount >= 5) return 85;
  if (sourceCount >= 3) return 74;
  if (sourceCount >= 1) return 58;
  return 35;
}

function riskLevelFromText(value: string) {
  const lower = value.toLowerCase();
  if (/(alleged|accused|riot|violence|hate|fraud|scam|murder|rape|terror|uapa|court|police|caste|religion)/.test(lower)) {
    return "High";
  }
  if (/(claim|reported|unclear|viral|leak|protest|detention)/.test(lower)) return "Medium";
  return "Low";
}

function hashClaim(value: string) {
  return createHash("sha256").update(value.toLowerCase().replace(/\s+/g, " ").trim()).digest("hex");
}

function slugify(value: string) {
  return clean(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "cwi-memory";
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(Number.isFinite(value) ? value : 0)));
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}
