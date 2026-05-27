import { requireAdminApi, ok, fail } from "@/lib/ai/admin-api";
import { assessAiishness } from "@/lib/ai/aiishness";
import { posts } from "@/data/posts";
import { unansweredFiles } from "@/data/unanswered-files";
import { getLiveNewsroomFallbackItems, getPublishedLiveNewsroomItems } from "@/lib/db/live-newsroom";
import { saveAiishnessReport } from "@/lib/db/news-intelligence";
import { site } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const unauthorized = requireAdminApi(request);
  if (unauthorized) return unauthorized;

  try {
    const liveItems = await getPublishedLiveNewsroomItems(40).catch(() => getLiveNewsroomFallbackItems(40));
    const publicSamples = [
      ...liveItems.map((item) => ({
        contentType: "live_newsroom_item",
        contentId: item.id,
        pageUrl: `${site.url}/live-newsroom/${item.slug}`,
        title: item.title,
        text: [
          item.summary,
          item.whatChanged,
          item.whatHappened,
          item.whatWeKnow,
          item.whatWeDontKnow.join("\n"),
          item.whatRemainsUnclear,
          item.body.flatMap((section) => [section.heading, ...section.paragraphs]).join("\n")
        ].join("\n\n")
      })),
      ...posts.slice(0, 16).map((post) => ({
        contentType: "archive_item",
        contentId: post.slug,
        pageUrl: `${site.url}/archive/${post.slug}`,
        title: post.title,
        text: [post.summary, post.content.join("\n"), post.sections.flatMap((section) => [section.heading, ...section.paragraphs]).join("\n")].join("\n\n")
      })),
      ...unansweredFiles.slice(0, 18).map((file) => ({
        contentType: "india_unanswered_file",
        contentId: file.slug,
        pageUrl: `${site.url}/india-unanswered-files/${file.slug}`,
        title: file.title,
        text: [file.summary, file.groundReality, file.unansweredQuestion, file.sections.map((section) => `${section.heading}\n${section.body}`).join("\n")].join("\n\n")
      })),
      {
        contentType: "homepage_copy",
        contentId: "home",
        pageUrl: site.url,
        title: "Cockroach Watch India - CWI",
        text: "Independent civic watch, satire, and commentary platform tracking youth voice, public issues, creator credit, and verified public records."
      }
    ];

    const reports = publicSamples.map((sample) => assessAiishness(sample));
    let saved = 0;
    for (const report of reports) {
      await saveAiishnessReport(report)
        .then(() => {
          saved += 1;
        })
        .catch(() => undefined);
    }

    return ok(
      {
        reports,
        saved,
        blocked: reports.filter((report) => report.score > 60).length,
        needsReview: reports.filter((report) => report.score >= 41 && report.score <= 60).length
      },
      "AI-ishness scan completed."
    );
  } catch (error) {
    return fail(error);
  }
}
