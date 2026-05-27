export type AiishnessFlag = {
  line: string;
  reason: string;
};

export type AiishnessReport = {
  contentType: string;
  contentId?: string;
  pageUrl?: string;
  score: number;
  flaggedLines: AiishnessFlag[];
  issues: string[];
  rewriteSuggestions: string[];
  saferHumanVersion: string;
  publishRecommendation: "allow" | "human_review" | "block";
  status: "allowed" | "human_review_required" | "blocked";
};

const repetitivePhrases = [
  "cwi watch desk documents public-interest updates with context",
  "the youth are not silent. india is watching.",
  "the watch never sleeps",
  "source-backed public-interest explainer",
  "public memory",
  "civic satire",
  "cockroach wave",
  "creator credit",
  "correction path",
  "cwi discussion prompts",
  "reader questions to consider",
  "social copy kit",
  "x thread",
  "instagram caption",
  "reddit caption",
  "youtube shorts caption",
  "internal links",
  "latest updates",
  "add context, not noise",
  "document. verify. amplify."
];

const publicBlockers = [
  "mock mode active",
  "no real ai call",
  "draft shell",
  "supabase backend",
  "ai os approved draft",
  "generated placeholder",
  "fake source",
  "test article",
  "lorem ipsum",
  ["cwi-ten", "vercel", "app"].join("."),
  "localhost",
  "vercel preview",
  "backend connected",
  "api response",
  "debugging",
  "console output",
  "admin-only"
];

const genericTerms = ["source-backed", "public-interest", "public memory", "civic", "context", "source attribution"];
const datePattern = /\b(?:\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4})\b/i;

export function assessAiishness(input: {
  contentType: string;
  contentId?: string;
  pageUrl?: string;
  title?: string;
  text: string;
}): AiishnessReport {
  const text = [input.title, input.text].filter(Boolean).join("\n\n").trim();
  const lower = text.toLowerCase();
  const lines = splitLines(text);
  const flaggedLines: AiishnessFlag[] = [];
  const issues = new Set<string>();
  let score = 0;

  for (const phrase of repetitivePhrases) {
    const count = countOccurrences(lower, phrase);
    if (!count) continue;
    score += count > 1 ? 8 + count * 4 : 5;
    issues.add(`Repeated or mechanical phrase: "${phrase}"`);
    flagMatchingLine(lines, phrase, flaggedLines, "Repeated brand or template phrase.");
  }

  for (const blocker of publicBlockers) {
    if (!lower.includes(blocker)) continue;
    score += 35;
    issues.add(`Public trust blocker: "${blocker}"`);
    flagMatchingLine(lines, blocker, flaggedLines, "Internal or public-trust blocker should not be public.");
  }

  for (const term of genericTerms) {
    const count = countOccurrences(lower, term);
    if (count >= 4) {
      score += Math.min(18, count * 3);
      issues.add(`Overused generic term: "${term}"`);
      flagMatchingLine(lines, term, flaggedLines, "This term appears too often and may feel templated.");
    }
  }

  for (const line of lines) {
    const semicolonCount = (line.match(/;/g) ?? []).length;
    if (line.length > 230 || semicolonCount >= 2) {
      score += 7;
      issues.add("Long balanced sentence or semicolon-heavy wording.");
      flaggedLines.push({ line: trimLine(line), reason: "Long or overly balanced sentence." });
    }

    if (/\b(why it matters|what happened|what we know)\b/i.test(line) && /public memory|civic|source-backed/i.test(line)) {
      score += 6;
      issues.add("Generic section wording around newsroom headings.");
      flaggedLines.push({ line: trimLine(line), reason: "Generic section copy needs a specific date, source, or event." });
    }
  }

  const exactKeywordHits = countOccurrences(lower, "cockroach watch india") + countOccurrences(lower, "cwi live newsroom");
  if (exactKeywordHits >= 8) {
    score += 14;
    issues.add("Exact-match CWI keywords appear too often.");
  }

  if (!datePattern.test(text) && text.length > 450) {
    score += 8;
    issues.add("No clear date found in a substantial news item.");
  }

  if (text.length > 450 && !/\b(according to|reported by|official statement|court|police|ministry|commission|source)\b/i.test(text)) {
    score += 10;
    issues.add("Specific source names or attribution are not visible enough.");
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(score)));
  const publishRecommendation = finalScore > 60 ? "block" : finalScore >= 41 ? "human_review" : "allow";

  return {
    contentType: input.contentType,
    contentId: input.contentId,
    pageUrl: input.pageUrl,
    score: finalScore,
    flaggedLines: dedupeFlags(flaggedLines).slice(0, 12),
    issues: Array.from(issues).slice(0, 16),
    rewriteSuggestions: buildRewriteSuggestions(Array.from(issues)),
    saferHumanVersion:
      "Start with the latest verified change, name the date and source, state what remains unknown, then end with: Have a source we missed or a correction to make? Send it here.",
    publishRecommendation,
    status: publishRecommendation === "block" ? "blocked" : publishRecommendation === "human_review" ? "human_review_required" : "allowed"
  };
}

export function extractPublicTrustBlockers(text: string) {
  const lower = text.toLowerCase();
  return publicBlockers.filter((blocker) => lower.includes(blocker));
}

export function hasPublicTrustBlockers(text: string) {
  return extractPublicTrustBlockers(text).length > 0;
}

function buildRewriteSuggestions(issues: string[]) {
  const suggestions = [
    "Replace slogans with the newest verified change.",
    "Name the source, date, and what the source does not prove.",
    "Use one correction/source invitation instead of repeated CTAs.",
    "Shorten long sentences and remove keyword stuffing."
  ];

  if (issues.some((issue) => issue.includes("No clear date"))) {
    suggestions.unshift("Add a concrete date or say clearly why the date is unknown.");
  }

  if (issues.some((issue) => issue.includes("Public trust blocker"))) {
    suggestions.unshift("Remove internal testing, backend, mock, or debug language before publishing.");
  }

  return suggestions.slice(0, 6);
}

function splitLines(text: string) {
  return text
    .split(/\n+|(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function flagMatchingLine(lines: string[], phrase: string, flags: AiishnessFlag[], reason: string) {
  const match = lines.find((line) => line.toLowerCase().includes(phrase));
  if (match) {
    flags.push({ line: trimLine(match), reason });
  }
}

function countOccurrences(value: string, needle: string) {
  if (!needle) return 0;
  return value.split(needle).length - 1;
}

function dedupeFlags(flags: AiishnessFlag[]) {
  const seen = new Set<string>();
  return flags.filter((flag) => {
    const key = `${flag.line}:${flag.reason}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function trimLine(value: string) {
  return value.length > 220 ? `${value.slice(0, 217)}...` : value;
}
