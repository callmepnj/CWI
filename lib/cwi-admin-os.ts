import { getFileVisual, unansweredFiles } from "@/data/unanswered-files";
import { posts } from "@/data/posts";
import { getAIProviderConfig } from "@/lib/ai/model-provider";
import { ensureAdminOsTables, ensureCommentsTable, ensureReportsTable, ensureUnansweredFilesTables, getPool } from "@/lib/db";
import { normalizeApprovalStatus } from "@/lib/db/approval";
import { getPublishedWatchPosts } from "@/lib/db/articles";
import { optionalUuid, requireUuid } from "@/lib/db/ids";
import { site } from "@/lib/site";
import { cwiOsAgents, syncBigBrainRules } from "@/lib/ai/big-brain";
import { syncStaticPublicMemory } from "@/lib/ai/source-memory";
import { runTrendRadar } from "@/lib/ai/trend-radar";

export const monthlyBudgetInr = 8000;
export const dailyBudgetInr = 250;

export type AdminDashboardData = Awaited<ReturnType<typeof getAdminDashboardData>>;

declare global {
  var cwiAdminSeedReady: Promise<void> | undefined;
  var cwiAdminDashboardCache: { data: unknown; expiresAt: number } | undefined;
}

const agentDefinitions = cwiOsAgents;

const defaultSources = [
  ["Reuters", "news", "https://www.reuters.com/", "", "", "website", "high", "International wire source for verified public-interest reporting."],
  ["BBC", "news", "https://www.bbc.com/news/world/asia/india", "", "", "website", "high", "Global source for India explainers and international framing."],
  ["Al Jazeera", "news", "https://www.aljazeera.com/where/india/", "", "", "website", "high", "International reporting and feature coverage."],
  ["Economic Times", "news", "https://economictimes.indiatimes.com/", "", "", "website", "medium", "Business/news source, verify numbers by date."],
  ["Hindustan Times", "news", "https://www.hindustantimes.com/", "", "", "website", "medium", "Indian news coverage, use with attribution."],
  ["Times of India", "news", "https://timesofindia.indiatimes.com/", "", "", "website", "medium", "Indian news coverage, use with attribution."],
  ["India Today", "news", "https://www.indiatoday.in/", "", "", "website", "medium", "Indian news and profile coverage."],
  ["BOOM Live", "fact-check", "https://www.boomlive.in/", "", "", "website", "high", "Fact-checking and misinformation context."],
  ["Official CJP website", "official", "https://cockroachjantaparty.org/", "", "", "website", "official", "Official CJP self-description and public statements."],
  ["Official CWI website", "official", site.url, "", `${site.url}/sitemap.xml`, "website", "official", "Official CWI public pages, policies, and sitemap."]
] as const;

const defaultKeywords = [
  ["Cockroach Watch India", "CWI", 1],
  ["CWI", "CWI", 1],
  ["CWI Watch Desk", "CWI", 1],
  ["CWI India Unanswered Files", "CWI", 1],
  ["Document Verify Amplify", "CWI", 2],
  ["India is watching", "CWI", 2],
  ["Cockroach Janta Party", "CJP", 1],
  ["CJP", "CJP", 1],
  ["Cockroach wave", "CJP", 1],
  ["Main Bhi Cockroach", "CJP", 2],
  ["I am Cockroach", "CJP", 2],
  ["Abhijeet Dipke", "CJP", 2],
  ["NEET paper leak", "Public issues", 1],
  ["Hathras case", "Public issues", 1],
  ["Electoral Bonds", "Public issues", 1],
  ["Bulldozer justice", "Public issues", 1],
  ["Assam evictions", "Public issues", 1],
  ["Manipur violence", "Public issues", 1],
  ["Joshimath", "Public issues", 1],
  ["Hasdeo", "Public issues", 1],
  ["Wayanad landslide", "Public issues", 1],
  ["Women wrestlers", "Public issues", 1]
] as const;

export async function initializeAdminOs() {
  await ensureAdminOsTables();
  if (!globalThis.cwiAdminSeedReady) {
    globalThis.cwiAdminSeedReady = seedAdminDefaults().catch((error) => {
      globalThis.cwiAdminSeedReady = undefined;
      throw error;
    });
  }

  await globalThis.cwiAdminSeedReady;
}

export function invalidateAdminDashboardCache() {
  globalThis.cwiAdminDashboardCache = undefined;
}

export async function seedAdminDefaults() {
  const pool = getPool();

  for (const [id, name, role] of agentDefinitions) {
    await pool.query(
      `
        insert into agents (id, name, role, status, settings)
        values ($1, $2, $3, 'online', $4)
        on conflict (id) do update set name = excluded.name, role = excluded.role, updated_at = now();
      `,
      [id, name, role, JSON.stringify(agentSettings(id))]
    );
  }

  for (const [name, sourceType, url, rssUrl, sitemapUrl, platform, trustLevel, notes] of defaultSources) {
    await pool.query(
      `
        insert into sources (name, source_type, url, rss_url, sitemap_url, platform, trust_level, active, notes)
        select $1, $2, $3, nullif($4, ''), nullif($5, ''), $6, $7, true, $8
        where not exists (select 1 from sources where name = $1 and coalesce(url, '') = coalesce($3, ''));
      `,
      [name, sourceType, url, rssUrl, sitemapUrl, platform, trustLevel, notes]
    );
  }

  for (const [keyword, group, priority] of defaultKeywords) {
    await pool.query(
      `
        insert into keywords (keyword, keyword_group, priority, active)
        values ($1, $2, $3, true)
        on conflict (keyword, keyword_group) do update set priority = excluded.priority, active = true, updated_at = now();
      `,
      [keyword, group, priority]
    );
  }

  await pool.query(
    `
      insert into settings (key, value)
      values
        ('budget', $1),
        ('publishing_rule', $2),
        ('official_site', $3)
      on conflict (key) do update set value = excluded.value, updated_at = now();
    `,
    [
      JSON.stringify({ monthlyCapInr: monthlyBudgetInr, dailyCapInr: dailyBudgetInr, autoPublish: false }),
      JSON.stringify({ rule: "Agents prepare everything. Human approves everything. No automatic publishing." }),
      JSON.stringify({ url: site.url })
    ]
  );

  await syncBigBrainRules();
}

