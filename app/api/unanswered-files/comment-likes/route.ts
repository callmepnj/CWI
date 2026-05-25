import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { ensureUnansweredFilesTables, getPool } from "@/lib/db";
import { optionalUuid } from "@/lib/db/ids";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const commentId = optionalUuid(body?.commentId);

  if (!commentId) {
    return NextResponse.json({ ok: false, error: "Comment ID is required." }, { status: 400 });
  }

  try {
    await ensureUnansweredFilesTables();
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex");

    const deleted = await getPool().query(
      `delete from cwi_unanswered_comment_likes where comment_id = $1 and ip_hash = $2 returning id;`,
      [commentId, ipHash]
    );

    if (deleted.rowCount === 0) {
      await getPool().query(
        `insert into cwi_unanswered_comment_likes (comment_id, ip_hash) values ($1, $2) on conflict do nothing;`,
        [commentId, ipHash]
      );
    }

    await getPool().query(
      `
        update cwi_unanswered_comments
        set likes_count = (
          select count(*)::integer from cwi_unanswered_comment_likes where comment_id = $1
        )
        where id = $1;
      `,
      [commentId]
    );

    const result = await getPool().query<{ likes_count: number }>(
      `select likes_count from cwi_unanswered_comments where id = $1;`,
      [commentId]
    );

    return NextResponse.json({ ok: true, likesCount: result.rows[0]?.likes_count ?? 0, liked: deleted.rowCount === 0 });
  } catch (error) {
    console.error("CWI unanswered comment like failed", error);
    return NextResponse.json({ ok: false, error: "Comment like could not be saved right now." }, { status: 500 });
  }
}
