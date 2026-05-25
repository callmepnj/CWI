import { getPool } from "@/lib/db";
import { ensureAdminDatabase } from "@/lib/db/admin";
import { optionalUuid } from "@/lib/db/ids";
import { getResearchPack } from "@/lib/db/research";
import { getVerificationReport } from "@/lib/db/articles";

export type VerificationGate = {
  topic: string;
  status: "passed" | "needs_review" | "blocked";
  canDraft: boolean;
  confidenceScore: number;
  sourceCount: number;
  officialSourceAvailable: boolean;
  riskyClaims: string[];
  missingDates: string[];
  contradictions: string[];
  legalRisk: "Low" | "Medium" | "High";
  checks: Record<string, unknown>;
};

export async function runVerificationGate(input: { researchPackId: string; verificationReportId?: string }) {
  const researchPackId = optionalUuid(input.researchPackId);
  if (!researchPackId) {
    throw new Error("Verification gate needs a valid researchPackId.");
  }

  const researchPack = await getResearchPack(researchPackId);
  if (!researchPack) {
    throw new Error("Verification gate could not find the research pack.");
  }

  const verificationReport = input.verificationReportId ? await getVerificationReport(input.verificationReportId) : null;
  const gate = buildGate(researchPack as Record<string, unknown>, (verificationReport ?? {}) as Record<string, unknown>);
  await saveVerificationGate({ ...gate, researchPackId, verificationReportId: input.verificationReportId });
  return gate;
}

export async function assertArticleDraftAllowed(input: { researchPackId: string; verificationReportId?: string }) {
  const gate = await runVerificationGate(input);
  if (!gate.canDraft) {
    throw new Error(
      `Article AI blocked by verification gate: ${gate.status}. Confidence ${gate.confidenceScore}/100. Fix source gaps first: ${[
        ...gate.missingDates,
        ...gate.riskyClaims,
        ...gate.contradictions
      ]
        .slice(0, 4)
        .join("; ")}`
    );
  }

  return gate;
}

function buildGate(researchPack: Record<string, unknown>, verificationReport: Record<string, unknown>): VerificationGate {
  const topic = clean(researchPack.topic) || "CWI research topic";
  const sources = sourceList(researchPack.source_list ?? researchPack.sources);
  const sourceCount = Number(researchPack.source_count ?? researchPack.sourceCount ?? sources.length);
  const sourceUrls = sources.map((source) => clean(source.url ?? source.sourceUrl)).filter(Boolean);
  const officialSourceAvailable = sources.some(isOfficialSource);
  const missingDates = sources
    .map((source, index) => (!clean(source.date) ? `Source ${index + 1} has no visible date: ${clean(source.title ?? source.name ?? source.url) || "Untitled source"}` : ""))
    .filter(Boolean);
  const riskyClaims = [
    ...textArray(researchPack.risks ?? researchPack.riskNotes),
    ...textArray(verificationReport.unsafe_claims ?? verificationReport.unsafeClaims)
  ].filter(Boolean);
  const contradictions = findContradictions(researchPack);
  const legalRisk = legalRiskFor(researchPack, verificationReport, riskyClaims);
  const confidenceScore = scoreGate({
    sourceCount,
    sourceUrls,
    officialSourceAvailable,
    missingDates,
    riskyClaims,
    contradictions,
    legalRisk
  });
  const fatalGaps = [
    sourceCount <= 0 ? "No source count is attached." : "",
    sourceUrls.length <= 0 ? "No source URL is attached." : "",
    legalRisk === "High" && sourceCount < 2 ? "High-risk topic needs at least two sources." : "",
    contradictions.length > 0 && sourceCount < 3 ? "Contradictions need additional source review." : ""
  ].filter(Boolean);
  const canDraft = fatalGaps.length === 0 && confidenceScore >= 45;

  return {
    topic,
    status: canDraft ? (confidenceScore >= 70 ? "passed" : "needs_review") : "blocked",
    canDraft,
    confidenceScore,
    sourceCount,
    officialSourceAvailable,
    riskyClaims,
    missingDates,
    contradictions,
    legalRisk,
    checks: {
      sourceUrls,
      fatalGaps,
      verificationStatus: clean(verificationReport.verification_status ?? verificationReport.verificationStatus),
      publishRecommendation: clean(verificationReport.publish_recommendation ?? verificationReport.publishRecommendation)
    }
  };
}

