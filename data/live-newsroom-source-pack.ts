import type { SourceType } from "@/data/live-newsroom";

export type SourcePackStatus = "source-backed" | "developing" | "needs-verification" | "advisory-source";

export type SourcePackRecord = {
  id: string;
  headline: string;
  slug: string;
  category: string;
  type: string;
  source: string;
  publishedDate: string;
  url: string;
  summaryBullets: string[];
  whatHappened: string;
  whatWeKnow: string;
  whatRemainsUnclear: string;
  verificationStatus: "Pending approval" | "Source-backed queue" | "Needs primary source";
  sourceCount: number;
  riskLevel: "Low" | "Medium" | "High";
  cwiRelevance: string;
  suggestedLiveNewsroomCategory: string;
  seoTitle: string;
  metaDescription: string;
  socialCaption: string;
  sourceType: SourceType;
  approvalStatus: "pending";
  draftPreview: string;
  seoPreview: {
    canonical: string;
    schemaTypes: string[];
    openGraphTitle: string;
    twitterCard: "summary_large_image";
  };
  socialPreview: Record<"instagram" | "facebook" | "x" | "reddit" | "youtubeShorts" | "bluesky" | "discord", string>;
  sourceGaps: string[];
  timeline: Array<{ date: string; event: string; source: string; verificationLabel: string }>;
};

const canonical = (slug: string) => `https://cockroachwatchindia.online/live-newsroom/${slug}`;

function socialPack(title: string, slug: string, safetyFirst = false) {
  const url = canonical(slug);
  const base = safetyFirst
    ? `Developing: CWI has prepared a public safety advisory for students. Verify official permissions before acting. This is not legal counsel or an endorsement. ${url}`
    : `${title}\n\nCWI is separating source-backed claims from what still needs verification. ${url}`;

  return {
    instagram: `${base}\n\nVerify before sharing. Source trail and unclear items stay visible in CWI Live Newsroom.`,
    facebook: `${base}\n\nRead the CWI Live Newsroom record and send corrections or official updates if you have them.`,
    x: safetyFirst
      ? "Developing: CWI has prepared a public safety advisory for students following reports of a planned June 6 Delhi assembly. Verify official permissions before acting. This is not legal counsel or an endorsement."
      : `${title} - source-backed CWI queue. What is known, unclear, and still awaiting primary verification.`,
    reddit: safetyFirst
      ? "CWI Public Advisory: What students should verify before any June 6 Delhi assembly\n\nThis discussion should focus on safety, official permission status, and source verification. This is not legal counsel or a call to assemble."
      : `${title}\n\nWhat sources should CWI add before publishing this Live Newsroom record?`,
    youtubeShorts: safetyFirst ? "June 6 Delhi Assembly: Safety First, Verify Before Sharing" : `${title} | CWI Live Newsroom`,
    bluesky: safetyFirst
      ? "Developing: CWI safety advisory prepared. Verify official permissions before acting. Not legal counsel or endorsement."
      : `${title} - CWI source-backed queue.`,
    discord: `${base}\n\nNext step: verify source gaps before approval.`
  };
}

