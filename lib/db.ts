import { Pool } from "pg";

declare global {
  var cwiPgPool: Pool | undefined;
  var cwiReportsTableReady: Promise<void> | undefined;
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
    `).then(() => undefined);
  }

  return globalThis.cwiReportsTableReady;
}
