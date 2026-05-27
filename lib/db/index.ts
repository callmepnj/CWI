import { Pool } from "pg";

declare global {
  var cwiPgPool: Pool | undefined;
  var cwiReportsTableReady: Promise<void> | undefined;
  var cwiCommentsTableReady: Promise<void> | undefined;
  var cwiUnansweredFilesTableReady: Promise<void> | undefined;
  var cwiArticleRatingsTableReady: Promise<void> | undefined;
  var cwiAdminOsTablesReady: Promise<void> | undefined;
}

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return databaseUrl;
}

export function getPool() {
  if (!globalThis.cwiPgPool) {
    globalThis.cwiPgPool = new Pool({
      connectionString: getDatabaseUrl(),
      max: 3,
      ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false }
    });
    installSafeQueryGuard(globalThis.cwiPgPool);
  }

  return globalThis.cwiPgPool;
}

async function runSqlBatch(sql: string) {
  const statements = splitSqlStatements(sql);
  const pool = getPool();

  for (const statement of statements) {
    await pool.query(statement);
  }
}

function installSafeQueryGuard(pool: Pool) {
  type LooseQuery = (...args: unknown[]) => unknown;
  const guardedPool = pool as Pool & {
    cwiSafeQueryGuardInstalled?: boolean;
  };

  if (guardedPool.cwiSafeQueryGuardInstalled) {
    return;
  }

  const originalQuery = pool.query.bind(pool) as LooseQuery;

  (guardedPool as { query: LooseQuery }).query = (first: unknown, second?: unknown, third?: unknown) => {
    if (typeof first === "string") {
      const hasValues = Array.isArray(second);
      const text = hasValues ? normalizePreparedSql(first) : stripTrailingSemicolons(first);
      return originalQuery(text, second, third);
    }

    if (first && typeof first === "object" && "text" in first) {
      const config = { ...(first as { text?: string; values?: unknown[] }) };
      if (typeof config.text === "string") {
        config.text = Array.isArray(config.values) ? normalizePreparedSql(config.text) : stripTrailingSemicolons(config.text);
      }
      return originalQuery(config, second, third);
    }

    return originalQuery(first, second, third);
  };

  guardedPool.cwiSafeQueryGuardInstalled = true;
}

function normalizePreparedSql(sql: string) {
  const normalized = stripTrailingSemicolons(sql);

  if (hasStatementSeparator(normalized)) {
    throw new Error(
      "CWI database guard blocked a multi-statement prepared query. Split this SQL into separate getPool().query calls before running it on Supabase."
    );
  }

  return normalized;
}

function stripTrailingSemicolons(sql: string) {
  let output = sql.trimEnd();
  while (output.endsWith(";")) {
    output = output.slice(0, -1).trimEnd();
  }
  return output;
}

function splitSqlStatements(sql: string) {
  const statements: string[] = [];
  let current = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let index = 0; index < sql.length; index += 1) {
    const char = sql[index];
    const next = sql[index + 1];

    if (inLineComment) {
      current += char;
      if (char === "\n") inLineComment = false;
      continue;
    }

    if (inBlockComment) {
      current += char;
      if (char === "*" && next === "/") {
        current += next;
        index += 1;
        inBlockComment = false;
      }
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && char === "-" && next === "-") {
      current += char + next;
      index += 1;
      inLineComment = true;
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && char === "/" && next === "*") {
      current += char + next;
      index += 1;
      inBlockComment = true;
      continue;
    }

    if (!inDoubleQuote && char === "'") {
      current += char;
      if (inSingleQuote && next === "'") {
        current += next;
        index += 1;
        continue;
      }
      inSingleQuote = !inSingleQuote;
      continue;
    }

    if (!inSingleQuote && char === '"') {
      current += char;
      inDoubleQuote = !inDoubleQuote;
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && char === ";") {
      const statement = current.trim();
      if (statement) statements.push(statement);
      current = "";
      continue;
    }

    current += char;
  }

  const finalStatement = current.trim();
  if (finalStatement) statements.push(finalStatement);
  return statements;
}

function hasStatementSeparator(sql: string) {
  return splitSqlStatements(sql).length > 1;
}

