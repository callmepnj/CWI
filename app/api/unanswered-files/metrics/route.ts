import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getFileVisual, getUnansweredFile } from "@/data/unanswered-files";
import { ensureUnansweredFilesTables, getPool } from "@/lib/db";

export const runtime = "nodejs";

type Action = "view" | "like" | "bookmark" | "share";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug")?.trim();

  if (!slug) {
    return NextResponse.json({ ok: false, error: "Article slug is required." }, { status: 400 });
  }

  const file = getUnansweredFile(slug);
  if (!file) {
    return NextResponse.json({ ok: false, error: "Article not found." }, { status: 404 });
  }

  try {
    await upsertArticle(file);
    const ipHash = hashIdentity(request);
    const metrics = await getMetrics(slug, ipHash);
    return NextResponse.json({ ok: true, ...metrics });
  } catch (error) {
    console.error("CWI unanswered metrics fetch failed", error);
    return NextResponse.json({ ok: false, error: "Metrics could not be loaded right now." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const slug = cleanString(body?.slug);
  const action = cleanString(body?.action) as Action;
  const platform = cleanString(body?.platform) || "copy";

  if (!slug) {
    return NextResponse.json({ ok: false, error: "Article slug is required." }, { status: 400 });
  }

  if (!["view", "like", "bookmark", "share"].includes(action)) {
    return NextResponse.json({ ok: false, error: "Invalid action." }, { status: 400 });
  }

  const file = getUnansweredFile(slug);
  if (!file) {
    return NextResponse.json({ ok: false, error: "Article not found." }, { status: 404 });
  }

  try {
    await upsertArticle(file);
    const pool = getPool();
    const ipHash = hashIdentity(request);
    const userAgentHash = hashString(request.headers.get("user-agent") ?? "unknown");

    if (action === "view") {
      await pool.query(
        `insert into cwi_unanswered_article_views (article_id, ip_hash, user_agent_hash) values ($1, $2, $3);`,
        [slug, ipHash, userAgentHash]
      );
    }

    if (action === "share") {
      await pool.query(
        `insert into cwi_unanswered_article_shares (article_id, platform, ip_hash) values ($1, $2, $3);`,
        [slug, platform.slice(0, 40), ipHash]
      );
    }

    if (action === "like") {
      const deleted = await pool.query(
        `delete from cwi_unanswered_article_likes where article_id = $1 and ip_hash = $2 returning id;`,
        [slug, ipHash]
      );
      if (deleted.rowCount === 0) {
        await pool.query(
          `insert into cwi_unanswered_article_likes (article_id, ip_hash) values ($1, $2) on conflict do nothing;`,
          [slug, ipHash]
        );
      }
    }

    if (action === "bookmark") {
      const deleted = await pool.query(
        `delete from cwi_unanswered_article_bookmarks where article_id = $1 and ip_hash = $2 returning id;`,
        [slug, ipHash]
      );
      if (deleted.rowCount === 0) {
        await pool.query(
          `insert into cwi_unanswered_article_bookmarks (article_id, ip_hash) values ($1, $2) on conflict do nothing;`,
          [slug, ipHash]
        );
      }
    }

    const metrics = await getMetrics(slug, ipHash);
    return NextResponse.json({ ok: true, ...metrics });
  } catch (error) {
    console.error("CWI unanswered metrics action failed", error);
    return NextResponse.json({ ok: false, error: "Action could not be saved right now." }, { status: 500 });
  }
}

async function upsertArticle(file: NonNullable<ReturnType<typeof getUnansweredFile>>) {
  await ensureUnansweredFilesTables();
  const visual = getFileVisual(file);

  await getPool().query(
    `
      insert into cwi_unanswered_articles (
        id, slug, title, summary, category, location, start_date, current_status,
        hero_image, reading_time, source_count, seo_title, seo_description, seo_keywords, updated_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, now())
      on conflict (id) do update set
        title = excluded.title,
        summary = excluded.summary,
        category = excluded.category,
        location = excluded.location,
        start_date = excluded.start_date,
        current_status = excluded.current_status,
        hero_image = excluded.hero_image,
        reading_time = excluded.reading_time,
        source_count = excluded.source_count,
        seo_title = excluded.seo_title,
        seo_description = excluded.seo_description,
        seo_keywords = excluded.seo_keywords,
        updated_at = now();
    `,
    [
      file.slug,
      file.slug,
      file.title,
      file.summary,
      file.category,
      file.location,
      file.year,
      file.status,
      visual.src,
      `${Math.max(6, file.timeline.length + file.sections.length)} min read`,
      file.sourceCount,
      file.seoTitle,
      file.seoDescription,
      file.keywords
    ]
  );
}

async function getMetrics(slug: string, ipHash: string) {
  const pool = getPool();
  const result = await pool.query<{
    views: string;
    likes: string;
    shares: string;
    bookmarks: string;
    liked: boolean;
    bookmarked: boolean;
  }>(
    `
      select
        (select count(*) from cwi_unanswered_article_views where article_id = $1) as views,
        (select count(*) from cwi_unanswered_article_likes where article_id = $1) as likes,
        (select count(*) from cwi_unanswered_article_shares where article_id = $1) as shares,
        (select count(*) from cwi_unanswered_article_bookmarks where article_id = $1) as bookmarks,
        exists(select 1 from cwi_unanswered_article_likes where article_id = $1 and ip_hash = $2) as liked,
        exists(select 1 from cwi_unanswered_article_bookmarks where article_id = $1 and ip_hash = $2) as bookmarked;
    `,
    [slug, ipHash]
  );
  const row = result.rows[0];

  return {
    counts: {
      views: Number(row?.views ?? 0),
      likes: Number(row?.likes ?? 0),
      shares: Number(row?.shares ?? 0),
      bookmarks: Number(row?.bookmarks ?? 0)
    },
    liked: Boolean(row?.liked),
    bookmarked: Boolean(row?.bookmarked)
  };
}

function hashIdentity(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  return hashString(ip);
}

function hashString(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function cleanString(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}