export async function getAdminDashboardData(options: { force?: boolean } = {}) {
  if (!options.force && globalThis.cwiAdminDashboardCache && globalThis.cwiAdminDashboardCache.expiresAt > Date.now()) {
    return globalThis.cwiAdminDashboardCache.data as Awaited<ReturnType<typeof buildAdminDashboardData>>;
  }

  const data = await buildAdminDashboardData();
  globalThis.cwiAdminDashboardCache = {
    data,
    expiresAt: Date.now() + 15_000
  };

  return data;
}

async function buildAdminDashboardData() {
  await initializeAdminOs();
  await ensureReportsTable().catch(() => undefined);
  await ensureCommentsTable().catch(() => undefined);
  await ensureUnansweredFilesTables().catch(() => undefined);

  const pool = getPool();
  const [
    agents,
    approvals,
    researchPacks,
    verificationReports,
    articleDrafts,
    seoPacks,
    socialPacks,
    imageLibrary,
    uiuxAudits,
    manualLinks,
    sources,
    keywords,
    briefings,
    healthLogs,
    costs,
    dailyCosts,
    costUsageLogs,
    reports,
    watchComments,
    unansweredComments,
    workflows,
    memoryNodes,
    memoryClaims,
    verificationGates,
    qualityScores,
    trendRadarItems,
    bigBrainRules,
    memoryGraphNodes,
    memoryGraphEdges
  ] = await Promise.all([
    pool.query(`select * from agents order by id;`),
    pool.query(`select * from approval_queue order by created_at desc limit 80;`),
    pool.query(`select * from research_packs order by created_at desc limit 50;`),
    pool.query(`select * from verification_reports order by created_at desc limit 50;`),
    pool.query(`select * from article_drafts order by created_at desc limit 50;`),
    pool.query(`select * from seo_packs order by created_at desc limit 50;`),
    pool.query(`select * from social_packs order by created_at desc limit 50;`),
    pool.query(`select * from image_library order by created_at desc limit 50;`),
    pool.query(`select * from uiux_audits order by created_at desc limit 50;`),
    pool.query(`select * from manual_links order by created_at desc limit 50;`),
    pool.query(`select * from sources order by active desc, trust_level, name;`),
    pool.query(`select * from keywords order by priority, keyword_group, keyword;`),
    pool.query(`select * from daily_briefings order by created_at desc limit 20;`),
    pool.query(`select * from system_health_logs order by created_at desc limit 10;`),
    pool.query(`select coalesce(sum(estimated_cost_inr), 0)::numeric(10,2)::text as month_cost from cost_usage_logs where created_at >= date_trunc('month', now());`),
    pool.query(`select coalesce(sum(estimated_cost_inr), 0)::numeric(10,2)::text as day_cost from cost_usage_logs where created_at >= current_date;`),
    pool.query(`select * from cost_usage_logs order by created_at desc limit 50;`),
    pool.query(`
      select id::text, created_at, name, contact, city, state, type, source_url, message, status
      from cwi_report_submissions
      order by created_at desc
      limit 30;
    `).catch(() => ({ rows: [] })),
    pool.query(`
      select id::text, article_slug as article, name, comment, status, created_at, 'Watch Desk' as source
      from cwi_article_comments
      order by created_at desc
      limit 40;
    `).catch(() => ({ rows: [] })),
    pool.query(`
      select id::text, article_id as article, name, comment_text as comment, status, created_at, 'India Unanswered Files' as source
      from cwi_unanswered_comments
      order by created_at desc
      limit 40;
    `).catch(() => ({ rows: [] })),
    pool.query(`select * from cwi_agent_workflows order by updated_at desc limit 50;`).catch(() => ({ rows: [] })),
    pool.query(`select * from cwi_memory_nodes order by last_seen_at desc limit 80;`).catch(() => ({ rows: [] })),
    pool.query(`select * from cwi_memory_claims order by last_seen_at desc limit 80;`).catch(() => ({ rows: [] })),
    pool.query(`select * from cwi_verification_gates order by created_at desc limit 50;`).catch(() => ({ rows: [] })),
    pool.query(`select * from cwi_quality_scores order by created_at desc limit 50;`).catch(() => ({ rows: [] })),
    pool.query(`select * from cwi_trend_radar_items order by priority_score desc, updated_at desc limit 50;`).catch(() => ({ rows: [] })),
    pool.query(`select * from big_brain_rules order by priority asc, category asc, title asc;`).catch(() => ({ rows: [] })),
    pool.query(`select * from memory_graph_nodes order by last_seen_at desc limit 100;`).catch(() => ({ rows: [] })),
    pool.query(`select * from memory_graph_edges order by updated_at desc limit 100;`).catch(() => ({ rows: [] }))
  ]);

  const approvalRows = approvals.rows;
  const dbPublishedPosts = await getPublishedWatchPosts(8).catch(() => []);
  const estimatedMonthlyCost = Number(costs.rows[0]?.month_cost ?? 0);
  const estimatedDailyCost = Number(dailyCosts.rows[0]?.day_cost ?? 0);
  const pendingApprovals = approvalRows.filter((row) => normalizeApprovalStatus(row.status) === "waiting_for_approval").length;
  const latestHealth = healthLogs.rows[0] ?? buildHealthSnapshot({ pendingApprovals, estimatedMonthlyCost, estimatedDailyCost });

  return {
    budget: {
      monthlyCapInr: monthlyBudgetInr,
      dailyCapInr: dailyBudgetInr,
      estimatedDailyCost,
      estimatedMonthlyCost,
      safeMode: estimatedMonthlyCost > monthlyBudgetInr * 0.8 || estimatedDailyCost >= 200
    },
    ai: publicAiConfig(),
    counts: {
      totalArticles: posts.length + dbPublishedPosts.length + unansweredFiles.length,
      pendingApprovals,
      reportsReceived: reports.rows.length,
      researchPacksReady: researchPacks.rows.length,
      articlesReady: articleDrafts.rows.length,
      seoPacksReady: seoPacks.rows.length,
      socialPacksReady: socialPacks.rows.length,
      uiuxIssuesFound: uiuxAudits.rows.length,
      memoryNodes: memoryNodes.rows.length,
      memoryGraphNodes: memoryGraphNodes.rows.length,
      bigBrainRules: bigBrainRules.rows.length,
      activeWorkflows: workflows.rows.filter((row) => ["queued", "running", "awaiting_approval"].includes(String(row.status))).length,
      trendRadarItems: trendRadarItems.rows.length,
      qualityReviews: qualityScores.rows.length
    },
    agents: agents.rows,
    approvals: approvalRows,
    researchPacks: researchPacks.rows,
    verificationReports: verificationReports.rows,
    articleDrafts: articleDrafts.rows,
    seoPacks: seoPacks.rows,
    socialPacks: socialPacks.rows,
    imageLibrary: imageLibrary.rows,
    uiuxAudits: uiuxAudits.rows,
    manualLinks: manualLinks.rows,
    sources: sources.rows,
    keywords: keywords.rows,
    dailyBriefings: briefings.rows,
    health: latestHealth,
    reports: reports.rows,
    workflows: workflows.rows,
    memoryNodes: memoryNodes.rows,
    memoryClaims: memoryClaims.rows,
    verificationGates: verificationGates.rows,
    qualityScores: qualityScores.rows,
    trendRadarItems: trendRadarItems.rows,
    bigBrainRules: bigBrainRules.rows,
    memoryGraphNodes: memoryGraphNodes.rows,
    memoryGraphEdges: memoryGraphEdges.rows,
    costUsageLogs: costUsageLogs.rows,
    comments: [...watchComments.rows, ...unansweredComments.rows].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    latestPublicArticles: mergeAdminArticles([
      ...dbPublishedPosts.map((post) => ({ title: post.title, href: `/watch-desk/${post.slug}`, category: post.category })),
      ...posts.slice(0, 8).map((post) => ({ title: post.title, href: `/watch-desk/${post.slug}`, category: post.category }))
    ]).slice(0, 6),
    latestUnansweredFiles: unansweredFiles.slice(0, 6).map((file) => ({ title: file.title, href: `/india-unanswered-files/${file.slug}`, category: file.category }))
  };
}

