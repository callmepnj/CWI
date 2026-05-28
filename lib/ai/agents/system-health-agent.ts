import { promises as fs } from "node:fs";
import path from "node:path";
import { getAIProviderConfig } from "@/lib/ai/model-provider";
import { getPool } from "@/lib/db";
import { ensureAdminDatabase, getDayCostInr, getMonthCostInr } from "@/lib/db/admin";
import { saveSystemHealthLog } from "@/lib/db/system-health";
import { site } from "@/lib/site";

type ScanSeverity = "Critical" | "High" | "Medium" | "Low";

type StaticIssue = {
  severity: ScanSeverity;
  page: string;
  issue: string;
};

export async function runSystemHealthAgent() {
  const aiProvider = getAIProviderConfig();
  let databaseStatus = "connected";
  let pendingApprovals = 0;
  let failedTasks = 0;
  let dailyUsage = 0;
  let monthlyUsage = 0;

  try {
    await ensureAdminDatabase();
    const [approvals, tasks, day, month] = await Promise.all([
      getPool().query(`select count(*)::int as count from approval_queue where status = 'waiting_for_approval';`),
      getPool().query(`select count(*)::int as count from agent_tasks where status = 'failed';`),
      getDayCostInr(),
      getMonthCostInr()
    ]);
    pendingApprovals = approvals.rows[0]?.count ?? 0;
    failedTasks = tasks.rows[0]?.count ?? 0;
    dailyUsage = day;
    monthlyUsage = month;
  } catch {
    databaseStatus = "connection failed";
  }

  const root = process.cwd();
  const scanIssues = await scanStaticIssues(root).catch((error) => [
    { severity: "High" as const, page: "system-health", issue: error instanceof Error ? error.message : "Static scan failed." }
  ]);
  const oldUrlHits = scanIssues.filter((issue) => /old route|preview URL|local development|Watch Desk|Watch More|Read Watch/i.test(issue.issue));
  const sitemapStatus = await checkEndpoint(`${site.url}/sitemap.xml`);
  const robotsStatus = await checkEndpoint(`${site.url}/robots.txt`);
  const websiteStatus = await checkEndpoint(site.url);

  if (databaseStatus === "connected") {
    await saveSystemHealthLog({
      websiteStatus,
      databaseStatus,
      sitemapStatus,
      robotsStatus,
      oldUrlCheck: oldUrlHits.length ? `${oldUrlHits.length} old URL or legacy text references found` : "no old production URL references found",
      brokenLinks: countIssues(scanIssues, "broken link"),
      missingMetadata: countIssues(scanIssues, "missing metadata"),
      missingAltText: countIssues(scanIssues, "missing alt"),
      failedTasks,
      pendingApprovals,
      issueDetails: scanIssues.slice(0, 80)
    }).catch(() => undefined);
  }

  return {
    websiteStatus,
    databaseStatus,
    sitemapStatus,
    robotsStatus,
    aiProvider: {
      provider: aiProvider.provider,
      model: aiProvider.model,
      configured: aiProvider.configured,
      error: aiProvider.error
    },
    oldUrlCheck: oldUrlHits.length ? "warning" : "ok",
    oldUrlHits,
    scanIssues,
    issueCounts: {
      Critical: scanIssues.filter((issue) => issue.severity === "Critical").length,
      High: scanIssues.filter((issue) => issue.severity === "High").length,
      Medium: scanIssues.filter((issue) => issue.severity === "Medium").length,
      Low: scanIssues.filter((issue) => issue.severity === "Low").length
    },
    failedTasks,
    pendingApprovals,
    dailyUsageInr: dailyUsage,
    monthlyUsageInr: monthlyUsage,
    budgetWarnings: {
      dailyWarning: dailyUsage >= 200,
      dailyHardWarning: dailyUsage >= 250,
      monthlyWarning: monthlyUsage >= 8000 * 0.8
    }
  };
}

async function checkEndpoint(url: string) {
  try {
    const response = await fetch(url, { method: "HEAD", cache: "no-store" });
    return response.ok ? "ok" : `http ${response.status}`;
  } catch {
    return "unreachable";
  }
}

function countIssues(issues: StaticIssue[], fragment: string) {
  const lower = fragment.toLowerCase();
  return issues.filter((issue) => issue.issue.toLowerCase().includes(lower)).length;
}

