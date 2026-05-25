type GenerateAITextInput = {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  taskName: string;
};

export type GenerateAITextResult = {
  success: boolean;
  text: string;
  provider: string;
  model: string;
  error?: string;
  estimatedCost?: number;
};

const INR_PER_USD = 83;

export function getAIProviderConfig() {
  const provider = (process.env.AI_PROVIDER || "").trim().toLowerCase();
  const model = (process.env.AI_MODEL || "").trim();

  if (provider === "openai") {
    return {
      provider,
      model: model || "gpt-4.1-mini",
      configured: Boolean(process.env.OPENAI_API_KEY),
      error: process.env.OPENAI_API_KEY ? "" : "OPENAI_API_KEY is missing. Add it to the server environment or switch AI_PROVIDER to mock for local testing."
    };
  }

  if (provider === "gemini") {
    return {
      provider,
      model: model || "gemini-1.5-flash",
      configured: Boolean(process.env.GEMINI_API_KEY),
      error: process.env.GEMINI_API_KEY ? "" : "GEMINI_API_KEY is missing. Add it to the server environment or switch AI_PROVIDER to mock for local testing."
    };
  }

  if (provider === "mock") {
    return {
      provider,
      model: "mock-local",
      configured: true,
      error: ""
    };
  }

  return {
    provider: provider || "not_configured",
    model: model || "not_configured",
    configured: false,
    error: "AI_PROVIDER is not configured. Use openai, gemini, or explicit mock mode for local testing."
  };
}

export async function generateAIText(input: GenerateAITextInput): Promise<GenerateAITextResult> {
  const config = getAIProviderConfig();

  if (!config.configured) {
    return {
      success: false,
      text: "",
      provider: config.provider,
      model: config.model,
      error: config.error,
      estimatedCost: 0
    };
  }

  if (config.provider === "mock") {
    return {
      success: true,
      text: buildMockText(input.taskName, input.userPrompt),
      provider: config.provider,
      model: config.model,
      estimatedCost: 0
    };
  }

  if (config.provider === "openai") {
    return callOpenAI(input, config.model);
  }

  if (config.provider === "gemini") {
    return callGemini(input, config.model);
  }

  return {
    success: false,
    text: "",
    provider: config.provider,
    model: config.model,
    error: "Unsupported AI provider.",
    estimatedCost: 0
  };
}

async function callOpenAI(input: GenerateAITextInput, model: string): Promise<GenerateAITextResult> {
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model,
        temperature: input.temperature ?? 0.2,
        max_output_tokens: input.maxTokens ?? 1800,
        input: [
          { role: "system", content: input.systemPrompt },
          { role: "user", content: input.userPrompt }
        ]
      })
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        text: "",
        provider: "openai",
        model,
        error: json?.error?.message ?? `OpenAI request failed with HTTP ${response.status}.`,
        estimatedCost: 0
      };
    }

    return {
      success: true,
      text: extractOpenAIText(json),
      provider: "openai",
      model,
      estimatedCost: estimateCost(input, 0.002)
    };
  } catch (error) {
    return {
      success: false,
      text: "",
      provider: "openai",
      model,
      error: error instanceof Error ? error.message : "OpenAI request failed.",
      estimatedCost: 0
    };
  }
}

async function callGemini(input: GenerateAITextInput, model: string): Promise<GenerateAITextResult> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${input.systemPrompt}\n\n${input.userPrompt}` }]
          }
        ],
        generationConfig: {
          temperature: input.temperature ?? 0.2,
          maxOutputTokens: input.maxTokens ?? 1800
        }
      })
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        text: "",
        provider: "gemini",
        model,
        error: json?.error?.message ?? `Gemini request failed with HTTP ${response.status}.`,
        estimatedCost: 0
      };
    }

    return {
      success: true,
      text: extractGeminiText(json),
      provider: "gemini",
      model,
      estimatedCost: estimateCost(input, 0.0004)
    };
  } catch (error) {
    return {
      success: false,
      text: "",
      provider: "gemini",
      model,
      error: error instanceof Error ? error.message : "Gemini request failed.",
      estimatedCost: 0
    };
  }
}

function extractOpenAIText(json: unknown) {
  const record = json as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
  if (record.output_text) return record.output_text;
  return record.output?.flatMap((item) => item.content ?? []).map((item) => item.text ?? "").join("\n").trim() ?? "";
}

function extractGeminiText(json: unknown) {
  const record = json as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  return record.candidates?.flatMap((candidate) => candidate.content?.parts ?? []).map((part) => part.text ?? "").join("\n").trim() ?? "";
}

function estimateCost(input: GenerateAITextInput, usdPerThousandTokens: number) {
  const charCount = input.systemPrompt.length + input.userPrompt.length + (input.maxTokens ?? 1800) * 4;
  const estimatedTokens = Math.ceil(charCount / 4);
  return Number(((estimatedTokens / 1000) * usdPerThousandTokens * INR_PER_USD).toFixed(2));
}

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
      suggestedAngle: `Source-backed CWI Watch Desk review of ${topic}.`
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
      publishRecommendation: "Human review required. Do not publish mock output."
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
        { heading: "CWI context", body: "Cockroach Watch India - CWI documents, verifies, and amplifies public-interest conversations with context and source attribution." }
      ],
      sources: [],
      disclaimer: "Cockroach Watch India is an independent civic watch, satire, and commentary platform. Claims require attribution and human review.",
      relatedArticles: ["/watch-desk", "/india-unanswered-files", "/submit"]
    });
  }

  if (taskName.includes("SEO")) {
    const slug = slugify(topic);
    return JSON.stringify({
      notice,
      seoTitle: `${topic} - CWI Watch Desk | Cockroach Watch India`,
      metaDescription: `Cockroach Watch India explains ${topic}, what is known, what remains unclear, and why the CWI Watch Desk is tracking this update.`,
      canonicalUrl: `https://www.cockroachwatchindia.online/watch-desk/${slug}`,
      ogTitle: `${topic} - CWI Watch Desk`,
      ogDescription: `CWI Watch Desk context for ${topic}.`,
      ogImage: "https://www.cockroachwatchindia.online/opengraph-image",
      twitterTitle: `${topic} - Cockroach Watch India`,
      twitterDescription: `CWI Watch Desk context for ${topic}.`,
      schemaJson: { "@type": "NewsArticle", headline: topic },
      internalLinks: ["/", "/watch", "/watch-desk", "/submit"],
      altText: [`Cockroach Watch India CWI Watch Desk visual on ${topic}.`]
    });
  }

  if (taskName.includes("Social")) {
    return JSON.stringify({
      notice,
      instagramCaption: `${topic}\n\nMock mode active - no real AI call.\n\nDocument. Verify. Amplify.`,
      facebookCaption: `${topic}\n\nCWI is reviewing this topic with source attribution.`,
      xCaption: `${topic}\nCWI Watch Desk review queued. https://www.cockroachwatchindia.online`,
      redditTitle: `${topic} - what verified context should CWI add?`,
      redditBody: "Discussion prompt for verified sources and context only.",
      youtubeTitle: `${topic} | CWI Watch Desk`,
      youtubeDescription: "Mock mode social description. Human approval required.",
      blueskyCaption: `${topic} - CWI is tracking with context.`,
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
