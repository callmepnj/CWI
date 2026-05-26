import { posts, type ArticleSource } from "@/data/posts";
import { getFileVisual, unansweredFiles } from "@/data/unanswered-files";
import { getPool } from "@/lib/db";
import { ensureAdminDatabase } from "@/lib/db/admin";
import { optionalUuid, requireUuid } from "@/lib/db/ids";
import { site } from "@/lib/site";

export type LiveNewsroomStatus =
  | "Verified"
  | "Source-backed"
  | "Reported"
  | "Developing"
  | "Opinion/Analysis"
  | "Satire/Context"
  | "Unverified"
  | "Public Advisory";

export type LiveNewsroomSource = ArticleSource;

export type LiveNewsroomTimelineItem = {
  date: string;
  title: string;
  summary: string;
};

export type LiveNewsroomItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
  summary: string;
  body: Array<{ heading: string; paragraphs: string[] }>;
  verificationStatus: LiveNewsroomStatus;
  riskLevel: string;
  sourceCount: number;
  sources: LiveNewsroomSource[];
  whatHappened: string;
  whatWeKnow: string;
  whatRemainsUnclear: string;
  timeline: LiveNewsroomTimelineItem[];
  cwiContext: string;
  tags: string[];
  heroImage: string;
  thumbnailImage: string;
  ogImage: string;
  altText: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  relatedItems: string[];
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  status: string;
};

type LiveNewsroomRow = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  type: string | null;
  summary: string | null;
  body: unknown;
  verification_status: string | null;
  risk_level: string | null;
  source_count: number | null;
  sources_json: unknown;
  what_happened: string | null;
  what_we_know: string | null;
  what_remains_unclear: string | null;
  timeline_json: unknown;
  cwi_context: string | null;
  tags_json: unknown;
  hero_image: string | null;
  thumbnail_image: string | null;
  og_image: string | null;
  alt_text: string | null;
  published_at: string | null;
  updated_at: string | null;
  author: string | null;
  related_items_json: unknown;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  status: string | null;
};

