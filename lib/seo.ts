import type { Metadata } from "next";
import { site } from "@/lib/site";

type SeoImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  image?: SeoImage;
  index?: boolean;
};

export const ogImage = {
  url: `${site.url}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: "Cockroach Watch India civic newsroom social preview"
};

export const importantRoutes = [
  "/",
  "/about",
  "/contact",
  "/corrections",
  "/support",
  "/charter",
  "/watch",
  "/watch/manipur-crisis",
  "/live-newsroom",
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
  "/terms"
] as const;

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, site.url).toString();
}

export function createMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
  image,
  index = true
}: SeoInput): Metadata {
  const url = absoluteUrl(path);
  const metadataKeywords = Array.from(new Set(keywords.length > 0 ? keywords : site.keywords));
  const socialImage = normalizeSeoImage(image ?? ogImage);

  return {
    title,
    description,
    keywords: metadataKeywords,
    alternates: {
      canonical: url
    },
    robots: {
      index,
      follow: index,
      googleBot: {
        index,
        follow: index,
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
      images: [socialImage],
      locale: "en_IN",
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {})
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage.url],
      creator: "@CWatchIndia",
      site: "@CWatchIndia"
    }
  };
}

function normalizeSeoImage(image: SeoImage) {
  const url = image.url.startsWith("http://") || image.url.startsWith("https://") ? image.url : absoluteUrl(image.url);

  return {
    url,
    width: image.width ?? 1200,
    height: image.height ?? 630,
    alt: image.alt ?? ogImage.alt
  };
}
