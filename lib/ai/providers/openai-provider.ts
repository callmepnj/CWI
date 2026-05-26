import type { AITextProvider, GenerateAITextResult, ProviderGenerateInput } from "@/lib/ai/providers/types";
import { estimateCostInr } from "@/lib/ai/providers/types";

export const openaiProvider: AITextProvider = {
  name: "openai",
  async generateText(input) {
    return callOpenAI(input);
  }
};

async function callOpenAI(input: ProviderGenerateInput): Promise<GenerateAITextResult> {
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: input.model,
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
        model: input.model,
        error: readError(json) || `OpenAI request failed with HTTP ${response.status}.`,
        estimatedCost: 0
      };
    }

    return {
      success: true,
      text: extractOpenAIText(json),
      provider: "openai",
      model: input.model,
      estimatedCost: estimateCostInr(input, costRate(input.modelRole))
    };
  } catch (error) {
    return {
      success: false,
      text: "",
      provider: "openai",
      model: input.model,
      error: error instanceof Error ? error.message : "OpenAI request failed.",
      estimatedCost: 0
    };
  }
}

function extractOpenAIText(json: unknown) {
  const record = json as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
  if (record.output_text) return record.output_text;
  return record.output?.flatMap((item) => item.content ?? []).map((item) => item.text ?? "").join("\n").trim() ?? "";
}

function readError(json: unknown) {
  return (json as { error?: { message?: string } })?.error?.message ?? "";
}

function costRate(role: string) {
  if (["command", "research", "verify", "article"].includes(role)) return 0.002;
  return 0.0006;
}
