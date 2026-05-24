import { getUnansweredFile } from "@/data/unanswered-files";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const file = getUnansweredFile(slug);

  if (!file) {
    return new Response("Not found", { status: 404 });
  }

  const titleLines = wrapText(file.title, 24, 3);
  const issueLines = wrapText(file.mainIssue, 62, 3);
  const palette = paletteFor(file.category);
  const titleTspans = titleLines
    .map((line, index) => `<tspan x="70" dy="${index === 0 ? 0 : 54}">${escapeXml(line)}</tspan>`)
    .join("");
  const issueTspans = issueLines
    .map((line, index) => `<tspan x="70" dy="${index === 0 ? 0 : 28}">${escapeXml(line)}</tspan>`)
    .join("");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="750" viewBox="0 0 1200 750" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(`CWI editorial visual for ${file.title}`)}">
  <rect width="1200" height="750" fill="#071123"/>
  <rect width="1200" height="750" fill="url(#grid)" opacity="0.28"/>
  <circle cx="1010" cy="112" r="260" fill="${palette.glow}" opacity="0.40"/>
  <circle cx="160" cy="654" r="260" fill="#0B5CFF" opacity="0.24"/>
  <path d="M790 80h310v310H790z" stroke="${palette.accent}" stroke-width="2" stroke-dasharray="12 16" opacity="0.72"/>
  <path d="M854 174c72-66 167-39 184 40 19 88-56 154-137 119-75-32-94-112-47-159Z" fill="${palette.accent}" opacity="0.16" stroke="${palette.accent}" stroke-width="5"/>
  <path d="M897 247h97M946 198v97" stroke="#FFD23F" stroke-width="7" stroke-linecap="round" opacity="0.95"/>
  <rect x="70" y="62" width="430" height="46" rx="23" fill="#FFFFFF" opacity="0.94"/>
  <text x="94" y="92" fill="#0B5CFF" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" letter-spacing="4">INDIA'S UNANSWERED FILES / CWI</text>
  <text x="70" y="228" fill="#FFFFFF" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="58" font-weight="900" letter-spacing="-2">${titleTspans}</text>
  <text x="70" y="456" fill="#DCE8FF" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700">${issueTspans}</text>
  <rect x="70" y="586" width="250" height="48" rx="24" fill="${palette.accent}"/>
  <text x="92" y="617" fill="#071123" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" letter-spacing="3">${escapeXml(file.status.toUpperCase())}</text>
  <rect x="342" y="586" width="248" height="48" rx="24" fill="#FFFFFF" opacity="0.92"/>
  <text x="365" y="617" fill="#071123" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" letter-spacing="3">${escapeXml(file.location.toUpperCase().slice(0, 26))}</text>
  <text x="70" y="690" fill="#93A4BD" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="800" letter-spacing="3">DOCUMENT. VERIFY. AMPLIFY. / EDITORIAL VISUAL, NOT INCIDENT PHOTO</text>
  <defs>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" stroke="#FFFFFF" stroke-opacity="0.22"/>
    </pattern>
  </defs>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}

function wrapText(value: string, maxLength: number, maxLines: number) {
  const words = value.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) {
    lines.push(current);
  }

  return lines.slice(0, maxLines);
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function paletteFor(category: string) {
  if (/ecology|tribal|federalism/i.test(category)) {
    return { accent: "#00C2A8", glow: "#00C2A8" };
  }

  if (/violence|detention|justice|demolitions/i.test(category)) {
    return { accent: "#FF6B35", glow: "#FF6B35" };
  }

  if (/students|farmers|gender/i.test(category)) {
    return { accent: "#FFD23F", glow: "#FFD23F" };
  }

  return { accent: "#0B5CFF", glow: "#0B5CFF" };
}
