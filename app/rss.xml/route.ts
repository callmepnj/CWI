import { posts } from "@/data/posts";
import { getPublishedWatchPosts } from "@/lib/db/articles";
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
  const publishedPosts = await getPublishedWatchPosts(50).catch(() => []);
  const feedPosts = mergePosts([...posts, ...publishedPosts]).sort((first, second) => dateValue(second.date) - dateValue(first.date));
  const items = feedPosts
    .slice(0, 50)
    .map((post) => {
      const url = `${site.url}/watch-desk/${post.slug}`;

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(post.summary)}</description>
      <category>${escapeXml(post.category)}</category>
      <author>${site.email} (${escapeXml(post.author)})</author>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.name)} Watch Desk</title>
    <link>${site.url}/watch-desk</link>
    <description>${escapeXml(site.description)}</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date(feedPosts[0]?.updatedDate ?? "2026-05-21").toUTCString()}</lastBuildDate>
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
