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
  "/india-unanswered-files",
  "/watch-desk",
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

const categories = [
  "Movement Update",
  "Explainer",
  "Public Reaction",
  "Youth Voice",
  "Meme Watch",
  "Fact Check",
  "Creator Spotlight",
  "Civic Issue",
  "Digital Culture",
  "Opinion",
  "Archive"
];

function slugifyTopic(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const postsSource = readFileSync(join(root, "data", "posts.ts"), "utf8");
const postSlugs = Array.from(postsSource.matchAll(/slug:\s*"([^"]+)"/g), (match) => match[1]);
const unansweredFilesSource = readFileSync(join(root, "data", "unanswered-files.ts"), "utf8");
const unansweredFileSlugs = Array.from(unansweredFilesSource.matchAll(/slug:\s*"([^"]+)"/g), (match) => match[1]);
const tagBlocks = Array.from(postsSource.matchAll(/tags:\s*\[([^\]]+)\]/g), (match) => match[1]);
const tags = Array.from(
  new Set(tagBlocks.flatMap((block) => Array.from(block.matchAll(/"([^"]+)"/g), (match) => match[1])))
);
const routes = [
  ...staticRoutes,
  ...categories.map((category) => `/watch-desk/category/${slugifyTopic(category)}`),
  ...tags.map((tag) => `/watch-desk/tag/${slugifyTopic(tag)}`),
  ...postSlugs.map((slug) => `/watch-desk/${slug}`),
  ...unansweredFileSlugs.map((slug) => `/india-unanswered-files/${slug}`)
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => {
    const isHome = route === "/";
    const isWatchDeskArticle = route.startsWith("/watch-desk/") && !route.startsWith("/watch-desk/category/") && !route.startsWith("/watch-desk/tag/");
    const isUnansweredArticle = route.startsWith("/india-unanswered-files/");
    const isTaxonomy = route.startsWith("/watch-desk/category/") || route.startsWith("/watch-desk/tag/");
    const changefreq = isHome ? "daily" : isWatchDeskArticle || isUnansweredArticle ? "monthly" : isTaxonomy ? "weekly" : "weekly";
    const priority = isHome
      ? "1.0"
      : ["/watch", "/watch-desk", "/india-unanswered-files"].includes(route)
        ? "0.9"
        : isWatchDeskArticle || isUnansweredArticle
          ? "0.8"
          : isTaxonomy
            ? "0.6"
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
