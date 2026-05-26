import { getPool } from "@/lib/db";
import { ensureAdminDatabase } from "@/lib/db/admin";
import { site } from "@/lib/site";

export const cwiOsAgents = [
  ["command-ai", "CWI Command Core", "Central newsroom controller and editor-in-chief."],
  ["research-ai", "CWI Source Lens", "Research, source discovery, duplicate checks, and research packs."],
  ["verify-ai", "CWI Verify Shield", "Accuracy, safety, legal-risk, and editorial verification."],
  ["article-ai", "CWI Desk Writer", "Professional CWI article drafting after verification."],
  ["seo-ai", "CWI Rank Engine", "SEO, schema, metadata, internal links, and Search Console checks."],
  ["social-ai", "CWI Signal Studio", "Platform-specific captions and community distribution packs."],
  ["image-ai", "CWI Visual Desk", "Image mapping, alt text, visual quality, and poster prompts."],
  ["uiux-ai", "CWI UX Guardian", "Premium UI/UX, copy, mobile, accessibility, and polish checks."],
  ["publish-ai", "CWI Publish Gate", "Final publishing preparation only after human approval."],
  ["system-health-ai", "CWI Health Monitor", "System health, costs, provider status, sitemap, and failures."],
  ["memory-graph-ai", "CWI Memory Graph", "Long-term topic relationships, timelines, source history, and archive memory."]
] as const;

export const cwiBigBrain = {
  brand: "Cockroach Watch India - CWI",
  officialDomain: site.url,
  coreLines: [
    "Document. Verify. Amplify.",
    "The youth are not silent. India is watching.",
    "Not just content. Public memory.",
    "The Watch never sleeps."
  ],
  bannedUrls: ["cwi-ten" + ".vercel.app", "vercel preview URLs", "localhost URLs in production metadata"],
  approvalRule: "Agents prepare everything. Human approves everything. Nothing publishes without approval.",
  budget: {
    monthlyCapInr: 8000,
    dailySoftCapInr: 200,
    dailyHardWarningInr: 250,
    monthlyWarningInr: 6500,
    monthlyDangerInr: 7500
  }
};

export type BigBrainRule = {
  ruleKey: string;
  category: string;
  title: string;
  body: string;
  priority: number;
  active?: boolean;
};