async function scanStaticIssues(root: string) {
  const issues: StaticIssue[] = [];
  const banned = [
    { value: "cwi-ten" + ".vercel.app", severity: "Critical" as const, issue: "Old Vercel preview URL is still present." },
    { value: "localhost" + ":3000", severity: "Critical" as const, issue: "Local development URL is still present in public code." },
    { value: "/watch-desk", severity: "High" as const, issue: "Old Watch Desk route link is still present." },
    { value: "Watch Desk", severity: "High" as const, issue: "Legacy Watch Desk wording is still present." },
    { value: "Watch More", severity: "High" as const, issue: "Legacy Watch More CTA is still present." },
    { value: "Read Watch Desk", severity: "High" as const, issue: "Legacy Read Watch Desk CTA is still present." },
    { value: "Supabase backend", severity: "High" as const, issue: "Public backend wording is still present." },
    { value: "mock mode", severity: "High" as const, issue: "Mock-mode wording is still present." },
    { value: "no real AI call", severity: "High" as const, issue: "Internal AI/debug wording is still present." },
    { value: "draft shell", severity: "Medium" as const, issue: "Draft-shell wording is still present." },
    { value: "AI generated placeholder", severity: "High" as const, issue: "AI-placeholder wording is still present." },
    { value: "fake source", severity: "High" as const, issue: "Fake-source wording is still present." },
    { value: "fake counter", severity: "High" as const, issue: "Fake-counter wording is still present." },
    { value: "fake donation", severity: "High" as const, issue: "Fake-donation wording is still present." }
  ];
  const ignored = new Set(["node_modules", ".next", ".git", "out"]);
  const textExtensions = /\.(ts|tsx|js|jsx|json|md|mjs|txt|xml|html)$/i;

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (ignored.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      if (!textExtensions.test(entry.name)) continue;
      if (entry.name === "AGENT_STATE.md") continue;
      const relative = path.relative(root, fullPath).replace(/\\/g, "/");
      if (relative === "lib/ai/agents/system-health-agent.ts") continue;
      const text = await fs.readFile(fullPath, "utf8").catch(() => "");
      for (const item of banned) {
        if (text.includes(item.value)) {
          issues.push({ severity: item.severity, page: relative, issue: item.issue });
        }
      }
    }
  }

  await walk(root);
  await scanCanonicalFiles(root, issues);
  await scanMainPageMetadata(root, issues);
  await scanLargeImages(root, issues);
  return issues;
}

async function scanCanonicalFiles(root: string, issues: StaticIssue[]) {
  const sitemap = await readText(path.join(root, "public", "sitemap.xml"));
  const robots = await readText(path.join(root, "public", "robots.txt"));
  if (!sitemap.includes(site.url)) issues.push({ severity: "Critical", page: "public/sitemap.xml", issue: "Missing canonical production domain in sitemap." });
  if (/watch-desk|localhost|cwi-ten|\/admin|\/drafts|\/test/i.test(sitemap)) {
    issues.push({ severity: "Critical", page: "public/sitemap.xml", issue: "Sitemap includes excluded, local, admin, draft, test, or legacy URLs." });
  }
  if (!robots.includes(`Sitemap: ${site.url}/sitemap.xml`)) {
    issues.push({ severity: "High", page: "public/robots.txt", issue: "Robots file does not point to the canonical sitemap." });
  }
  for (const route of ["/admin", "/api/admin", "/drafts", "/test"]) {
    if (!robots.includes(`Disallow: ${route}`)) {
      issues.push({ severity: "High", page: "public/robots.txt", issue: `Robots file is missing Disallow for ${route}.` });
    }
  }
}

async function scanMainPageMetadata(root: string, issues: StaticIssue[]) {
  const pages = [
    "app/page.tsx",
    "app/live-newsroom/page.tsx",
    "app/archive/page.tsx",
    "app/unanswered-files/page.tsx",
    "app/submit/page.tsx",
    "app/support/page.tsx",
    "app/about/page.tsx",
    "app/editorial-policy/page.tsx",
    "app/corrections/page.tsx",
    "app/contact/page.tsx",
    "app/credit-policy/page.tsx",
    "app/privacy-policy/page.tsx",
    "app/terms/page.tsx"
  ];
  for (const file of pages) {
    const text = await readText(path.join(root, file));
    if (!/export const metadata|generateMetadata|createMetadata\(/.test(text)) {
      issues.push({ severity: "High", page: file, issue: "Missing metadata export or createMetadata call." });
    }
    if (!/Cwi|Live Newsroom|Archive|Submit|Support|Corrections/.test(text)) {
      issues.push({ severity: "Low", page: file, issue: "Page may not be using the CWI newsroom UI language." });
    }
  }
}

async function scanLargeImages(root: string, issues: StaticIssue[]) {
  const publicDir = path.join(root, "public");
  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      if (!/\.(png|jpe?g)$/i.test(entry.name)) continue;
      const stat = await fs.stat(fullPath).catch(() => undefined);
      if (stat && stat.size > 1_500_000) {
        issues.push({ severity: "Low", page: path.relative(root, fullPath).replace(/\\/g, "/"), issue: "Large image should be compressed or converted to WebP/AVIF." });
      }
    }
  }
  await walk(publicDir);
}

async function readText(file: string) {
  return fs.readFile(file, "utf8").catch(() => "");
}