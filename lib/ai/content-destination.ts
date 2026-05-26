export const contentDestinations = [
  "live_newsroom",
  "archive",
  "india_unanswered_files",
  "public_advisory",
  "social_only"
] as const;

export type ContentDestination = (typeof contentDestinations)[number];

export function normalizeContentDestination(value: unknown): ContentDestination {
  if (typeof value !== "string") return "live_newsroom";

  const normalized = value.trim().toLowerCase().replace(/[-\s]+/g, "_");
  if (normalized === "watch_desk") return "archive";

  return contentDestinations.includes(normalized as ContentDestination) ? (normalized as ContentDestination) : "live_newsroom";
}

export function destinationLabel(value: unknown) {
  const destination = normalizeContentDestination(value);
  const labels: Record<ContentDestination, string> = {
    live_newsroom: "Live Newsroom",
    archive: "Archive",
    india_unanswered_files: "India Unanswered Files",
    public_advisory: "Public Advisory",
    social_only: "Social Only"
  };
  return labels[destination];
}