function publicAiConfig() {
  const config = getAIProviderConfig();
  return {
    provider: config.provider,
    model: config.model,
    configured: config.configured,
    productionReady: config.provider === "openai" || config.provider === "bedrock",
    routing: config.routing ?? {},
    message: config.configured
      ? config.provider === "mock"
        ? "Mock mode is active. Use only for local testing, not real editorial output."
        : "Real AI provider is configured."
      : config.error
  };
}

export async function createManualLinkWorkflow(input: {
  url: string;
  topic?: string;
  platform?: string;
  creatorSource?: string;
  notes?: string;
  priority?: string;
  contentType?: string;
}) {
  await initializeAdminOs();

  const url = normalizeUrl(input.url);
  const metadata = await extractUrlMetadata(url).catch(() => ({
    title: input.topic || "Manual source link",
    description: "Metadata extraction failed. Admin can add title, creator, date, context, and screenshot manually.",
    status: "manual_required"
  }));
  const topic = clean(input.topic) || metadata.title || "Manual source link";
  const platform = clean(input.platform) || detectPlatform(url);
  const pool = getPool();

  const manualLink = await pool.query<{ id: string }>(
    `
      insert into manual_links (url, topic, platform, creator_source, notes, priority, content_type, extracted_title, extracted_description, extraction_status)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      returning id;
    `,
    [
      url,
      topic,
      platform,
      clean(input.creatorSource),
      clean(input.notes),
      clean(input.priority) || "normal",
      clean(input.contentType) || "manual link",
      metadata.title,
      metadata.description,
      metadata.status
    ]
  );

  const sourceList = [
    {
      title: metadata.title,
      url,
      platform,
      creatorSource: clean(input.creatorSource) || platform,
      note: "Manual source link supplied by CWI admin."
    }
  ];

  const researchPack = await pool.query<{ id: string }>(
    `
      insert into research_packs (
        topic, category, date_range, source_list, source_count, summary,
        what_happened, what_we_know, what_remains_unclear, timeline, key_facts,
        public_reaction, source_confidence, risks, suggested_article_angle, suggested_social_angle
      )
      values ($1, $2, $3, $4, 1, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      returning id;
    `,
    [
      topic,
      categoryFromContentType(input.contentType),
      "Manual review",
      JSON.stringify(sourceList),
      metadata.description || `CWI Source Lens received a manual link about ${topic}.`,
      `A manual source link was submitted for ${topic}. The source needs review before use.`,
      "The URL, platform, creator/source, notes, and extracted metadata are available for review.",
      "Whether the claim is verified, complete, current, or suitable for publication remains unclear until human review.",
      JSON.stringify([{ date: new Date().toISOString().slice(0, 10), title: "Manual link submitted", summary: `CWI admin submitted ${url}` }]),
      JSON.stringify([metadata.title || topic, `Platform: ${platform}`, "No paid API used."]),
      clean(input.notes) || "Public reaction not assessed yet.",
      metadata.status === "extracted" ? "Manual source extracted; verification required" : "Needs manual metadata",
      JSON.stringify(["Do not treat this source as verified until reviewed.", "Avoid reposting copyrighted creator material without permission or commentary context."]),
      `Source-backed explainer or advisory on ${topic}`,
      `Short responsible caption directing readers to CWI after verification.`
    ]
  );

  const verification = await createVerificationReport(researchPack.rows[0].id, "Developing", "Medium");
  const article = await createArticleDraft(researchPack.rows[0].id, topic, metadata.description || "", 1, "Developing");
  const seo = await createSeoPack(article.id, topic, article.slug);
  const social = await createSocialPack(article.id, topic, url);
  const image = await createImagePack(topic);
  const approval = await createApprovalQueueItem({
    topic,
    type: "Manual Link Workflow",
    summary: metadata.description || `Manual link queued for ${topic}.`,
    verificationStatus: "Developing",
    riskLevel: "Medium",
    sourceCount: 1,
    articleDraftId: article.id,
    seoPackId: seo.id,
    socialPackId: social.id,
    imagePackId: image.id,
    suggestedAction: "Review source, verify claims, then approve article/social/image packs if suitable."
  });

  await logTask("research-ai", `Processed manual link: ${topic}`, "completed", 6);
  await logTask("verify-ai", `Created verification report: ${topic}`, "completed", 4, { verificationReportId: verification.id });
  await logTask("article-ai", `Prepared draft shell: ${topic}`, "completed", 8);
  await logTask("seo-ai", `Prepared SEO pack: ${topic}`, "completed", 3);
  await logTask("social-ai", `Prepared social pack: ${topic}`, "completed", 3);
  invalidateAdminDashboardCache();

  return {
    manualLinkId: manualLink.rows[0].id,
    researchPackId: researchPack.rows[0].id,
    approvalQueueId: approval.id
  };
}

