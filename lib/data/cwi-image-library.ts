export type CwiImageUse = "heroImage" | "thumbnailImage" | "ogImage" | "fallback" | "social" | "publicAdvisory";

export interface CwiImageLibraryItem {
  id: string;
  title: string;
  slug: string;
  filePath: string;
  heroPath?: string;
  thumbnailPath?: string;
  ogPath?: string;
  category: string;
  tags: string[];
  altText: string;
  credit: string;
  recommendedUse: CwiImageUse[];
  createdAt: string;
}

const generatedHero = "/images/cwi/generated/hero";
const generatedThumb = "/images/cwi/generated/thumbnails";
const generatedOg = "/images/cwi/generated/og";

export const cwiImageLibrary: CwiImageLibraryItem[] = [
  {
    id: "cwi-student-justice-paper-leak",
    title: "CWI Student Justice Paper Leak Graphic",
    slug: "cwi-student-justice-paper-leak",
    filePath: `${generatedHero}/cwi-student-justice-paper-leak-hd.jpg`,
    thumbnailPath: `${generatedThumb}/cwi-student-justice-paper-leak-hd.jpg`,
    ogPath: `${generatedOg}/cwi-student-justice-paper-leak-hd.jpg`,
    category: "Live Newsroom",
    tags: ["student justice", "paper leak", "NTA", "NEET", "exam accountability"],
    altText: "CWI Live Newsroom graphic about student justice and paper leak accountability",
    credit: "CWI Original Graphic",
    recommendedUse: ["heroImage", "thumbnailImage", "ogImage"],
    createdAt: "2026-06"
  },
  {
    id: "cwi-neet-june-21-security-audit",
    title: "CWI NEET June 21 Security Audit Graphic",
    slug: "cwi-neet-june-21-security-audit",
    filePath: `${generatedHero}/cwi-neet-cancelled-hall-ticket-hd.jpg`,
    thumbnailPath: `${generatedThumb}/cwi-neet-cancelled-hall-ticket-hd.jpg`,
    ogPath: `${generatedOg}/cwi-neet-cancelled-hall-ticket-hd.jpg`,
    category: "Live Newsroom",
    tags: ["NEET", "NTA", "security audit", "re-exam", "paper leak"],
    altText: "CWI Live Newsroom graphic representing NEET re-exam security and NTA accountability",
    credit: "CWI Original Graphic",
    recommendedUse: ["heroImage", "thumbnailImage", "ogImage"],
    createdAt: "2026-06"
  },
  {
    id: "cwi-jantar-mantar-student-protest",
    title: "CWI Jantar Mantar Student Protest Graphic",
    slug: "cwi-jantar-mantar-student-protest",
    filePath: `${generatedHero}/cwi-jantar-mantar-student-protest-hd.jpg`,
    thumbnailPath: `${generatedThumb}/cwi-jantar-mantar-student-protest-hd.jpg`,
    ogPath: `${generatedOg}/cwi-jantar-mantar-student-protest-hd.jpg`,
    category: "Live Newsroom",
    tags: ["Delhi", "Jantar Mantar", "student protest", "public assembly", "CJP"],
    altText: "CWI Live Newsroom graphic showing student protest and public accountability at Jantar Mantar",
    credit: "CWI Original Graphic",
    recommendedUse: ["heroImage", "thumbnailImage", "ogImage"],
    createdAt: "2026-06"
  },
  {
    id: "cwi-cockroach-wave-youth-protest",
    title: "CWI Cockroach Wave Youth Protest Graphic",
    slug: "cwi-cockroach-wave-youth-protest",
    filePath: `${generatedHero}/cwi-cockroach-wave-masks-hd.jpg`,
    thumbnailPath: `${generatedThumb}/cwi-cockroach-wave-masks-hd.jpg`,
    ogPath: `${generatedOg}/cwi-cockroach-wave-masks-hd.jpg`,
    category: "Live Newsroom",
    tags: ["cockroach wave", "youth voice", "student protest", "CJP", "movement"],
    altText: "CWI graphic representing the cockroach wave, youth voice, and student protest accountability",
    credit: "CWI Original Graphic",
    recommendedUse: ["heroImage", "thumbnailImage", "ogImage"],
    createdAt: "2026-06"
  },
  {
    id: "cwi-cockroach-janta-party-mascot",
    title: "CWI Cockroach Janta Party Mascot Graphic",
    slug: "cwi-cockroach-janta-party-mascot",
    filePath: `${generatedHero}/cwi-cockroach-janta-party-podium-hd.jpg`,
    thumbnailPath: `${generatedThumb}/cwi-cockroach-janta-party-podium-hd.jpg`,
    ogPath: `${generatedOg}/cwi-cockroach-janta-party-podium-hd.jpg`,
    category: "Live Newsroom",
    tags: ["CJP", "Cockroach Janta Party", "cockroach wave", "youth politics", "satire"],
    altText: "CWI original graphic for Cockroach Janta Party and youth-led civic satire",
    credit: "CWI Original Graphic",
    recommendedUse: ["heroImage", "thumbnailImage", "ogImage", "social"],
    createdAt: "2026-06"
  },
  {
    id: "cwi-bengaluru-freedom-park-protest",
    title: "CWI Bengaluru Freedom Park Protest Graphic",
    slug: "cwi-bengaluru-freedom-park-protest",
    filePath: `${generatedHero}/cwi-bengaluru-rain-protest-hd.jpg`,
    thumbnailPath: `${generatedThumb}/cwi-bengaluru-rain-protest-hd.jpg`,
    ogPath: `${generatedOg}/cwi-bengaluru-rain-protest-hd.jpg`,
    category: "Live Newsroom",
    tags: ["Bengaluru", "Freedom Park", "student protest", "regional mobilisation"],
    altText: "CWI graphic about Bengaluru Freedom Park civic protest and student mobilisation",
    credit: "CWI Original Graphic",
    recommendedUse: ["heroImage", "thumbnailImage", "ogImage"],
    createdAt: "2026-06"
  },
  {
    id: "cwi-amritsar-golden-gate-protest",
    title: "CWI Amritsar Golden Gate Protest Graphic",
    slug: "cwi-amritsar-golden-gate-protest",
    filePath: `${generatedHero}/cwi-amritsar-golden-gate-protest-hd.jpg`,
    thumbnailPath: `${generatedThumb}/cwi-amritsar-golden-gate-protest-hd.jpg`,
    ogPath: `${generatedOg}/cwi-amritsar-golden-gate-protest-hd.jpg`,
    category: "Live Newsroom",
    tags: ["Amritsar", "Punjab", "student protest", "regional mobilisation"],
    altText: "CWI graphic about Amritsar civic mobilisation and student justice",
    credit: "CWI Original Graphic",
    recommendedUse: ["heroImage", "thumbnailImage", "ogImage"],
    createdAt: "2026-06"
  },
  {
    id: "cwi-night-rallies-student-movement",
    title: "CWI Night Rallies Student Movement Graphic",
    slug: "cwi-night-rallies-student-movement",
    filePath: `${generatedHero}/cwi-night-rally-student-lights-hd.jpg`,
    thumbnailPath: `${generatedThumb}/cwi-night-rally-student-lights-hd.jpg`,
    ogPath: `${generatedOg}/cwi-night-rally-student-lights-hd.jpg`,
    category: "Live Newsroom",
    tags: ["student movement", "night rally", "national mobilisation", "youth voice"],
    altText: "CWI graphic showing a night rally for student movement and public accountability",
    credit: "CWI Original Graphic",
    recommendedUse: ["heroImage", "thumbnailImage", "ogImage"],
    createdAt: "2026-06"
  },
  {
    id: "cwi-police-standoff-public-safety",
    title: "CWI Police Standoff Public Safety Graphic",
    slug: "cwi-police-standoff-public-safety",
    filePath: `${generatedHero}/cwi-justice-watch-investigation.jpg`,
    thumbnailPath: `${generatedThumb}/cwi-justice-watch-investigation.jpg`,
    ogPath: `${generatedOg}/cwi-justice-watch-investigation.jpg`,
    category: "Public Advisory",
    tags: ["public safety", "police", "legal watch", "protest advisory", "verification"],
    altText: "CWI public advisory graphic about protest safety, verification, and legal caution",
    credit: "CWI Original Graphic",
    recommendedUse: ["heroImage", "thumbnailImage", "ogImage", "publicAdvisory"],
    createdAt: "2026-06"
  },
  {
    id: "cwi-public-advisory-delhi-protest",
    title: "CWI Public Advisory Delhi Protest Graphic",
    slug: "cwi-public-advisory-delhi-protest",
    filePath: `${generatedHero}/cwi-public-advisory-verify-before-sharing-hd.jpg`,
    thumbnailPath: `${generatedThumb}/cwi-public-advisory-verify-before-sharing-hd.jpg`,
    ogPath: `${generatedOg}/cwi-public-advisory-verify-before-sharing-hd.jpg`,
    category: "Public Advisory",
    tags: ["Delhi", "public advisory", "protest", "verify before sharing", "safety"],
    altText: "Cockroach Watch India public advisory graphic about verifying protest updates before sharing",
    credit: "CWI Original Graphic",
    recommendedUse: ["heroImage", "thumbnailImage", "ogImage", "publicAdvisory"],
    createdAt: "2026-06"
  },
  {
    id: "cwi-digital-rights-account-restriction",
    title: "CWI Digital Rights Account Restriction Graphic",
    slug: "cwi-digital-rights-account-restriction",
    filePath: `${generatedHero}/cwi-digital-rights-blocked-account-hd.jpg`,
    thumbnailPath: `${generatedThumb}/cwi-digital-rights-blocked-account-hd.jpg`,
    ogPath: `${generatedOg}/cwi-digital-rights-blocked-account-hd.jpg`,
    category: "Live Newsroom",
    tags: ["digital rights", "account restriction", "platform", "geoblock", "public memory"],
    altText: "CWI graphic representing digital rights, account restrictions, and public accountability",
    credit: "CWI Original Graphic",
    recommendedUse: ["heroImage", "thumbnailImage", "ogImage"],
    createdAt: "2026-06"
  },
  {
    id: "cwi-live-newsroom-fallback",
    title: "CWI Live Newsroom Fallback Graphic",
    slug: "cwi-live-newsroom-fallback",
    filePath: `${generatedHero}/cwi-newsroom-timeline-cards-hd.jpg`,
    thumbnailPath: `${generatedThumb}/cwi-newsroom-timeline-cards-hd.jpg`,
    ogPath: `${generatedOg}/cwi-newsroom-timeline-cards-hd.jpg`,
    category: "Live Newsroom",
    tags: ["CWI", "Live Newsroom", "public memory", "fallback"],
    altText: "CWI graphic representing youth voice, public accountability, and India's unanswered questions",
    credit: "CWI Original Graphic",
    recommendedUse: ["heroImage", "thumbnailImage", "ogImage", "fallback", "social"],
    createdAt: "2026-06"
  },
  {
    id: "cwi-bharat-tiwari-case-explained",
    title: "CWI Bharat Tiwari Case Explained Graphic",
    slug: "cwi-bharat-tiwari-case-explained",
    filePath: `${generatedHero}/cwi-bharat-tiwari-case-explained.jpg`,
    thumbnailPath: `${generatedThumb}/cwi-bharat-tiwari-case-explained.jpg`,
    ogPath: `${generatedOg}/cwi-bharat-tiwari-case-explained.jpg`,
    category: "Live Newsroom",
    tags: ["Bharat Tiwari", "encounter case", "public accountability", "justice watch", "Bhojpur"],
    altText: "CWI Live Newsroom graphic explaining the Bharat Tiwari encounter case, family allegations, police version, and unanswered questions",
    credit: "CWI Original Graphic",
    recommendedUse: ["heroImage", "thumbnailImage", "ogImage"],
    createdAt: "2026-06"
  },
  {
    id: "cwi-cjp-june-20-jantar-mantar",
    title: "CWI CJP June 20 Jantar Mantar Protest Graphic",
    slug: "cwi-cjp-june-20-jantar-mantar",
    filePath: `${generatedHero}/cwi-jantar-mantar-youth-protest-hd.jpg`,
    thumbnailPath: `${generatedThumb}/cwi-jantar-mantar-youth-protest-hd.jpg`,
    ogPath: `${generatedOg}/cwi-jantar-mantar-youth-protest-hd.jpg`,
    category: "Live Newsroom",
    tags: ["CJP", "Jantar Mantar", "June 20", "student protest", "NEET"],
    altText: "CWI Live Newsroom graphic showing youth protest at Jantar Mantar for exam accountability",
    credit: "CWI Original Graphic",
    recommendedUse: ["heroImage", "thumbnailImage", "ogImage"],
    createdAt: "2026-06"
  },
  {
    id: "cwi-india-unanswered-files-hd",
    title: "CWI India Unanswered Files Graphic",
    slug: "cwi-india-unanswered-files-hd",
    filePath: `${generatedHero}/cwi-india-unanswered-files-hd.jpg`,
    thumbnailPath: `${generatedThumb}/cwi-india-unanswered-files-hd.jpg`,
    ogPath: `${generatedOg}/cwi-india-unanswered-files-hd.jpg`,
    category: "India Unanswered Files",
    tags: ["India Unanswered Files", "archive", "public memory", "source trail"],
    altText: "CWI graphic representing India Unanswered Files and public memory archives",
    credit: "CWI Original Graphic",
    recommendedUse: ["heroImage", "thumbnailImage", "ogImage", "fallback"],
    createdAt: "2026-06"
  }
];

