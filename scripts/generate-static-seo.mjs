import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const baseUrl = "https://www.cockroachwatchindia.online";
const lastModified = "2026-05-24";

const staticRoutes = [
  "/",
  "/about",
  "/contact",
  "/charter",
  "/watch",
  "/watch/manipur-crisis",
  "/live-newsroom",
  "/india-unanswered-files",
  "/archive",
  "/corrections",
  "/issues",
  "/join",
  "/submit",
  "/five-point-agenda",
  "/youth-voice",
  "/media-bank",
  "/credit-policy",
  "/editorial-policy",
  "/privacy-policy",
  "/terms",
  "/what-is-cwi",
  "/rss.xml"
];

const postsSource = readFileSync(join(root, "data", "posts.ts"), "utf8");
const postSlugs = Array.from(postsSource.matchAll(/slug:\s*"([^"]+)"/g), (match) => match[1]);
const unansweredFilesSource = readFileSync(join(root, "data", "unanswered-files.ts"), "utf8");
const unansweredFileSlugs = Array.from(unansweredFilesSource.matchAll(/slug:\s*"([^"]+)"/g), (match) => match[1]);
const routes = [
  ...staticRoutes,
  ...postSlugs.map((slug) => `/archive/${slug}`),
  ...postSlugs.slice(0, 12).map((slug) => `/live-newsroom/${slug}`),
  ...unansweredFileSlugs.map((slug) => `/live-newsroom/${slug}`),
  ...unansweredFileSlugs.map((slug) => `/india-unanswered-files/${slug}`)
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => {
    const isHome = route === "/";
    const isArchiveArticle = route.startsWith("/archive/");
    const isUnansweredArticle = route.startsWith("/india-unanswered-files/");
    const isLiveNewsroomArticle = route.startsWith("/live-newsroom/");
    const changefreq = isHome ? "daily" : isArchiveArticle || isUnansweredArticle || isLiveNewsroomArticle ? "monthly" : "weekly";
    const priority = isHome
      ? "1.0"
      : ["/watch", "/archive", "/live-newsroom", "/india-unanswered-files"].includes(route)
        ? "0.9"
        : isArchiveArticle || isUnansweredArticle || isLiveNewsroomArticle
          ? "0.8"
          : "0.8";

    return `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

writeFileSync(join(root, "public", "sitemap.xml"), sitemap);
writeFileSync(join(root, "public", "robots.txt"), robots);

console.log(`Generated public/sitemap.xml with ${routes.length} URLs`);