export async function ensureReportsTable() {
  if (!globalThis.cwiReportsTableReady) {
    globalThis.cwiReportsTableReady = runSqlBatch(`
      create table if not exists cwi_report_submissions (
        id bigserial primary key,
        created_at timestamptz not null default now(),
        name text,
        contact text,
        city text,
        state text,
        type text not null,
        source_url text,
        proof_note text,
        message text not null,
        credit_preference text,
        consent boolean not null default false,
        safety boolean not null default false,
        status text not null default 'received',
        tracking_id text,
        raw_payload jsonb not null default '{}'::jsonb
      );

      create table if not exists cwi_report_evidence_files (
        id bigserial primary key,
        report_id bigint not null references cwi_report_submissions(id) on delete cascade,
        created_at timestamptz not null default now(),
        file_name text not null,
        file_type text not null,
        file_size integer not null,
        file_data bytea not null
      );

      create index if not exists cwi_report_evidence_files_report_id_idx
      on cwi_report_evidence_files (report_id);

      alter table cwi_report_submissions add column if not exists tracking_id text;
      create unique index if not exists cwi_report_submissions_tracking_id_idx
      on cwi_report_submissions (tracking_id)
      where tracking_id is not null;
    `);
  }

  return globalThis.cwiReportsTableReady;
}

export async function ensureCommentsTable() {
  if (!globalThis.cwiCommentsTableReady) {
    globalThis.cwiCommentsTableReady = runSqlBatch(`
      create extension if not exists pgcrypto;

      create table if not exists cwi_article_comments (
        id uuid primary key default gen_random_uuid(),
        article_slug text not null,
        name text not null,
        email text,
        comment text not null,
        status text not null default 'pending',
        created_at timestamptz not null default now(),
        ip_hash text,
        user_agent text
      );

      create index if not exists cwi_article_comments_slug_status_created_idx
      on cwi_article_comments (article_slug, status, created_at desc);
    `);
  }

  return globalThis.cwiCommentsTableReady;
}

export async function ensureArticleRatingsTable() {
  if (!globalThis.cwiArticleRatingsTableReady) {
    globalThis.cwiArticleRatingsTableReady = runSqlBatch(`
      create extension if not exists pgcrypto;

      create table if not exists cwi_article_ratings (
        id uuid primary key default gen_random_uuid(),
        article_type text not null,
        article_slug text not null,
        rating integer not null check (rating between 1 and 5),
        ip_hash text not null,
        user_agent_hash text,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        unique (article_type, article_slug, ip_hash)
      );

      create index if not exists cwi_article_ratings_article_idx
      on cwi_article_ratings (article_type, article_slug, updated_at desc);
    `);
  }

  return globalThis.cwiArticleRatingsTableReady;
}

export async function ensureUnansweredFilesTables() {
  if (!globalThis.cwiUnansweredFilesTableReady) {
    globalThis.cwiUnansweredFilesTableReady = runSqlBatch(`
      create extension if not exists pgcrypto;

      create table if not exists cwi_unanswered_articles (
        id text primary key,
        slug text not null unique,
        title text not null,
        summary text,
        category text,
        location text,
        start_date text,
        current_status text,
        hero_image text,
        reading_time text,
        source_count integer not null default 0,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        published_at timestamptz not null default now(),
        seo_title text,
        seo_description text,
        seo_keywords text[]
      );

      create table if not exists cwi_unanswered_article_views (
        id bigserial primary key,
        article_id text not null references cwi_unanswered_articles(id) on delete cascade,
        ip_hash text,
        user_agent_hash text,
        viewed_at timestamptz not null default now()
      );

      create table if not exists cwi_unanswered_article_likes (
        id bigserial primary key,
        article_id text not null references cwi_unanswered_articles(id) on delete cascade,
        user_id text,
        ip_hash text,
        created_at timestamptz not null default now(),
        unique (article_id, ip_hash)
      );

      create table if not exists cwi_unanswered_article_shares (
        id bigserial primary key,
        article_id text not null references cwi_unanswered_articles(id) on delete cascade,
        platform text not null,
        shared_at timestamptz not null default now(),
        ip_hash text
      );

      create table if not exists cwi_unanswered_article_bookmarks (
        id bigserial primary key,
        article_id text not null references cwi_unanswered_articles(id) on delete cascade,
        user_id text,
        ip_hash text,
        created_at timestamptz not null default now(),
        unique (article_id, ip_hash)
      );

      create table if not exists cwi_unanswered_comments (
        id uuid primary key default gen_random_uuid(),
        article_id text not null references cwi_unanswered_articles(id) on delete cascade,
        parent_id uuid references cwi_unanswered_comments(id) on delete cascade,
        name text not null,
        email text,
        comment_text text not null,
        status text not null default 'pending',
        likes_count integer not null default 0,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        ip_hash text,
        user_agent text
      );

      create table if not exists cwi_unanswered_comment_likes (
        id bigserial primary key,
        comment_id uuid not null references cwi_unanswered_comments(id) on delete cascade,
        user_id text,
        ip_hash text,
        created_at timestamptz not null default now(),
        unique (comment_id, ip_hash)
      );

      create index if not exists cwi_unanswered_views_article_idx
      on cwi_unanswered_article_views (article_id, viewed_at desc);

      create index if not exists cwi_unanswered_comments_article_status_idx
      on cwi_unanswered_comments (article_id, status, created_at desc);
    `);
  }

  return globalThis.cwiUnansweredFilesTableReady;
}

