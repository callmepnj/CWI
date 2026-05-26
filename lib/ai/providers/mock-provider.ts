import { site } from "@/lib/site";
import type { AITextProvider } from "@/lib/ai/providers/types";

export const mockProvider: AITextProvider = {
  name: "mock",
  async generateText(input) {
    return {
      success: true,
      text: buildMockText(input.taskName, input.userPrompt),
      provider: "mock",
      model: input.model,
      estimatedCost: 0
    };
  }
};

function buildMockText(taskName: string, userPrompt: string) {
  const topic = extractTopic(userPrompt);
  const destination = extractDestination(userPrompt);
  const isArchive = destination === "archive" || destination === "watch_desk";
  const sectionLabel = isArchive ? "CWI Archive" : "CWI Live Newsroom";
  const sectionPath = isArchive ? "/archive" : "/live-newsroom";
  const slug = slugify(topic);
  const sourceUrl = extractUrl(userPrompt);
  const notice = "Mock mode active - no real AI call.";

  if (taskName.includes("Research")) {
    const sources = sourceUrl
      ? [{ title: "Admin supplied source link", url: sourceUrl, publisher: "Manual input", reliability: "Needs human verification" }]
      : [];

    return JSON.stringify({
      notice,
      topic,
      summary: `${notice} Research review package for ${topic}. Replace with verified source extraction before production use.`,
      sources,
      sourceCount: sources.length,
      whatHappened: "Admin supplied a topic or link for CWI review.",
      whatWeKnow: "Only the submitted context is available in mock mode.",
      whatRemainsUnclear: "All factual claims require source-backed verification.",
      timeline: [{ date: new Date().toISOString().slice(0, 10), title: "Queued for review", description: "CWI admin initiated a research workflow." }],
      keyFacts: ["Human review required", "Sources required", "No auto-publish"],
      riskNotes: ["Mock output must not be published as reporting."],
      conflictingClaims: [],
      publicReaction: "Not assessed in mock mode.",
      suggestedAngle: `Source-backed ${sectionLabel} review of ${topic}.`,
      suggestedSocialAngle: `Short CWI update after verification: ${topic}.`,
      sourceConfidenceScore: sources.length ? 45 : 20,
      category: isArchive ? "Archive" : "Live Newsroom"
    });
  }

  if (taskName.includes("Verify")) {
    return JSON.stringify({
      notice,
      verificationStatus: "Developing",
      riskLevel: "Medium",
      unsafeClaims: [],
      saferWording: ["Use reportedly, according to, and official clarification awaited where needed."],
      sourceGaps: ["Add at least two reliable sources before publication."],
      publishRecommendation: "Human review required. Do not publish mock output.",
      humanReviewRequired: true
    });
  }

  if (taskName.includes("Article")) {
    return JSON.stringify({
      notice,
      title: topic,
      slug,
      category: isArchive ? "Archive" : "Live Newsroom",
      summary: `${notice} Article review package for ${topic}.`,
      body: [
        { heading: "Short answer", body: "This is a mock-mode review package. Verified reporting is required before publication." },
        { heading: "What happened", body: "Use source-backed details from the research pack here." },
        { heading: "What changed", body: "Record only material changes supported by sources." },
        { heading: "What we know", body: "List verified or attributed facts only." },
        { heading: "What remains unclear", body: "Separate claims, rumours, and developing details." },
        { heading: "Why it matters", body: `${sectionLabel} tracks public-interest topics with context, source labels, and editorial caution.` },
        { heading: "CWI context", body: "Cockroach Watch India - CWI documents, verifies, and amplifies public-interest conversations with context and source attribution." },
        { heading: "Sources and further reading", body: "Attach verified sources before approval." }
      ],
      sources: [],
      disclaimer:
        "Cockroach Watch India is an independent civic watch, satire, and commentary platform. Claims require attribution and human review.",
      relatedArticles: [sectionPath, "/india-unanswered-files", "/submit"]
    });
  }

  if (taskName.includes("SEO")) {
    return JSON.stringify({
      notice,
      seoTitle: `${topic} - ${sectionLabel} | Cockroach Watch India`,
      metaDescription: `Cockroach Watch India explains ${topic}, what is known, what remains unclear, and why ${sectionLabel} is tracking this update.`,
      canonicalUrl: `${site.url}${sectionPath}/${slug}`,
      ogTitle: `${topic} - ${sectionLabel}`,
      ogDescription: `${sectionLabel} context for ${topic}.`,
      ogImage: `${site.url}/opengraph-image`,
      twitterTitle: `${topic} - Cockroach Watch India`,
      twitterDescription: `${sectionLabel} context for ${topic}.`,
      schemaJson: { "@type": "NewsArticle", headline: topic },
      breadcrumbSchema: {},
      internalLinks: ["/", "/watch", sectionPath, "/submit"],
      altText: [`Cockroach Watch India ${sectionLabel} visual on ${topic}.`],
      searchConsoleChecklist: ["Check live canonical after publish.", "Confirm sitemap after publish."]
    });
  }

  if (taskName.includes("Social")) {
    return JSON.stringify({
      notice,
      instagramCaption: `${topic}\n\nMock mode active - no real AI call.\n\nDocument. Verify. Amplify.\n${site.url}${sectionPath}/${slug}`,
      facebookCaption: `${topic}\n\nCWI is reviewing this topic with source attribution.`,
      xCaption: `${topic}\n${sectionLabel} review queued. ${site.url}${sectionPath}/${slug}`,
      redditTitle: `${topic} - what verified context should CWI add?`,
      redditBody: "Discussion prompt for verified sources and context only.",
      youtubeTitle: `${topic} | ${sectionLabel}`,
      youtubeDescription: "Mock mode social description. Human approval required.",
      pinnedComment: `Read and submit corrections at ${site.url}/submit.`,
      blueskyCaption: `${topic} - CWI is tracking with context. ${site.url}${sectionPath}/${slug}`,
      discordMessage: `CWI topic queued: ${topic}`,
      hashtags: ["#CWI", "#CockroachWatchIndia", "#DocumentVerifyAmplify"]
    });
  }

  return JSON.stringify({ notice, topic, summary: `${notice} Output shell for ${topic}.` });
}

function extractTopic(prompt: string) {
  const topicMatch = prompt.match(/topic["']?\s*[:=]\s*["']?([^"',\n}]+)/i);
  return (topicMatch?.[1] ?? "CWI topic").trim();
}

function extractDestination(prompt: string) {
  const destinationMatch = prompt.match(/contentDestination["']?\s*[:=]\s*["']?([a-z_-]+)/i);
  return (destinationMatch?.[1] ?? "live_newsroom").trim().toLowerCase();
}

function extractUrl(prompt: string) {
  const urlMatch = prompt.match(/url["']?\s*[:=]\s*["']?(https?:\/\/[^"',\s}]+)/i);
  return (urlMatch?.[1] ?? "").trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "cwi-topic";
}
