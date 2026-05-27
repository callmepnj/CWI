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
  primaryProduct: "CWI Live Newsroom",
  secondaryProduct: "India Unanswered Files inside Live Newsroom",
  archiveRole: "Older newsroom content is now the passive CWI Archive.",
  coreLines: [
    "Document. Verify. Amplify.",
    "The youth are not silent. India is watching.",
    "Not just content. Public memory.",
    "The Watch never sleeps."
  ],
  bannedUrls: ["cwi-ten" + ".vercel.app", "preview deployment URLs", "local development URLs in production metadata"],
  publicTrustBannedTerms: [
    "Mock mode active",
    "no real AI call",
    "draft shell",
    "Supabase backend",
    "AI OS approved draft",
    "generated placeholder",
    "fake source",
    "test article",
    "lorem ipsum",
    "backend connected",
    "API response",
    "debugging",
    "console output",
    "admin-only"
  ],
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
  rule("brand.identity", "Brand Identity", "CWI Identity", "Cockroach Watch India - CWI is an independent civic watch, satire, commentary, public archive, and youth voice platform."),
  rule("brand.independence", "Brand Identity", "Independent CWI", "CWI is not the official Cockroach Janta Party and is not affiliated with any political party unless officially declared."),
  rule("brand.domain", "Brand Identity", "Official Domain", `Use ${site.url} for production URLs. Never use preview deployment URLs or local development URLs in production metadata.`),
  rule("brand.lines", "Brand Identity", "Core Lines", cwiBigBrain.coreLines.join("\n")),
  rule("product.primary", "Product Direction", "Primary Product", "CWI Live Newsroom is the main product. All active AI workflows default to live_newsroom."),
  rule("product.archive", "Product Direction", "Archive Is Passive", "Older newsroom content is now CWI Archive. Archive stays useful for history and SEO, but agents must not create fresh archive-first content."),
  rule("editorial.no_invention", "Editorial Policy", "No Invention", "Do not invent facts, sources, dates, numbers, quotes, documents, or official statements."),
  rule("editorial.attribution", "Editorial Policy", "Attribution First", "Use reported, according to, source-backed, developing, claimed, or official clarification awaited when facts are not independently verified."),
  rule("editorial.safety", "Editorial Policy", "Safety and Legal Risk", "Avoid defamation, hate, threats, doxxing, unverified allegations as fact, and unsafe wording around crime, court, caste, religion, communal violence, or personal accusations."),
  rule("editorial.sources", "Source Rules", "Source Section Required", "Every article needs visible Sources and further reading. If sources are weak, mark Needs sources and stop before final article generation."),
  rule("editorial.creator_credit", "Source Rules", "Creator Credit", "Add creator/source credit when public posts, screenshots, videos, or user submissions are used as context."),
  rule("wording.safe", "Safe Wording", "Safe Wording", "Use: reportedly, according to, publicly circulating, claimed, developing, source-backed, official clarification awaited, CWI has not independently verified this."),
  rule("wording.avoid", "Banned Wording", "Avoid Unless Proven", "Avoid: confirmed unless truly confirmed, hacked if only claims exist, guilty unless court-confirmed, scam unless legally/source-backed and safe, expose, destroy, attack, target."),
  rule("public.trust_cleanup", "Banned Wording", "Public Trust Cleanup", "Never expose public-facing internal testing, storage, debug, placeholder, false-source, undefined, or null wording."),
  rule("seo.keywords", "SEO Keywords", "Primary Keywords", "Cockroach Watch India, CWI, CWI Live Newsroom, CWI Archive, CWI articles, CWI India Unanswered Files, India Unanswered Files, public advisories, civic news, youth voice."),
  rule("article.template", "Article Templates", "CWI Article Structure", "Status, title, one-line summary, dates, source count, Short answer, What changed, What happened, What CWI knows, What CWI does not know, Why it matters, Source trail, Timeline, Before you share, Correction CTA, Related updates, one disclaimer."),
  rule("article.human_style", "Article Templates", "Human Writing", "Start with what changed. Use dates and source names. Avoid repeated slogans, public social-caption blocks, keyword stuffing, generic why-it-matters paragraphs, and identical article openings."),
  rule("caption.templates", "Caption Templates", "Default Ending", `Document. Verify. Amplify.\nThe youth are not silent. India is watching.\nWebsite: ${site.url}`),
  rule("image.rules", "Image Rules", "Visual Desk Rules", "Every article needs hero image, thumbnail, OG image, alt text, and credit/source note where required. Avoid wrong-topic, repeated, blurry, or misspelled images."),
  rule("verification.labels", "Verification Labels", "Allowed Labels", "Verified, Source-backed, Reported, Developing, Opinion, Satire/Context, Unverified, Risky."),
  rule("budget.rules", "Budget Rules", "Cost Controls", "Monthly cap INR 8000. Daily soft cap INR 200. Hard warning INR 250. Use templates first, cache outputs, process only priority items, and pause non-essential AI near limit."),
  rule("approval.rules", "Approval Rules", "Human Approval", cwiBigBrain.approvalRule),
  rule("vertical.archive", "Archive Knowledge", "CWI Archive", "CWI Archive preserves older explainers, notes, and context posts. Current source-backed updates live in the CWI Live Newsroom."),
  rule("vertical.live_newsroom", "Live Newsroom Rules", "CWI Live Newsroom", "Live Newsroom is the default CWI OS destination. Existing agents must prepare source-backed updates for /live-newsroom unless the admin selects Public Advisory, India Unanswered Files, Social Only, or passive Archive migration."),
  rule("vertical.live_newsroom_seo", "Live Newsroom Rules", "Live Newsroom SEO", "Use /live-newsroom/[slug] canonical URLs, NewsArticle, BlogPosting, and BreadcrumbList schema for Live Newsroom detail pages."),
  rule("vertical.news_intelligence", "Live Newsroom Rules", "News Intelligence", "Track approved claims, source trails, timelines, advisories, corrections, what changed, and what CWI does not know. Do not auto-publish or claim breaking news without sources."),
  rule("quality.aiishness", "Approval Rules", "AI-ishness Gate", "If AI-ishness score is above 60, block publishing. If score is 41-60, require human review. Below 40 can continue through approval."),
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
