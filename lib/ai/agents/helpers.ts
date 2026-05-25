import { generateAIText } from "@/lib/ai/model-provider";
import { getBigBrainSystemPrompt } from "@/lib/ai/big-brain";

export async function runJsonAgent<T>(input: {
  agentName: string;
  taskName: string;
  instruction: string;
  payload: unknown;
  temperature?: number;
  maxTokens?: number;
}) {
  const result = await generateAIText({
    systemPrompt: `${getBigBrainSystemPrompt(input.agentName)}\n\nReturn strict JSON only. No markdown fences.`,
    userPrompt: `${input.instruction}\n\nInput JSON:\n${JSON.stringify(input.payload, null, 2)}`,
    temperature: input.temperature ?? 0.2,
    maxTokens: input.maxTokens ?? 1800,
    taskName: input.taskName
  });

  if (!result.success) {
    throw new Error(result.error ?? `${input.agentName} failed.`);
  }

  return {
    data: parseJson<T>(result.text),
    provider: result.provider,
    model: result.model,
    estimatedCost: result.estimatedCost ?? 0
  };
}

export function parseJson<T>(text: string): T {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]?.trim();
  const candidate = fenced || trimmed.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)?.[1] || trimmed;
  return JSON.parse(candidate) as T;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "cwi-topic";
}

export function normalizeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function asText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}