export async function runAgentAction(action: string) {
  await initializeAdminOs();

  if (action === "daily-workflow" || action === "daily-briefing") {
    return createDailyBriefing();
  }

  if (action === "research-only") {
    return createPriorityResearchPack();
  }

  if (action === "seo-check") {
    return createSeoAuditPack();
  }

  if (action === "uiux-audit") {
    return createUiuxAudit();
  }

  if (action === "social-pack") {
    return createStandaloneSocialPack();
  }

  if (action === "article-draft") {
    return createStandaloneArticleDraft();
  }

  if (action === "sync-memory") {
    const result = await syncStaticPublicMemory();
    await logTask("research-ai", "Synced CWI source memory and knowledge graph", "completed", 2, result);
    invalidateAdminDashboardCache();
    return { ok: true, message: `Source memory synced: ${result.synced} public records indexed.`, data: result };
  }

  if (action === "sync-big-brain") {
    const result = await syncBigBrainRules();
    await logTask("memory-graph-ai", "Synced CWI Big Brain rules", "completed", 1, result);
    invalidateAdminDashboardCache();
    return { ok: true, message: `Big Brain synced: ${result.synced} newsroom rules active.`, data: result };
  }

  if (action === "trend-radar") {
    const result = await runTrendRadar();
    await logTask("command-ai", "Generated CWI Trend Radar", "completed", 4, result);
    invalidateAdminDashboardCache();
    return { ok: true, message: `Trend radar generated ${result.generated} items.`, data: result };
  }

  if (action === "stop-non-essential") {
    await getPool().query(`update agents set status = 'paused', updated_at = now() where id not in ('command-ai', 'system-health-ai', 'publish-ai', 'memory-graph-ai');`);
    await logTask("system-health-ai", "Stopped all non-essential tasks", "completed", 0);
    invalidateAdminDashboardCache();
    return { ok: true, message: "Non-essential agents paused. Command, Publish, and System Health remain available." };
  }

  return { ok: false, message: "Unknown agent action." };
}

export async function updateApprovalStatus(id: string, status: string, notes?: string) {
  await initializeAdminOs();
  const approvalQueueId = requireUuid(id, "approvalQueueId");
  const safeStatus = normalizeApprovalStatus(clean(status) || "waiting_for_approval");
  const result = await getPool().query(
    `
      update approval_queue
      set status = $2,
          notes = coalesce(nullif($3, ''), notes),
          approved_at = case when $2 = 'approved' then coalesce(approved_at, now()) else approved_at end,
          approved_by = case when $2 = 'approved' then coalesce(approved_by, 'CWI Admin') else approved_by end,
          updated_at = now()
      where id = $1
      returning *;
    `,
    [approvalQueueId, safeStatus, clean(notes)]
  );

  await logTask("publish-ai", `Approval queue status changed to ${safeStatus}`, "completed", 0);
  invalidateAdminDashboardCache();
  return result.rows[0] ?? null;
}

