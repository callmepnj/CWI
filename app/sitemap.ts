import type { MetadataRoute } from "next";
import { posts } from "@/data/posts";

const baseUrl = "https://cwi-ten.vercel.app";

const routes = [
  "",
  "/about",
  "/contact",
  "/charter",
  "/watch-desk",
  "/issues",
  "/join",
  "/submit",
  "/five-point-agenda",
  "/youth-voice",
  "/media-bank",
  "/credit-policy",
  "/what-is-cwi"
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1 : route === "/submit" || route === "/watch-desk" ? 0.9 : 0.8
  }));

  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/watch-desk/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.65
  }));

  return [...staticRoutes, ...postRoutes];
}