export const cjpExamSourcePackRecords: SourcePackRecord[] = [
  {
    id: "sourcepack-cjp-student-protest-front-exam-crisis",
    headline: "CJP Moves From Meme Wave to Student Protest Front - CWI Live Newsroom",
    slug: "cjp-student-protest-front-exam-crisis",
    category: "CJP / Student Issues",
    type: "Live Newsroom Update",
    source: "CJP / CWI / Exam Crisis Research Pack",
    publishedDate: "2026-06-02",
    url: canonical("cjp-student-protest-front-exam-crisis"),
    summaryBullets: [
      "The attached source pack says CJP shifted from meme-led digital organizing toward student-exam advocacy.",
      "Media sources cited in the pack include Hindustan Times, India Today, The Telegraph, and PTC News reports dated June 1, 2026.",
      "The item should remain developing until CWI verifies primary campaign posts, official protest-permission records, and exam-system source documents."
    ],
    whatHappened: "The source pack frames CJP's NEET, CBSE, CUET, and SSC-GD campaign as a move from online satire into student-facing mobilization.",
    whatWeKnow: "The pack provides a media index and describes a June 6 Delhi return/protest plan attributed to Abhijeet Dipke.",
    whatRemainsUnclear: "CWI still needs primary campaign posts, official permission status, and independent source checks for each exam-system claim.",
    verificationStatus: "Source-backed queue",
    sourceCount: 4,
    riskLevel: "High",
    cwiRelevance: "Central to CWI's youth voice, exam accountability, public safety, and source-backed newsroom coverage.",
    suggestedLiveNewsroomCategory: "CJP / Student Issues",
    seoTitle: "CJP student protest front - CWI Live Newsroom | Cockroach Watch India",
    metaDescription: "Cockroach Watch India tracks CJP's reported shift toward student exam accountability protests, with source gaps and safety notes visible.",
    socialCaption: "CWI queue: CJP is reported to be moving from meme wave to student protest front. CWI is verifying sources before publication.",
    sourceType: "Established media",
    approvalStatus: "pending",
    draftPreview: "Short answer: CJP is reported to have moved its digital energy toward a student exam-accountability campaign, but CWI must keep protest logistics and legal claims developing until official records are verified.",
    seoPreview: { canonical: canonical("cjp-student-protest-front-exam-crisis"), schemaTypes: ["NewsArticle", "BlogPosting", "BreadcrumbList"], openGraphTitle: "CJP Moves From Meme Wave to Student Protest Front", twitterCard: "summary_large_image" },
    socialPreview: socialPack("CJP Moves From Meme Wave to Student Protest Front", "cjp-student-protest-front-exam-crisis"),
    sourceGaps: ["Primary CJP announcement links", "Official Delhi Police permission status", "Official NTA/CBSE/CUET/SSC figures for affected-student framing"],
    timeline: [{ date: "2026-06-01", event: "Media reports describe June 6 Delhi return/protest plan", source: "Attached research pack media index", verificationLabel: "Source-backed" }]
  },
  {
    id: "sourcepack-cjp-one-crore-student-claim-exam-crisis",
    headline: "The 1 Crore Student Claim: What CJP Says and What Needs Verification",
    slug: "cjp-one-crore-student-claim-exam-crisis",
    category: "Exam Accountability",
    type: "Source-backed Explainer",
    source: "CJP / CWI / Exam Crisis Research Pack",
    publishedDate: "2026-06-02",
    url: canonical("cjp-one-crore-student-claim-exam-crisis"),
    summaryBullets: ["The source pack attributes a 1 crore affected-student claim to CJP/media coverage.", "The proposed calculation combines NEET 22 lakh, CBSE 17 lakh, CUET 16 lakh, and SSC-GD 40 lakh.", "CWI should show this as a transparent calculation, not an independently final official count."],
    whatHappened: "CJP is reported to cite a large affected-student metric across four exam systems.",
    whatWeKnow: "The attached pack supplies the component numbers and media-source context, but not every official primary source URL.",
    whatRemainsUnclear: "CWI needs official exam registration/participation records and precise definitions of affected students for each exam system.",
    verificationStatus: "Needs primary source",
    sourceCount: 4,
    riskLevel: "High",
    cwiRelevance: "This is the core numerical claim CWI must verify carefully to avoid exaggeration.",
    suggestedLiveNewsroomCategory: "Exam Accountability",
    seoTitle: "The 1 crore student claim - CWI Live Newsroom | Cockroach Watch India",
    metaDescription: "CWI examines the reported CJP 1 crore student claim across NEET, CBSE, CUET, and SSC-GD, separating campaign claims from verified data.",
    socialCaption: "CWI queue: The 1 crore student claim needs transparent math and official-source checks before publication.",
    sourceType: "Established media",
    approvalStatus: "pending",
    draftPreview: "Short answer: The attached pack presents a 95 lakh to 1 crore calculation, but CWI should publish it only as a sourced campaign metric until official figures are attached.",
    seoPreview: { canonical: canonical("cjp-one-crore-student-claim-exam-crisis"), schemaTypes: ["NewsArticle", "BlogPosting", "BreadcrumbList"], openGraphTitle: "The 1 Crore Student Claim", twitterCard: "summary_large_image" },
    socialPreview: socialPack("The 1 Crore Student Claim", "cjp-one-crore-student-claim-exam-crisis"),
    sourceGaps: ["Official NEET/NTA count", "Official CBSE affected-student/evaluation issue record", "Official CUET disruption data", "Official SSC-GD candidate/backlog source"],
    timeline: [{ date: "2026-06-01", event: "Hindustan Times report cited petition and affected-student figures", source: "Hindustan Times via source pack", verificationLabel: "Reported" }]
  },
  {
    id: "sourcepack-abhijeet-dipke-june-6-delhi-protest",
    headline: "CJP Founder Abhijeet Dipke Announces June 6 Delhi Return for Protest",
    slug: "abhijeet-dipke-june-6-delhi-protest",
    category: "Developing / Public Advisory",
    type: "Developing Update",
    source: "CJP / CWI / Exam Crisis Research Pack",
    publishedDate: "2026-06-02",
    url: canonical("abhijeet-dipke-june-6-delhi-protest"),
    summaryBullets: ["The source pack says Dipke announced a June 6 Delhi arrival and protest-permission plan.", "India Today and The Telegraph are cited for the return/protest framing.", "CWI must avoid calling people to gather and must label permission status developing."],
    whatHappened: "Reports in the source pack describe Dipke's planned June 6 return to Delhi and stated intent to seek permission for a Jantar Mantar protest.",
    whatWeKnow: "The plan is attributed to media reporting and the attached source pack.",
    whatRemainsUnclear: "Police permission, airport crowd legality, exact route, crowd-control conditions, and safety arrangements remain unclear.",
    verificationStatus: "Source-backed queue",
    sourceCount: 3,
    riskLevel: "High",
    cwiRelevance: "This requires careful public-safety framing and legal-risk labelling.",
    suggestedLiveNewsroomCategory: "Public Advisory",
    seoTitle: "Abhijeet Dipke June 6 Delhi protest plan - CWI Live Newsroom | Cockroach Watch India",
    metaDescription: "CWI tracks reported June 6 Delhi protest plans involving CJP founder Abhijeet Dipke with permission and safety questions clearly marked developing.",
    socialCaption: "Developing: CWI is tracking reported June 6 Delhi protest plans. Verify official permission status before acting.",
    sourceType: "Established media",
    approvalStatus: "pending",
    draftPreview: "Short answer: The June 6 Delhi plan is reported, but CWI should not present any gathering as cleared or safe without official confirmation.",
    seoPreview: { canonical: canonical("abhijeet-dipke-june-6-delhi-protest"), schemaTypes: ["NewsArticle", "BlogPosting", "BreadcrumbList"], openGraphTitle: "Abhijeet Dipke June 6 Delhi Protest Plan", twitterCard: "summary_large_image" },
    socialPreview: socialPack("Abhijeet Dipke June 6 Delhi Protest Plan", "abhijeet-dipke-june-6-delhi-protest", true),
    sourceGaps: ["Delhi Police written permission", "Official restrictions around airport/Jantar Mantar", "Primary CJP announcement link"],
    timeline: [{ date: "2026-06-06", event: "Planned Delhi arrival / permission request", source: "Attached source pack", verificationLabel: "Developing" }]
  },
  {
    id: "sourcepack-neet-cbse-cuet-sscgd-exam-accountability",
    headline: "NEET, CBSE, CUET and SSC-GD: Why Students Are Demanding Accountability",
    slug: "neet-cbse-cuet-sscgd-exam-accountability",
    category: "Student Justice",
    type: "Explainer",
    source: "CJP / CWI / Exam Crisis Research Pack",
    publishedDate: "2026-06-02",
    url: canonical("neet-cbse-cuet-sscgd-exam-accountability"),
    summaryBullets: ["The source pack groups four exam systems under one accountability frame.", "The explainer should separate official records, media reporting, and campaign claims.", "CWI should not collapse distinct failures into one confirmed official scandal."],
    whatHappened: "CJP's campaign is reported to connect grievances around NEET, CBSE, CUET, and SSC-GD.",
    whatWeKnow: "The attached pack identifies the four systems and proposes a student-justice framing.",
    whatRemainsUnclear: "Each exam system needs its own official source trail, dates, affected-count basis, and institutional response record.",
    verificationStatus: "Needs primary source",
    sourceCount: 4,
    riskLevel: "Medium",
    cwiRelevance: "This is the broad context article linking student grievances to institutional accountability.",
    suggestedLiveNewsroomCategory: "Student Justice",
    seoTitle: "NEET CBSE CUET SSC-GD exam accountability - CWI Live Newsroom | Cockroach Watch India",
    metaDescription: "CWI explains why student accountability demands are being linked across NEET, CBSE, CUET, and SSC-GD while marking what still needs source verification.",
    socialCaption: "CWI queue: Four exam systems, one accountability debate. Each claim still needs its own source trail.",
    sourceType: "Established media",
    approvalStatus: "pending",
    draftPreview: "Short answer: Students are connecting several exam grievances, but CWI should keep each exam-system claim separately sourced and labelled.",
    seoPreview: { canonical: canonical("neet-cbse-cuet-sscgd-exam-accountability"), schemaTypes: ["NewsArticle", "BlogPosting", "BreadcrumbList"], openGraphTitle: "NEET, CBSE, CUET and SSC-GD Accountability", twitterCard: "summary_large_image" },
    socialPreview: socialPack("NEET, CBSE, CUET and SSC-GD Accountability", "neet-cbse-cuet-sscgd-exam-accountability"),
    sourceGaps: ["Official records for each exam system", "Institutional responses", "Precise affected-count methodology"],
    timeline: [{ date: "2026-05-30", event: "CUET disruption coverage appears in source pack timeline", source: "Attached source pack", verificationLabel: "Reported" }]
  },
  {
    id: "sourcepack-students-june-6-cjp-delhi-mobilization-legal-watch",
    headline: "What Students Should Know Before the June 6 CJP Delhi Mobilization",
    slug: "students-june-6-cjp-delhi-mobilization-legal-watch",
    category: "Public Advisory",
    type: "Legal/Safety Advisory",
    source: "CJP / CWI / Exam Crisis Research Pack",
    publishedDate: "2026-06-02",
    url: canonical("students-june-6-cjp-delhi-mobilization-legal-watch"),
    summaryBullets: ["The record should warn readers to verify permission status and official restrictions.", "Airport gathering and protest legality remain source gaps.", "CWI should avoid language that directs or organizes assembly."],
    whatHappened: "The source pack asks CWI to prepare a legal-watch advisory ahead of a reported June 6 Delhi mobilization.",
    whatWeKnow: "A safety-first advisory is appropriate because permission and crowd-control details remain developing.",
    whatRemainsUnclear: "Police permission, local restrictions, emergency legal-aid contacts, and airport security rules require official verification.",
    verificationStatus: "Needs primary source",
    sourceCount: 2,
    riskLevel: "High",
    cwiRelevance: "Prevents unsafe amplification while keeping civic-awareness context visible.",
    suggestedLiveNewsroomCategory: "Public Advisory",
    seoTitle: "Students June 6 CJP Delhi mobilization legal watch - CWI Live Newsroom | Cockroach Watch India",
    metaDescription: "CWI prepares a safety-first legal watch for students around reported June 6 CJP Delhi mobilization plans, with developing permission status.",
    socialCaption: "Safety first: verify official permission status before acting. CWI is not organizing or endorsing any assembly.",
    sourceType: "Established media",
    approvalStatus: "pending",
    draftPreview: "Short answer: Students should verify official permissions, avoid unsafe crowding, and treat all legal/safety details as developing until confirmed.",
    seoPreview: { canonical: canonical("students-june-6-cjp-delhi-mobilization-legal-watch"), schemaTypes: ["NewsArticle", "BlogPosting", "BreadcrumbList"], openGraphTitle: "June 6 CJP Delhi Mobilization Legal Watch", twitterCard: "summary_large_image" },
    socialPreview: socialPack("June 6 CJP Delhi Mobilization Legal Watch", "students-june-6-cjp-delhi-mobilization-legal-watch", true),
    sourceGaps: ["Delhi Police permission", "Section 144/local restrictions", "Airport terminal gathering rules", "Verified emergency legal-aid contacts"],
    timeline: [{ date: "2026-06-06", event: "Reported mobilization date", source: "Attached source pack", verificationLabel: "Developing" }]
  },
  {
    id: "sourcepack-june-6-delhi-assembly-cwi-public-safety-advisory",
    headline: "June 6 Delhi Assembly: CWI Public Safety and Legal Rights Advisory",
    slug: "june-6-delhi-assembly-cwi-public-safety-advisory",
    category: "Public Advisory",
    type: "Safety / Legal Rights Advisory",
    source: "CWI Public Advisory CWI-ADV-2026-004",
    publishedDate: "2026-06-02",
    url: canonical("june-6-delhi-assembly-cwi-public-safety-advisory"),
    summaryBullets: ["CWI-ADV-2026-004 is a developing public safety and legal-rights advisory.", "The advisory is not legal counsel, not a call to assemble, and not an endorsement of any political front.", "Formal Delhi Police clearance and legal-aid contacts still need verification before publication."],
    whatHappened: "CWI prepared a safety-first advisory for students and citizen volunteers following reports of a planned June 6 Delhi assembly.",
    whatWeKnow: "The attached advisory identifies safety risks around airport gathering, Jantar Mantar permission, crowd behavior, heat, digital safety, and de-escalation.",
    whatRemainsUnclear: "Delhi Police permission, exact local restrictions, airport gathering permission, detention-law wording, and emergency contact registry are not independently verified in the attached text.",
    verificationStatus: "Needs primary source",
    sourceCount: 1,
    riskLevel: "High",
    cwiRelevance: "High-caution public safety advisory; must be reviewed before any public publication.",
    suggestedLiveNewsroomCategory: "Public Advisory",
    seoTitle: "June 6 Delhi Assembly advisory - CWI Live Newsroom | Cockroach Watch India",
    metaDescription: "CWI public safety advisory for students following reports of a planned June 6 Delhi assembly, with official permission status marked developing.",
    socialCaption: "Developing: CWI prepared a June 6 public safety advisory. Verify official permissions before acting. Not legal counsel or endorsement.",
    sourceType: "User-submitted",
    approvalStatus: "pending",
    draftPreview: "CWI is an independent civic watch, verification, satire, and commentary platform. This advisory is for public safety and civic awareness only. It is not legal counsel, not a call to assemble, and not an endorsement of any political front.",
    seoPreview: { canonical: canonical("june-6-delhi-assembly-cwi-public-safety-advisory"), schemaTypes: ["NewsArticle", "BlogPosting", "BreadcrumbList"], openGraphTitle: "June 6 Delhi Assembly: CWI Public Safety Advisory", twitterCard: "summary_large_image" },
    socialPreview: socialPack("June 6 Delhi Assembly: CWI Public Safety Advisory", "june-6-delhi-assembly-cwi-public-safety-advisory", true),
    sourceGaps: ["Delhi Police written permission", "Court/local restriction orders", "Airport security public advisory", "Verified legal-aid contacts", "Official legal resources for detention/arrest wording"],
    timeline: [{ date: "2026-06-02", event: "CWI advisory source pack prepared", source: "CWI-ADV-2026-004", verificationLabel: "Advisory source / developing" }]
  }
];

