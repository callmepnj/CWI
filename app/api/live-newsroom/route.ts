import { NextResponse } from "next/server";
import { getLiveNewsroomFallbackItems, getPublishedLiveNewsroomItems } from "@/lib/db/live-newsroom";

export const runtime = "nodejs";

export async function GET() {
  const dbItems = await getPublishedLiveNewsroomItems(80).catch(() => []);
  const fallbackItems = getLiveNewsroomFallbackItems(80);
  const seen = new Set<string>();
  const items = [...dbItems, ...fallbackItems].filter((item) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });

  return NextResponse.json({ ok: true, data: items });
}
