export type AIProviderName = "bedrock" | "openai" | "mock" | "not_configured";

export type AIModelRole =
  | "command"
  | "research"
  | "verify"
  | "article"
  | "seo"
  | "social"
  | "image"
  | "uiux"
  | "health"
  | "memory"
  | "default";

export type GenerateAITextInput = {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  taskName: string;
  agentName?: string;
  modelRole?: AIModelRole;
};

export type GenerateAITextResult = {
  success: boolean;
  text: string;
  provider: AIProviderName | string;
  model: string;
  error?: string;
  estimatedCost?: number;
};

export type AIProviderConfig = {
  provider: AIProviderName | string;
  model: string;
  configured: boolean;
  error: string;
  routing?: Record<string, string>;
};

export type ProviderGenerateInput = GenerateAITextInput & {
  model: string;
  modelRole: AIModelRole;
};

export interface AITextProvider {
  name: AIProviderName;
  generateText(input: ProviderGenerateInput): Promise<GenerateAITextResult>;
}

export const INR_PER_USD = 83;

export function estimateCostInr(input: GenerateAITextInput, usdPerThousandTokens: number) {
  const charCount = input.systemPrompt.length + input.userPrompt.length + (input.maxTokens ?? 1800) * 4;
  const estimatedTokens = Math.ceil(charCount / 4);
  return Number(((estimatedTokens / 1000) * usdPerThousandTokens * INR_PER_USD).toFixed(2));
}