export async function saveLiveNewsroomItemFromDraft(input: {
  approval: Record<string, unknown>;
  articleDraft: Record<string, unknown>;
}) {
  await ensureAdminDatabase();
  const articleDraftId = requireUuid(input.articleDraft.id, "articleDraftId");
  const approvalQueueId = optionalUuid(input.approval.id);
  const draft = asRecord(input.articleDraft.draft);
  const nestedBody = asRecord(draft.body);
  const title = asText(input.articleDraft.title, asText(draft.title, "CWI Live Newsroom update"));
  const slug = slugify(asText(input.articleDraft.slug, asText(draft.slug, title)));
  const category = asText(input.articleDraft.category, asText(draft.category, "Live Newsroom"));
  const verificationStatus = asText(input.approval.verification_status, asText(input.articleDraft.verification_status, "Developing"));
  const riskLevel = asText(input.approval.risk_level, "Medium");
  const sourceCount = Number(input.approval.source_count ?? input.articleDraft.source_count ?? 0);
  const sections = extractSections(draft);
  const researchSources = await latestResearchSources(input.articleDraft.research_pack_id);
  const draftSources = extractSources(draft.sources || nestedBody.sources);
  const sources = draftSources.length ? draftSources : researchSources;
  const fallbackSummary = sections[0]?.paragraphs[0] || "CWI Live Newsroom update approved for public publication.";
  const summary = asText(input.approval.summary, asText(draft.summary, fallbackSummary));
  const timeline = normalizeTimeline(draft.timeline || nestedBody.timeline);
  const tags = normalizeStringArray(draft.tags).length
    ? normalizeStringArray(draft.tags)
    : ["Cockroach Watch India", "CWI Live Newsroom", category];
  const relatedItems = normalizeStringArray(draft.relatedArticles || draft.related_items);
  const seo = await latestSeoForDraft(articleDraftId);
  const image = await latestImageForApproval(input.approval.image_pack_id);
  const canonicalUrl = asText(seo?.canonical_url, `${site.url}/live-newsroom/${slug}`);

  const result = await getPool().query<{ id: string }>(
    `
      with updated as (
        update live_newsroom_items
        set approval_queue_id = $2,
            title = $3,
            slug = $4,
            category = $5,
            type = $6,
            summary = $7,
            body = $8,
            verification_status = $9,
            risk_level = $10,
            source_count = $11,
            sources_json = $12,
            what_happened = $13,
            what_we_know = $14,
            what_remains_unclear = $15,
            timeline_json = $16,
            cwi_context = $17,
            tags_json = $18,
            hero_image = $19,
            thumbnail_image = $20,
            og_image = $21,
            alt_text = $22,
            updated_at = now(),
            author = $23,
            related_items_json = $24,
            seo_title = $25,
            seo_description = $26,
            canonical_url = $27,
            status = 'published',
            metadata = $28
        where article_draft_id = $1
        returning id
      ),
      inserted as (
        insert into live_newsroom_items (
          article_draft_id, approval_queue_id, title, slug, category, type, summary,
          body, verification_status, risk_level, source_count, sources_json,
          what_happened, what_we_know, what_remains_unclear, timeline_json,
          cwi_context, tags_json, hero_image, thumbnail_image, og_image, alt_text,
          author, related_items_json, seo_title, seo_description, canonical_url, status, metadata
        )
        select $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, 'published', $28
        where not exists (select 1 from updated)
        returning id
      )
      select id from updated
      union all
      select id from inserted
    `,
    [
      articleDraftId,
      approvalQueueId,
      title,
      slug,
      category,
      "live_newsroom_update",
      summary,
      JSON.stringify(sections),
      verificationStatus,
      riskLevel,
      sourceCount,
      JSON.stringify(sources),
      asText(draft.whatHappened || nestedBody.whatHappened, sections.find((section) => section.heading === "What happened")?.paragraphs.join("\n\n") || summary),
      asText(draft.whatWeKnow || nestedBody.whatWeKnow, sections.find((section) => section.heading === "What we know")?.paragraphs.join("\n\n") || summary),
      asText(
        draft.whatRemainsUnclear || nestedBody.whatRemainsUnclear,
        sections.find((section) => section.heading === "What remains unclear")?.paragraphs.join("\n\n") ||
          "CWI is keeping this update open for corrections, official clarification, and additional source-backed context."
      ),
      JSON.stringify(timeline),
      asText(draft.cwiContext || draft.disclaimer, cwiContext),
      JSON.stringify(tags),
      image?.heroImage || `${site.url}/opengraph-image`,
      image?.thumbnailImage || image?.heroImage || `${site.url}/opengraph-image`,
      image?.ogImage || image?.heroImage || `${site.url}/opengraph-image`,
      image?.altText || `${title} - CWI Live Newsroom visual`,
      "Cockroach Watch India Editorial Desk",
      JSON.stringify(relatedItems),
      asText(seo?.seo_title, `${title} - CWI Live Newsroom | Cockroach Watch India`),
      asText(seo?.meta_description, `Cockroach Watch India Live Newsroom explains ${title}, what is known, what remains unclear, and why CWI is tracking this public-interest update.`),
      canonicalUrl,
      JSON.stringify({ approvalQueueId, articleDraftId, source: "CWI Publish Gate" })
    ]
  );

  return { id: result.rows[0].id, slug, url: canonicalUrl };
}

export async function getPublishedLiveNewsroomItems(limit = 80) {
  await ensureAdminDatabase();
  const result = await getPool().query<LiveNewsroomRow>(
    `
      select id::text, title, slug, category, type, summary, body, verification_status,
        risk_level, source_count, sources_json, what_happened, what_we_know,
        what_remains_unclear, timeline_json, cwi_context, tags_json, hero_image,
        thumbnail_image, og_image, alt_text, published_at::text, updated_at::text,
        author, related_items_json, seo_title, seo_description, canonical_url, status
      from live_newsroom_items
      where status = 'published'
      order by published_at desc
      limit $1
    `,
    [limit]
  );

  return result.rows.map(rowToLiveNewsroomItem);
}

