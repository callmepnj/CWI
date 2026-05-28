import { getPool } from "@/lib/db";
import { ensureAdminDatabase } from "@/lib/db/admin";
import { optionalUuid, requireUuid } from "@/lib/db/ids";
import { site } from "@/lib/site";
import type { ArticleSource, VerificationStatus, WatchCategory, WatchPost } from "@/data/posts";

export async function saveVerificationReport(report: {
  researchPackId: string;
  verificationStatus: string;
  riskLevel: string;
  unsafeClaims: unknown[];
  saferWording: unknown[];
  sourceGaps: unknown[];
  publishRecommendation: string;
}) {
  await ensureAdminDatabase();
  const researchPackId = requireUuid(report.researchPackId, "researchPackId");
  const result = await getPool().query<{ id: string }>(
    `
      insert into verification_reports (
        research_pack_id, verification_status, risk_level, unsafe_claims,
        safer_wording, source_gaps, publish_recommendation, human_review_required
      )
      values ($1, $2, $3, $4, $5, $6, $7, true)
      returning id;
    `,
    [
      researchPackId,
      report.verificationStatus,
      report.riskLevel,
      JSON.stringify(report.unsafeClaims),
      JSON.stringify(report.saferWording),
      JSON.stringify(report.sourceGaps),
      report.publishRecommendation
    ]
  );
  return result.rows[0].id;
}

export async function getVerificationReport(id: string) {
  const verificationReportId = optionalUuid(id);
  if (!verificationReportId) {
    return null;
  }

  await ensureAdminDatabase();
  const result = await getPool().query(`select * from verification_reports where id = $1;`, [verificationReportId]);
  return result.rows[0] ?? null;
}

export async function saveArticleDraft(article: {
  researchPackId?: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  body: unknown;
  verificationStatus: string;
  sourceCount: number;
}) {
  await ensureAdminDatabase();
  const result = await getPool().query<{ id: string }>(
    `
      insert into article_drafts (
        research_pack_id, title, slug, category, draft, verification_status,
        source_count, approval_status, publish_status
      )
      values ($1, $2, $3, $4, $5, $6, $7, 'Draft Ready', 'Not published')
      returning id;
    `,
    [
      optionalUuid(article.researchPackId),
      article.title,
      article.slug,
      article.category,
      JSON.stringify(articleDraftPayload(article.summary, article.body)),
      article.verificationStatus,
      article.sourceCount
    ]
  );
  return result.rows[0].id;
}

export async function getArticleDraft(id: string) {
  const articleDraftId = optionalUuid(id);
  if (!articleDraftId) {
    return null;
  }

  await ensureAdminDatabase();
  const result = await getPool().query(`select * from article_drafts where id = $1;`, [articleDraftId]);
  return result.rows[0] ?? null;
}

export async function savePublishedArticle(input: { articleDraftId: string; title: string; slug: string; url: string; category?: string; metadata?: unknown }) {
  await ensureAdminDatabase();
  const articleDraftId = requireUuid(input.articleDraftId, "articleDraftId");
  const result = await getPool().query<{ id: string }>(
    `
      with updated as (
        update published_articles
        set title = $2,
            slug = $3,
            url = $4,
            category = $5,
            metadata = $6,
            published_at = now()
        where article_draft_id = $1
        returning id
      ),
      inserted as (
        insert into published_articles (article_draft_id, title, slug, url, category, metadata)
        select $1, $2, $3, $4, $5, $6
        where not exists (select 1 from updated)
        returning id
      )
      select id from updated
      union all
      select id from inserted;
    `,
    [articleDraftId, input.title, input.slug, input.url, input.category ?? "", JSON.stringify(input.metadata ?? {})]
  );
  await getPool().query(
    `
      update article_drafts
      set publish_status = 'Published',
          approval_status = 'Approved',
          slug = $2,
          updated_at = now()
      where id = $1;
    `,
    [articleDraftId, input.slug]
  );
  return result.rows[0].id;
}

const removedPublicSlugs = new Set(["cwi-priority-public-interest-update"]);

