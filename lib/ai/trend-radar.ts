import { posts } from "@/data/posts";
import { unansweredFiles } from "@/data/unanswered-files";
import { getPool } from "@/lib/db";
import { ensureAdminDatabase } from "@/lib/db/admin";

type TrendItem = {
  topic: string;
  trendType: string;
  priorityScore: number;
  evidenceCount: number;
  suggestedAction: string;
  whyItMatters: string;
  sourceUrls: string[];
  metadata?: unknown;
};

export async function runTrendRadar() {
  await ensureAdminDatabase();
  const [manualLinks, reports, keywords, comments] = await Promise.all([
    getPool().query(`select topic, url, platform, notes, created_at from manual_links order by created_at desc limit 80;`).catch(() => ({ rows: [] })),
    getPool()
      .query(`select type, source_url, message, city, state, created_at from cwi_report_submissions order by created_at desc limit 80;`)
      .catch(() => ({ rows: [] })),
    getPool().query(`select keyword, keyword_group, priority from keywords where active = true order by priority asc limit 80;`).catch(() => ({ rows: [] })),
    getPool()
      .query(
        `
          select article_slug as article, comment as text, created_at from cwi_article_comments
          union all
          select article_id as article, comment_text as text, created_at from cwi_unanswered_comments
          order by created_at desc
          limit 80;
        `
      )
      .catch(() => ({ rows: [] }))
  ]);

  const trends = rankTrends([
    ...manualLinks.rows.map((row) => ({
      topic: clean(row.topic),
      trendType: "manual_link",
      url: clean(row.url),
      evidence: clean(row.notes) || clean(row.platform)
    })),
    ...reports.rows.map((row) => ({
      topic: clean(row.type) || clean(row.message).slice(0, 80),
      trendType: "public_report",
      url: clean(row.source_url),
      evidence: `${clean(row.city)} ${clean(row.state)} ${clean(row.message)}`
    })),
    ...keywords.rows.map((row) => ({
      topic: clean(row.keyword),
      trendType: "keyword_watch",
      url: "",
      evidence: clean(row.keyword_group),
      priority: Number(row.priority ?? 3)
    })),
    ...comments.rows.map((row) => ({
      topic: clean(row.article),
      trendType: "reader_signal",
      url: "",
      evidence: clean(row.text)
    })),
    ...posts.slice(0, 12).map((post) => ({
      topic: post.title,
      trendType: "live_newsroom_followup",
      url: `/archive/${post.slug}`,
      evidence: post.summary
    })),
    ...unansweredFiles.slice(0, 8).map((file) => ({
      topic: file.title,
      trendType: "unanswered_files_followup",
      url: `/india-unanswered-files/${file.slug}`,
      evidence: file.summary
    }))
  ]);

  for (const trend of trends) {
    await upsertTrend(trend);
  }

  return {
    generated: trends.length,
    topTrends: trends.slice(0, 10)
  };
}

function rankTrends(rawItems: Array<{ topic: string; trendType: string; url: string; evidence: string; priority?: number }>): TrendItem[] {
  const buckets = new Map<string, { topic: string; trendType: string; evidence: string[]; urls: Set<string>; priority: number }>();

  for (const item of rawItems) {
    const topic = item.topic || topicFromText(item.evidence);
    if (!topic) continue;
    const key = `${item.trendType}:${topic.toLowerCase()}`;
    const current = buckets.get(key) ?? { topic, trendType: item.trendType, evidence: [], urls: new Set<string>(), priority: item.priority ?? 3 };
    if (item.evidence) current.evidence.push(item.evidence);
    if (item.url) current.urls.add(item.url);
    current.priority = Math.min(current.priority, item.priority ?? current.priority);
    buckets.set(key, current);
  }

  return Array.from(buckets.values())
    .map((bucket) => {
      const evidenceCount = bucket.evidence.length + bucket.urls.size;
      const priorityScore = scoreTrend(bucket.trendType, evidenceCount, bucket.priority, bucket.evidence.join(" "));
      return {
        topic: bucket.topic,
        trendType: bucket.trendType,
        priorityScore,
        evidenceCount,
        suggestedAction: suggestedAction(bucket.trendType, priorityScore),
        whyItMatters: whyItMatters(bucket.trendType, bucket.topic),
        sourceUrls: Array.from(bucket.urls),
        metadata: { sampleEvidence: bucket.evidence.slice(0, 5) }
      };
    })
    .sort((first, second) => second.priorityScore - first.priorityScore)
    .slice(0, 40);
}

async function upsertTrend(trend: TrendItem) {
  await getPool().query(
    `
      insert into cwi_trend_radar_items (
        topic, trend_type, priority_score, evidence_count, suggested_action,
        why_it_matters, source_urls, metadata
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8)
      on conflict (topic, trend_type) do update set
        priority_score = greatest(cwi_trend_radar_items.priority_score, excluded.priority_score),
        evidence_count = greatest(cwi_trend_radar_items.evidence_count, excluded.evidence_count),
        suggested_action = excluded.suggested_action,
        why_it_matters = excluded.why_it_matters,
        source_urls = excluded.source_urls,
        metadata = cwi_trend_radar_items.metadata || excluded.metadata,
        status = 'new',
        updated_at = now();
    `,
    [
      trend.topic,
      trend.trendType,
      trend.priorityScore,
      trend.evidenceCount,
      trend.suggestedAction,
      trend.whyItMatters,
      JSON.stringify(trend.sourceUrls),
      JSON.stringify(trend.metadata ?? {})
    ]
  );
}

function scoreTrend(trendType: string, evidenceCount: number, priority: number, evidence: string) {
  let score = 40 + Math.min(30, evidenceCount * 6) + Math.max(0, 12 - priority * 3);
  if (trendType.includes("report")) score += 12;
  if (trendType.includes("unanswered")) score += 10;
  if (/(urgent|violence|court|official|leak|protest|student|youth|source|correction|viral)/i.test(evidence)) score += 10;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function suggestedAction(trendType: string, score: number) {
  if (score >= 80) return "Assign Research AI today and prepare a verification-first Live Newsroom draft.";
  if (trendType.includes("unanswered")) return "Check source freshness and consider an India Unanswered Files update.";
  if (trendType.includes("reader")) return "Review comments for corrections, missing context, or follow-up questions.";
  return "Queue for CWI Source Lens and memory-graph enrichment.";
}

function whyItMatters(trendType: string, topic: string) {
  if (trendType.includes("report")) return `${topic} came from public intake and may need CWI verification or follow-up.`;
  if (trendType.includes("keyword")) return `${topic} is part of CWI's active keyword watch list.`;
  if (trendType.includes("unanswered")) return `${topic} belongs to the public-memory archive and needs periodic source checks.`;
  return `${topic} may be relevant to CWI Live Newsroom coverage, source checks, or civic context.`;
}

function topicFromText(value: string) {
  return value
    .split(/[.!?\n]/)[0]
    ?.trim()
    .slice(0, 90);
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}
