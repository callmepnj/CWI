// Live Newsroom - daily, source-led editorial records.

import { june14LiveNewsroomItems, june14Sources } from "./live-newsroom-june-14-2026";
import { june2026LiveNewsroomItems } from "./live-newsroom-june-2026";

export type NewsroomItemStatus =
  | "Verified"
  | "Source-backed"
  | "Developing"
  | "Public Advisory"
  | "Needs Source"
  | "Correction"
  | "Reported"
  | "Claim under review"
  | "Official clarification awaited"
  | "Opinion / public sentiment"
  | "Unverified"
  | "False/Misleading"
  | "Blocked";

export type NewsroomItemSection =
  | "lead-story"
  | "top-3"
  | "what-changed"
  | "latest-updates"
  | "verification-desk"
  | "public-advisory"
  | "india-unanswered-files"
  | "source-ledger"
  | "featured";

export type ChangeType =
  | "New update"
  | "Source added"
  | "Correction"
  | "Status changed"
  | "Advisory posted"
  | "File updated";

export type NewsroomItemLabel =
  | "NEW TODAY"
  | "UPDATED TODAY"
  | "LAST CHECKED"
  | "SOURCE REQUEST OPEN";

export type AdvisoryType =
  | "Verify before sharing"
  | "Screenshot context"
  | "Suspicious link warning"
  | "Creator credit notice"
  | "Platform restriction update"
  | "Correction notice";

export type SourceType =
  | "Official"
  | "Court/legal"
  | "Established media"
  | "Fact-check"
  | "Public statement"
  | "Social post"
  | "User-submitted"
  | "Unverified";

export type EvidenceLevel =
  | "Verified"
  | "Source-backed"
  | "Reported"
  | "Developing"
  | "Needs Source"
  | "Unverified"
  | "False/Misleading"
  | "Blocked";

export interface Source {
  id: string;
  name: string;
  url: string;
  type: SourceType;
  reliabilityLabel?: string;
  usedFor?: string[];
  usedIn?: string;
  supports?: string;
  doesNotProve?: string;
  notes?: string;
  lastUsedAt?: string;
}

export interface LiveNewsroomItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  status: NewsroomItemStatus;
  sections: NewsroomItemSection[];
  category: string;

  isLeadStory: boolean;
  topStoryRank?: number;
  priorityScore: number;
  changeType: ChangeType;
  labels: NewsroomItemLabel[];
  editorNote?: string;

  whatChanged: string;
  whatWeKnow: string;
  whatWeDontKnow: string;
  sourceGap?: string;
  sourceTrail: Source[];
  lastCheckedAt: string;
  lastUpdatedAt: string;

  displayImage?: string;
  displayImageAlt?: string;

  correctionOpen: boolean;
  sourceRequestOpen: boolean;
  hiddenFromLiveNewsroom: boolean;
  isArchivedContext: boolean;
  approvalStatus: "draft" | "pending" | "approved" | "rejected";
  originalPublishDate?: string;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  approvedBy?: string;
}

export interface PublicAdvisory {
  id: string;
  slug: string;
  type: AdvisoryType;
  title: string;
  warning: string;
  whatToRead: string;
  context?: string;
  relatedLink?: string;
  relatedLinkText?: string;
  lastUpdatedAt: string;
  priority: "high" | "normal" | "low";
}

