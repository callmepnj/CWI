import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getAdminDashboardData } from "@/lib/cwi-admin-os";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const data = await getAdminDashboardData({ force: url.searchParams.get("force") === "1" });
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("CWI admin dashboard failed", error);
    return NextResponse.json(
      {
        ok: true,
        degraded: true,
        error: "Database connection failed. Check DATABASE_URL in .env.local or Vercel. Admin shell is loaded in setup mode.",
        data: buildSetupModeDashboard()
      },
      { status: 200 }
    );
  }
}

function buildSetupModeDashboard() {
  return {
    budget: {
      monthlyCapInr: 8000,
      dailyCapInr: 250,
      estimatedMonthlyCost: 0,
      safeMode: false
    },
    counts: {
      totalArticles: 0,
      pendingApprovals: 0,
      reportsReceived: 0,
      researchPacksReady: 0,
      articlesReady: 0,
      seoPacksReady: 0,
      socialPacksReady: 0,
      uiuxIssuesFound: 0
    },
    agents: [],
    approvals: [],
    researchPacks: [],
    articleDrafts: [],
    seoPacks: [],
    socialPacks: [],
    uiuxAudits: [
      {
        id: "database-setup",
        page: "Admin OS",
        issue: "Database connection failed.",
        severity: "High",
        suggested_text: "Update DATABASE_URL in .env.local and restart the dev server.",
        fix_status: "Setup Required"
      }
    ],
    manualLinks: [],
    sources: [],
    keywords: [],
    dailyBriefings: [],
    health: {
      website_status: "local admin shell online",
      database_status: "connection failed",
      sitemap_status: "not checked",
      robots_status: "not checked",
      old_url_check: "not checked",
      pending_approvals: 0,
      daily_ai_usage_inr: 0,
      monthly_budget_usage_inr: 0,
      failed_tasks: 1
    },
    reports: [],
    comments: [],
    latestPublicArticles: [],
    latestUnansweredFiles: []
  };
}