async function adminOsSchemaLooksReady() {
  try {
    const result = await getPool().query<Record<string, boolean>>(`
      select
        to_regclass('public.agents') is not null as agents,
        to_regclass('public.agent_tasks') is not null as agent_tasks,
        to_regclass('public.approval_queue') is not null as approval_queue,
        to_regclass('public.research_packs') is not null as research_packs,
        to_regclass('public.verification_reports') is not null as verification_reports,
        to_regclass('public.article_drafts') is not null as article_drafts,
        to_regclass('public.live_newsroom_items') is not null as live_newsroom_items,
        to_regclass('public.archive_items') is not null as archive_items,
        to_regclass('public.seo_packs') is not null as seo_packs,
        to_regclass('public.social_packs') is not null as social_packs,
        to_regclass('public.image_library') is not null as image_library,
        to_regclass('public.uiux_audits') is not null as uiux_audits,
        to_regclass('public.daily_briefings') is not null as daily_briefings,
        to_regclass('public.system_health_logs') is not null as system_health_logs,
        to_regclass('public.cost_usage_logs') is not null as cost_usage_logs,
        to_regclass('public.settings') is not null as settings,
        to_regclass('public.cwi_memory_nodes') is not null as cwi_memory_nodes,
        to_regclass('public.cwi_memory_edges') is not null as cwi_memory_edges,
        to_regclass('public.cwi_memory_claims') is not null as cwi_memory_claims,
        to_regclass('public.cwi_agent_workflows') is not null as cwi_agent_workflows,
        to_regclass('public.cwi_agent_workflow_steps') is not null as cwi_agent_workflow_steps,
        to_regclass('public.cwi_verification_gates') is not null as cwi_verification_gates,
        to_regclass('public.cwi_quality_scores') is not null as cwi_quality_scores,
        to_regclass('public.cwi_trend_radar_items') is not null as cwi_trend_radar_items,
        to_regclass('public.aiishness_reports') is not null as aiishness_reports,
        to_regclass('public.news_intelligence_items') is not null as news_intelligence_items,
        to_regclass('public.supporter_notes') is not null as supporter_notes,
        to_regclass('public.big_brain_rules') is not null as big_brain_rules,
        to_regclass('public.memory_graph_nodes') is not null as memory_graph_nodes,
        to_regclass('public.memory_graph_edges') is not null as memory_graph_edges,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'agent_tasks' and column_name = 'agent_name'
        ) as agent_tasks_agent_name,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'agent_tasks' and column_name = 'input_json'
        ) as agent_tasks_input_json,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'agent_tasks' and column_name = 'output_json'
        ) as agent_tasks_output_json,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'agent_tasks' and column_name = 'content_destination'
        ) as agent_tasks_content_destination,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'research_packs' and column_name = 'content_destination'
        ) as research_packs_content_destination,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'article_drafts' and column_name = 'content_destination'
        ) as article_drafts_content_destination,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'seo_packs' and column_name = 'content_destination'
        ) as seo_packs_content_destination,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'social_packs' and column_name = 'content_destination'
        ) as social_packs_content_destination,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'approval_queue' and column_name = 'content_destination'
        ) as approval_queue_content_destination,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'approval_queue' and column_name = 'item_type'
        ) as approval_queue_item_type,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'approval_queue' and column_name = 'research_pack_id'
        ) as approval_queue_research_pack_id,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'approval_queue' and column_name = 'verification_report_id'
        ) as approval_queue_verification_report_id,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'approval_queue' and column_name = 'admin_notes'
        ) as approval_queue_admin_notes,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'live_newsroom_items' and column_name = 'what_changed'
        ) as live_newsroom_items_what_changed,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'live_newsroom_items' and column_name = 'what_we_dont_know'
        ) as live_newsroom_items_what_we_dont_know,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'live_newsroom_items' and column_name = 'before_you_share'
        ) as live_newsroom_items_before_you_share,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'live_newsroom_items' and column_name = 'editor_note'
        ) as live_newsroom_items_editor_note,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'live_newsroom_items' and column_name = 'aiishness_score'
        ) as live_newsroom_items_aiishness_score,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'live_newsroom_items' and column_name = 'source_trail_json'
        ) as live_newsroom_items_source_trail_json
    `);

    return Object.values(result.rows[0] ?? {}).every(Boolean);
  } catch {
    return false;
  }
}

