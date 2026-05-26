import { runJsonAgent } from "@/lib/ai/agents/helpers";
import { normalizeContentDestination, type ContentDestination } from "@/lib/ai/content-destination";

export type ResearchAgentInput = {
  topic: string;
  url?: string;
  platform?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  category?: string;
  contentDestination?: ContentDestination;
};

export type ResearchAgentOutput = {
  topic: string;
  summary: string;
  sources: Array<Record<string, unknown>>;
  sourceCount: number;
  whatHappened: string;
  whatWeKnow: string;
  whatRemainsUnclear: string;
  timeline: Array<Record<string, unknown>>;
  keyFacts: string[];
  riskNotes: string[];
  suggestedAngle: string;
  category?: string;
};

export async function runResearchAgent(input: ResearchAgentInput) {
  const contentDestination = normalizeContentDestination(input.contentDestination);
  const { data, estimatedCost, provider, model } = await runJsonAgent<ResearchAgentOutput>({
    agentName: "CWI Source Lens",
    taskName: "Research Agent",
    payload: { ...input, contentDestination },
    instruction: `
Extract a source-cautious CWI research pack from the supplied topic/link/context.
Do not invent sources, numbers, quotes, or facts.
If metadata is limited, say manual context is required.
Default content destination is live_newsroom unless the admin selected another destination.
Return exactly these fields:
topic, summary, sources, sourceCount, whatHappened, whatWeKnow, whatRemainsUnclear, timeline, keyFacts, riskNotes, suggestedAngle, category.
Sources must contain title, publisher/source, url, date if known, and reliability note.
    `.trim()
  });

  return {
    ...data,
    topic: data.topic || input.topic,
    sources: Array.isArray(data.sources) ? data.sources : [],
    sourceCount: Number(data.sourceCount ?? data.sources?.length ?? 0),
    timeline: Array.isArray(data.timeline) ? data.timeline : [],
    keyFacts: Array.isArray(data.keyFacts) ? data.keyFacts : [],
    riskNotes: Array.isArray(data.riskNotes) ? data.riskNotes : [],
    category: data.category || input.category || "Watch Desk",
    _meta: { estimatedCost, provider, model }
  };
}
