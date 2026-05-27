import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getAdminDashboardData } from "@/lib/cwi-admin-os";
import { getLiveNewsroomFallbackItems } from "@/lib/db/live-newsroom";

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
  const liveNewsroomFallbackItems = getLiveNewsroomFallbackItems(24);
  return {
    budget: {
      monthlyCapInr: 8000,
      dailyCapInr: 250,
      estimatedDailyCost: 0,
      estimatedMonthlyCost: 0,
      safeMode: false
    },
    ai: {
      provider: process.env.AI_PROVIDER || "not_configured",
      model: process.env.AI_MODEL || "not_configured",
      configured: false,
      productionReady: false,
      routing: {},
      message: "AI configuration was not checked because the database connection failed first."
    },
    counts: {
      totalArticles: 0,
      liveNewsroomItems: liveNewsroomFallbackItems.length,
      liveNewsroomApprovals: 0,
      pendingApprovals: 0,
      reportsReceived: 0,
      researchPacksReady: 0,
      articlesReady: 0,
      seoPacksReady: 0,
      socialPacksReady: 0,
      uiuxIssuesFound: 0,
      memoryNodes: 0,
      memoryGraphNodes: 0,
      bigBrainRules: 0,
      activeWorkflows: 0,
      trendRadarItems: 0,
      qualityReviews: 0,
      aiishnessReports: 0,
      newsIntelligenceItems: 0
    },
    agents: [],
    approvals: [],
    researchPacks: [],
    verificationReports: [],
    articleDrafts: [],
    seoPacks: [],
    socialPacks: [],
    imageLibrary: [],
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
    workflows: [],
    memoryNodes: [],
    memoryClaims: [],
    verificationGates: [],
    qualityScores: [],
    trendRadarItems: [],
    bigBrainRules: [],
    memoryGraphNodes: [],
    memoryGraphEdges: [],
    costUsageLogs: [],
    aiishnessReports: [],
    newsIntelligenceItems: [],
    latestPublicArticles: [],
    latestUnansweredFiles: [],
    liveNewsroomItems: [],
    liveNewsroomFallbackItems
  };
}
