import { getFileVisual, unansweredFiles } from "@/data/unanswered-files";
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

export async function runImageAgent(input: { topic?: string; articleDraftId?: string }) {
  const topic = input.topic || "CWI Watch Desk update";
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
    imageNotes: "Template image mapping only. Human review required before final publishing."
  };

  const result = await getPool().query<{ id: string }>(
    `
      insert into image_library (topic, section, image_type, path, alt_text, credit, source_url, quality_status, approval_status, metadata)
      values ($1, 'CWI AI OS', 'hero/thumbnail/og/social candidate', $2, $3, $4, $5, 'Needs human review', 'Image Ready', $6)
      returning id;
    `,
    [
      topic,
      output.heroImage,
      output.altText,
      visual.credit,
      visual.sourceUrl,
      JSON.stringify(output)
    ]
  );

  return { ...output, imagePackId: result.rows[0].id, _meta: { estimatedCost: 0, provider: "template", model: "image-library" } };
}