export async function getPublishedLiveNewsroomItem(slug: string) {
  await ensureAdminDatabase();
  const result = await getPool().query<LiveNewsroomRow>(
    `
      select id::text, title, slug, category, type, summary, body, verification_status,
        risk_level, source_count, sources_json, what_happened, what_we_know,
        what_remains_unclear, timeline_json, cwi_context, tags_json, hero_image,
        thumbnail_image, og_image, alt_text, published_at::text, updated_at::text,
        author, related_items_json, seo_title, seo_description, canonical_url, status
      from live_newsroom_items
      where slug = $1 and status = 'published'
      order by published_at desc
      limit 1
    `,
    [slug]
  );

  return result.rows[0] ? rowToLiveNewsroomItem(result.rows[0]) : null;
}

export function getLiveNewsroomFallbackItems(limit = 80): LiveNewsroomItem[] {
  const watchItems = posts.slice(0, 12).map((post) => ({
    id: `watch-${post.slug}`,
    title: post.title,
    slug: post.slug,
    category: post.category,
    type: "watch_desk_update",
    summary: post.summary,
    body: post.sections,
    verificationStatus: normalizeStatus(post.verificationStatus),
    riskLevel: "Low",
    sourceCount: post.sources.length,
    sources: post.sources,
    whatHappened: sectionText(post.sections, "What happened") || post.summary,
    whatWeKnow: sectionText(post.sections, "What we know") || post.content[0] || post.summary,
    whatRemainsUnclear: sectionText(post.sections, "What remains unclear") || "This item is source-backed but remains open for corrections and new context.",
    timeline: [{ date: post.date, title: "Watch Desk publication", summary: post.summary }],
    cwiContext,
    tags: post.tags,
    heroImage: post.ogImage,
    thumbnailImage: post.ogImage,
    ogImage: post.ogImage,
    altText: post.imageAlt,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author,
    relatedItems: post.relatedSlugs,
    seoTitle: `${post.title} - CWI Live Newsroom | Cockroach Watch India`,
    seoDescription: post.seoDescription,
    canonicalUrl: `${site.url}/live-newsroom/${post.slug}`,
    status: "published"
  }));

  const unansweredItems = unansweredFiles.map((file) => {
    const visual = getFileVisual(file);
    return {
      id: `unanswered-${file.slug}`,
      title: file.title,
      slug: file.slug,
      category: "India Unanswered Files",
      type: "india_unanswered_file",
      summary: file.summary,
      body: [
        { heading: "Short answer", paragraphs: [file.unansweredQuestion] },
        ...file.sections.map((section) => ({ heading: section.heading, paragraphs: [section.body] }))
      ],
      verificationStatus: "Source-backed" as LiveNewsroomStatus,
      riskLevel: "Medium",
      sourceCount: file.sourceCount,
      sources: file.sources.map((source) => ({
        name: source.name,
        outlet: source.publisher,
        url: source.url,
        type: source.type === "Official response" ? "Official source" : source.type === "Explainer" ? "Feature" : "News report",
        note: source.note
      })) as ArticleSource[],
      whatHappened: file.sections[0]?.body || file.summary,
      whatWeKnow: file.groundReality,
      whatRemainsUnclear: file.unansweredQuestion,
      timeline: file.timeline.slice(0, 8).map((item) => ({ date: item.date, title: item.title, summary: item.summary })),
      cwiContext,
      tags: ["India Unanswered Files", "CWI public memory", file.category],
      heroImage: file.heroImage || visual.src,
      thumbnailImage: file.thumbnailImage || visual.src,
      ogImage: file.ogImage || visual.src,
      altText: file.altText || visual.alt,
      publishedAt: "2026-05-24",
      updatedAt: "2026-05-26",
      author: "Cockroach Watch India Editorial Desk",
      relatedItems: [],
      seoTitle: `${file.title} - CWI India Unanswered Files`,
      seoDescription: file.seoDescription,
      canonicalUrl: `${site.url}/live-newsroom/${file.slug}`,
      status: "published"
    };
  });

  return [...watchItems, ...unansweredItems].slice(0, limit);
}