export const sourcePackSourceLibrary = [
  { sourceName: "Hindustan Times", headline: "8 lakh signed petition, 1 crore affected", url: "https://www.hindustantimes.com/india-news/8-lakh-signed-petition-1-crore-affected-cjp-chief-abhijeet-dipke-numbers-seeking-dharmendra-pradhan-resignation-101780308446786.html", date: "2026-06-01", usedIn: "1 crore student claim / campaign context", verificationRelevance: "Reported campaign numbers", status: "source-backed" },
  { sourceName: "India Today", headline: "Cockroach party founder to return to Delhi on Jun 6", url: "https://www.indiatoday.in/india/story/neet-ug-paper-leak-abhijeet-dipke-education-minister-dharmendra-pradhan-resignation-jantar-mantar-protest-2920302-2026-06-01", date: "2026-06-01", usedIn: "June 6 return/protest plan", verificationRelevance: "Reported mobilization plan", status: "source-backed" },
  { sourceName: "The Telegraph", headline: "CJP founder to return to India on June 6", url: "https://www.telegraphindia.com/india/cockroach-janta-party-founder-abhijeet-dipke-to-return-to-india-on-june-6-seek-dharmendra-pradhans-resignation/cid/2163428", date: "2026-06-01", usedIn: "Permission-request framing", verificationRelevance: "Reported legal route", status: "source-backed" },
  { sourceName: "PTC News", headline: "NEET, CBSE, CUET row", url: "https://www.ptcnews.tv/politics/neet-cbse-cuet-row-cjp-founder-abhijeet-dipke-demands-dharmendra-pradhan-resignation-4425196", date: "2026-06-01", usedIn: "Exam accountability explainer", verificationRelevance: "Reported exam-issue summary", status: "source-backed" },
  { sourceName: "CWI-ADV-2026-004", headline: "Safety Protocols & Legal Guidelines for the June 6 Delhi Assembly", url: canonical("june-6-delhi-assembly-cwi-public-safety-advisory"), date: "2026-06-02", usedIn: "Public safety advisory", verificationRelevance: "Advisory source; legal claims need official verification", status: "advisory-source" }
] as const;

