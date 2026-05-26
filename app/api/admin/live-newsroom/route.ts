import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getAdminDashboardData } from "@/lib/cwi-admin-os";
import { getLiveNewsroomFallbackItems, getPublishedLiveNewsroomItems } from "@/lib/db/live-newsroom";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 401 });
  }

  try {
    const [dashboard, publishedItems] = await Promise.all([
      getAdminDashboardData({ force: true }),
      getPublishedLiveNewsroomItems(80).catch(() => [])
    ]);
    const fallbackItems = getLiveNewsroomFallbackItems(80);
    const liveApprovals = dashboard.approvals.filter((item) => item.content_destination === "live_newsroom");

    return NextResponse.json({
      ok: true,
      data: {
        overview: {
          totalLiveNewsroomItems: publishedItems.length + fallbackItems.length,
          waitingApprovals: liveApprovals.filter((item) => item.status === "waiting_for_approval").length,
          developingUpdates: [...publishedItems, ...fallbackItems].filter((item) => item.verificationStatus === "Developing").length,
          sourceBackedReports: [...publishedItems, ...fallbackItems].filter((item) => ["Verified", "Source-backed"].includes(item.verificationStatus)).length
        },
        publishedItems,
        fallbackItems,
        approvals: liveApprovals,
        researchPacks: dashboard.researchPacks.filter((item) => item.content_destination === "live_newsroom"),
        verificationReports: dashboard.verificationReports.filter((item) => item.content_destination === "live_newsroom"),
        articleDrafts: dashboard.articleDrafts.filter((item) => item.content_destination === "live_newsroom"),
        seoPacks: dashboard.seoPacks.filter((item) => item.content_destination === "live_newsroom"),
        socialPacks: dashboard.socialPacks.filter((item) => item.content_destination === "live_newsroom"),
        imageLibrary: dashboard.imageLibrary.filter((item) => item.content_destination === "live_newsroom"),
        health: dashboard.health,
        budget: dashboard.budget
      }
    });
  } catch (error) {
    console.error("CWI admin live newsroom failed", error);
    return NextResponse.json({
      ok: true,
      degraded: true,
      error: "Live Newsroom admin data is in setup mode. Check DATABASE_URL before running DB-backed agent workflows.",
      data: {
        overview: {
          totalLiveNewsroomItems: getLiveNewsroomFallbackItems(80).length,
          waitingApprovals: 0,
          developingUpdates: 0,
          sourceBackedReports: getLiveNewsroomFallbackItems(80).filter((item) => ["Verified", "Source-backed"].includes(item.verificationStatus)).length
        },
        publishedItems: [],
        fallbackItems: getLiveNewsroomFallbackItems(80),
        approvals: [],
        researchPacks: [],
        verificationReports: [],
        articleDrafts: [],
        seoPacks: [],
        socialPacks: [],
        imageLibrary: []
      }
    });
  }
}
