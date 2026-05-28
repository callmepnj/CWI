import { NextResponse, type NextRequest } from "next/server";

const removedDraftSlugs = new Set(["cwi-priority-public-interest-update"]);

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  const { slug } = await params;

  if (removedDraftSlugs.has(slug)) {
    return new Response(
      "This draft archive item has been removed from Cockroach Watch India and is not available for indexing.",
      {
        status: 410,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "x-robots-tag": "noindex, nofollow"
        }
      }
    );
  }

  const url = request.nextUrl.clone();
  url.pathname = `/watch-desk/${slug}`;
  return NextResponse.redirect(url, 308);
}
