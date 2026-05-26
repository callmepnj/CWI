import { bedrockProvider } from "@/lib/ai/providers/bedrock-provider";
import { mockProvider } from "@/lib/ai/providers/mock-provider";
import { openaiProvider } from "@/lib/ai/providers/openai-provider";
import type { AIModelRole, AIProviderConfig, GenerateAITextInput, GenerateAITextResult } from "@/lib/ai/providers/types";

export type { AIModelRole, GenerateAITextInput, GenerateAITextResult } from "@/lib/ai/providers/types";

const DEFAULT_BEDROCK_CLAUDE = "anthropic.claude-3-5-sonnet-20240620-v1:0";
const DEFAULT_BEDROCK_LLAMA = "meta.llama3-1-70b-instruct-v1:0";
const DEFAULT_BEDROCK_MISTRAL = "mistral.mistral-large-2402-v1:0";
const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";

export function getAIProviderConfig(): AIProviderConfig {
  const provider = (process.env.AI_PROVIDER || "").trim().toLowerCase();
  const roleModels = buildRoutingTable(provider);

  if (provider === "bedrock") {
    const configured = Boolean(
      process.env.AWS_ACCESS_KEY_ID &&
        process.env.AWS_SECRET_ACCESS_KEY &&
        process.env.AWS_REGION &&
        (process.env.BEDROCK_MODEL_CLAUDE || process.env.BEDROCK_MODEL_LLAMA || process.env.BEDROCK_MODEL_MISTRAL)
    );

    return {
      provider,
      model: roleModels.default,
      configured,
      routing: roleModels,
      error: configured
        ? ""
        : "AI_PROVIDER=bedrock requires AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, and at least one BEDROCK_MODEL_* value."
    };
  }

  if (provider === "openai") {
    return {
      provider,
      model: roleModels.default,
      configured: Boolean(process.env.OPENAI_API_KEY),
      routing: roleModels,
      error: process.env.OPENAI_API_KEY ? "" : "OPENAI_API_KEY is missing. Add it to the server environment or switch AI_PROVIDER to mock for local testing."
    };
  }

  if (provider === "mock") {
    return {
      provider,
      model: "mock-local",
      configured: true,
      routing: roleModels,
      error: ""
    };
  }

  return {
    provider: provider || "not_configured",
    model: process.env.AI_MODEL || "not_configured",
    configured: false,
    routing: roleModels,
    error: "AI_PROVIDER is not configured. Use bedrock, openai, or explicit mock mode for local testing."
  };
}

export async function generateAIText(input: GenerateAITextInput): Promise<GenerateAITextResult> {
  const config = getAIProviderConfig();
  const modelRole = input.modelRole ?? inferModelRole(input);
  const model = selectModel(modelRole, config.provider);

  if (!config.configured) {
    return {
      success: false,
      text: "",
      provider: config.provider,
      model,
      error: config.error,
      estimatedCost: 0
    };
  }

  if (config.provider === "mock") {
    return mockProvider.generateText({ ...input, model: "mock-local", modelRole });
  }

  if (config.provider === "openai") {
    return openaiProvider.generateText({ ...input, model, modelRole });
  }

  if (config.provider === "bedrock") {
    return bedrockProvider.generateText({ ...input, model, modelRole });
  }

  return {
    success: false,
    text: "",
    provider: config.provider,
    model,
    error: "Unsupported AI provider.",
    estimatedCost: 0
  };
}

export function selectModel(role: AIModelRole, provider = (process.env.AI_PROVIDER || "").trim().toLowerCase()) {
  const routing = buildRoutingTable(provider);
  return routing[role] || routing.default;
}

export function inferModelRole(input: Pick<GenerateAITextInput, "taskName" | "agentName">): AIModelRole {
  const joined = `${input.agentName ?? ""} ${input.taskName ?? ""}`.toLowerCase();
  if (/(command|briefing)/.test(joined)) return "command";
  if (/(source|research)/.test(joined)) return "research";
  if (/(verify|verification|shield|quality)/.test(joined)) return "verify";
  if (/(article|writer|draft)/.test(joined)) return "article";
  if (/(seo|rank)/.test(joined)) return "seo";
  if (/(social|signal|caption)/.test(joined)) return "social";
  if (/(image|visual)/.test(joined)) return "image";
  if (/(ui|ux|guardian)/.test(joined)) return "uiux";
  if (/(health|system)/.test(joined)) return "health";
  if (/(memory|graph)/.test(joined)) return "memory";
  return "default";
}

export function shouldPreferTemplate(role: AIModelRole) {
  return ["image", "health"].includes(role);
}

function buildRoutingTable(provider: string): Record<AIModelRole, string> {
  if (provider === "bedrock") {
    const claude = process.env.BEDROCK_MODEL_CLAUDE || process.env.AI_MODEL || DEFAULT_BEDROCK_CLAUDE;
    const llama = process.env.BEDROCK_MODEL_LLAMA || process.env.BEDROCK_MODEL_MISTRAL || DEFAULT_BEDROCK_LLAMA;
    const mistral = process.env.BEDROCK_MODEL_MISTRAL || process.env.BEDROCK_MODEL_LLAMA || DEFAULT_BEDROCK_MISTRAL;

    return {
      command: claude,
      research: claude,
      verify: claude,
      article: claude,
      seo: llama,
      social: mistral,
      image: mistral,
      uiux: llama,
      health: llama,
      memory: claude,
      default: claude
    };
  }

  if (provider === "openai") {
    const primary = process.env.OPENAI_MODEL || process.env.AI_MODEL || DEFAULT_OPENAI_MODEL;
    const light = process.env.OPENAI_LIGHT_MODEL || primary;
    return {
      command: primary,
      research: primary,
      verify: primary,
      article: primary,
      seo: light,
      social: light,
      image: light,
      uiux: light,
      health: light,
      memory: primary,
      default: primary
    };
  }

  return {
    command: "mock-local",
    research: "mock-local",
    verify: "mock-local",
    article: "mock-local",
    seo: "mock-local",
    social: "mock-local",
    image: "mock-local",
    uiux: "mock-local",
    health: "mock-local",
    memory: "mock-local",
    default: "mock-local"
  };
}
