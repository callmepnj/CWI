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
  const notice = "Mock mode active - no real AI call.";

  if (taskName.includes("Research")) {
    return JSON.stringify({
      notice,
      topic,
      summary: `${notice} Research shell for ${topic}. Replace with verified source extraction before production use.`,
      sources: [{ title: "Admin supplied source", url: "", publisher: "Manual input", reliability: "Needs review" }],
      sourceCount: 1,
      whatHappened: "Admin supplied a topic or link for CWI review.",
      whatWeKnow: "Only the submitted context is available in mock mode.",
      whatRemainsUnclear: "All factual claims require source-backed verification.",
      timeline: [{ date: new Date().toISOString().slice(0, 10), title: "Queued for review", description: "CWI admin initiated a research workflow." }],
      keyFacts: ["Human review required", "Sources required", "No auto-publish"],
      riskNotes: ["Mock output must not be published as reporting."],
      conflictingClaims: [],
      publicReaction: "Not assessed in mock mode.",
      suggestedAngle: `Source-backed CWI Watch Desk review of ${topic}.`,
      suggestedSocialAngle: `Short CWI update after verification: ${topic}.`,
      sourceConfidenceScore: 35
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
      title: `${topic} - CWI Watch Desk`,
      slug: slugify(topic),
      category: "Watch Desk",
      summary: `${notice} Article draft shell for ${topic}.`,
      body: [
        { heading: "Short answer", body: "This is a mock-mode draft shell. Verified reporting is required before publication." },
        { heading: "What happened", body: "Use source-backed details from the research pack here." },
        { heading: "What we know", body: "List verified or attributed facts only." },
        { heading: "What remains unclear", body: "Separate claims, rumours, and developing details." },
        { heading: "Why it matters", body: "CWI tracks public-interest topics with context, source labels, and editorial caution." },
        { heading: "CWI context", body: "Cockroach Watch India - CWI documents, verifies, and amplifies public-interest conversations with context and source attribution." },
        { heading: "Sources and further reading", body: "Attach verified sources before approval." }
      ],
      sources: [],
      disclaimer:
        "Cockroach Watch India is an independent civic watch, satire, and commentary platform. Claims require attribution and human review.",
      relatedArticles: ["/watch-desk", "/india-unanswered-files", "/submit"]
    });
  }

  if (taskName.includes("SEO")) {
    const slug = slugify(topic);
    return JSON.stringify({
      notice,
      seoTitle: `${topic} - CWI Watch Desk | Cockroach Watch India`,
      metaDescription: `Cockroach Watch India explains ${topic}, what is known, what remains unclear, and why the CWI Watch Desk is tracking this update.`,
      canonicalUrl: `${site.url}/watch-desk/${slug}`,
      ogTitle: `${topic} - CWI Watch Desk`,
      ogDescription: `CWI Watch Desk context for ${topic}.`,
      ogImage: `${site.url}/opengraph-image`,
      twitterTitle: `${topic} - Cockroach Watch India`,
      twitterDescription: `CWI Watch Desk context for ${topic}.`,
      schemaJson: { "@type": "NewsArticle", headline: topic },
      breadcrumbSchema: {},
      internalLinks: ["/", "/watch", "/watch-desk", "/submit"],
      altText: [`Cockroach Watch India CWI Watch Desk visual on ${topic}.`],
      searchConsoleChecklist: ["Check live canonical after publish.", "Confirm sitemap after publish."]
    });
  }

  if (taskName.includes("Social")) {
    return JSON.stringify({
      notice,
      instagramCaption: `${topic}\n\nMock mode active - no real AI call.\n\nDocument. Verify. Amplify.`,
      facebookCaption: `${topic}\n\nCWI is reviewing this topic with source attribution.`,
      xCaption: `${topic}\nCWI Watch Desk review queued. ${site.url}`,
      redditTitle: `${topic} - what verified context should CWI add?`,
      redditBody: "Discussion prompt for verified sources and context only.",
      youtubeTitle: `${topic} | CWI Watch Desk`,
      youtubeDescription: "Mock mode social description. Human approval required.",
      pinnedComment: `Read and submit corrections at ${site.url}/submit.`,
      blueskyCaption: `${topic} - CWI is tracking with context. ${site.url}`,
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "cwi-topic";
}