async function saveVerificationGate(input: VerificationGate & { researchPackId: string; verificationReportId?: string }) {
  await ensureAdminDatabase();
  await getPool().query(
    `
      insert into cwi_verification_gates (
        research_pack_id, verification_report_id, topic, status, can_draft, confidence_score,
        source_count, official_source_available, risky_claims, missing_dates,
        contradictions, legal_risk, checks
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
    `,
    [
      optionalUuid(input.researchPackId),
      optionalUuid(input.verificationReportId),
      input.topic,
      input.status,
      input.canDraft,
      input.confidenceScore,
      input.sourceCount,
      input.officialSourceAvailable,
      JSON.stringify(input.riskyClaims),
      JSON.stringify(input.missingDates),
      JSON.stringify(input.contradictions),
      input.legalRisk,
      JSON.stringify(input.checks)
    ]
  );
}

function scoreGate(input: {
  sourceCount: number;
  sourceUrls: string[];
  officialSourceAvailable: boolean;
  missingDates: string[];
  riskyClaims: string[];
  contradictions: string[];
  legalRisk: string;
}) {
  let score = 35;
  score += Math.min(30, input.sourceCount * 10);
  score += Math.min(15, input.sourceUrls.length * 5);
  if (input.officialSourceAvailable) score += 10;
  score -= Math.min(15, input.missingDates.length * 3);
  score -= Math.min(20, input.riskyClaims.length * 4);
  score -= Math.min(20, input.contradictions.length * 8);
  if (input.legalRisk === "High") score -= 12;
  if (input.legalRisk === "Low") score += 5;
  return clamp(score);
}

function findContradictions(researchPack: Record<string, unknown>) {
  const text = `${clean(researchPack.what_remains_unclear ?? researchPack.whatRemainsUnclear)} ${clean(researchPack.summary)}`.toLowerCase();
  const markers = ["contradict", "conflicting", "disputed", "different versions", "unclear"];
  return markers.filter((marker) => text.includes(marker)).map((marker) => `Research pack mentions ${marker}.`);
}

function legalRiskFor(researchPack: Record<string, unknown>, verificationReport: Record<string, unknown>, riskyClaims: string[]): "Low" | "Medium" | "High" {
  const joined = [
    researchPack.topic,
    researchPack.summary,
    researchPack.what_happened,
    researchPack.whatHappened,
    verificationReport.risk_level,
    verificationReport.riskLevel,
    ...riskyClaims
  ]
    .map(clean)
    .join(" ")
    .toLowerCase();

  if (/(rape|murder|terror|uapa|court|police|riot|communal|religion|caste|corruption|fraud|scam|accused|alleged)/.test(joined)) return "High";
  if (/(claim|leak|protest|detention|violence|reported|viral|unsafe)/.test(joined)) return "Medium";
  return "Low";
}

type SourceRecord = Record<string, unknown>;

function sourceList(value: unknown): SourceRecord[] {
  const parsed = parseMaybeJson(value);
  return Array.isArray(parsed) ? parsed.filter((item): item is SourceRecord => Boolean(item && typeof item === "object")) : [];
}

function isOfficialSource(source: SourceRecord) {
  const text = `${source.publisher ?? ""} ${source.outlet ?? ""} ${source.url ?? ""} ${source.title ?? ""}`.toLowerCase();
  return /(official|gov\.in|nic\.in|pib\.gov\.in|court|supreme court|parliament|election commission|police|press release)/.test(text);
}

function textArray(value: unknown) {
  const parsed = parseMaybeJson(value);
  if (Array.isArray(parsed)) return parsed.map((item) => clean(item)).filter(Boolean);
  return clean(parsed)
    .split(/\n+|;+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseMaybeJson(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}
