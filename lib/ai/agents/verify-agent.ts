import { runJsonAgent } from "@/lib/ai/agents/helpers";
import { getResearchPack } from "@/lib/db/research";

export type VerifyAgentOutput = {
  verificationStatus: string;
  riskLevel: string;
  unsafeClaims: string[];
  saferWording: string[];
  sourceGaps: string[];
  publishRecommendation: string;
};

export async function runVerifyAgent(input: { researchPackId?: string; researchPack?: unknown }) {
  const researchPack = input.researchPack ?? (input.researchPackId ? await getResearchPack(input.researchPackId) : null);

  if (!researchPack) {
    throw new Error("Verify AI needs a research pack.");
  }

  const { data, estimatedCost, provider, model } = await runJsonAgent<VerifyAgentOutput>({
    agentName: "CWI Verify Shield",
    taskName: "Verify Agent",
    payload: researchPack,
    instruction: `
Review the research pack for accuracy, safety, legal risk, attribution, wording, and source gaps.
Label claims as Verified, Source-backed, Reported, Developing, Opinion, Satire/Context, Unverified, or Risky.
Return exactly:
verificationStatus, riskLevel, unsafeClaims, saferWording, sourceGaps, publishRecommendation.
Never recommend public publishing without human review.
    `.trim()
  });

  return {
    verificationStatus: data.verificationStatus || "Developing",
    riskLevel: data.riskLevel || "Medium",
    unsafeClaims: Array.isArray(data.unsafeClaims) ? data.unsafeClaims : [],
    saferWording: Array.isArray(data.saferWording) ? data.saferWording : [],
    sourceGaps: Array.isArray(data.sourceGaps) ? data.sourceGaps : [],
    publishRecommendation: data.publishRecommendation || "Human review required before publication.",
    _meta: { estimatedCost, provider, model }
  };
}