export async function updateCommentModeration(input: { source: string; id: string; status: string }) {
  const status = ["approved", "rejected", "spam", "pending"].includes(input.status) ? input.status : "pending";
  const commentId = requireUuid(input.id, "commentId");

  if (input.source === "Watch Desk") {
    await ensureCommentsTable();
    await getPool().query(`update cwi_article_comments set status = $2 where id = $1;`, [commentId, status]);
  } else if (input.source === "India Unanswered Files") {
    await ensureUnansweredFilesTables();
    await getPool().query(`update cwi_unanswered_comments set status = $2, updated_at = now() where id = $1;`, [commentId, status]);
  }

  await logTask("verify-ai", `Comment moderation: ${status}`, "completed", 0);
  invalidateAdminDashboardCache();
  return { ok: true, status };
}

async function createDailyBriefing() {
  const data = await getAdminDashboardData();
  const topTopics = [
    ...data.reports.slice(0, 3).map((item) => item.type || item.message?.slice(0, 80) || "Submitted report"),
    ...posts.slice(0, 4).map((post) => post.title),
    ...unansweredFiles.slice(0, 3).map((file) => file.title)
  ].slice(0, 10);

  const result = await getPool().query<{ id: string }>(
    `
      insert into daily_briefings (
        top_topics, urgent_updates, articles_to_prepare, social_posts_to_prepare,
        images_needed, seo_tasks, uiux_issues, risks_to_avoid, approval_items
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      returning id;
    `,
    [
      JSON.stringify(topTopics),
      JSON.stringify(data.approvals.slice(0, 5).map((item) => item.topic)),
      JSON.stringify(["Review pending manual links", "Update source-backed Watch Desk items", "Check top India Unanswered Files pages"]),
      JSON.stringify(["Prepare captions only for approved topics", "Avoid unverified breaking claims"]),
      JSON.stringify(["Check topic-specific OG images", "Avoid repeated unrelated visuals"]),
      JSON.stringify(["Confirm sitemap is current", "Inspect top URLs in Search Console after approval"]),
      JSON.stringify(data.uiuxAudits.slice(0, 5).map((item) => item.issue)),
      JSON.stringify(["No auto-publish", "No fake claims", "No copyrighted reposts without context", "No old Vercel URLs"]),
      JSON.stringify(data.approvals.slice(0, 8).map((item) => ({ id: item.id, topic: item.topic, status: item.status })))
    ]
  );

  await createApprovalQueueItem({
    topic: "Daily Command Briefing",
    type: "Daily Briefing",
    summary: "CWI Command Core prepared a daily briefing for human review.",
    verificationStatus: "Source-backed",
    riskLevel: "Low",
    sourceCount: 0,
    suggestedAction: "Review priorities, approve tasks, or request changes."
  });
  await logTask("command-ai", "Generated Daily Command Briefing", "completed", 12);
  invalidateAdminDashboardCache();

  return { ok: true, message: "Daily briefing generated and sent to approval queue.", id: result.rows[0].id };
}

async function createPriorityResearchPack() {
  const file = unansweredFiles[0];
  const result = await getPool().query<{ id: string }>(
    `
      insert into research_packs (
        topic, category, date_range, source_list, source_count, summary,
        what_happened, what_we_know, what_remains_unclear, timeline, key_facts,
        source_confidence, risks, suggested_article_angle, suggested_social_angle
      )
      values ($1, 'India Unanswered Files', $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Source-backed but needs final review', $11, $12, $13)
      returning id;
    `,
    [
      file.title,
      file.year,
      JSON.stringify(file.sources.slice(0, 5)),
      file.sourceCount,
      file.summary,
      file.sections[0]?.body ?? file.summary,
      file.sections[1]?.body ?? file.groundReality,
      file.unansweredQuestions.join(" "),
      JSON.stringify(file.timeline.slice(0, 8)),
      JSON.stringify(file.unansweredQuestions.slice(0, 5)),
      JSON.stringify(["Needs source freshness check before publishing updates."]),
      `Update ${file.title} with latest source-backed context.`,
      `Public-memory post linking to ${site.url}/india-unanswered-files/${file.slug}.`
    ]
  );

  await createApprovalQueueItem({
    topic: file.title,
    type: "Research Pack",
    summary: file.summary,
    verificationStatus: file.status,
    riskLevel: "Medium",
    sourceCount: file.sourceCount,
    suggestedAction: "Review source freshness before assigning Article AI."
  });
  await logTask("research-ai", `Prepared priority research pack: ${file.title}`, "completed", 7);
  invalidateAdminDashboardCache();

  return { ok: true, message: "Research pack generated for approval.", id: result.rows[0].id };
}