export const cwiFallbackNewsroomImage = cwiImageLibrary.find((image) => image.slug === "cwi-live-newsroom-fallback")!;

export function getCwiImageBySlug(slug: string) {
  return cwiImageLibrary.find((image) => image.slug === slug);
}

export function resolveCwiNewsroomImage(slug: string, category: string, title: string): CwiImageLibraryItem {
  const haystack = `${slug} ${category} ${title}`.toLowerCase();

  if (haystack.includes("bharat tiwari") || haystack.includes("bharat-tiwari") || haystack.includes("bhojpur") || haystack.includes("encounter case")) return getCwiImageBySlug("cwi-bharat-tiwari-case-explained") ?? cwiFallbackNewsroomImage;
  if (haystack.includes("june 20") || haystack.includes("thali") || haystack.includes("chamach")) return getCwiImageBySlug("cwi-cjp-june-20-jantar-mantar") ?? cwiFallbackNewsroomImage;
  if (haystack.includes("bengaluru")) return getCwiImageBySlug("cwi-bengaluru-freedom-park-protest") ?? cwiFallbackNewsroomImage;
  if (haystack.includes("amritsar") || haystack.includes("punjab")) return getCwiImageBySlug("cwi-amritsar-golden-gate-protest") ?? cwiFallbackNewsroomImage;
  if (haystack.includes("jantar") || haystack.includes("delhi assembly") || haystack.includes("june 6")) return getCwiImageBySlug("cwi-jantar-mantar-student-protest") ?? cwiFallbackNewsroomImage;
  if (haystack.includes("pune") || haystack.includes("lucknow") || haystack.includes("regional") || haystack.includes("national mobilisation")) return getCwiImageBySlug("cwi-night-rallies-student-movement") ?? cwiFallbackNewsroomImage;
  if (haystack.includes("digital") || haystack.includes("platform") || haystack.includes("withheld") || haystack.includes("account") || haystack.includes("geoblock")) return getCwiImageBySlug("cwi-digital-rights-account-restriction") ?? cwiFallbackNewsroomImage;
  if (haystack.includes("safety") || haystack.includes("police") || haystack.includes("legal watch") || haystack.includes("advisory")) return getCwiImageBySlug("cwi-public-advisory-delhi-protest") ?? cwiFallbackNewsroomImage;
  if (haystack.includes("neet") || haystack.includes("nta") || haystack.includes("paper leak") || haystack.includes("cbse") || haystack.includes("cuet") || haystack.includes("ssc") || haystack.includes("exam")) return getCwiImageBySlug("cwi-student-justice-paper-leak") ?? cwiFallbackNewsroomImage;
  if (haystack.includes("cjp") || haystack.includes("cockroach janta party") || haystack.includes("mascot")) return getCwiImageBySlug("cwi-cockroach-janta-party-mascot") ?? cwiFallbackNewsroomImage;
  if (haystack.includes("cockroach") || haystack.includes("youth")) return getCwiImageBySlug("cwi-cockroach-wave-youth-protest") ?? cwiFallbackNewsroomImage;

  return cwiFallbackNewsroomImage;
}
