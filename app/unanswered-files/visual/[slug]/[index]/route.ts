import { getUnansweredFile, getVisualBrief } from "@/data/unanswered-files";

type Props = {
  params: Promise<{ slug: string; index: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { slug, index } = await params;
  const file = getUnansweredFile(slug);
  const visualIndex = Math.max(0, Number.parseInt(index, 10) - 1);

  if (!file || Number.isNaN(visualIndex)) {
    return new Response("Not found", { status: 404 });
  }

  const visual = getVisualBrief(file, visualIndex);
  const palette = paletteFor(file.category, visualIndex);
  const titleTspans = wrapText(file.title, 23, 3)
    .map((line, lineIndex) => `<tspan x="70" dy="${lineIndex === 0 ? 0 : 52}">${escapeXml(line)}</tspan>`)
    .join("");
  const briefTspans = wrapText(visual.brief, 56, 3)
    .map((line, lineIndex) => `<tspan x="70" dy="${lineIndex === 0 ? 0 : 30}">${escapeXml(line)}</tspan>`)
    .join("");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="750" viewBox="0 0 1200 750" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(visual.alt)}">
  <rect width="1200" height="750" fill="#071123"/>
  <rect width="1200" height="750" fill="url(#grid)" opacity="0.22"/>
  <circle cx="1020" cy="96" r="290" fill="${palette.glow}" opacity="0.38"/>
  <circle cx="180" cy="655" r="255" fill="#0B5CFF" opacity="0.20"/>
  <path d="${shapePath(visualIndex)}" fill="${palette.accent}" opacity="0.16" stroke="${palette.accent}" stroke-width="5"/>
  <path d="M790 88h330v330H790z" stroke="${palette.accent}" stroke-width="2" stroke-dasharray="12 16" opacity="0.72"/>
  <path d="M828 356c92-126 210-176 278-258" stroke="#FFD23F" stroke-width="7" stroke-linecap="round" opacity="0.75"/>
  <circle cx="914" cy="236" r="${64 + visualIndex * 3}" fill="none" stroke="#FFFFFF" stroke-opacity="0.48" stroke-width="3" stroke-dasharray="8 14"/>
  <rect x="70" y="62" width="455" height="46" rx="23" fill="#FFFFFF" opacity="0.94"/>
  <text x="94" y="92" fill="#0B5CFF" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" letter-spacing="4">CWI IMAGE RESEARCH BOARD</text>
  <text x="70" y="224" fill="#FFFFFF" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="56" font-weight="900" letter-spacing="-2">${titleTspans}</text>
  <text x="70" y="450" fill="#DCE8FF" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="800">${briefTspans}</text>
  <rect x="70" y="586" width="260" height="48" rx="24" fill="${palette.accent}"/>
  <text x="94" y="617" fill="#071123" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" letter-spacing="3">${escapeXml(file.status.toUpperCase())}</text>
  <rect x="350" y="586" width="310" height="48" rx="24" fill="#FFFFFF" opacity="0.92"/>
  <text x="374" y="617" fill="#071123" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" letter-spacing="3">${escapeXml(file.category.toUpperCase().slice(0, 28))}</text>
  <text x="70" y="690" fill="#93A4BD" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="800" letter-spacing="3">IMAGE-PACK BRIEF ${visualIndex + 1} / EDITORIAL VISUAL, NOT INCIDENT PHOTO</text>
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

function paletteFor(category: string, index: number) {
  const palettes = [
    { accent: "#0B5CFF", glow: "#0B5CFF" },
    { accent: "#FFD23F", glow: "#FFD23F" },
    { accent: "#00C2A8", glow: "#00C2A8" },
    { accent: "#FF6B35", glow: "#FF6B35" }
  ];

  if (/ecology|tribal|forest|fisherfolk/i.test(category)) {
    return palettes[(index + 2) % palettes.length];
  }

  if (/violence|detention|justice|demolitions/i.test(category)) {
    return palettes[(index + 3) % palettes.length];
  }

  return palettes[index % palettes.length];
}

function shapePath(index: number) {
  const paths = [
    "M860 174c72-66 167-39 184 40 19 88-56 154-137 119-75-32-94-112-47-159Z",
    "M828 136c84-42 223 2 235 102 12 101-112 169-205 107-90-60-117-166-30-209Z",
    "M850 121c90 16 166 60 177 145 10 78-45 143-130 137-86-6-136-67-140-142-4-79 31-151 93-140Z",
    "M902 104c104 10 164 82 146 177-20 106-140 136-213 71-73-65-51-169 67-248Z"
  ];

  return paths[index % paths.length];
}
