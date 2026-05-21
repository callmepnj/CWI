import { postCategories, posts } from "@/data/posts";

export function slugifyTopic(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const categoryEntries = postCategories.map((category) => ({
  label: category,
  slug: slugifyTopic(category)
}));

export const tagEntries = Array.from(new Set(posts.flatMap((post) => post.tags))).map((tag) => ({
  label: tag,
  slug: slugifyTopic(tag)
}));

export function getCategoryFromSlug(slug: string) {
  return categoryEntries.find((entry) => entry.slug === slug);
}

export function getTagFromSlug(slug: string) {
  return tagEntries.find((entry) => entry.slug === slug);
}
