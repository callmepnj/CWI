import type { SourceType } from "@/data/live-newsroom";

export type PendingNewsroomRecord = {
  id: string;
  headline: string;
  slug: string;
  category: string;
  source: string;
  author?: string;
  publishedDate: string;
  updatedDate?: string;
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
};

export const pendingNewsroomRecords: PendingNewsroomRecord[] = [
  {
    id: "pending-cjp-x-withheld-ndtv-2026-05-21",
    headline: "Cockroach Janta Party X account withheld in India, founder says",
    slug: "cockroach-janta-party-x-account-withheld-india-founder-claim",
    category: "Digital Rights",
    source: "NDTV",
    author: "Edited by Mohd Asim",
    publishedDate: "2026-05-21",
    url: "https://www.ndtv.com/india-news/cockroach-janata-party-x-account-blocked-in-india-says-founder-11527284/amp/1",
    summaryBullets: [
      "NDTV reported that the CJP X account was withheld in India after a legal demand.",
      "The report attributed confirmation of the block to founder Abhijeet Dipke's public post.",
      "NDTV said the Instagram account remained active with 13.4 million followers at filing time.",
      "The report described CJP as a satirical platform that had surfaced less than a week earlier.",
      "The item should remain labelled reported/source-backed unless CWI adds a primary X notice or legal document."
    ],
    whatHappened:
      "A public report said the Cockroach Janta Party account on X was withheld in India in response to a legal demand.",
    whatWeKnow:
      "The NDTV report gives the date, founder attribution, legal-demand context, and Instagram follower context as reported facts.",
    whatRemainsUnclear:
      "CWI has not independently reviewed the legal demand, X notice, or government order behind the withholding.",
    verificationStatus: "Source-backed queue",
    sourceCount: 1,
    riskLevel: "Medium",
    cwiRelevance:
      "Relevant to CWI's digital-rights, youth-voice, platform-restriction, and Cockroach-wave tracking.",
    suggestedLiveNewsroomCategory: "Digital Rights",
    seoTitle: "CJP X account withheld in India: what is reported and what remains unclear",
    metaDescription:
      "CWI pending record on reported withholding of the Cockroach Janta Party X account in India, with source gaps and verification notes.",
    socialCaption:
      "Reported: CJP's X account was withheld in India. CWI is logging what is sourced and what still needs primary documents.",
    sourceType: "Established media",
    approvalStatus: "pending"
  },
  {
    id: "pending-cjp-social-crackdown-indianexpress-2026-05-23",
    headline: "CJP founder alleges Instagram hacks and wider social-media crackdown",
    slug: "cjp-founder-alleges-instagram-hacks-social-media-crackdown",
    category: "Cockroach Wave",
    source: "The Indian Express",
    author: "Express Web Desk",
    publishedDate: "2026-05-23",
    updatedDate: "2026-05-23T11:06:00+05:30",
    url: "https://indianexpress.com/article/india/founder-crackdown-cockroach-janta-party-x-handles-withheld-instagram-accounts-hacked-10703851/lite/",
    summaryBullets: [
      "The Indian Express reported Dipke's allegation of a severe crackdown on CJP social accounts.",
      "The report said the original X handle had been withheld earlier after IB-linked national-security inputs.",
      "Dipke asked people not to treat posts from inaccessible handles as official CJP statements.",
      "The report connected the controversy to CJI Surya Kant's later-clarified remarks.",
      "The hacking claims remain allegations unless platform logs, police complaints, or other primary records are added."
    ],
    whatHappened:
      "The founder alleged that CJP's Instagram page, his personal Instagram, the X account, and a backup account were inaccessible or taken down.",
    whatWeKnow:
      "The Indian Express recorded the allegation, the publication/update time, and the reported context around withholding of the original X handle.",
    whatRemainsUnclear:
      "CWI does not yet have primary platform evidence confirming how each account became inaccessible.",
    verificationStatus: "Pending approval",
    sourceCount: 1,
    riskLevel: "High",
    cwiRelevance:
      "The item concerns platform restriction claims, creator safety, source authenticity, and public-memory handling for CJP-related posts.",
    suggestedLiveNewsroomCategory: "Cockroach Wave",
    seoTitle: "CJP founder alleges social-media crackdown: source-backed CWI queue",
    metaDescription:
      "Pending CWI newsroom record on reported CJP account access claims, platform restrictions, and verification gaps.",
    socialCaption:
      "CWI queue: CJP founder alleges account hacks and takedowns. Treat as reported until primary platform evidence is available.",
    sourceType: "Established media",
    approvalStatus: "pending"
  },
  {
    id: "pending-cjp-delhi-hc-x-plea-indianexpress-2026-05-30",
    headline: "Delhi High Court sends CJP founder's X-unblocking plea to MeitY review committee",
    slug: "delhi-high-court-cjp-x-unblocking-plea-meity-review",
    category: "Legal",
    source: "The Indian Express",
    author: "Richa Sahay and Somya Panwar",
    publishedDate: "2026-05-30",
    updatedDate: "2026-05-30T10:07:00+05:30",
    url: "https://indianexpress.com/article/legal-news/cockroach-janta-party-high-court-order-unblock-twitter-x-account-10713528/lite/",
    summaryBullets: [
      "The Indian Express reported that Dipke approached Delhi High Court over the CJP X account block.",
      "The report said the court directed MeitY's review committee to examine the plea.",
      "The court did not grant immediate relief, according to the report.",
      "The petition framed CJP as satire and as an outlet for youth grievances.",
      "Primary court order text should be added before CWI treats procedural details as complete."
    ],
    whatHappened:
      "A reported Delhi High Court hearing sent the X-unblocking issue to MeitY review committee consideration without immediate relief.",
    whatWeKnow:
      "The article identifies the court, judge, authors, update date, petition context, and reported procedural outcome.",
    whatRemainsUnclear:
      "CWI still needs the court order, petition copy, or official cause-list/order link for transcript-level verification.",
    verificationStatus: "Needs primary source",
    sourceCount: 1,
    riskLevel: "Medium",
    cwiRelevance:
      "Relevant to CWI's legal-reference, digital-rights, youth-voice, and CJP source-led coverage.",
    suggestedLiveNewsroomCategory: "Legal",
    seoTitle: "CJP X account plea reaches Delhi High Court: what CWI can verify",
    metaDescription:
      "Pending CWI record on Delhi High Court proceedings around the Cockroach Janta Party X account withholding.",
    socialCaption:
      "Court update queued: CJP founder's X-unblocking plea reportedly moved to MeitY review committee. Primary order still needed.",
    sourceType: "Established media",
    approvalStatus: "pending"
  },
  {
    id: "pending-cbse-fake-rumours-advisory-2026-02-18",
    headline: "CBSE warns against fake paper-leak rumours and unofficial links",
    slug: "cbse-fake-paper-leak-rumours-official-advisory-2026",
    category: "Student Advisory",
    source: "CBSE official advisory",
    publishedDate: "2026-02-18",
    url: "https://www.cbse.gov.in/cbsenew/documents/Advisory_Fake_News_Rumours_18022026.pdf",
    summaryBullets: [
      "CBSE issued an official advisory on fake news and rumours ahead of board examinations.",
      "The advisory warned students and parents about false question-paper leak claims.",
      "CBSE asked readers to use the official CBSE website for authentic information.",
      "The item is an official source for caution around viral CBSE leak PDFs.",
      "It does not verify or disprove every later screenshot or student-specific grievance."
    ],
    whatHappened:
      "CBSE published a student-facing advisory warning against misinformation and fake paper-leak rumours.",
    whatWeKnow:
      "The advisory is hosted on the official CBSE domain and directly addresses fake exam-related rumours.",
    whatRemainsUnclear:
      "Separate OSM/scanning claims need their own source trail and cannot be settled by this advisory alone.",
    verificationStatus: "Source-backed queue",
    sourceCount: 1,
    riskLevel: "Low",
    cwiRelevance:
      "Useful as an official student-safety and verification reference for CWI's CBSE/NEET advisory coverage.",
    suggestedLiveNewsroomCategory: "Student Advisory",
    seoTitle: "CBSE fake paper leak rumours advisory: official source for students",
    metaDescription:
      "CWI pending record for CBSE's official advisory warning students against fake paper-leak rumours and unofficial links.",
    socialCaption:
      "Student advisory queue: CBSE's official fake-rumour warning should anchor any CBSE paper-leak claim checks.",
    sourceType: "Official",
    approvalStatus: "pending"
  }
];