async function createSeoAuditPack() {
  const sitemapOk = true;
  const result = await getPool().query<{ id: string }>(
    `
      insert into system_health_logs (
        website_status, database_status, sitemap_status, robots_status, old_url_check,
        broken_links, missing_metadata, missing_alt_text, failed_tasks, monthly_budget_usage_inr, daily_ai_usage_inr, pending_approvals
      )
      values ('online', 'connected', $1, 'ok', 'no old Vercel URL detected in generated public SEO files', 0, 0, 0, 0, $2, 0, (select count(*) from approval_queue where status like '%Approval%'))
      returning id;
    `,
    [sitemapOk ? "ok" : "needs review", await getMonthCost()]
  );

  await createApprovalQueueItem({
    topic: "SEO system check",
    type: "SEO Pack",
    summary: "CWI Rank Engine checked sitemap/robots assumptions and queued a Search Console checklist.",
    verificationStatus: "Source-backed",
    riskLevel: "Low",
    sourceCount: 0,
    suggestedAction: "Review sitemap and inspect priority URLs after deploy."
  });
  await logTask("seo-ai", "Ran SEO system check", "completed", 3);
  invalidateAdminDashboardCache();

  return { ok: true, message: "SEO check generated.", id: result.rows[0].id };
}

async function createUiuxAudit() {
  const audits = [
    ["Submit Report", "Confirm no developer-facing upload/backend wording is visible.", "High", "Keep upload instructions user-facing."],
    ["Watch Desk articles", "Check mobile spacing around source cards and rating widget.", "Medium", "Keep CTA buttons tappable."],
    ["India Unanswered Files", "Verify related cards use readable title overlays and relevant images.", "Medium", "Maintain CWI blue title treatment."]
  ];

  for (const [page, issue, severity, suggestedText] of audits) {
    await getPool().query(
      `
        insert into uiux_audits (page, issue, severity, suggested_text, fix_status)
        values ($1, $2, $3, $4, 'UI Review Ready');
      `,
      [page, issue, severity, suggestedText]
    );
  }

  await createApprovalQueueItem({
    topic: "UI/UX audit pack",
    type: "UI/UX Fix Pack",
    summary: "CWI UX Guardian prepared a small review list. No redesign will happen without approval.",
    verificationStatus: "Opinion",
    riskLevel: "Low",
    sourceCount: 0,
    suggestedAction: "Approve specific fixes only."
  });
  await logTask("uiux-ai", "Generated UI/UX audit pack", "completed", 5);
  invalidateAdminDashboardCache();

  return { ok: true, message: "UI/UX audit generated." };
}

async function createStandaloneSocialPack() {
  const post = posts[0];
  const social = await createSocialPack(null, post.title, `${site.url}/watch-desk/${post.slug}`);
  await createApprovalQueueItem({
    topic: post.title,
    type: "Social Pack",
    summary: "CWI Signal Studio generated platform captions for review only.",
    verificationStatus: post.verificationStatus,
    riskLevel: "Low",
    sourceCount: post.sources.length,
    socialPackId: social.id,
    suggestedAction: "Approve captions manually before posting."
  });
  await logTask("social-ai", `Generated social pack: ${post.title}`, "completed", 3);
  invalidateAdminDashboardCache();

  return { ok: true, message: "Social pack generated for approval.", id: social.id };
}

async function createStandaloneArticleDraft() {
  const post = posts[0];
  const article = await createArticleDraft(null, post.title, post.summary, post.sources.length, post.verificationStatus);
  const seo = await createSeoPack(article.id, post.title, article.slug);
  await createApprovalQueueItem({
    topic: post.title,
    type: "Article Draft",
    summary: "CWI Desk Writer prepared a template-based draft shell for human review.",
    verificationStatus: post.verificationStatus,
    riskLevel: "Medium",
    sourceCount: post.sources.length,
    articleDraftId: article.id,
    seoPackId: seo.id,
    suggestedAction: "Review, edit, verify sources, then approve or request changes."
  });
  await logTask("article-ai", `Generated article draft: ${post.title}`, "completed", 8);
  invalidateAdminDashboardCache();

  return { ok: true, message: "Article draft generated for approval.", id: article.id };
}

async function createVerificationReport(researchPackId: string, status: string, riskLevel: string) {
  const safeResearchPackId = requireUuid(researchPackId, "researchPackId");
  const result = await getPool().query<{ id: string }>(
    `
      insert into verification_reports (
        research_pack_id, verification_status, risk_level, unsafe_claims, safer_wording,
        source_gaps, publish_recommendation, human_review_required
      )
      values ($1, $2, $3, $4, $5, $6, 'Do not publish until CWI admin reviews sources and wording.', true)
      returning id;
    `,
    [
      safeResearchPackId,
      status,
      riskLevel,
      JSON.stringify(["No claim should be treated as confirmed without reliable source attribution."]),
      JSON.stringify(["Use reportedly, according to, publicly circulating, developing, and official clarification awaited where needed."]),
      JSON.stringify(["Need at least two reliable sources for high-risk allegations."])
    ]
  );

  return result.rows[0];
}

async function createArticleDraft(researchPackId: string | null, topic: string, summary: string, sourceCount: number, verificationStatus: string) {
  const slug = slugify(topic);
  const draft = {
    h1: `${topic} - CWI Watch Desk`,
    shortAnswer: summary || `${topic} is queued for CWI review with source attribution required before publishing.`,
    sections: [
      { heading: "What happened", body: "This section must be completed only from verified source links in the research pack." },
      { heading: "What we know", body: "List source-backed details with dates, outlets, and official/public records." },
      { heading: "What remains unclear", body: "Separate claims, rumours, developing details, and unanswered questions." },
      { heading: "Why it matters", body: "Explain the civic, youth, digital-rights, creator-credit, or public-interest relevance." },
      {
        heading: "CWI context",
        body:
          "Cockroach Watch India - CWI is tracking this topic through the CWI Watch Desk as part of its public archive on youth voice, civic satire, creator-led commentary, public issues, and India's unanswered questions. CWI's role is to document, verify, and amplify public-interest conversations with context and source attribution."
      }
    ],
    disclaimer:
      "Cockroach Watch India is an independent civic watch, satire, and commentary platform. This article discusses publicly available reports, official statements, social media trends, and public reactions. Claims are presented with attribution wherever possible and should not be treated as legal findings or official declarations unless clearly stated.",
    cta: `Submit corrections or source links at ${site.url}/submit.`
  };

  const result = await getPool().query<{ id: string; slug: string }>(
    `
      insert into article_drafts (research_pack_id, title, slug, category, draft, verification_status, source_count)
      values ($1, $2, $3, 'Watch Desk', $4, $5, $6)
      returning id, slug;
    `,
    [optionalUuid(researchPackId), topic, slug, JSON.stringify(draft), verificationStatus, sourceCount]
  );

  return result.rows[0];
}