export interface ClaimTrackerItem {
  id: string;
  claim: string;
  firstSeenAt: string;
  status: EvidenceLevel;
  evidenceLevel: EvidenceLevel;
  cwiNote: string;
  sourceGap?: string;
  sources: Source[];
  lastCheckedAt: string;
  approvalStatus: "approved" | "pending" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface Correction {
  id: string;
  itemId: string;
  itemTitle: string;
  correctionDate: string;
  whatChanged: string;
  whyChanged: string;
  sourceNote?: string;
  status: "published" | "pending" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface TodaysBrief {
  id: string;
  date: string;
  title: string;
  topUpdates: string[];
  whatChanged: string;
  whatRemainsUnclear: string;
  sourceCount: number;
  editorNote?: string;
  editorName?: string;
  status: "draft" | "approved" | "published";
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const sourceMap = {
  ntaNeetPublicNotices: {
    id: "src-nta-neet-public-notices",
    name: "NTA NEET public notices",
    url: "https://neet.nta.nic.in/document-category/public-notices/",
    type: "Official",
    reliabilityLabel: "Official",
    usedIn: "NEET official notices and candidate actions",
    supports: "NTA-published NEET(UG) public notices, including re-exam and candidate notice pages.",
    doesNotProve: "It does not prove viral screenshots, private coaching claims, or non-NTA timelines.",
    lastUsedAt: "2026-05-30T10:45:00+05:30"
  },
  ntaMain: {
    id: "src-nta-main",
    name: "National Testing Agency official site",
    url: "https://www.nta.ac.in/",
    type: "Official",
    reliabilityLabel: "Official",
    usedIn: "Agency context",
    supports: "Official agency ownership and public communications context.",
    doesNotProve: "It does not confirm social-media claims unless a matching notice is published.",
    lastUsedAt: "2026-05-30T10:45:00+05:30"
  },
  cbseLatest: {
    id: "src-cbse-latest",
    name: "CBSE latest updates",
    url: "https://www.cbse.gov.in/cbsenew/cbse.html",
    type: "Official",
    reliabilityLabel: "Official",
    usedIn: "CBSE OSM and post-result notices",
    supports: "CBSE-published latest notices, including OSM and scanned answer-book updates.",
    doesNotProve: "It does not independently audit disputed screenshots or third-party portal claims.",
    lastUsedAt: "2026-05-30T09:30:00+05:30"
  },
  cbseCirculars: {
    id: "src-cbse-circulars",
    name: "CBSE examination circulars",
    url: "https://www.cbse.gov.in/cbsenew/examination_Circular.html",
    type: "Official",
    reliabilityLabel: "Official",
    usedIn: "CBSE post-result and OSM process context",
    supports: "Official circular listings for post-result facilities and OSM-related instructions.",
    doesNotProve: "It does not settle every individual student's mark dispute.",
    lastUsedAt: "2026-05-30T09:30:00+05:30"
  },
  parikshaSangam: {
    id: "src-pariksha-sangam",
    name: "CBSE Pariksha Sangam re-checking portal",
    url: "https://parikshasangam.cbse.gov.in/ps/frmSchCommunication",
    type: "Official",
    reliabilityLabel: "Official",
    usedIn: "Verification, photocopy, and re-evaluation action path",
    supports: "Official student-facing route for re-checking and re-evaluation services when active.",
    doesNotProve: "It does not confirm whether any specific answer sheet was mis-scanned.",
    lastUsedAt: "2026-05-30T09:30:00+05:30"
  },
  teleManas: {
    id: "src-tele-manas",
    name: "Tele-MANAS mental health support portal",
    url: "https://telemanas.mohfw.gov.in/",
    type: "Official",
    reliabilityLabel: "Official",
    usedIn: "Student safety advisory",
    supports: "Official mental-health support context for students in distress.",
    doesNotProve: "It is a support resource, not an exam-policy source.",
    lastUsedAt: "2026-05-30T10:45:00+05:30"
  },
  indianExpressNeetProbe: {
    id: "src-indianexpress-neet-probe",
    name: "The Indian Express NEET probe report",
    url: "https://indianexpress.com/article/india/neet-ug-2026-paper-leak-cbi-two-more-arrests-10709998/",
    type: "Established media",
    reliabilityLabel: "Reported",
    usedIn: "NEET probe update",
    supports: "Reported CBI arrests, custody details, and investigation context attributed to officials.",
    doesNotProve: "It is not a court record or CBI press release.",
    lastUsedAt: "2026-05-30T10:45:00+05:30"
  },
  ndtvNeetProbe: {
    id: "src-ndtv-neet-probe",
    name: "NDTV/PTI NEET probe report",
    url: "https://www.ndtv.com/india-news/latur-based-doctor-pune-physics-teacher-arrested-in-neet-ug-paper-leak-case-11553246",
    type: "Established media",
    reliabilityLabel: "Reported",
    usedIn: "NEET probe update",
    supports: "Additional reported context on the arrests and alleged leak chain.",
    doesNotProve: "It does not replace primary legal filings.",
    lastUsedAt: "2026-05-30T10:45:00+05:30"
  },
  ndtvCbseOsm: {
    id: "src-ndtv-cbse-osm",
    name: "NDTV CBSE OSM clarification report",
    url: "https://www.ndtv.com/education/cbse-dismisses-claims-of-osm-portal-breach-calls-viral-allegations-misleading-11550627",
    type: "Established media",
    reliabilityLabel: "Reported",
    usedIn: "CBSE OSM portal claim context",
    supports: "Reported CBSE denial and the disputed social-media vulnerability claim.",
    doesNotProve: "It does not independently verify either side's technical evidence.",
    lastUsedAt: "2026-05-30T09:30:00+05:30"
  },
  nationalHeraldCji: {
    id: "src-nationalherald-cji",
    name: "National Herald CJI clarification report",
    url: "https://www.nationalheraldindia.com/national/cji-clarifies-cockroach-remark-after-backlash-says-comments-targeted-fake-degree-holders",
    type: "Established media",
    reliabilityLabel: "Reported",
    usedIn: "CJI/CJP context verification",
    supports: "Reported clarification that the remarks were framed around fake-degree entrants.",
    doesNotProve: "It does not provide the complete court transcript or settle every viral quote card.",
    lastUsedAt: "2026-05-30T08:15:00+05:30"
  },
  financialExpressCji: {
    id: "src-financialexpress-cji",
    name: "Financial Express CJI clarification report",
    url: "https://www.financialexpress.com/india-news/cji-surya-kant-clarifies-cockroaches-comment-it-was-about-fake-degree-holders-not-indian-youth/4243020/lite/",
    type: "Established media",
    reliabilityLabel: "Reported",
    usedIn: "CJI/CJP context verification",
    supports: "Second reported account of the clarification and public debate.",
    doesNotProve: "It is not a primary judicial transcript.",
    lastUsedAt: "2026-05-30T08:15:00+05:30"
  }
} satisfies Record<string, Source>;

export const todaysBriefs: TodaysBrief[] = [
  {
    id: "brief-2026-05-30",
    date: "May 28, 2026",
    title: "Newsroom record for May 28",
    topUpdates: [
      "NEET candidate action links are being separated from viral re-exam claims.",
      "CBSE OSM portal breach claims remain disputed; official CBSE links and reported counter-claims are logged.",
      "CJI/CJP quote cards need transcript-level sourcing before CWI treats every viral wording as settled."
    ],
    whatChanged: "Official NTA/CBSE links, student support resources, and reported NEET probe updates were added to the source trail.",
    whatRemainsUnclear: "CBSE OSM technical evidence, primary legal documents in the NEET probe, and full original transcript context for viral quote cards.",
    sourceCount: 10,
    editorNote: "Today's newsroom record prioritizes candidate safety, official action links, and clear source gaps.",
    editorName: "PNJ / CWI Editorial Desk",
    status: "approved",
    approvedAt: "2026-05-30T11:00:00+05:30",
    createdAt: "2026-05-30T07:30:00+05:30",
    updatedAt: "2026-05-30T11:00:00+05:30"
  }
];

const baseLiveNewsroomItems: LiveNewsroomItem[] = [
  {
    id: "live-neet-probe-2026",
    slug: "neet-ug-2026-probe-official-notices-and-source-gaps",
    title: "NEET UG 2026 probe: official notices, arrest reports, and what students should not assume yet",
    summary: "CWI is tracking the official NTA notice trail separately from reported CBI developments and viral coaching claims.",
    content:
      "CWI is treating the NEET UG 2026 leak story as a developing public-interest record. Candidate action should come from NTA notices first. Reported investigation details are logged with attribution and source gaps until primary legal or agency documents are available.",
    status: "Developing",
    sections: ["lead-story", "what-changed", "latest-updates", "verification-desk", "featured"],
    category: "Students",
    isLeadStory: true,
    priorityScore: 96,
    changeType: "Source added",
    labels: ["UPDATED TODAY", "LAST CHECKED", "SOURCE REQUEST OPEN"],
    editorNote:
      "Do not convert reported arrests or coaching-chain claims into confirmed facts beyond what the named source supports.",
    whatChanged:
      "NTA public notices and two reported NEET probe updates were added to the same record, with official and media evidence separated.",
    whatWeKnow:
      "NTA has a public notice trail for NEET(UG) 2026. Indian Express and NDTV/PTI report additional CBI arrests and custody details in the alleged paper leak probe.",
    whatWeDontKnow:
      "CWI has not independently reviewed court filings, CBI documents, or the full investigation chain. Viral coaching screenshots remain unverified unless matched to a named source.",
    sourceGap: "Primary CBI release or court order link is still needed for the investigation details.",
    sourceTrail: [
      sourceMap.ntaNeetPublicNotices,
      sourceMap.ntaMain,
      sourceMap.indianExpressNeetProbe,
      sourceMap.ndtvNeetProbe
    ],
    lastCheckedAt: "2026-05-30T10:45:00+05:30",
    lastUpdatedAt: "2026-05-30T10:45:00+05:30",
    displayImage: "/images/cwi-unanswered-files/neet-paper-leak/hero.jpg",
    displayImageAlt: "CWI editorial visual on NEET exam accountability and student verification",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    createdAt: "2026-05-30T08:20:00+05:30",
    updatedAt: "2026-05-30T10:45:00+05:30",
    publishedAt: "2026-05-30T10:45:00+05:30",
    approvedBy: "PNJ / CWI Editorial Desk"
  },
  {
    id: "live-neet-cbse-student-help",
    slug: "neet-cbse-student-help-official-links-before-sharing",
    title: "Before sharing NEET or CBSE claims, check these official student action links first",
    summary: "A student-facing advisory for NEET, CBSE answer-book access, re-evaluation routes, and mental-health support context.",
    content:
      "Students should rely on official exam, board, and counselling channels before acting on viral posts about re-exams, answer keys, result changes, or revaluation claims. CWI is tracking this as a student-support advisory and not as confirmation of any unsourced viral claim.",
    status: "Public Advisory",
    sections: ["top-3", "what-changed", "latest-updates", "public-advisory", "featured"],
    category: "Student Advisory",
    isLeadStory: false,
    topStoryRank: 1,
    priorityScore: 92,
    changeType: "Advisory posted",
    labels: ["NEW TODAY", "LAST CHECKED"],
    editorNote:
      "This record is designed to lower panic and point students to source trails, not to amplify unsourced re-exam claims.",
    whatChanged:
      "NTA, CBSE, Pariksha Sangam, and Tele-MANAS links were grouped into one reader action checklist.",
    whatWeKnow:
      "Official portals exist for NTA NEET notices, CBSE notices, CBSE re-checking/re-evaluation access, and public mental-health support.",
    whatWeDontKnow:
      "CWI does not treat viral screenshots, coaching claims, or unsourced timelines as confirmed unless an official body or named source supports them.",
    sourceGap: "Readers can submit missing official notices or corrected candidate guidance through CWI Submit.",
    sourceTrail: [
      sourceMap.ntaNeetPublicNotices,
      sourceMap.cbseLatest,
      sourceMap.cbseCirculars,
      sourceMap.parikshaSangam,
      sourceMap.teleManas
    ],
    lastCheckedAt: "2026-05-30T10:30:00+05:30",
    lastUpdatedAt: "2026-05-30T10:30:00+05:30",
    displayImage: "/images/cwi-unanswered-files/neet-paper-leak/hero.jpg",
    displayImageAlt: "Student exam stress and public accountability visual for CWI advisory",
    correctionOpen: true,
    sourceRequestOpen: false,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    createdAt: "2026-05-30T07:45:00+05:30",
    updatedAt: "2026-05-30T10:30:00+05:30",
    publishedAt: "2026-05-30T10:30:00+05:30",
    approvedBy: "PNJ / CWI Editorial Desk"
  },
  {
    id: "live-cbse-osm-2026",
    slug: "cbse-osm-portal-claims-what-is-official-and-what-is-disputed",
    title: "CBSE OSM portal claims: what is official, what is disputed, and what students can verify",
    summary: "CWI logs CBSE's official OSM/post-result links and reported dispute around portal-breach claims without treating screenshots as settled evidence.",
    content:
      "CBSE OSM claims are fast-moving and technical. CWI is separating official board notices, student grievance routes, and media-reported technical allegations so readers do not mistake screenshots for confirmed audit findings.",
    status: "Source-backed",
    sections: ["top-3", "what-changed", "latest-updates", "verification-desk", "public-advisory"],
    category: "Students",
    isLeadStory: false,
    topStoryRank: 2,
    priorityScore: 89,
    changeType: "Status changed",
    labels: ["UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote:
      "This record should remain careful: official CBSE denial and disputed technical evidence are not the same thing as an independent audit.",
    whatChanged:
      "CBSE official pages and the reported OSM portal-breach clarification were added with a visible source gap.",
    whatWeKnow:
      "CBSE lists OSM and post-result facilities on official pages. NDTV reports CBSE said the cited URL was a testing/dummy platform, while the social-media user disputed the explanation.",
    whatWeDontKnow:
      "CWI has not independently verified the alleged vulnerability, the screenshots, or whether any real student data was exposed.",
    sourceGap: "Independent security audit evidence or a primary CBSE technical note is still needed.",
    sourceTrail: [sourceMap.cbseLatest, sourceMap.cbseCirculars, sourceMap.parikshaSangam, sourceMap.ndtvCbseOsm],
    lastCheckedAt: "2026-05-30T09:30:00+05:30",
    lastUpdatedAt: "2026-05-30T09:30:00+05:30",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    createdAt: "2026-05-30T08:00:00+05:30",
    updatedAt: "2026-05-30T09:30:00+05:30",
    publishedAt: "2026-05-30T09:30:00+05:30",
    approvedBy: "PNJ / CWI Editorial Desk"
  },
  {
    id: "live-cji-cjp-context-2026",
    slug: "cji-cockroach-remark-cjp-context-needs-primary-source",
    title: "CJI 'cockroach' quote cards and CJP context need primary-source checking",
    summary: "CWI is logging reported clarification context while asking readers not to share viral quote cards without original source links.",
    content:
      "The CJI/CJP context is culturally important for CWI readers, but quote cards can flatten legal context. CWI is keeping this in Verification Desk until primary transcript-level material is available.",
    status: "Needs Source",
    sections: ["top-3", "what-changed", "latest-updates", "verification-desk"],
    category: "Youth Voice",
    isLeadStory: false,
    topStoryRank: 3,
    priorityScore: 76,
    changeType: "Source added",
    labels: ["SOURCE REQUEST OPEN", "LAST CHECKED"],
    editorNote:
      "This should be treated as context tracking, not partisan promotion or a claim that every viral graphic is accurate.",
    whatChanged:
      "Two media reports about the clarification were logged, while the original transcript/primary statement remains requested.",
    whatWeKnow:
      "Multiple media reports say the clarification framed the remark around fake-degree entrants, not India's youth generally.",
    whatWeDontKnow:
      "CWI has not received a complete primary transcript or official document that settles the exact wording used in every viral quote card.",
    sourceGap: "Full court transcript, primary clarification, or authoritative legal record is still needed.",
    sourceTrail: [sourceMap.nationalHeraldCji, sourceMap.financialExpressCji],
    lastCheckedAt: "2026-05-30T08:15:00+05:30",
    lastUpdatedAt: "2026-05-30T08:15:00+05:30",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    createdAt: "2026-05-30T07:55:00+05:30",
    updatedAt: "2026-05-30T08:15:00+05:30",
    publishedAt: "2026-05-30T08:15:00+05:30",
    approvedBy: "PNJ / CWI Editorial Desk"
  }  ,
  {
    id: "live-neet-nta-roadmap-june-2026",
    slug: "neet-ug-2026-nta-roadmap-cbi-probe-reexam-june-21",
    title: "NEET UG 2026: Supreme Court roadmap, CBI probe, and June 21 re-exam - what changed after May 30",
    summary: "The PDF research pack logs the post-May 30 NEET update: Supreme Court scrutiny of NTA reform, a June 21 re-exam schedule, CBI arrests, and unresolved accountability questions.",
    content: "Short answer: NEET UG 2026 remains a developing exam-accountability story. The Supreme Court directed the Centre to prepare an NTA restructuring roadmap, the June 21 re-exam remains the next student-facing date, and CBI probe details are being tracked with attribution. CWI is separating official exam actions from reported investigation claims and political framing.",
    status: "Developing",
    sections: ["lead-story", "top-3", "what-changed", "latest-updates", "verification-desk", "featured"],
    category: "Students / Exam Accountability",
    isLeadStory: true,
    topStoryRank: 1,
    priorityScore: 99,
    changeType: "New update",
    labels: ["NEW TODAY", "UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote: "Use confirmed only for official court/exam dates and named-source reports. Treat IAF transport, NEET 2025 compromise claims, and future CBT decisions as reported or developing unless a primary source is added.",
    whatChanged: "The PDF adds the May 30 Supreme Court NTA-reform roadmap, the June 21 re-exam schedule, reported CBI arrests, admit-card and fee-refund dates, and open questions around exam security.",
    whatWeKnow: "The Supreme Court directed the Centre to prepare a comprehensive NTA restructuring roadmap; the re-exam is listed for June 21, 2026; admit cards are expected June 14; fee refund portal remains open until June 22; named reports describe CBI arrests in the alleged leak probe.",
    whatWeDontKnow: "CWI has not independently reviewed all court filings or CBI documents. It remains unclear whether IAF question-paper transport is final, whether further legal challenge changes the June 21 schedule, whether NTA officials face direct accountability, and whether NEET formally shifts to CBT from 2027.",
    sourceGap: "Primary Supreme Court order text, CBI release/court filings, and final official NTA security protocol are still useful additions.",
    sourceTrail: [
      { id: "src-neet-sc-roadmap-2026", name: "Bar and Bench", url: "https://www.barandbench.com/", type: "Court/legal", reliabilityLabel: "Established legal media", supports: "Supreme Court observations on NTA reform and accountability roadmap.", doesNotProve: "It does not prove every investigation claim or future NTA policy decision.", lastUsedAt: "2026-06-05T11:00:00+05:30" },
      { id: "src-neet-nta-public-notices-june-2026", name: "NTA NEET public notices", url: "https://neet.nta.nic.in/document-category/public-notices/", type: "Official", reliabilityLabel: "Official", supports: "Candidate-facing NEET notices, re-exam/admit-card/fee-refund updates when published.", doesNotProve: "It does not confirm CBI investigation details unless NTA posts them.", lastUsedAt: "2026-06-05T11:00:00+05:30" },
      { id: "src-neet-medical-dialogues-cbt-petition", name: "Medical Dialogues", url: "https://medicaldialogues.in/", type: "Established media", reliabilityLabel: "Established media", supports: "Reported Supreme Court refusal of a separate CBT-mode petition.", doesNotProve: "It does not settle future CBT policy.", lastUsedAt: "2026-06-05T11:00:00+05:30" },
      { id: "src-neet-cbi-probe-pack", name: "CWI PDF research pack", url: "https://cockroachwatchindia.online/live-newsroom", type: "User-submitted", reliabilityLabel: "Editor supplied research pack", supports: "Compiled post-May 30 CBI probe status and open verification labels.", doesNotProve: "CWI still prefers primary CBI/court documents for final legal attribution.", lastUsedAt: "2026-06-05T11:00:00+05:30" }
    ],
    lastCheckedAt: "2026-06-05T11:00:00+05:30",
    lastUpdatedAt: "2026-06-05T11:00:00+05:30",
    displayImage: "/images/cwi-unanswered-files/neet-paper-leak/hero.jpg",
    displayImageAlt: "CWI editorial visual on NEET UG exam accountability and NTA reform",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    createdAt: "2026-06-05T11:00:00+05:30",
    updatedAt: "2026-06-05T11:00:00+05:30",
    publishedAt: "2026-06-05T11:00:00+05:30",
    approvedBy: "Cockroach Watch India Editorial Desk"
  },
  {
    id: "live-cbse-class-12-osm-controversy-2026",
    slug: "cbse-class-12-osm-controversy-2026",
    title: "CBSE Class 12 OSM controversy 2026: marking system complaints, protest, and what MoE is doing",
    summary: "The CBSE row in the PDF is not a paper leak. It is an on-screen marking controversy after Class 12 results, with reported blurred scans, partial evaluation complaints, student protest, and Ministry monitoring.",
    content: "Short answer: The CBSE row is not a confirmed paper leak. It is a source-backed marking system controversy. CBSE introduced digital On-Screen Marking for Class 12 in 2026; after May 13 results, students reported blurred scans, partial evaluation, and unexpected low marks. The Ministry of Education reportedly stepped in after the pass rate dropped to 85.20%.",
    status: "Source-backed",
    sections: ["top-3", "what-changed", "latest-updates", "verification-desk", "featured"],
    category: "Students / Exam Accountability",
    isLeadStory: false,
    topStoryRank: 2,
    priorityScore: 98,
    changeType: "New update",
    labels: ["NEW TODAY", "UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote: "CWI must keep CBSE paper-leak rumours and the CBSE OSM controversy separate. The PDF treats fake leak rumours as one event and OSM evaluation complaints as a separate documented May 2026 controversy.",
    whatChanged: "The PDF adds a full CBSE OSM explainer: OSM rollout, May 13 result complaints, 85.20% pass rate context, May 24 Ministry response, May 28 Indira Bhawan protest, and teacher concerns about training.",
    whatWeKnow: "CBSE introduced Class 12 OSM in 2026; results were declared May 13; reports describe low-mark and scan-quality complaints; Ministry sources reportedly monitored data logs; students protested at Indira Bhawan on May 28; CBSE paper-leak rumours remain a separate fake-rumour advisory issue.",
    whatWeDontKnow: "The total number of affected students is not settled. It remains unclear whether CBSE will restore a full re-evaluation mechanism, whether colleges will accept revised results, and whether OSM will continue unchanged in 2027.",
    sourceGap: "CWI still needs a full CBSE post-result technical note, affected-count data, and case-level resolution evidence.",
    sourceTrail: [
      { id: "src-cbse-osm-circular-2026", name: "CBSE official OSM circular", url: "https://www.cbse.gov.in/cbsenew/documents/OSM_Class%20XII_09022026.pdf", type: "Official", reliabilityLabel: "Official", supports: "CBSE's official Class 12 on-screen marking rollout.", doesNotProve: "It does not prove the scale of later student complaints.", lastUsedAt: "2026-06-05T11:05:00+05:30" },
      { id: "src-republic-ani-cbse-osm", name: "Republic World / ANI", url: "https://www.republicworld.com/education", type: "Established media", reliabilityLabel: "Established media", supports: "Reported Ministry monitoring, pass-rate drop context, and OSM controversy details.", doesNotProve: "It does not independently audit every answer sheet.", lastUsedAt: "2026-06-05T11:05:00+05:30" },
      { id: "src-theweek-cbse-osm", name: "The Week / PTI", url: "https://www.theweek.in/news/india/2026/05/30/cbse-class-12-osm-controversy.html", type: "Established media", reliabilityLabel: "Established media", supports: "May 30 OSM controversy explainer and May 28 protest context.", doesNotProve: "It does not quantify every affected student.", lastUsedAt: "2026-06-05T11:05:00+05:30" },
      { id: "src-careers360-cbse-osm", name: "Careers360", url: "https://school.careers360.com/boards/cbse/cbse-12th-exam-2026-evaluation-goes-digital-no-post-result-verification-marks", type: "Established media", reliabilityLabel: "Education media", supports: "OSM explainer, post-result verification context, and teacher concern coverage.", doesNotProve: "It does not establish a systemic evaluation failure by itself.", lastUsedAt: "2026-06-05T11:05:00+05:30" },
      { id: "src-newsonair-cbse-osm", name: "NewsOnAir", url: "https://www.newsonair.gov.in/cbse-to-introduce-on-screen-marking-for-class-12-from-2026-exams/", type: "Established media", reliabilityLabel: "Public broadcaster", supports: "Public announcement context for CBSE OSM.", doesNotProve: "It does not resolve later grievance claims.", lastUsedAt: "2026-06-05T11:05:00+05:30" }
    ],
    lastCheckedAt: "2026-06-05T11:05:00+05:30",
    lastUpdatedAt: "2026-06-05T11:05:00+05:30",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    createdAt: "2026-06-05T11:05:00+05:30",
    updatedAt: "2026-06-05T11:05:00+05:30",
    publishedAt: "2026-06-05T11:05:00+05:30",
    approvedBy: "Cockroach Watch India Editorial Desk"
  },
  {
    id: "live-cuet-ug-2026-technical-glitch",
    slug: "cuet-ug-2026-technical-glitch-tcs-nta-delay",
    title: "CUET-UG 2026 technical glitch: what NTA said, who was affected, and what remains separate from NEET",
    summary: "The PDF records a May 31 CUET-UG delay at multiple centres due to a TCS-linked technical issue, with NTA announcing compensatory time for affected candidates.",
    content: "Short answer: CUET-UG 2026 faced a confirmed technical disruption on May 31 at multiple centres, including Delhi and Bengaluru. NTA attributed the issue to its technology partner TCS and announced compensatory time. CWI is treating this as a technical-glitch update, not a paper leak.",
    status: "Source-backed",
    sections: ["what-changed", "latest-updates", "verification-desk"],
    category: "Students / Exam Accountability",
    isLeadStory: false,
    priorityScore: 91,
    changeType: "New update",
    labels: ["NEW TODAY", "UPDATED TODAY"],
    editorNote: "The PDF connects CUET to the wider exam-accountability season, but CWI should keep causes separate: NEET leak, CBSE OSM complaints, CUET technical glitch, and JEE data exposure are different events.",
    whatChanged: "The PDF adds CUET-UG May 31 disruption context, NTA/TCS attribution, compensatory time, and political reaction connecting NEET, CBSE, SSC, and CUET.",
    whatWeKnow: "CUET-UG was delayed at multiple centres on May 31; NTA attributed the issue to a TCS technical problem; affected candidates were given compensatory time; opposition leaders publicly linked the disruption to broader exam-management failures.",
    whatWeDontKnow: "The full number of affected centres/candidates, internal TCS/NTA failure report, and any long-term corrective action are not in the public source trail CWI has reviewed.",
    sourceGap: "Primary NTA notice and technical incident report would strengthen this record.",
    sourceTrail: [
      { id: "src-cuet-nta-technical-glitch", name: "NTA / CUET public update", url: "https://cuet.nta.nic.in/", type: "Official", reliabilityLabel: "Official", supports: "Official CUET candidate notices and updates.", doesNotProve: "It does not explain all internal technical causes unless a notice says so.", lastUsedAt: "2026-06-05T11:10:00+05:30" },
      { id: "src-cuet-pdf-research-pack", name: "CWI PDF research pack", url: "https://cockroachwatchindia.online/live-newsroom", type: "User-submitted", reliabilityLabel: "Editor supplied research pack", supports: "Compiled May 31 CUET disruption, NTA/TCS attribution, and political reaction details.", doesNotProve: "Primary NTA/TCS technical incident data remains useful.", lastUsedAt: "2026-06-05T11:10:00+05:30" },
      { id: "src-msn-dynamite-cuet", name: "MSN / Dynamite News", url: "https://www.msn.com/", type: "Established media", reliabilityLabel: "Established media", supports: "Reported context linking CUET delay to exam-accountability debate.", doesNotProve: "It does not make all exam controversies the same cause.", lastUsedAt: "2026-06-05T11:10:00+05:30" }
    ],
    lastCheckedAt: "2026-06-05T11:10:00+05:30",
    lastUpdatedAt: "2026-06-05T11:10:00+05:30",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    createdAt: "2026-06-05T11:10:00+05:30",
    updatedAt: "2026-06-05T11:10:00+05:30",
    publishedAt: "2026-06-05T11:10:00+05:30",
    approvedBy: "Cockroach Watch India Editorial Desk"
  },
  {
    id: "live-jee-advanced-2026-data-exposure",
    slug: "jee-advanced-2026-data-exposure-cloud-storage",
    title: "JEE Advanced 2026 data exposure: what a 16-year-old found in IIT Roorkee's cloud storage",
    summary: "The PDF records a June 2 JEE Advanced data exposure: 1.79 lakh result records and 1.87 lakh admit-card PDFs reportedly accessible without login before IIT Roorkee acknowledged and plugged the issue.",
    content: "Short answer: On June 2, the day after JEE Advanced 2026 results, 16-year-old researcher Rylen Anil reported a cloud-storage misconfiguration linked to IIT Roorkee's results portal. IIT Roorkee publicly thanked him, said the data was read-only, and said the issue was being plugged on priority. No data alteration is confirmed.",
    status: "Source-backed",
    sections: ["top-3", "what-changed", "latest-updates", "verification-desk", "featured"],
    category: "Students / Digital Rights",
    isLeadStory: false,
    topStoryRank: 3,
    priorityScore: 97,
    changeType: "New update",
    labels: ["NEW TODAY", "UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote: "CWI covers the confirmed data exposure and ethical disclosure. CJP's political attribution to the Education Minister is a campaign position, not a verified technical finding.",
    whatChanged: "The PDF adds the June 1 result date, June 2 researcher disclosure, reported exposed record counts, IIT Roorkee acknowledgement, read-only clarification, and CJP's June 3-4 response.",
    whatWeKnow: "JEE Advanced 2026 results were declared June 1; Rylen Anil reported public access to candidate result records and admit-card PDFs on June 2; IIT Roorkee acknowledged a cloud-storage configuration issue, said it was being plugged, and described the data as read-only.",
    whatWeDontKnow: "CWI has not seen evidence of malicious use, data alteration, candidate notification status, exposure duration, or an official government investigation beyond the reported IIT Roorkee response.",
    sourceGap: "Official incident report, candidate notification statement, and audit outcome would strengthen this record.",
    sourceTrail: [
      { id: "src-iit-roorkee-x-jee-data", name: "IIT Roorkee acknowledgement on X", url: "https://x.com/iitroorkee", type: "Public statement", reliabilityLabel: "Institutional public statement", supports: "Acknowledgement of cloud-storage configuration issue and read-only data statement.", doesNotProve: "It does not disclose full exposure duration or download history.", lastUsedAt: "2026-06-05T11:15:00+05:30" },
      { id: "src-deccan-herald-jee-data", name: "Deccan Herald", url: "https://www.deccanherald.com/", type: "Established media", reliabilityLabel: "Established media", supports: "Reported details of the JEE Advanced data exposure and ethical researcher disclosure.", doesNotProve: "It does not confirm malicious use.", lastUsedAt: "2026-06-05T11:15:00+05:30" },
      { id: "src-sunday-guardian-jee-data", name: "Sunday Guardian Live", url: "https://sundayguardianlive.com/", type: "Established media", reliabilityLabel: "Established media", supports: "Reported question of whether JEE Advanced 2026 data leaked and public concern around exposure.", doesNotProve: "It does not establish alteration or exploitation.", lastUsedAt: "2026-06-05T11:15:00+05:30" },
      { id: "src-outlook-jee-cjp", name: "Outlook India", url: "https://www.outlookindia.com/", type: "Established media", reliabilityLabel: "Established media", supports: "Reported CJP response and demand after the JEE data exposure.", doesNotProve: "It does not make CJP's political attribution a verified finding.", lastUsedAt: "2026-06-05T11:15:00+05:30" }
    ],
    lastCheckedAt: "2026-06-05T11:15:00+05:30",
    lastUpdatedAt: "2026-06-05T11:15:00+05:30",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    createdAt: "2026-06-05T11:15:00+05:30",
    updatedAt: "2026-06-05T11:15:00+05:30",
    publishedAt: "2026-06-05T11:15:00+05:30",
    approvedBy: "Cockroach Watch India Editorial Desk"
  },
  {
    id: "live-cjp-june-6-timeline-2026",
    slug: "cockroach-janta-party-what-is-cjp-june-6-protest",
    title: "Cockroach Janta Party: from CJI's remark to Jantar Mantar - a CWI source-backed timeline",
    summary: "The PDF tracks CJP from the May 15 cockroach remark and May 16 launch to platform actions, first press conference, Sonam Wangchuk support, Dipke's airport U-turn, and the June 6 Jantar Mantar test.",
    content: "Short answer: Cockroach Janta Party is a youth-led satirical political movement founded by Abhijeet Dipke after the May 15 cockroach remark. It grew rapidly online, faced platform and website restrictions, held its first press conference on June 3, and made Education Minister Dharmendra Pradhan's resignation its central demand. The June 6 Jantar Mantar protest remains developing until permission and outcome are verified.",
    status: "Developing",
    sections: ["lead-story", "top-3", "what-changed", "latest-updates", "verification-desk", "featured"],
    category: "Youth Voice / Civic Movement",
    isLeadStory: true,
    topStoryRank: 1,
    priorityScore: 100,
    changeType: "New update",
    labels: ["NEW TODAY", "UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote: "Claims about Instagram hacking, deportation, airport arrest, protest permission, and crowd size must stay reported or developing until primary evidence appears.",
    whatChanged: "The PDF adds a complete CJP timeline: May 15 remark, May 16 launch, rapid follower growth, website/X actions, June 3 press conference, June 4 airport U-turn, deportation fact-check framing, and June 6 developing protest status.",
    whatWeKnow: "CJP launched after the reported May 15 remark; multiple outlets covered its rapid growth; its website and X account faced restrictions; CJP held a June 3 press conference; Dipke asked supporters not to gather at Delhi airport on June 4; Education Minister Pradhan had not resigned by June 5.",
    whatWeDontKnow: "CWI has not independently verified every follower count, Instagram hacking claim, deportation rumour, protest permission status, airport arrest claim, or final June 6 protest outcome.",
    sourceGap: "Primary government blocking order, platform notices, Delhi Police permission document, and full protest outcome reports are still needed.",
    sourceTrail: [
      { id: "src-reuters-cjp-viral", name: "Reuters", url: "https://www.reuters.com/", type: "Established media", reliabilityLabel: "Wire source", supports: "CJP viral growth and Gen Z worries context.", doesNotProve: "It does not verify every social follower or campaign claim by itself.", lastUsedAt: "2026-06-05T11:20:00+05:30" },
      { id: "src-aljazeera-cjp-website", name: "Al Jazeera", url: "https://www.aljazeera.com/amp/economy/2026/5/23/cockroach-janta-partys-founder-says-indian-government-took-website-down", type: "Established media", reliabilityLabel: "Established media", supports: "Attributed website blocking claim and founder framing.", doesNotProve: "It does not publish the full government order.", lastUsedAt: "2026-06-05T11:20:00+05:30" },
      { id: "src-cnbc-cjp-investors", name: "CNBC", url: "https://www.cnbc.com/", type: "Established media", reliabilityLabel: "Established media", supports: "June 4 global/business coverage of CJP's public visibility.", doesNotProve: "It does not settle protest permission or legal claims.", lastUsedAt: "2026-06-05T11:20:00+05:30" },
      { id: "src-the-federal-pti-wangchuk-cjp", name: "The Federal / PTI", url: "https://thefederal.com/", type: "Established media", reliabilityLabel: "Established media", supports: "Reported Sonam Wangchuk support for June 6 if Pradhan did not resign.", doesNotProve: "It does not prove attendance or protest outcome.", lastUsedAt: "2026-06-05T11:20:00+05:30" },
      { id: "src-theweek-cjp-airport-uturn", name: "The Week", url: "https://www.theweek.in/", type: "Established media", reliabilityLabel: "Established media", supports: "June 4 airport U-turn and supporter guidance context.", doesNotProve: "It does not prove arrest status.", lastUsedAt: "2026-06-05T11:20:00+05:30" },
      { id: "src-sunday-guardian-cjp-airport", name: "Sunday Guardian Live", url: "https://sundayguardianlive.com/", type: "Established media", reliabilityLabel: "Established media", supports: "Reported Dipke airport return/protest-turn coverage.", doesNotProve: "It does not verify every viral deportation claim.", lastUsedAt: "2026-06-05T11:20:00+05:30" }
    ],
    lastCheckedAt: "2026-06-05T11:20:00+05:30",
    lastUpdatedAt: "2026-06-05T11:20:00+05:30",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    createdAt: "2026-06-05T11:20:00+05:30",
    updatedAt: "2026-06-05T11:20:00+05:30",
    publishedAt: "2026-06-05T11:20:00+05:30",
    approvedBy: "Cockroach Watch India Editorial Desk"
  },
  {
    id: "live-sonam-wangchuk-cjp-june-6-2026",
    slug: "sonam-wangchuk-cjp-june-6-protest-support-explained",
    title: "Sonam Wangchuk and CJP: why his June 6 support matters and what remains developing",
    summary: "The PDF connects Sonam Wangchuk's recent Ladakh movement history with his reported support for the June 6 CJP protest if the Education Minister did not resign by June 5.",
    content: "Short answer: Sonam Wangchuk's reported support gives the CJP June 6 protest a wider education-reform and civic-accountability context. The PDF says he would join the Jantar Mantar protest if Dharmendra Pradhan did not resign by June 5. CWI treats his support as source-backed reporting, while attendance, permission, and protest outcome remain developing.",
    status: "Source-backed",
    sections: ["what-changed", "latest-updates", "verification-desk"],
    category: "Youth Voice / Civic Movement",
    isLeadStory: false,
    priorityScore: 94,
    changeType: "New update",
    labels: ["NEW TODAY", "UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote: "Wangchuk's support should be covered as a reported public-interest development, not as proof that all CJP demands or protest logistics are verified.",
    whatChanged: "The PDF adds Wangchuk's post-NSA-release context, Ladakh Sixth Schedule/statehood background, and his reported June 2-3 statement about joining the CJP protest if Pradhan did not resign by June 5.",
    whatWeKnow: "Wangchuk was released from Jodhpur Central Jail on March 14, 2026 after NSA charges were dropped; Ladakh's statehood and Sixth Schedule demands remain unresolved; PTI-linked reporting says he spoke to Dipke and said he would join the June 6 protest if the Education Minister did not resign by June 5.",
    whatWeDontKnow: "CWI has not independently verified whether Wangchuk ultimately attended, whether protest permission was granted, or whether any official education-ministry response followed before June 6.",
    sourceGap: "Primary Wangchuk statement, full PTI copy, and June 6 attendance/outcome reports are still useful.",
    sourceTrail: [
      { id: "src-pti-wangchuk-cjp", name: "PTI / The Federal", url: "https://thefederal.com/", type: "Established media", reliabilityLabel: "Established media", supports: "Reported Wangchuk support for the CJP June 6 protest conditional on Pradhan not resigning by June 5.", doesNotProve: "It does not prove final attendance or protest outcome.", lastUsedAt: "2026-06-05T11:25:00+05:30" },
      { id: "src-wangchuk-ladakh-context-pack", name: "CWI PDF research pack", url: "https://cockroachwatchindia.online/live-newsroom", type: "User-submitted", reliabilityLabel: "Editor supplied research pack", supports: "Compiled context on Wangchuk's Ladakh movement background and March 2026 release.", doesNotProve: "Primary government and court records remain useful for legal-history detail.", lastUsedAt: "2026-06-05T11:25:00+05:30" },
      { id: "src-ladakh-mha-context", name: "Ministry of Home Affairs context via reported statements", url: "https://www.mha.gov.in/", type: "Official", reliabilityLabel: "Official source reference", supports: "Official context should be used for Ladakh dialogue and security-law developments where available.", doesNotProve: "The PDF summary still needs direct official links for every legal detail.", lastUsedAt: "2026-06-05T11:25:00+05:30" }
    ],
    lastCheckedAt: "2026-06-05T11:25:00+05:30",
    lastUpdatedAt: "2026-06-05T11:25:00+05:30",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    createdAt: "2026-06-05T11:25:00+05:30",
    updatedAt: "2026-06-05T11:25:00+05:30",
    publishedAt: "2026-06-05T11:25:00+05:30",
    approvedBy: "Cockroach Watch India Editorial Desk"
  }
];

export const liveNewsroomItems: LiveNewsroomItem[] = [
  ...june14LiveNewsroomItems,
  ...june2026LiveNewsroomItems,
  ...baseLiveNewsroomItems
];

export const publicAdvisories: PublicAdvisory[] = [
  {
    id: "adv-peaceful-protest-source-aware-june-2026",
    slug: "peaceful-protest-verified-information-public-accountability",
    type: "Verify before sharing",
    title: "Peaceful protest. Verified information. Public accountability.",
    warning: "Student protest must remain peaceful, lawful, source-aware, and free from violence, hate, misinformation, and reckless rumours.",
    whatToRead:
      "Read the June 8 CWI protest advisory and verify NEET, CBSE, NTA and protest claims before forwarding screenshots or calls to action.",
    context: "CWI believes the credibility of a student movement comes from clear demands, lawful assembly, verified information, and public accountability.",
    relatedLink: "/live-newsroom/peaceful-protest-advisory-student-movements-credible-june-2026",
    relatedLinkText: "Open peaceful protest advisory",
    lastUpdatedAt: "2026-06-08T10:30:00+05:30",
    priority: "high"
  },
  {
    id: "adv-neet-cbse-official-links",
    slug: "verify-neet-cbse-official-links-before-sharing",
    type: "Verify before sharing",
    title: "Before forwarding an exam update, open the official notice page",
    warning: "Screenshots about NEET, CBSE marks, re-exams, or re-evaluation can move faster than official notices.",
    whatToRead:
      "Check the NTA NEET notice page, CBSE latest notices, and Pariksha Sangam before changing plans or sharing advice.",
    context: "Student safety comes before virality.",
    relatedLink: "/live-newsroom/neet-cbse-student-help-official-links-before-sharing",
    relatedLinkText: "Open student advisory",
    lastUpdatedAt: "2026-05-30T10:30:00+05:30",
    priority: "high"
  },
  {
    id: "adv-cbse-osm-screenshot-context",
    slug: "cbse-osm-screenshot-context",
    type: "Screenshot context",
    title: "OSM screenshots need original links, timestamps, and source context",
    warning: "A screenshot alone cannot prove whether a CBSE portal claim is live-system evidence, test data, or edited context.",
    whatToRead:
      "Look for the original post, timestamp, URL context, official response, and whether an independent technical review exists.",
    relatedLink: "/live-newsroom/cbse-osm-portal-claims-what-is-official-and-what-is-disputed",
    relatedLinkText: "Open verification note",
    lastUpdatedAt: "2026-05-30T09:30:00+05:30",
    priority: "normal"
  },
  {
    id: "adv-cji-quote-cards",
    slug: "viral-quote-card-context",
    type: "Verify before sharing",
    title: "Do not share quote cards without primary context",
    warning: "Viral CJI/CJP quote cards can mix reported wording, commentary, satire, and political anger.",
    whatToRead:
      "Check whether the post links to the original court context, a primary clarification, or at least two named media reports.",
    relatedLink: "/live-newsroom/cji-cockroach-remark-cjp-context-needs-primary-source",
    relatedLinkText: "Open source request",
    lastUpdatedAt: "2026-05-30T08:15:00+05:30",
    priority: "normal"
  }
];

export const claimTrackerItems: ClaimTrackerItem[] = [
  {
    id: "claim-cbse-osm-breach",
    claim: "The CBSE OSM production portal was compromised and real evaluation data was exposed.",
    firstSeenAt: "2026-05-26T12:00:00+05:30",
    status: "Developing",
    evidenceLevel: "Developing",
    cwiNote:
      "CBSE's reported position is that the cited URL was a testing/dummy platform. The social-media claimant disputes that. CWI needs independent technical evidence before calling the claim settled.",
    sourceGap: "Independent audit evidence or primary CBSE technical note.",
    sources: [sourceMap.cbseLatest, sourceMap.ndtvCbseOsm],
    lastCheckedAt: "2026-05-30T09:30:00+05:30",
    approvalStatus: "approved",
    createdAt: "2026-05-30T08:05:00+05:30",
    updatedAt: "2026-05-30T09:30:00+05:30"
  },
  {
    id: "claim-cji-quote-card",
    claim: "Every viral CJI 'cockroach' quote card accurately represents the full court context.",
    firstSeenAt: "2026-05-16T09:00:00+05:30",
    status: "Needs Source",
    evidenceLevel: "Needs Source",
    cwiNote:
      "Media reports document a clarification, but CWI still needs primary context before treating every quote-card version as accurate.",
    sourceGap: "Full transcript or authoritative primary clarification.",
    sources: [sourceMap.nationalHeraldCji, sourceMap.financialExpressCji],
    lastCheckedAt: "2026-05-30T08:15:00+05:30",
    approvalStatus: "approved",
    createdAt: "2026-05-30T07:55:00+05:30",
    updatedAt: "2026-05-30T08:15:00+05:30"
  }
];

export const corrections: Correction[] = [];

export const sources: Source[] = [
  ...june14Sources,
  sourceMap.ntaNeetPublicNotices,
  sourceMap.cbseLatest,
  sourceMap.cbseCirculars,
  sourceMap.parikshaSangam,
  sourceMap.teleManas,
  sourceMap.indianExpressNeetProbe,
  sourceMap.ndtvCbseOsm,
  sourceMap.nationalHeraldCji
];

export function getPublicLiveNewsroomItems(): LiveNewsroomItem[] {
  return liveNewsroomItems
    .filter((item) => item.approvalStatus === "approved" && Boolean(item.publishedAt) && !item.hiddenFromLiveNewsroom)
    .sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime());
}

export function getLeadStory(): LiveNewsroomItem | undefined {
  const publicItems = getPublicLiveNewsroomItems();
  return (
    publicItems.find((item) => item.isLeadStory) ??
    [...publicItems].sort((a, b) => b.priorityScore - a.priorityScore)[0]
  );
}

export function getTodaysTopItems(limit = 3): LiveNewsroomItem[] {
  const leadStory = getLeadStory();
  const leadId = leadStory?.id;

  return getPublicLiveNewsroomItems()
    .filter((item) => item.sections.includes("top-3") && item.id !== leadId)
    .sort((a, b) => (a.topStoryRank ?? 99) - (b.topStoryRank ?? 99) || b.priorityScore - a.priorityScore)
    .slice(0, limit);
}

export function getWhatChangedToday(limit = 6): LiveNewsroomItem[] {
  return getPublicLiveNewsroomItems()
    .filter((item) => item.sections.includes("what-changed"))
    .slice(0, limit);
}

export function getLiveUpdates(limit = 10): LiveNewsroomItem[] {
  return getPublicLiveNewsroomItems()
    .filter((item) => item.sections.includes("latest-updates") || item.sections.includes("featured"))
    .slice(0, limit);
}

export function getVerificationDeskItems(): LiveNewsroomItem[] {
  return getPublicLiveNewsroomItems().filter((item) => item.sections.includes("verification-desk"));
}

export function getPublicAdvisories(): PublicAdvisory[] {
  return [...publicAdvisories].sort(
    (a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime()
  );
}

export function getSourceBackedReports(): LiveNewsroomItem[] {
  return getPublicLiveNewsroomItems().filter(
    (item) => item.status === "Source-backed" || item.status === "Verified"
  );
}

export function getItemBySlug(slug: string): LiveNewsroomItem | undefined {
  return getPublicLiveNewsroomItems().find((item) => item.slug === slug);
}