type PublishedArticleRow = {
  id: string;
  article_draft_id: string;
  title: string;
  slug: string;
  url: string;
  category: string | null;
  published_at: string;
  draft: unknown;
  verification_status: string | null;
  source_count: number | null;
  updated_at: string | null;
  source_list: unknown;
  seo_title: string | null;
  meta_description: string | null;
  open_graph_image: string | null;
};

export async function getPublishedWatchPostBySlug(slug: string) {
  if (removedPublicSlugs.has(slug)) {
    return null;
  }

  await ensureAdminDatabase();
  const result = await getPool().query<PublishedArticleRow>(
    `
      select
        pa.id::text,
        pa.article_draft_id::text,
        pa.title,
        pa.slug,
        pa.url,
        pa.category,
        pa.published_at::text,
        ad.draft,
        ad.verification_status,
        ad.source_count,
        ad.updated_at::text,
        rp.source_list,
        sp.seo_title,
        sp.meta_description,
        sp.open_graph_image
      from published_articles pa
      join article_drafts ad on ad.id = pa.article_draft_id
      left join research_packs rp on rp.id = ad.research_pack_id
      left join lateral (
        select seo_title, meta_description, open_graph_image
        from seo_packs
        where article_draft_id = ad.id
        order by created_at desc
        limit 1
      ) sp on true
      where pa.slug = $1
      order by pa.published_at desc
      limit 1;
    `,
    [slug]
  );

  return result.rows[0] ? publishedRowToWatchPost(result.rows[0]) : null;
}

export async function getPublishedWatchPosts(limit = 80) {
  await ensureAdminDatabase();
  const result = await getPool().query<PublishedArticleRow>(
    `
      select
        pa.id::text,
        pa.article_draft_id::text,
        pa.title,
        pa.slug,
        pa.url,
        pa.category,
        pa.published_at::text,
        ad.draft,
        ad.verification_status,
        ad.source_count,
        ad.updated_at::text,
        rp.source_list,
        sp.seo_title,
        sp.meta_description,
        sp.open_graph_image
      from published_articles pa
      join article_drafts ad on ad.id = pa.article_draft_id
      left join research_packs rp on rp.id = ad.research_pack_id
      left join lateral (
        select seo_title, meta_description, open_graph_image
        from seo_packs
        where article_draft_id = ad.id
        order by created_at desc
        limit 1
      ) sp on true
      order by pa.published_at desc
      limit $1;
    `,
    [limit]
  );

  return result.rows.filter((row) => !removedPublicSlugs.has(row.slug)).map(publishedRowToWatchPost);
}

function publishedRowToWatchPost(row: PublishedArticleRow): WatchPost {
  const draft = asRecord(row.draft);
  const nestedDraft = asRecord(draft.body);
  const sections = extractSections(draft);
  const researchSources = extractSources(row.source_list);
  const draftSources = extractSources(nestedDraft.sources || draft.sources);
  const sources = researchSources.length ? researchSources : draftSources;
  const summary =
    asText(draft.summary) ||
    asText(nestedDraft.summary) ||
    sections[0]?.paragraphs[0] ||
    "CWI Archive article published from the approved CWI AI OS workflow.";
  const date = dateOnly(row.published_at);
  const updatedDate = dateOnly(row.updated_at || row.published_at);
  const category = normalizeCategory(row.category);

  return {
    title: row.title,
    slug: row.slug,
    date,
    updatedDate,
    publishedAt: date,
    updatedAt: updatedDate,
    category,
    summary,
    content: sections.flatMap((section) => section.paragraphs),
    sections,
    sourceLabel: "CWI AI OS approved draft",
    sourceUrl: row.url,
    sources,
    verificationStatus: normalizeVerification(row.verification_status),
    credit: "Cockroach Watch India Editorial Desk",
    tags: Array.from(new Set(["Cockroach Watch India", "CWI", "CWI Archive", category, "Approved AI draft"])),
    author: "Cockroach Watch India Editorial Desk",
    readingMinutes: Math.max(3, Math.ceil(sections.flatMap((section) => section.paragraphs).join(" ").split(/\s+/).length / 180)),
    metaTitle: row.seo_title || `${row.title} | CWI Archive`,
    metaDescription: row.meta_description || summary.slice(0, 155),
    seoTitle: row.seo_title || `${row.title} | CWI Archive`,
    seoDescription: row.meta_description || summary.slice(0, 155),
    ogImage: row.open_graph_image || `${site.url}/opengraph-image`,
    imageAlt: `${row.title} - Cockroach Watch India Archive article`,
    pullQuote: "Approved CWI drafts become public only after human approval and Publish AI.",
    relatedSlugs: [],
    relatedArticles: [],
    social: {
      xThread: [`${row.title}`, `Read in CWI Archive: ${row.url}`],
      instagramCaption: `${row.title}\n\nRead the source-backed update at ${site.url}.`,
      redditPost: `${row.title} - what verified context should CWI add?`,
      youtubeShortsDescription: `${row.title} | CWI Archive`,
      seoSummary: summary
    }
  };
}