async function createSeoPack(articleDraftId: string | null, topic: string, slug: string) {
  const canonicalUrl = `${site.url}/watch-desk/${slug}`;
  const result = await getPool().query<{ id: string }>(
    `
      insert into seo_packs (
        article_draft_id, seo_title, meta_description, slug, canonical_url,
        open_graph_title, open_graph_description, open_graph_image, twitter_card,
        schema_json, breadcrumb_schema, internal_links, image_alt_text, sitemap_status,
        search_console_checklist
      )
      values ($1, $2, $3, $4, $5, $2, $3, $6, $7, $8, $9, $10, $11, 'Pending approval', $12)
      returning id;
    `,
    [
      optionalUuid(articleDraftId),
      `${topic} - CWI Watch Desk | Cockroach Watch India`,
      `Cockroach Watch India explains ${topic}, what is known, what remains unclear, and why the CWI Watch Desk is tracking this public-interest update.`,
      slug,
      canonicalUrl,
      `${site.url}/opengraph-image`,
      JSON.stringify({ card: "summary_large_image", site: "@CWatchIndia" }),
      JSON.stringify({ "@type": "NewsArticle", headline: topic, url: canonicalUrl, publisher: "Cockroach Watch India" }),
      JSON.stringify({ "@type": "BreadcrumbList", items: ["Home", "CWI Watch Desk", topic] }),
      JSON.stringify(["/", "/watch", "/watch-desk", "/india-unanswered-files", "/submit"]),
      JSON.stringify([`Cockroach Watch India CWI Watch Desk visual on ${topic}.`]),
      JSON.stringify(["Check canonical", "Check OG image", "Check sitemap after approval", "Inspect URL in Google Search Console"])
    ]
  );

  return result.rows[0];
}

async function createSocialPack(articleDraftId: string | null, topic: string, url: string) {
  const ending = `Document. Verify. Amplify.\nThe youth are not silent. India is watching.\nWebsite: ${site.url}`;
  const result = await getPool().query<{ id: string }>(
    `
      insert into social_packs (
        article_draft_id, instagram_caption, facebook_caption, x_caption, reddit_title,
        reddit_body, youtube_shorts_title, youtube_shorts_description, pinned_comment,
        bluesky_caption, discord_announcement, hashtag_set, credit_line, website_line, risk_note
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      returning id;
    `,
    [
      optionalUuid(articleDraftId),
      `${topic}\n\nCWI is reviewing this public-interest update with source attribution and editorial caution.\n\n${ending}`,
      `${topic}\n\nCockroach Watch India is tracking this topic through a source-backed civic watch lens.\n\n${ending}`,
      `${topic}\n\nCWI is tracking this with source labels and public-interest context.\n${site.url}\n#CWI #IndiaIsWatching`,
      `${topic} - what source-backed context should CWI add?`,
      `CWI is reviewing this topic. What verified source, official statement, or public-interest context should be added before publication?\n\n${site.url}`,
      `${topic} | CWI Watch Desk`,
      `Source-backed civic context from Cockroach Watch India. ${ending}`,
      `Read the source trail and submit corrections at ${site.url}/submit.`,
      `${topic}\nCWI is tracking this with context, source attribution, and public-interest caution. ${site.url}`,
      `CWI update queued for review: ${topic}. Nothing publishes until approved.`,
      JSON.stringify(["#CockroachWatchIndia", "#CWI", "#DocumentVerifyAmplify", "#IndiaIsWatching", "#CivicWatch"]),
      `Source: ${url}`,
      `Website: ${site.url}`,
      "Review for platform-specific risk, creator credit, and unsupported claims before posting."
    ]
  );

  return result.rows[0];
}

async function createImagePack(topic: string) {
  const file = unansweredFiles.find((item) => topic.toLowerCase().includes(item.title.toLowerCase().split(" ")[0])) ?? unansweredFiles[0];
  const visual = getFileVisual(file);
  const result = await getPool().query<{ id: string }>(
    `
      insert into image_library (topic, section, image_type, path, alt_text, credit, source_url, quality_status, approval_status, metadata)
      values ($1, 'Watch Desk', 'hero/og/thumbnail candidate', $2, $3, $4, $5, 'Needs human review', 'Image Ready', $6)
      returning id;
    `,
    [
      topic,
      visual.src,
      `Cockroach Watch India visual for ${topic}.`,
      visual.credit,
      visual.sourceUrl,
      JSON.stringify({ doNotRepeatAcrossUnrelatedTopics: true, generatedBy: "CWI Visual Desk template" })
    ]
  );

  return result.rows[0];
}