export function getLiveNewsroomFallbackItem(slug: string) {
  return getLiveNewsroomFallbackItems(120).find((item) => item.slug === slug) ?? null;
}

function rowToLiveNewsroomItem(row: LiveNewsroomRow): LiveNewsroomItem {
  const sections = normalizeSections(row.body);
  const summary = asText(row.summary, sections[0]?.paragraphs[0] || "CWI Live Newsroom update.");
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: asText(row.category, "Live Newsroom"),
    type: asText(row.type, "live_newsroom_update"),
    summary,
    body: sections,
    verificationStatus: normalizeStatus(row.verification_status),
    riskLevel: asText(row.risk_level, "Medium"),
    sourceCount: Number(row.source_count ?? 0),
    sources: extractSources(row.sources_json),
    whatHappened: asText(row.what_happened, summary),
    whatWeKnow: asText(row.what_we_know, summary),
    whatRemainsUnclear: asText(row.what_remains_unclear, "CWI is tracking corrections, official clarifications, and new source-backed updates."),
    timeline: normalizeTimeline(row.timeline_json),
    cwiContext: asText(row.cwi_context, cwiContext),
    tags: normalizeStringArray(row.tags_json),
    heroImage: asText(row.hero_image, `${site.url}/opengraph-image`),
    thumbnailImage: asText(row.thumbnail_image, asText(row.hero_image, `${site.url}/opengraph-image`)),
    ogImage: asText(row.og_image, asText(row.hero_image, `${site.url}/opengraph-image`)),
    altText: asText(row.alt_text, `${row.title} - CWI Live Newsroom visual`),
    publishedAt: dateOnly(row.published_at),
    updatedAt: dateOnly(row.updated_at || row.published_at),
    author: asText(row.author, "Cockroach Watch India Editorial Desk"),
    relatedItems: normalizeStringArray(row.related_items_json),
    seoTitle: asText(row.seo_title, `${row.title} - CWI Live Newsroom | Cockroach Watch India`),
    seoDescription: asText(row.seo_description, summary.slice(0, 155)),
    canonicalUrl: asText(row.canonical_url, `${site.url}/live-newsroom/${row.slug}`),
    status: asText(row.status, "published")
  };
}

async function latestSeoForDraft(articleDraftId: string) {
  const result = await getPool().query<{
    seo_title: string | null;
    meta_description: string | null;
    canonical_url: string | null;
  }>(
    `
      select seo_title, meta_description, canonical_url
      from seo_packs
      where article_draft_id = $1
      order by created_at desc
      limit 1
    `,
    [articleDraftId]
  );
  return result.rows[0] ?? null;
}

async function latestResearchSources(researchPackId: unknown) {
  const id = optionalUuid(researchPackId);
  if (!id) return [];

  const result = await getPool().query<{ source_list: unknown }>(
    `select source_list from research_packs where id = $1 limit 1`,
    [id]
  );
  return extractSources(result.rows[0]?.source_list);
}

async function latestImageForApproval(imagePackId: unknown) {
  const id = optionalUuid(imagePackId);
  if (!id) return null;

  const result = await getPool().query<{ metadata: unknown; path: string | null; alt_text: string | null }>(
    `select metadata, path, alt_text from image_library where id = $1 limit 1`,
    [id]
  );
  const metadata = asRecord(result.rows[0]?.metadata);
  return {
    heroImage: asText(metadata.heroImage, asText(result.rows[0]?.path)),
    thumbnailImage: asText(metadata.thumbnailImage, asText(metadata.heroImage, asText(result.rows[0]?.path))),
    ogImage: asText(metadata.ogImage, asText(metadata.heroImage, asText(result.rows[0]?.path))),
    altText: asText(metadata.altText, asText(result.rows[0]?.alt_text))
  };
}

