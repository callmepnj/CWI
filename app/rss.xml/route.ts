import { getLiveNewsroomFallbackItems, getPublishedLiveNewsroomItems } from "@/lib/db/live-newsroom";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const publishedPosts = await getPublishedLiveNewsroomItems(50).catch(() => []);
  const feedPosts = mergePosts([...publishedPosts, ...getLiveNewsroomFallbackItems(50)]).sort(
    (first, second) => dateValue(second.updatedAt) - dateValue(first.updatedAt)
  );
  const items = feedPosts
    .slice(0, 50)
    .map((item) => {
      const url = `${site.url}/live-newsroom/${item.slug}`;

      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(item.summary)}</description>
      <category>${escapeXml(item.category)}</category>
      <author>${site.email} (${escapeXml(item.author)})</author>
      <pubDate>${new Date(`${item.publishedAt}T00:00:00+05:30`).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)} Live Newsroom</title>
    <link>${site.url}/live-newsroom</link>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml("CWI Live Newsroom source-backed updates, public advisories, India Unanswered Files coverage, and correction records.")}</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date(`${feedPosts[0]?.updatedAt ?? "2026-05-26"}T00:00:00+05:30`).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function dateValue(value: string) {
  return new Date(`${value}T00:00:00+05:30`).getTime();
}

function mergePosts<T extends { slug: string }>(items: T[]) {
  return Array.from(new Map(items.map((item) => [item.slug, item])).values());
}