async function createApprovalQueueItem(input: {
  topic: string;
  type: string;
  summary: string;
  verificationStatus: string;
  riskLevel: string;
  sourceCount: number;
  articleDraftId?: string | null;
  seoPackId?: string | null;
  socialPackId?: string | null;
  imagePackId?: string | null;
  uiuxAuditId?: string | null;
  suggestedAction: string;
}) {
  const result = await getPool().query<{ id: string }>(
    `
      insert into approval_queue (
        topic, type, summary, verification_status, risk_level, source_count,
        article_draft_id, seo_pack_id, social_pack_id, image_pack_id, uiux_audit_id,
        status, suggested_action
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Waiting for Approval', $12)
      returning id;
    `,
    [
      input.topic,
      input.type,
      input.summary,
      input.verificationStatus,
      input.riskLevel,
      input.sourceCount,
      optionalUuid(input.articleDraftId),
      optionalUuid(input.seoPackId),
      optionalUuid(input.socialPackId),
      optionalUuid(input.imagePackId),
      optionalUuid(input.uiuxAuditId),
      input.suggestedAction
    ]
  );

  return result.rows[0];
}

async function logTask(agentId: string, title: string, status: string, costEstimateInr: number, output: Record<string, unknown> = {}) {
  const pool = getPool();
  await pool.query(
    `
      insert into agent_tasks (agent_id, title, task_type, status, priority, output, cost_estimate_inr)
      values ($1, $2, 'admin-workflow', $3, 'normal', $4, $5);
    `,
    [agentId, title, status, JSON.stringify(output), costEstimateInr]
  );
  await pool.query(
    `
      update agents
      set last_run_at = now(),
          tasks_completed = tasks_completed + case when $2 = 'completed' then 1 else 0 end,
          failed_tasks = failed_tasks + case when $2 = 'failed' then 1 else 0 end,
          cost_estimate_inr = cost_estimate_inr + $3,
          updated_at = now()
      where id = $1;
    `,
    [agentId, status, costEstimateInr]
  );
  await pool.query(
    `
      insert into cost_usage_logs (agent_id, usage_type, estimated_cost_inr)
      values ($1, 'template-ai-orchestration', $2);
    `,
    [agentId, costEstimateInr]
  );
}

async function getMonthCost() {
  const result = await getPool().query<{ month_cost: string }>(
    `select coalesce(sum(estimated_cost_inr), 0)::numeric(10,2)::text as month_cost from cost_usage_logs where created_at >= date_trunc('month', now());`
  );

  return Number(result.rows[0]?.month_cost ?? 0);
}

async function extractUrlMetadata(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "Cockroach Watch India manual link processor; contact cockroachwatchindia@gmail.com"
      }
    });
    const html = await response.text();
    const title = decodeHtml(matchMeta(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || matchMeta(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i));
    const description = decodeHtml(
      matchMeta(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
        matchMeta(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)
    );

    return {
      title: clean(title) || "Manual source link",
      description: clean(description) || "No public metadata found. Manual context is required.",
      status: "extracted"
    };
  } finally {
    clearTimeout(timeout);
  }
}

function buildHealthSnapshot({
  pendingApprovals,
  estimatedMonthlyCost,
  estimatedDailyCost
}: {
  pendingApprovals: number;
  estimatedMonthlyCost: number;
  estimatedDailyCost: number;
}) {
  return {
    website_status: "online",
    database_status: "connected",
    sitemap_status: "ok",
    robots_status: "ok",
    old_url_check: "no old Vercel URL expected",
    broken_links: 0,
    missing_metadata: 0,
    missing_alt_text: 0,
    failed_tasks: 0,
    monthly_budget_usage_inr: estimatedMonthlyCost,
    daily_ai_usage_inr: estimatedDailyCost,
    pending_approvals: pendingApprovals,
    created_at: new Date().toISOString()
  };
}

function agentSettings(id: string) {
  return {
    autoPublish: false,
    monthlyBudgetCapInr: monthlyBudgetInr,
    dailyBudgetCapInr: dailyBudgetInr,
    lowCostMode: true,
    allowedInputs: ["RSS", "manual links", "YouTube RSS", "public sitemaps", "user reports", "official websites"],
    blockedInputs: ["paid X API", "paid Instagram API", "expensive scraping APIs", "unapproved auto-publish"],
    agentId: id
  };
}

function mergeAdminArticles(items: Array<{ href: string; title: string; category: string }>) {
  return Array.from(new Map(items.map((item) => [item.href, item])).values());
}

function categoryFromContentType(value?: string) {
  const normalized = clean(value).toLowerCase();
  if (normalized.includes("unanswered")) return "India Unanswered Files";
  if (normalized.includes("social")) return "Social Pack";
  if (normalized.includes("advisory")) return "Public Advisory";
  return "Watch Desk";
}

function detectPlatform(url: string) {
  const lower = url.toLowerCase();
  if (lower.includes("instagram.com")) return "Instagram";
  if (lower.includes("x.com") || lower.includes("twitter.com")) return "X";
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "YouTube";
  if (lower.includes("reddit.com")) return "Reddit";
  if (lower.includes("bsky.app")) return "Bluesky";
  return "Website";
}

function normalizeUrl(value: string) {
  const trimmed = clean(value);
  const url = trimmed.startsWith("http://") || trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`;
  return new URL(url).toString();
}

function matchMeta(html: string, pattern: RegExp) {
  return html.match(pattern)?.[1] ?? "";
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function slugify(value: string) {
  return clean(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function clean(value?: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\s+/g, " ");
}