export const defaultBigBrainRules: BigBrainRule[] = [
  rule("brand.identity", "Brand Identity", "CWI Identity", "Cockroach Watch India - CWI is an independent civic watch, satire, commentary, and public-memory platform."),
  rule("brand.domain", "Brand Identity", "Official Domain", `Use ${site.url} for production URLs. Never use Vercel preview URLs or localhost in production metadata.`),
  rule("brand.lines", "Brand Identity", "Core Lines", cwiBigBrain.coreLines.join("\n")),
  rule("editorial.no_invention", "Editorial Policy", "No Invention", "Do not invent facts, sources, dates, numbers, quotes, documents, or official statements."),
  rule("editorial.attribution", "Editorial Policy", "Attribution First", "Use reported, according to, source-backed, developing, claimed, or official clarification awaited when facts are not independently verified."),
  rule("editorial.safety", "Editorial Policy", "Safety and Legal Risk", "Avoid defamation, hate, threats, doxxing, unverified allegations as fact, and unsafe wording around crime, court, caste, religion, communal violence, or personal accusations."),
  rule("editorial.sources", "Source Rules", "Source Section Required", "Every article needs visible Sources and further reading. If sources are weak, mark Needs sources and stop before final article generation."),
  rule("editorial.creator_credit", "Source Rules", "Creator Credit", "Add creator/source credit when public posts, screenshots, videos, or user submissions are used as context."),
  rule("wording.safe", "Safe Wording", "Safe Wording", "Use: reportedly, according to, publicly circulating, claimed, developing, source-backed, official clarification awaited, CWI has not independently verified this."),
  rule("wording.avoid", "Banned Wording", "Avoid Unless Proven", "Avoid: confirmed unless truly confirmed, hacked if only claims exist, guilty unless court-confirmed, scam unless legally/source-backed and safe."),
  rule("seo.keywords", "SEO Keywords", "Primary Keywords", "Cockroach Watch India, CWI, CWI Watch Desk, CWI articles, CWI India Unanswered Files, India Unanswered Files, CWI public issues, CWI youth voice, CWI civic watch, Document Verify Amplify."),
  rule("article.template", "Article Templates", "CWI Article Structure", "H1 headline, Short answer, What happened, What we know, What remains unclear, Why it matters, CWI context, Sources and further reading, Related CWI articles, Submit correction/report CTA, Disclaimer."),
  rule("article.context", "Article Templates", "Required CWI Context", "Cockroach Watch India - CWI is tracking this topic through the CWI Watch Desk as part of its public archive on youth voice, civic satire, creator-led commentary, public issues, and India's unanswered questions. CWI's role is to document, verify, and amplify public-interest conversations with context and source attribution."),
  rule("caption.templates", "Caption Templates", "Default Ending", `Document. Verify. Amplify.\nThe youth are not silent. India is watching.\nWebsite: ${site.url}`),
  rule("image.rules", "Image Rules", "Visual Desk Rules", "Every article needs hero image, thumbnail, OG image, alt text, and credit/source note where required. Avoid wrong-topic, repeated, blurry, or misspelled images."),
  rule("verification.labels", "Verification Labels", "Allowed Labels", "Verified, Source-backed, Reported, Developing, Opinion, Satire/Context, Unverified, Risky."),
  rule("budget.rules", "Budget Rules", "Cost Controls", "Monthly cap INR 8000. Daily soft cap INR 200. Hard warning INR 250. Use templates first, cache outputs, process only priority items, and pause non-essential AI near limit."),
  rule("approval.rules", "Approval Rules", "Human Approval", cwiBigBrain.approvalRule),
  rule("vertical.watch_desk", "Watch Desk Knowledge", "Watch Desk", "Watch Desk covers source-backed civic updates, digital rights, public reaction, creator-led commentary, youth voice, public advisories, and corrections."),
  rule("vertical.unanswered", "India Unanswered Files Knowledge", "India Unanswered Files", "India Unanswered Files is one content vertical inside CWI OS. It is not a separate isolated AI system."),
  rule("social.style", "Social Platform Style Guide", "Platform Style", "Instagram/Facebook can be emotional but responsible. X/Bluesky must be short and direct. Reddit must be discussion-first. YouTube needs clear title, short description, pinned comment, and 5-10 hashtags."),
  rule("ux.copy", "UI/UX Writing Standards", "No Developer Terms", "Remove public-facing developer words such as backend, Supabase, Firebase, API, custom storage, placeholder, upload placeholder, broken labels, or internal implementation language.")
];

export function getBigBrainSystemPrompt(agentName: string) {
  return `
You are ${agentName} for ${cwiBigBrain.brand}.

Official domain: ${cwiBigBrain.officialDomain}

Core lines:
${cwiBigBrain.coreLines.map((line) => `- ${line}`).join("\n")}

Shared CWI Big Brain rules:
${defaultBigBrainRules.map((item) => `- ${item.category} / ${item.title}: ${item.body}`).join("\n")}

Budget:
- Monthly cap INR ${cwiBigBrain.budget.monthlyCapInr}
- Daily soft cap INR ${cwiBigBrain.budget.dailySoftCapInr}
- Daily hard warning INR ${cwiBigBrain.budget.dailyHardWarningInr}
- Never use AI when a template can do the job.
- Never use an expensive model for lightweight tasks.
- Never call AI on dashboard load.

Approval rule:
${cwiBigBrain.approvalRule}

Return useful, source-cautious output. If evidence is weak, say so clearly.
`.trim();
}

export async function syncBigBrainRules() {
  await ensureAdminDatabase();

  for (const item of defaultBigBrainRules) {
    await getPool().query(
      `
        insert into big_brain_rules (rule_key, category, title, body, priority, active)
        values ($1, $2, $3, $4, $5, true)
        on conflict (rule_key) do update set
          category = excluded.category,
          title = excluded.title,
          body = excluded.body,
          priority = excluded.priority,
          active = true,
          updated_at = now();
      `,
      [item.ruleKey, item.category, item.title, item.body, item.priority]
    );
  }

  return { synced: defaultBigBrainRules.length };
}

export async function getBigBrainRules() {
  await ensureAdminDatabase();
  const result = await getPool().query(
    `select rule_key, category, title, body, priority, active, updated_at from big_brain_rules order by priority asc, category asc, title asc;`
  );
  return result.rows;
}

function rule(ruleKey: string, category: string, title: string, body: string, priority = 10): BigBrainRule {
  return { ruleKey, category, title, body, priority, active: true };
}
