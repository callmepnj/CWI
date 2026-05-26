import { asText, runJsonAgent } from "@/lib/ai/agents/helpers";
import { normalizeContentDestination, type ContentDestination } from "@/lib/ai/content-destination";
import { getArticleDraft } from "@/lib/db/articles";
import { site } from "@/lib/site";

export type SocialAgentOutput = {
  instagramCaption: string;
  facebookCaption: string;
  xCaption: string;
  redditTitle: string;
  redditBody: string;
  youtubeTitle: string;
  youtubeDescription: string;
  blueskyCaption: string;
  discordMessage: string;
  hashtags: string[];
};

export async function runSocialAgent(input: { articleDraftId?: string; articleDraft?: unknown; topic?: string; contentDestination?: ContentDestination }) {
  const articleDraft = input.articleDraft ?? (input.articleDraftId ? await getArticleDraft(input.articleDraftId) : null);
  const contentDestination = normalizeContentDestination(
    input.contentDestination || (articleDraft as { content_destination?: string } | null)?.content_destination
  );
  const topic = asText((articleDraft as { title?: string } | null)?.title, input.topic || "CWI Watch Desk update");
  const publicPath = contentDestination === "live_newsroom" ? "/live-newsroom" : "/watch-desk";
  const destinationName = contentDestination === "live_newsroom" ? "CWI Live Newsroom" : "CWI Watch Desk";

  const { data, estimatedCost, provider, model } = await runJsonAgent<SocialAgentOutput>({
    agentName: "CWI Signal Studio",
    taskName: "Social Agent",
    payload: { articleDraft, topic, contentDestination, publicPath },
    instruction: `
Create approval-ready social captions for this CWI topic.
No claim should be overstated. Include source/creator credit reminders where relevant.
Return exactly: instagramCaption, facebookCaption, xCaption, redditTitle, redditBody, youtubeTitle, youtubeDescription, blueskyCaption, discordMessage, hashtags.
When destination is live_newsroom, include the CWI Live Newsroom URL line: ${site.url}${publicPath}.
Use the ending "Document. Verify. Amplify. The youth are not silent. India is watching. Website: ${site.url}" where suitable.
    `.trim()
  });

  return {
    instagramCaption: asText(data.instagramCaption, `${topic}\n\nDocument. Verify. Amplify.\n${destinationName}: ${site.url}${publicPath}`),
    facebookCaption: asText(data.facebookCaption, `${topic}\n\nCockroach Watch India is tracking this with context.\n${site.url}${publicPath}`),
    xCaption: asText(data.xCaption, `${topic}\n${destinationName}: ${site.url}${publicPath}`),
    redditTitle: asText(data.redditTitle, `${topic} - what verified context should CWI add?`),
    redditBody: asText(data.redditBody, `CWI is looking for verified source context on ${topic}.`),
    youtubeTitle: asText(data.youtubeTitle, `${topic} | ${destinationName}`),
    youtubeDescription: asText(data.youtubeDescription, `Source-backed civic context from Cockroach Watch India. ${site.url}${publicPath}`),
    blueskyCaption: asText(data.blueskyCaption, `${topic} - CWI is tracking this with context. ${site.url}${publicPath}`),
    discordMessage: asText(data.discordMessage, `CWI update queued for review: ${topic}`),
    hashtags: Array.isArray(data.hashtags) ? data.hashtags : ["#CockroachWatchIndia", "#CWI", "#DocumentVerifyAmplify"],
    _meta: { estimatedCost, provider, model }
  };
}