export async function ensureAdminOsTables() {
  if (!globalThis.cwiAdminOsTablesReady) {
    globalThis.cwiAdminOsTablesReady = (async () => {
      if (await adminOsSchemaLooksReady()) {
        return;
      }

      await runSqlBatch(`
      create extension if not exists pgcrypto;

      create table if not exists agents (
        id text primary key,
        name text not null,
        role text not null,
        status text not null default 'online',
        last_run_at timestamptz,
        tasks_completed integer not null default 0,
        failed_tasks integer not null default 0,
        current_queue integer not null default 0,
        cost_estimate_inr numeric(10,2) not null default 0,
        active boolean not null default true,
        settings jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists agent_tasks (
        id uuid primary key default gen_random_uuid(),
        agent_id text references agents(id) on delete set null,
        title text not null,
        task_type text not null,
        content_destination text not null default 'live_newsroom',
        status text not null default 'queued',
        priority text not null default 'normal',
        input jsonb not null default '{}'::jsonb,
        output jsonb not null default '{}'::jsonb,
        cost_estimate_inr numeric(10,2) not null default 0,
        error text,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists sources (
        id uuid primary key default gen_random_uuid(),
        name text not null,
        source_type text not null,
        url text,
        rss_url text,
        sitemap_url text,
        platform text,
        trust_level text not null default 'medium',
        active boolean not null default true,
        notes text,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists keywords (
        id uuid primary key default gen_random_uuid(),
        keyword text not null,
        keyword_group text not null,
        priority integer not null default 3,
        active boolean not null default true,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        unique(keyword, keyword_group)
      );

      create table if not exists manual_links (
        id uuid primary key default gen_random_uuid(),
        url text not null,
        topic text,
        platform text,
        creator_source text,
        notes text,
        priority text not null default 'normal',
        content_type text not null default 'manual link',
        content_destination text not null default 'live_newsroom',
        extracted_title text,
        extracted_description text,
        extraction_status text not null default 'pending',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists research_packs (
        id uuid primary key default gen_random_uuid(),
        topic text not null,
        category text not null default 'Live Newsroom',
        content_destination text not null default 'live_newsroom',
        date_range text,
        source_list jsonb not null default '[]'::jsonb,
        source_count integer not null default 0,
        summary text,
        what_happened text,
        what_we_know text,
        what_remains_unclear text,
        timeline jsonb not null default '[]'::jsonb,
        key_facts jsonb not null default '[]'::jsonb,
        public_reaction text,
        source_confidence text not null default 'Needs review',
        risks jsonb not null default '[]'::jsonb,
        suggested_article_angle text,
        suggested_social_angle text,
        status text not null default 'Research Ready',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists verification_reports (
        id uuid primary key default gen_random_uuid(),
        research_pack_id uuid references research_packs(id) on delete cascade,
        content_destination text not null default 'live_newsroom',
        verification_status text not null default 'Developing',
        risk_level text not null default 'Medium',
        unsafe_claims jsonb not null default '[]'::jsonb,
        safer_wording jsonb not null default '[]'::jsonb,
        source_gaps jsonb not null default '[]'::jsonb,
        publish_recommendation text not null default 'Human review required',
        human_review_required boolean not null default true,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists article_drafts (
        id uuid primary key default gen_random_uuid(),
        research_pack_id uuid references research_packs(id) on delete set null,
        content_destination text not null default 'live_newsroom',
        title text not null,
        slug text,
        category text not null default 'Live Newsroom',
        draft jsonb not null default '{}'::jsonb,
        verification_status text not null default 'Developing',
        source_count integer not null default 0,
        approval_status text not null default 'Draft Ready',
        publish_status text not null default 'Not published',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists published_articles (
        id uuid primary key default gen_random_uuid(),
        article_draft_id uuid references article_drafts(id) on delete set null,
        title text not null,
        slug text not null,
        url text not null,
        category text,
        published_at timestamptz not null default now(),
        metadata jsonb not null default '{}'::jsonb
      );

      create table if not exists live_newsroom_items (
        id uuid primary key default gen_random_uuid(),
        approval_queue_id uuid,
        article_draft_id uuid references article_drafts(id) on delete set null,
        title text not null,
        slug text not null,
        category text not null default 'Live Newsroom',
        type text not null default 'live_newsroom_update',
        summary text,
        body jsonb not null default '{}'::jsonb,
        verification_status text not null default 'Developing',
        risk_level text not null default 'Medium',
        source_count integer not null default 0,
        sources_json jsonb not null default '[]'::jsonb,
        what_happened text,
        what_changed text,
        what_we_know text,
        what_we_dont_know text,
        what_remains_unclear text,
        timeline_json jsonb not null default '[]'::jsonb,
        before_you_share text,
        editor_note text,
        aiishness_score integer not null default 0,
        claim_tracker_json jsonb not null default '[]'::jsonb,
        source_trail_json jsonb not null default '[]'::jsonb,
        correction_history_json jsonb not null default '[]'::jsonb,
        region_tags_json jsonb not null default '[]'::jsonb,
        topic_tags_json jsonb not null default '[]'::jsonb,
        cwi_context text,
        tags_json jsonb not null default '[]'::jsonb,
        hero_image text,
        thumbnail_image text,
        og_image text,
        alt_text text,
        published_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        author text not null default 'Cockroach Watch India Editorial Desk',
        related_items_json jsonb not null default '[]'::jsonb,
        seo_title text,
        seo_description text,
        canonical_url text,
        status text not null default 'published',
        metadata jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now()
      );

      create table if not exists archive_items (
        id uuid primary key default gen_random_uuid(),
        original_route text,
        title text not null,
        slug text not null unique,
        summary text,
        body jsonb not null default '{}'::jsonb,
        archived_at timestamptz not null default now(),
        original_published_at timestamptz,
        updated_at timestamptz not null default now(),
        canonical_url text,
        status text not null default 'archived',
        redirect_to text,
        seo_title text,
        seo_description text
      );

      create index if not exists published_articles_slug_published_idx
      on published_articles (slug, published_at desc);

      create index if not exists published_articles_published_at_idx
      on published_articles (published_at desc);

      create index if not exists live_newsroom_items_slug_status_idx
      on live_newsroom_items (slug, status, published_at desc);

      create index if not exists live_newsroom_items_published_idx
      on live_newsroom_items (status, published_at desc);

      create index if not exists archive_items_slug_status_idx
      on archive_items (slug, status, archived_at desc);

      create table if not exists seo_packs (
        id uuid primary key default gen_random_uuid(),
        article_draft_id uuid references article_drafts(id) on delete cascade,
        content_destination text not null default 'live_newsroom',
        seo_title text not null,
        meta_description text not null,
        slug text,
        canonical_url text,
        open_graph_title text,
        open_graph_description text,
        open_graph_image text,
        twitter_card jsonb not null default '{}'::jsonb,
        schema_json jsonb not null default '{}'::jsonb,
        breadcrumb_schema jsonb not null default '{}'::jsonb,
        internal_links jsonb not null default '[]'::jsonb,
        image_alt_text jsonb not null default '[]'::jsonb,
        sitemap_status text not null default 'Pending approval',
        search_console_checklist jsonb not null default '[]'::jsonb,
        approval_status text not null default 'SEO Ready',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists social_packs (
        id uuid primary key default gen_random_uuid(),
        article_draft_id uuid references article_drafts(id) on delete cascade,
        content_destination text not null default 'live_newsroom',
        instagram_caption text,
        facebook_caption text,
        x_caption text,
        reddit_title text,
        reddit_body text,
        youtube_shorts_title text,
        youtube_shorts_description text,
        pinned_comment text,
        bluesky_caption text,
        discord_announcement text,
        hashtag_set jsonb not null default '[]'::jsonb,
        credit_line text,
        website_line text,
        risk_note text,
        approval_status text not null default 'Social Ready',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists image_library (
        id uuid primary key default gen_random_uuid(),
        topic text,
        section text,
        content_destination text not null default 'live_newsroom',
        image_type text,
        path text,
        alt_text text,
        credit text,
        source_url text,
        quality_status text not null default 'Needs review',
        approval_status text not null default 'Image Ready',
        metadata jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists uiux_audits (
        id uuid primary key default gen_random_uuid(),
        page text not null,
        issue text not null,
        severity text not null default 'Medium',
        current_text text,
        suggested_text text,
        layout_issue text,
        mobile_issue text,
        screenshot_reference text,
        fix_status text not null default 'UI Review Ready',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists reports (
        id uuid primary key default gen_random_uuid(),
        source_report_id text,
        name_handle text,
        contact text,
        city text,
        state text,
        report_type text,
        link text,
        message text,
        evidence jsonb not null default '[]'::jsonb,
        status text not null default 'New',
        assigned_agent text references agents(id) on delete set null,
        priority text not null default 'normal',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists comments (
        id uuid primary key default gen_random_uuid(),
        source_table text not null,
        source_id text not null,
        article text,
        name text,
        comment text not null,
        risk_flag text,
        status text not null default 'pending',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists daily_briefings (
        id uuid primary key default gen_random_uuid(),
        briefing_date date not null default current_date,
        top_topics jsonb not null default '[]'::jsonb,
        urgent_updates jsonb not null default '[]'::jsonb,
        articles_to_prepare jsonb not null default '[]'::jsonb,
        social_posts_to_prepare jsonb not null default '[]'::jsonb,
        images_needed jsonb not null default '[]'::jsonb,
        seo_tasks jsonb not null default '[]'::jsonb,
        uiux_issues jsonb not null default '[]'::jsonb,
        risks_to_avoid jsonb not null default '[]'::jsonb,
        approval_items jsonb not null default '[]'::jsonb,
        status text not null default 'Waiting for approval',
        created_at timestamptz not null default now()
      );

      create table if not exists system_health_logs (
        id uuid primary key default gen_random_uuid(),
        website_status text not null default 'unchecked',
        database_status text not null default 'unchecked',
        sitemap_status text not null default 'unchecked',
        robots_status text not null default 'unchecked',
        old_url_check text not null default 'unchecked',
        broken_links integer not null default 0,
        missing_metadata integer not null default 0,
        missing_alt_text integer not null default 0,
        failed_tasks integer not null default 0,
        monthly_budget_usage_inr numeric(10,2) not null default 0,
        daily_ai_usage_inr numeric(10,2) not null default 0,
        pending_approvals integer not null default 0,
        created_at timestamptz not null default now()
      );

      create table if not exists cost_usage_logs (
        id uuid primary key default gen_random_uuid(),
        agent_id text references agents(id) on delete set null,
        task_id uuid,
        provider text not null default 'template',
        usage_type text not null,
        estimated_cost_inr numeric(10,2) not null default 0,
        created_at timestamptz not null default now()
      );

      create table if not exists settings (
        key text primary key,
        value jsonb not null default '{}'::jsonb,
        updated_at timestamptz not null default now()
      );

      create table if not exists cwi_memory_nodes (
        id uuid primary key default gen_random_uuid(),
        node_type text not null,
        label text not null,
        slug text not null,
        summary text,
        confidence_score integer not null default 50,
        source_count integer not null default 0,
        first_seen_at timestamptz not null default now(),
        last_seen_at timestamptz not null default now(),
        mention_count integer not null default 1,
        source_url text,
        metadata jsonb not null default '{}'::jsonb,
        unique (node_type, slug)
      );

      create table if not exists cwi_memory_edges (
        id uuid primary key default gen_random_uuid(),
        from_node_id uuid not null references cwi_memory_nodes(id) on delete cascade,
        to_node_id uuid not null references cwi_memory_nodes(id) on delete cascade,
        relation_type text not null,
        confidence_score integer not null default 50,
        evidence jsonb not null default '[]'::jsonb,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        unique (from_node_id, to_node_id, relation_type)
      );

      create table if not exists cwi_memory_claims (
        id uuid primary key default gen_random_uuid(),
        topic text not null,
        claim_text text not null,
        claim_hash text not null unique,
        status text not null default 'needs_verification',
        confidence_score integer not null default 50,
        risk_level text not null default 'Medium',
        source_count integer not null default 0,
        source_urls jsonb not null default '[]'::jsonb,
        article_slug text,
        metadata jsonb not null default '{}'::jsonb,
        first_seen_at timestamptz not null default now(),
        last_seen_at timestamptz not null default now()
      );

      create table if not exists cwi_agent_workflows (
        id uuid primary key default gen_random_uuid(),
        workflow_type text not null,
        topic text not null,
        status text not null default 'queued',
        current_step text not null default 'queued',
        progress_percent integer not null default 0,
        approval_queue_id uuid,
        article_draft_id uuid references article_drafts(id) on delete set null,
        public_url text,
        input jsonb not null default '{}'::jsonb,
        output jsonb not null default '{}'::jsonb,
        error_message text,
        started_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        completed_at timestamptz
      );

      create table if not exists cwi_agent_workflow_steps (
        id uuid primary key default gen_random_uuid(),
        workflow_id uuid not null references cwi_agent_workflows(id) on delete cascade,
        step_key text not null,
        label text not null,
        status text not null default 'queued',
        progress_percent integer not null default 0,
        input jsonb not null default '{}'::jsonb,
        output jsonb not null default '{}'::jsonb,
        error_message text,
        started_at timestamptz,
        completed_at timestamptz,
        updated_at timestamptz not null default now(),
        unique (workflow_id, step_key)
      );

      create table if not exists cwi_verification_gates (
        id uuid primary key default gen_random_uuid(),
        research_pack_id uuid references research_packs(id) on delete cascade,
        verification_report_id uuid references verification_reports(id) on delete set null,
        topic text not null,
        status text not null default 'needs_review',
        can_draft boolean not null default false,
        confidence_score integer not null default 0,
        source_count integer not null default 0,
        official_source_available boolean not null default false,
        risky_claims jsonb not null default '[]'::jsonb,
        missing_dates jsonb not null default '[]'::jsonb,
        contradictions jsonb not null default '[]'::jsonb,
        legal_risk text not null default 'Medium',
        checks jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now()
      );

      create table if not exists cwi_quality_scores (
        id uuid primary key default gen_random_uuid(),
        article_draft_id uuid references article_drafts(id) on delete cascade,
        approval_queue_id uuid,
        topic text not null,
        factual_accuracy_score integer not null default 0,
        source_strength_score integer not null default 0,
        legal_risk_score integer not null default 0,
        seo_score integer not null default 0,
        readability_score integer not null default 0,
        cwi_voice_score integer not null default 0,
        publish_readiness_score integer not null default 0,
        status text not null default 'needs_review',
        issues jsonb not null default '[]'::jsonb,
        improvements jsonb not null default '[]'::jsonb,
        created_at timestamptz not null default now()
      );

      create table if not exists cwi_trend_radar_items (
        id uuid primary key default gen_random_uuid(),
        topic text not null,
        trend_type text not null default 'live_newsroom',
        priority_score integer not null default 50,
        evidence_count integer not null default 0,
        suggested_action text not null default 'Review manually',
        why_it_matters text,
        source_urls jsonb not null default '[]'::jsonb,
        status text not null default 'new',
        metadata jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        unique (topic, trend_type)
      );

      create table if not exists aiishness_reports (
        id uuid primary key default gen_random_uuid(),
        content_type text not null,
        content_id text,
        page_url text,
        score integer not null default 0,
        flagged_lines_json jsonb not null default '[]'::jsonb,
        issues_json jsonb not null default '[]'::jsonb,
        rewrite_suggestions_json jsonb not null default '[]'::jsonb,
        status text not null default 'human_review_required',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists news_intelligence_items (
        id uuid primary key default gen_random_uuid(),
        item_type text not null,
        title text not null,
        summary text,
        status text not null default 'Developing',
        category text,
        source_count integer not null default 0,
        sources_json jsonb not null default '[]'::jsonb,
        what_changed text,
        what_we_know text,
        what_we_dont_know text,
        timeline_json jsonb not null default '[]'::jsonb,
        before_you_share text,
        editor_note text,
        related_live_newsroom_item_id uuid,
        approval_status text not null default 'waiting_for_approval',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists supporter_notes (
        id uuid primary key default gen_random_uuid(),
        display_name text,
        handle text,
        amount numeric(10,2),
        amount_display_mode text not null default 'hidden',
        amount_range text,
        comment text not null,
        supporter_badge text not null default 'Supporter',
        consent_to_display boolean not null default false,
        payment_verified boolean not null default false,
        status text not null default 'pending',
        admin_notes text,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        approved_at timestamptz
      );

      create table if not exists big_brain_rules (
        id uuid primary key default gen_random_uuid(),
        rule_key text not null unique,
        category text not null,
        title text not null,
        body text not null,
        priority integer not null default 10,
        active boolean not null default true,
        metadata jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists memory_graph_nodes (
        id uuid primary key default gen_random_uuid(),
        node_type text not null,
        label text not null,
        slug text not null,
        summary text,
        confidence_score integer not null default 50,
        source_count integer not null default 0,
        status text not null default 'active',
        source_url text,
        metadata jsonb not null default '{}'::jsonb,
        first_seen_at timestamptz not null default now(),
        last_seen_at timestamptz not null default now(),
        unique (node_type, slug)
      );

      create table if not exists memory_graph_edges (
        id uuid primary key default gen_random_uuid(),
        from_node_id uuid not null references memory_graph_nodes(id) on delete cascade,
        to_node_id uuid not null references memory_graph_nodes(id) on delete cascade,
        relation_type text not null,
        weight integer not null default 50,
        evidence jsonb not null default '[]'::jsonb,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        unique (from_node_id, to_node_id, relation_type)
      );

      create table if not exists approval_queue (
        id uuid primary key default gen_random_uuid(),
        topic text not null,
        type text not null,
        content_destination text not null default 'live_newsroom',
        summary text,
        verification_status text not null default 'Developing',
        risk_level text not null default 'Medium',
        source_count integer not null default 0,
        article_draft_id uuid references article_drafts(id) on delete set null,
        seo_pack_id uuid references seo_packs(id) on delete set null,
        social_pack_id uuid references social_packs(id) on delete set null,
        image_pack_id uuid references image_library(id) on delete set null,
        uiux_audit_id uuid references uiux_audits(id) on delete set null,
        status text not null default 'Waiting for Approval',
        suggested_action text not null default 'Review before publishing',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        approved_at timestamptz,
        approved_by text,
        notes text
      );

      create index if not exists approval_queue_status_created_idx
      on approval_queue (status, created_at desc);

      create index if not exists agent_tasks_status_created_idx
      on agent_tasks (status, created_at desc);

      create index if not exists cwi_memory_nodes_type_seen_idx
      on cwi_memory_nodes (node_type, last_seen_at desc);

      create index if not exists cwi_memory_claims_topic_seen_idx
      on cwi_memory_claims (topic, last_seen_at desc);

      create index if not exists cwi_agent_workflows_status_updated_idx
      on cwi_agent_workflows (status, updated_at desc);

      create index if not exists cwi_trend_radar_priority_idx
      on cwi_trend_radar_items (priority_score desc, updated_at desc);

      create index if not exists aiishness_reports_score_idx
      on aiishness_reports (score desc, created_at desc);

      create index if not exists news_intelligence_items_status_idx
      on news_intelligence_items (approval_status, status, updated_at desc);

      create index if not exists supporter_notes_public_idx
      on supporter_notes (status, consent_to_display, payment_verified, approved_at desc, created_at desc);

      create index if not exists news_intelligence_items_type_idx
      on news_intelligence_items (item_type, updated_at desc);

      create index if not exists big_brain_rules_category_priority_idx
      on big_brain_rules (category, priority);

      create index if not exists memory_graph_nodes_type_seen_idx
      on memory_graph_nodes (node_type, last_seen_at desc);

      create index if not exists memory_graph_edges_relation_idx
      on memory_graph_edges (relation_type, updated_at desc);

      alter table agent_tasks add column if not exists agent_name text;
      alter table agent_tasks add column if not exists content_destination text not null default 'live_newsroom';
      alter table agent_tasks add column if not exists input_json jsonb not null default '{}'::jsonb;
      alter table agent_tasks add column if not exists output_json jsonb not null default '{}'::jsonb;
      alter table agent_tasks add column if not exists error_message text;
      alter table agent_tasks add column if not exists cost_estimate numeric(10,2) not null default 0;
      alter table agent_tasks add column if not exists completed_at timestamptz;

      alter table manual_links add column if not exists content_destination text not null default 'live_newsroom';
      alter table research_packs add column if not exists content_destination text not null default 'live_newsroom';
      alter table verification_reports add column if not exists content_destination text not null default 'live_newsroom';
      alter table article_drafts add column if not exists content_destination text not null default 'live_newsroom';
      alter table seo_packs add column if not exists content_destination text not null default 'live_newsroom';
      alter table social_packs add column if not exists content_destination text not null default 'live_newsroom';
      alter table image_library add column if not exists content_destination text not null default 'live_newsroom';
      alter table live_newsroom_items add column if not exists what_changed text;
      alter table live_newsroom_items add column if not exists what_we_dont_know text;
      alter table live_newsroom_items add column if not exists before_you_share text;
      alter table live_newsroom_items add column if not exists editor_note text;
      alter table live_newsroom_items add column if not exists aiishness_score integer not null default 0;
      alter table live_newsroom_items add column if not exists claim_tracker_json jsonb not null default '[]'::jsonb;
      alter table live_newsroom_items add column if not exists source_trail_json jsonb not null default '[]'::jsonb;
      alter table live_newsroom_items add column if not exists correction_history_json jsonb not null default '[]'::jsonb;
      alter table live_newsroom_items add column if not exists region_tags_json jsonb not null default '[]'::jsonb;
      alter table live_newsroom_items add column if not exists topic_tags_json jsonb not null default '[]'::jsonb;

      alter table approval_queue add column if not exists item_type text;
      alter table approval_queue add column if not exists content_destination text not null default 'live_newsroom';
      alter table approval_queue add column if not exists research_pack_id uuid references research_packs(id) on delete set null;
      alter table approval_queue add column if not exists verification_report_id uuid references verification_reports(id) on delete set null;
      alter table approval_queue add column if not exists admin_notes text;
      alter table approval_queue add column if not exists approved_at timestamptz;
      alter table approval_queue add column if not exists approved_by text;
      alter table approval_queue add column if not exists notes text;

      update agent_tasks
      set agent_name = coalesce(agent_name, agent_id),
          input_json = case when input_json = '{}'::jsonb then coalesce(input, '{}'::jsonb) else input_json end,
          output_json = case when output_json = '{}'::jsonb then coalesce(output, '{}'::jsonb) else output_json end,
          error_message = coalesce(error_message, error),
          cost_estimate = case when cost_estimate = 0 then coalesce(cost_estimate_inr, 0) else cost_estimate end
      where agent_name is null
         or input_json = '{}'::jsonb
         or output_json = '{}'::jsonb
         or error_message is null
         or cost_estimate = 0;

      update approval_queue
      set item_type = coalesce(item_type, type),
          admin_notes = coalesce(admin_notes, notes)
      where item_type is null or admin_notes is null;
    `);
    })().catch((error) => {
      globalThis.cwiAdminOsTablesReady = undefined;
      throw error;
    });
  }

  return globalThis.cwiAdminOsTablesReady;
}
