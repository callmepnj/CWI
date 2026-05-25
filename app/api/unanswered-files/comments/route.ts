import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getFileVisual, getUnansweredFile } from "@/data/unanswered-files";
import { ensureUnansweredFilesTables, getPool } from "@/lib/db";
import { optionalUuid } from "@/lib/db/ids";

export const runtime = "nodejs";

const blockedTerms = ["kill", "doxx", "lynch", "rape", "terrorist", "traitor"];

type ApprovedComment = {
  id: string;
  parent_id: string | null;
  name: string;
  comment_text: string;
  likes_count: number;
  created_at: string;
};

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
    await ensureUnansweredFilesTables();
    await upsertArticleForComments(file);
    const result = await getPool().query<ApprovedComment>(
      `
        select id, parent_id, name, comment_text, likes_count, created_at
        from cwi_unanswered_comments
        where article_id = $1 and status = 'approved'
        order by created_at desc
        limit 80;
      `,
      [slug]
    );

    return NextResponse.json({ ok: true, comments: result.rows });
  } catch (error) {
    console.error("CWI unanswered comments fetch failed", error);
    return NextResponse.json({ ok: false, error: "Comments could not be loaded right now." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const slug = cleanString(body?.articleSlug);
  const name = cleanString(body?.name);
  const email = cleanString(body?.email);
  const comment = cleanString(body?.comment);
  const parentId = cleanString(body?.parentId);
  const honeypot = cleanString(body?.website);

  if (honeypot) {
    return NextResponse.json({ ok: true, message: "Comment received for moderation." });
  }

  const file = getUnansweredFile(slug);
  if (!slug || !file) {
    return NextResponse.json({ ok: false, error: "Article slug is required." }, { status: 400 });
  }

  if (!name || name.length < 2) {
    return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
  }

  if (!comment || comment.length < 10) {
    return NextResponse.json({ ok: false, error: "Comment must be at least 10 characters." }, { status: 400 });
  }

  if (comment.length > 1200) {
    return NextResponse.json({ ok: false, error: "Comment must be under 1200 characters." }, { status: 400 });
  }

  if ((comment.match(/https?:\/\//gi) ?? []).length > 1) {
    return NextResponse.json({ ok: false, error: "Please include no more than one link." }, { status: 400 });
  }

  const lowered = comment.toLowerCase();
  if (blockedTerms.some((term) => lowered.includes(term))) {
    return NextResponse.json({ ok: false, error: "Comments cannot include threats, hate, doxxing, or harassment." }, { status: 400 });
  }

  try {
    await ensureUnansweredFilesTables();
    await upsertArticleForComments(file);

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex");

    await getPool().query(
      `
        insert into cwi_unanswered_comments (
          article_id, parent_id, name, email, comment_text, status, ip_hash, user_agent
        )
        values ($1, $2, $3, $4, $5, 'pending', $6, $7);
      `,
      [slug, optionalUuid(parentId), name, email || null, comment, ipHash, request.headers.get("user-agent")]
    );

    return NextResponse.json({ ok: true, message: "Comment received. It will appear after moderation." });
  } catch (error) {
    console.error("CWI unanswered comment submission failed", error);
    return NextResponse.json({ ok: false, error: "Comment could not be saved right now." }, { status: 500 });
  }
}

function cleanString(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\s+/g, " ");
}

async function upsertArticleForComments(file: NonNullable<ReturnType<typeof getUnansweredFile>>) {
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
        current_status = excluded.current_status,
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
