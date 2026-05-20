import { posts } from "@/data/posts";

export const dynamic = "force-static";

const baseUrl = "https://cwi-ten.vercel.app";
const lastModified = "2026-05-20";

const routes = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/about", changefreq: "weekly", priority: "0.8" },
  { path: "/contact", changefreq: "weekly", priority: "0.8" },
  { path: "/charter", changefreq: "weekly", priority: "0.8" },
  { path: "/watch-desk", changefreq: "weekly", priority: "0.9" },
  { path: "/issues", changefreq: "weekly", priority: "0.8" },
  { path: "/join", changefreq: "weekly", priority: "0.8" },
  { path: "/submit", changefreq: "weekly", priority: "0.9" },
  { path: "/five-point-agenda", changefreq: "weekly", priority: "0.8" },
  { path: "/youth-voice", changefreq: "weekly", priority: "0.8" },
  { path: "/media-bank", changefreq: "weekly", priority: "0.8" },
  { path: "/credit-policy", changefreq: "weekly", priority: "0.8" },
  { path: "/what-is-cwi", changefreq: "weekly", priority: "0.8" }
];

function sitemapEntry({ url, lastmod, changefreq, priority }: { url: string; lastmod: string; changefreq: string; priority: string }) {
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export function GET() {
  const staticEntries = routes.map((route) =>
    sitemapEntry({
      url: `${baseUrl}${route.path === "/" ? "/" : route.path}`,
      lastmod: lastModified,
      changefreq: route.changefreq,
      priority: route.priority
    })
  );

  const postEntries = posts.map((post) =>
    sitemapEntry({
      url: `${baseUrl}/watch-desk/${post.slug}`,
      lastmod: post.date,
      changefreq: "monthly",
      priority: "0.6"
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...postEntries].join("\n")}
</urlset>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400"
    }
  });
}
