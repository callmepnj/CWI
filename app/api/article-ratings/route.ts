import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { posts } from "@/data/posts";
import { getUnansweredFile } from "@/data/unanswered-files";
import { getPublishedWatchPostBySlug } from "@/lib/db/articles";
import { ensureArticleRatingsTable, getPool } from "@/lib/db";

export const runtime = "nodejs";

type ArticleType = "watch-desk" | "unanswered-files";

type RatingRow = {
  average_rating: string | null;
  rating_count: string;
  user_rating: number | null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const articleType = cleanString(searchParams.get("type")) as ArticleType;
  const slug = cleanString(searchParams.get("slug"));

  if (!(await isValidArticle(articleType, slug))) {
    return NextResponse.json({ ok: false, error: "Article not found." }, { status: 404 });
  }

  try {
    await ensureArticleRatingsTable();
    const data = await getRatingSummary(articleType, slug, hashIdentity(request));
    return NextResponse.json({ ok: true, ...data });
  } catch (error) {
    console.error("CWI rating fetch failed", error);
    return NextResponse.json({ ok: false, error: "Ratings could not be loaded right now." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const articleType = cleanString(body?.type) as ArticleType;
  const slug = cleanString(body?.slug);
  const rating = Number(body?.rating);

  if (!(await isValidArticle(articleType, slug))) {
    return NextResponse.json({ ok: false, error: "Article not found." }, { status: 404 });
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ ok: false, error: "Rating must be between 1 and 5." }, { status: 400 });
  }

  try {
    await ensureArticleRatingsTable();
    const ipHash = hashIdentity(request);
    const userAgentHash = hashString(request.headers.get("user-agent") ?? "unknown");

    await getPool().query(
      `
        insert into cwi_article_ratings (article_type, article_slug, rating, ip_hash, user_agent_hash)
        values ($1, $2, $3, $4, $5)
        on conflict (article_type, article_slug, ip_hash)
        do update set rating = excluded.rating, user_agent_hash = excluded.user_agent_hash, updated_at = now();
      `,
      [articleType, slug, rating, ipHash, userAgentHash]
    );

    const data = await getRatingSummary(articleType, slug, ipHash);
    return NextResponse.json({ ok: true, ...data, message: "Rating saved. Thank you for adding real reader feedback." });
  } catch (error) {
    console.error("CWI rating save failed", error);
    return NextResponse.json({ ok: false, error: "Rating could not be saved right now." }, { status: 500 });
  }
}

async function getRatingSummary(articleType: ArticleType, slug: string, ipHash: string) {
  const result = await getPool().query<RatingRow>(
    `
      select
        avg(rating)::numeric(10,2)::text as average_rating,
        count(*)::text as rating_count,
        (
          select rating
          from cwi_article_ratings
          where article_type = $1 and article_slug = $2 and ip_hash = $3
          limit 1
        ) as user_rating
      from cwi_article_ratings
      where article_type = $1 and article_slug = $2;
    `,
    [articleType, slug, ipHash]
  );
  const row = result.rows[0];

  return {
    averageRating: row?.average_rating ? Number(row.average_rating) : null,
    ratingCount: Number(row?.rating_count ?? 0),
    userRating: row?.user_rating ? Number(row.user_rating) : null
  };
}

async function isValidArticle(articleType: ArticleType, slug: string) {
  if (!slug) {
    return false;
  }

  if (articleType === "watch-desk") {
    if (posts.some((post) => post.slug === slug)) {
      return true;
    }

    return Boolean(
      await getPublishedWatchPostBySlug(slug).catch(() => null)
    );
  }

  if (articleType === "unanswered-files") {
    return Boolean(getUnansweredFile(slug));
  }

  return false;
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