function extractSections(draft: Record<string, unknown>) {
  const directSections = normalizeSectionArray(draft.sections);
  if (directSections.length) return directSections;

  const bodyRecord = asRecord(draft.body);
  const nestedSections = normalizeSectionArray(bodyRecord.body || bodyRecord.sections);
  if (nestedSections.length) return nestedSections;

  const bodySections = normalizeSectionArray(draft.body);
  if (bodySections.length) return bodySections;

  const sections = [
    ["Short answer", draft.shortAnswer],
    ["What happened", draft.whatHappened],
    ["What we know", draft.whatWeKnow],
    ["What remains unclear", draft.whatRemainsUnclear],
    ["CWI context", draft.cwiContext || draft.disclaimer]
  ]
    .map(([heading, body]) => ({ heading: String(heading), paragraphs: splitParagraphs(asText(body)) }))
    .filter((section) => section.paragraphs.length > 0);

  return sections.length
    ? sections
    : [
        {
          heading: "CWI Archive",
          paragraphs: ["This approved article draft is available from the CWI admin publishing database."]
        }
      ];
}

function articleDraftPayload(summary: string, body: unknown) {
  const bodyRecord = asRecord(body);
  if (Object.keys(bodyRecord).length > 0) {
    return {
      ...bodyRecord,
      summary: summary || asText(bodyRecord.summary)
    };
  }

  return { summary, body };
}

function normalizeSectionArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const record = asRecord(item);
      const heading = asText(record.heading || record.title, "CWI Archive");
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
      const name = asText(record.name || record.title, url || `Source ${index + 1}`);
      const outlet = asText(record.publisher || record.outlet || record.platform || record.sourceDomain, url ? hostFromUrl(url) : "CWI source");
      const note = asText(record.note || record.description || record.reliability, "Source saved in the CWI research pack.");

      return {
        name,
        outlet,
        url: url || site.url,
        type: "Reference" as ArticleSource["type"],
        note
      };
    })
    .filter((source) => source.name);
}

function normalizeCategory(value: unknown): WatchCategory {
  const category = asText(value);
  const allowed: WatchCategory[] = [
    "Movement Update",
    "Explainer",
    "Public Reaction",
    "Youth Voice",
    "Meme Watch",
    "Fact Check",
    "Creator Spotlight",
    "Civic Issue",
    "Digital Culture",
    "Opinion",
    "Archive"
  ];

  return allowed.includes(category as WatchCategory) ? (category as WatchCategory) : "Archive";
}

function normalizeVerification(value: unknown): VerificationStatus {
  const status = asText(value);
  const allowed: VerificationStatus[] = ["Verified", "Developing", "Claimed", "Reported", "Opinion/Analysis", "Satire/Context"];

  return allowed.includes(status as VerificationStatus) ? (status as VerificationStatus) : "Developing";
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

function dateOnly(value: string) {
  const date = new Date(value);
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
