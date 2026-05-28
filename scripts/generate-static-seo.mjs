import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const baseUrl = "https://www.cockroachwatchindia.online";
const lastModified = "2026-05-28";

const staticRoutes = [
  "/",
  "/live-newsroom",
  "/india-unanswered-files",
  "/archive",
  "/submit",
  "/support",
  "/about",
  "/editorial-policy",
  "/corrections",
  "/credit-policy",
  "/contact",
  "/privacy-policy",
  "/terms"
];

const postsSource = readFileSync(join(root, "data", "posts.ts"), "utf8");
const removedPostSlugs = new Set(["cwi-priority-public-interest-update"]);
const postSlugs = Array.from(postsSource.matchAll(/slug:\s*"([^"]+)"/g), (match) => match[1]).filter((slug) => !removedPostSlugs.has(slug));
const unansweredFilesSource = readFileSync(join(root, "data", "unanswered-files.ts"), "utf8");
const unansweredFileSlugs = Array.from(unansweredFilesSource.matchAll(/slug:\s*"([^"]+)"/g), (match) => match[1]);
const liveNewsroomSource = readFileSync(join(root, "data", "live-newsroom.ts"), "utf8");
const liveNewsroomBlock = liveNewsroomSource.match(/export const liveNewsroomItems:[\s\S]*?export const publicAdvisories/)?.[0] ?? "";
const liveNewsroomSlugs = Array.from(liveNewsroomBlock.matchAll(/slug:\s*"([^"]+)"/g), (match) => match[1]);

const routes = Array.from(new Set([
  ...staticRoutes,
  ...liveNewsroomSlugs.map((slug) => `/live-newsroom/${slug}`),
  ...unansweredFileSlugs.map((slug) => `/india-unanswered-files/${slug}`),
  ...postSlugs.map((slug) => `/archive/${slug}`)
]));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => {
    const isHome = route === "/";
    const isLive = route === "/live-newsroom" || route.startsWith("/live-newsroom/");
    const isArticle = route.startsWith("/live-newsroom/") || route.startsWith("/india-unanswered-files/") || route.startsWith("/archive/");
    const changefreq = isHome || isLive ? "daily" : isArticle ? "monthly" : "weekly";
    const priority = isHome ? "1.0" : route === "/live-newsroom" ? "0.95" : ["/india-unanswered-files", "/archive", "/submit", "/support"].includes(route) ? "0.85" : isArticle ? "0.75" : "0.7";
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
Disallow: /admin
Disallow: /admin/
Disallow: /api/admin
Disallow: /drafts
Disallow: /test
Disallow: /archive/cwi-priority-public-interest-update

Sitemap: ${baseUrl}/sitemap.xml
`;

writeFileSync(join(root, "public", "sitemap.xml"), sitemap);
writeFileSync(join(root, "public", "robots.txt"), robots);

console.log(`Generated public/sitemap.xml with ${routes.length} URLs`);