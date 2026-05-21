import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { ensureCommentsTable, getPool } from "@/lib/db";

export const runtime = "nodejs";

const blockedTerms = [
  "kill",
  "doxx",
  "lynch",
  "rape",
  "terrorist",
  "traitor"
];

type ApprovedComment = {
  id: string;
  name: string;
  comment: string;
  created_at: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();

  if (!slug) {
    return NextResponse.json({ ok: false, error: "Article slug is required." }, { status: 400 });
  }

  try {
    await ensureCommentsTable();

    const result = await getPool().query<ApprovedComment>(
      `
        select id, name, comment, created_at
        from cwi_article_comments
        where article_slug = $1 and status = 'approved'
        order by created_at desc
        limit 50;
      `,
      [slug]
    );

    return NextResponse.json({ ok: true, comments: result.rows });
  } catch (error) {
    console.error("CWI comment fetch failed", error);
    return NextResponse.json({ ok: false, error: "Comments could not be loaded right now." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const articleSlug = cleanString(body.articleSlug);
  const name = cleanString(body.name);
  const email = cleanString(body.email);
  const comment = cleanString(body.comment);
  const honeypot = cleanString(body.website);

  if (honeypot) {
    return NextResponse.json({ ok: true, message: "Comment received for moderation." });
  }

  if (!articleSlug) {
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
    await ensureCommentsTable();

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex");

    await getPool().query(
      `
        insert into cwi_article_comments (
          article_slug,
          name,
          email,
          comment,
          status,
          ip_hash,
          user_agent
        )
        values ($1, $2, $3, $4, 'pending', $5, $6);
      `,
      [articleSlug, name, email, comment, ipHash, request.headers.get("user-agent")]
    );

    return NextResponse.json({
      ok: true,
      message: "Comment received. It will appear after moderation."
    });
  } catch (error) {
    console.error("CWI comment submission failed", error);
    return NextResponse.json({ ok: false, error: "Comment could not be saved right now." }, { status: 500 });
  }
}

function cleanString(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\s+/g, " ");
}
