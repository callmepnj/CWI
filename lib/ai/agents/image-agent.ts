import { getFileVisual, unansweredFiles } from "@/data/unanswered-files";
import { normalizeContentDestination, type ContentDestination } from "@/lib/ai/content-destination";
import { getPool } from "@/lib/db";

export type ImageAgentOutput = {
  heroImage: string;
  thumbnailImage: string;
  ogImage: string;
  socialImage: string;
  altText: string;
  imageNotes: string;
  imagePackId?: string;
};

export async function runImageAgent(input: { topic?: string; articleDraftId?: string; contentDestination?: ContentDestination }) {
  const topic = input.topic || "CWI Live Newsroom update";
  const contentDestination = normalizeContentDestination(input.contentDestination);
  const file =
    unansweredFiles.find((item) => topic.toLowerCase().includes(item.title.toLowerCase().split(" ")[0])) ||
    unansweredFiles.find((item) => item.heroImage) ||
    unansweredFiles[0];
  const visual = getFileVisual(file);

  const output: ImageAgentOutput = {
    heroImage: visual.src,
    thumbnailImage: file.thumbnailImage || visual.src,
    ogImage: file.ogImage || visual.src,
    socialImage: file.socialImages?.[0] || visual.src,
    altText: `Cockroach Watch India CWI visual for ${topic}.`,
    imageNotes: "Template image mapping only. Human review required before final publishing. Check spelling, logo consistency, dimensions, compression, and safe civic framing."
  };

  const result = await getPool().query<{ id: string }>(
    `
      insert into image_library (topic, section, content_destination, image_type, path, alt_text, credit, source_url, quality_status, approval_status, metadata)
      values ($1, 'CWI AI OS', $2, 'hero/thumbnail/og/social candidate', $3, $4, $5, $6, 'Needs human review', 'Image Ready', $7)
      returning id;
    `,
    [
      topic,
      contentDestination,
      output.heroImage,
      output.altText,
      visual.credit,
      visual.sourceUrl,
      JSON.stringify(output)
    ]
  );

  return { ...output, imagePackId: result.rows[0].id, _meta: { estimatedCost: 0, provider: "template", model: "image-library" } };
}
