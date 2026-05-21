import { posts } from "@/data/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const items = posts
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
    <lastBuildDate>${new Date(posts[0]?.updatedDate ?? "2026-05-21").toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400"
    }
  });
}
