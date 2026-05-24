import type { Metadata } from "next";
import { site } from "@/lib/site";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
};

export const ogImage = {
  url: `${site.url}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: "Cockroach Watch India Document Verify Amplify social preview"
};

export const importantRoutes = [
  "/",
  "/about",
  "/what-is-cwi",
  "/contact",
  "/charter",
  "/watch",
  "/watch/manipur-crisis",
  "/watch-desk",
  "/issues",
  "/join",
  "/submit",
  "/five-point-agenda",
  "/youth-voice",
  "/media-bank",
  "/credit-policy"
] as const;

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, site.url).toString();
}

export function createMetadata({ title, description, path = "/", keywords = [], type = "website", publishedTime }: SeoInput): Metadata {
  const url = absoluteUrl(path);
  const mergedKeywords = Array.from(new Set([...site.keywords, ...keywords]));

  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: url
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      images: [ogImage],
      locale: "en_IN",
      type,
      ...(publishedTime ? { publishedTime } : {})
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
      creator: "@CWatchIndia",
      site: "@CWatchIndia"
    }
  };
}
