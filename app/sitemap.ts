import type { MetadataRoute } from "next";
import { posts } from "@/data/posts";
import { absoluteUrl, importantRoutes } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = importantRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "/" ? 1 : route === "/submit" || route === "/watch-desk" ? 0.9 : 0.75
  }));

  const postRoutes = posts.map((post) => ({
    url: absoluteUrl(`/watch-desk/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.65
  }));

  return [...staticRoutes, ...postRoutes];
}
