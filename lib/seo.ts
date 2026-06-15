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
] as const;

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, site.url).toString();
}

export function createMetadata({
  title,
  description,
  path = "/",
  type = "website",
  publishedTime,
  modifiedTime,
  image,
  index = true
}: SeoInput): Metadata {
  const url = absoluteUrl(path);
  const seoTitle = cleanSeoTitle(title);
  const socialImage = normalizeSeoImage(image ?? ogImage);

  return {
    title: seoTitle,
    description,
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
      title: seoTitle,
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
      title: seoTitle,
      description,
      images: [socialImage.url],
      creator: "@CWatchIndia",
      site: "@CWatchIndia"
    }
  };
}

export function cleanSeoTitle(title: string, maxLength = 60) {
  const normalized = title.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const withoutSuffix = normalized
    .replace(/\s+-\s+CWI\s+(Live Newsroom|Archive)$/i, "")
    .replace(/\s+-\s+Cockroach Watch India$/i, "")
    .replace(/\s+\|\s+Cockroach Watch India$/i, "");

  const candidate = withoutSuffix.length <= maxLength ? withoutSuffix : withoutSuffix;
  if (candidate.length <= maxLength) return candidate;

  const clipped = candidate.slice(0, maxLength - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > 42 ? clipped.slice(0, lastSpace) : clipped).trim()}…`;
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