const cwiContext =
  "Cockroach Watch India - CWI is tracking this topic through the CWI Live Newsroom as part of its public archive on youth voice, civic satire, creator-led commentary, public issues, and India's unanswered questions. CWI's role is to document, verify, and amplify public-interest conversations with context and source attribution.";

function extractSections(value: unknown) {
  const direct = normalizeSections(value);
  if (direct.length) return direct;

  const record = asRecord(value);
  const nested = asRecord(record.body);
  const sections = [
    ["Short answer", record.shortAnswer || nested.shortAnswer],
    ["What happened", record.whatHappened || nested.whatHappened],
    ["What we know", record.whatWeKnow || nested.whatWeKnow],
    ["What remains unclear", record.whatRemainsUnclear || nested.whatRemainsUnclear],
    ["Why it matters", record.whyItMatters || nested.whyItMatters],
    ["CWI context", record.cwiContext || record.disclaimer || nested.cwiContext]
  ]
    .map(([heading, body]) => ({ heading: String(heading), paragraphs: splitParagraphs(asText(body)) }))
    .filter((section) => section.paragraphs.length > 0);

  return sections.length ? sections : [{ heading: "CWI Live Newsroom", paragraphs: ["This approved CWI update is available for public review."] }];
}

function normalizeSections(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const record = asRecord(item);
      const heading = asText(record.heading || record.title, "CWI Live Newsroom");
      const paragraphs = Array.isArray(record.paragraphs)
        ? record.paragraphs.map((paragraph) => asText(paragraph)).filter(Boolean)
        : splitParagraphs(asText(record.body || record.text || record.content));
      return { heading, paragraphs };
    })
    .filter((section) => section.paragraphs.length > 0);
}

function extractSources(value: unknown): ArticleSource[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      const record = asRecord(item);
      const url = asText(record.url || record.href || record.sourceUrl);
      return {
        name: asText(record.name || record.title, url || `Source ${index + 1}`),
        outlet: asText(record.publisher || record.outlet || record.platform || record.sourceDomain, url ? hostFromUrl(url) : "CWI source"),
        url: url || site.url,
        type: "Reference" as const,
        note: asText(record.note || record.description || record.reliability, "Source saved in the CWI research pack.")
      };
    })
    .filter((source) => source.name);
}

function normalizeTimeline(value: unknown): LiveNewsroomTimelineItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const record = asRecord(item);
      return {
        date: asText(record.date || record.publishedAt || record.time, "Developing"),
        title: asText(record.title || record.event, "Source update"),
        summary: asText(record.summary || record.description || record.body)
      };
    })
    .filter((item) => item.summary);
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asText(item)).filter(Boolean);
}

function normalizeStatus(value: unknown): LiveNewsroomStatus {
  const status = asText(value);
  const map: Record<string, LiveNewsroomStatus> = {
    Verified: "Verified",
    "Source-backed": "Source-backed",
    Developing: "Developing",
    Reported: "Reported",
    Claimed: "Reported",
    "Opinion/Analysis": "Opinion/Analysis",
    "Satire/Context": "Satire/Context",
    Unverified: "Unverified",
    "Public Advisory": "Public Advisory"
  };
  return map[status] ?? "Developing";
}

function sectionText(sections: Array<{ heading: string; paragraphs: string[] }>, heading: string) {
  return sections.find((section) => section.heading.toLowerCase() === heading.toLowerCase())?.paragraphs.join("\n\n") ?? "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function asText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function splitParagraphs(value: string) {
  return value
    .split(/\n{2,}|\r{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function dateOnly(value: string | null) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function hostFromUrl(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "CWI source";
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "cwi-live-newsroom-update";
}