export const sourcePackTimeline = [
  { date: "2026-05-22", event: "CJP adopts NEET/exam crisis as a primary institutional target", source: "Attached research pack", verificationLabel: "Needs primary source", relatedSlug: "cjp-student-protest-front-exam-crisis" },
  { date: "2026-05-29", event: "Media coverage window begins for exam-crisis/CJP updates", source: "Attached research pack", verificationLabel: "Source-backed", relatedSlug: "cjp-student-protest-front-exam-crisis" },
  { date: "2026-05-30", event: "CUET technical disruption/glitch coverage appears in source pack", source: "Attached research pack", verificationLabel: "Reported", relatedSlug: "neet-cbse-cuet-sscgd-exam-accountability" },
  { date: "2026-06-01", event: "Dipke June 6 Delhi return/protest announcement coverage", source: "India Today / Telegraph via pack", verificationLabel: "Source-backed", relatedSlug: "abhijeet-dipke-june-6-delhi-protest" },
  { date: "2026-06-02", event: "CWI public safety advisory source pack prepared", source: "CWI-ADV-2026-004", verificationLabel: "Developing", relatedSlug: "june-6-delhi-assembly-cwi-public-safety-advisory" },
  { date: "2026-06-06", event: "Planned Delhi arrival / permission request", source: "Attached source pack", verificationLabel: "Developing", relatedSlug: "students-june-6-cjp-delhi-mobilization-legal-watch" }
] as const;

export const sourcePackUnansweredFileCard = {
  title: "National Exam Accountability Crisis",
  slug: "national-exam-accountability-crisis",
  summary: "Pending India Unanswered Files connection for NEET, CBSE, CUET, and SSC-GD accountability claims. Source count and affected-student claims require official verification before publication.",
  sourceCount: cjpExamSourcePackRecords.length,
  status: "pending approval",
  riskLevel: "High"
} as const;

export const slashCommandHelp = [
  "/add", "/research", "/verify", "/draft", "/seo", "/social", "/image", "/approve", "/reject", "/changes", "/publish", "/timeline", "/source", "/unanswered", "/health", "/fix-ui", "/newsroom", "/caption", "/reddit", "/x", "/ig", "/advisory", "/legal-check", "/next", "/status", "/sources-needed", "/publish-check"
] as const;

export function findSourcePackRecord(query?: string) {
  const value = (query || "").trim().toLowerCase();
  if (!value) return cjpExamSourcePackRecords[0];
  return cjpExamSourcePackRecords.find((record) =>
    record.slug.toLowerCase().includes(value) ||
    record.headline.toLowerCase().includes(value) ||
    record.category.toLowerCase().includes(value)
  );
}
