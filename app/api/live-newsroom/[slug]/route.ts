import { NextResponse } from "next/server";
import { getLiveNewsroomFallbackItem, getPublishedLiveNewsroomItem } from "@/lib/db/live-newsroom";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const item = (await getPublishedLiveNewsroomItem(slug).catch(() => null)) ?? getLiveNewsroomFallbackItem(slug);

  if (!item) {
    return NextResponse.json({ ok: false, error: "Live Newsroom item not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: item });
}
