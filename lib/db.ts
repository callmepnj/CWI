import { Pool } from "pg";

declare global {
  var cwiPgPool: Pool | undefined;
  var cwiReportsTableReady: Promise<void> | undefined;
  var cwiCommentsTableReady: Promise<void> | undefined;
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
  }

  return globalThis.cwiPgPool;
}

export async function ensureReportsTable() {
  if (!globalThis.cwiReportsTableReady) {
    globalThis.cwiReportsTableReady = getPool().query(`
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
    `).then(() => undefined);
  }

  return globalThis.cwiReportsTableReady;
}

export async function ensureCommentsTable() {
  if (!globalThis.cwiCommentsTableReady) {
    globalThis.cwiCommentsTableReady = getPool().query(`
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
    `).then(() => undefined);
  }

  return globalThis.cwiCommentsTableReady;
}
