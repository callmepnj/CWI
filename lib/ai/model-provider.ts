export {
  generateAIText,
  getAIProviderConfig,
  inferModelRole,
  selectModel,
  shouldPreferTemplate
} from "@/lib/ai/model-router";

export type { AIModelRole, GenerateAITextInput, GenerateAITextResult } from "@/lib/ai/model-router";
