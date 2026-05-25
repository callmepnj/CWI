import { promises as fs } from "node:fs";
import path from "node:path";
import { getAIProviderConfig } from "@/lib/ai/model-provider";
import { getPool } from "@/lib/db";
import { ensureAdminDatabase, getDayCostInr, getMonthCostInr } from "@/lib/db/admin";
import { saveSystemHealthLog } from "@/lib/db/system-health";
import { site } from "@/lib/site";

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

  const oldUrlHits = await scanForOldUrls(process.cwd()).catch(() => []);
  const sitemapStatus = await checkEndpoint(`${site.url}/sitemap.xml`);
  const robotsStatus = await checkEndpoint(`${site.url}/robots.txt`);
  const websiteStatus = await checkEndpoint(site.url);

  if (databaseStatus === "connected") {
    await saveSystemHealthLog({
      websiteStatus,
      databaseStatus,
      sitemapStatus,
      robotsStatus,
      oldUrlCheck: oldUrlHits.length ? `${oldUrlHits.length} old URL references found` : "no old production URL references found",
      failedTasks,
      pendingApprovals
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

async function scanForOldUrls(root: string) {
  const banned = ["cwi-ten" + ".vercel.app", "localhost" + ":3000"];
  const ignored = new Set(["node_modules", ".next", ".git", "out"]);
  const hits: string[] = [];

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (ignored.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      if (!/\.(ts|tsx|js|jsx|json|md|mjs|txt|xml|html)$/i.test(entry.name)) continue;
      if (entry.name === "AGENT_STATE.md") continue;
      const text = await fs.readFile(fullPath, "utf8").catch(() => "");
      for (const value of banned) {
        if (text.includes(value)) {
          hits.push(path.relative(root, fullPath));
          break;
        }
      }
    }
  }

  await walk(root);
  return hits;
}
