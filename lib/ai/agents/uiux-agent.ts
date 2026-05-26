import { runJsonAgent } from "@/lib/ai/agents/helpers";

export type UIUXAgentOutput = {
  page: string;
  issues: string[];
  severity: string;
  suggestedFixes: string[];
  correctedCopy: string[];
  approvalRequired: boolean;
};

export async function runUIUXAgent(input: { page: string; notes?: string }) {
  const { data, estimatedCost, provider, model } = await runJsonAgent<UIUXAgentOutput>({
    agentName: "CWI UX Guardian",
    taskName: "UI/UX Agent",
    payload: input,
    instruction: `
Audit the named CWI page for visible copy, mobile clarity, professional tone, broken UI risks, accessibility, and developer-facing wording.
Do not redesign the site. Prepare only a fix pack that requires approval.
Return exactly: page, issues, severity, suggestedFixes, correctedCopy, approvalRequired.
    `.trim()
  });

  return {
    page: data.page || input.page,
    issues: Array.isArray(data.issues) ? data.issues : [],
    severity: data.severity || "Medium",
    suggestedFixes: Array.isArray(data.suggestedFixes) ? data.suggestedFixes : [],
    correctedCopy: Array.isArray(data.correctedCopy) ? data.correctedCopy : [],
    approvalRequired: data.approvalRequired !== false,
    _meta: { estimatedCost, provider, model }
  };
}
