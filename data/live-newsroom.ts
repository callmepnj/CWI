// Live Newsroom - daily, source-led editorial records.

export type NewsroomItemStatus =
  | "Verified"
  | "Source-backed"
  | "Developing"
  | "Public Advisory"
  | "Needs Source"
  | "Correction"
  | "Reported"
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
    lastUsedAt: "2026-05-28T10:45:00+05:30"
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
    lastUsedAt: "2026-05-28T10:45:00+05:30"
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
    lastUsedAt: "2026-05-28T09:30:00+05:30"
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
    lastUsedAt: "2026-05-28T09:30:00+05:30"
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
    lastUsedAt: "2026-05-28T09:30:00+05:30"
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
    lastUsedAt: "2026-05-28T10:45:00+05:30"
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
    lastUsedAt: "2026-05-28T10:45:00+05:30"
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
    lastUsedAt: "2026-05-28T10:45:00+05:30"
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
    lastUsedAt: "2026-05-28T09:30:00+05:30"
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
    lastUsedAt: "2026-05-28T08:15:00+05:30"
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
    lastUsedAt: "2026-05-28T08:15:00+05:30"
  }
} satisfies Record<string, Source>;

export const todaysBriefs: TodaysBrief[] = [
  {
    id: "brief-2026-05-28",
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
    approvedAt: "2026-05-28T11:00:00+05:30",
    createdAt: "2026-05-28T07:30:00+05:30",
    updatedAt: "2026-05-28T11:00:00+05:30"
  }
];

export const liveNewsroomItems: LiveNewsroomItem[] = [
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
    lastCheckedAt: "2026-05-28T10:45:00+05:30",
    lastUpdatedAt: "2026-05-28T10:45:00+05:30",
    displayImage: "/images/cwi-unanswered-files/neet-paper-leak/hero.jpg",
    displayImageAlt: "CWI editorial visual on NEET exam accountability and student verification",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    createdAt: "2026-05-28T08:20:00+05:30",
    updatedAt: "2026-05-28T10:45:00+05:30",
    publishedAt: "2026-05-28T10:45:00+05:30",
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
    lastCheckedAt: "2026-05-28T10:30:00+05:30",
    lastUpdatedAt: "2026-05-28T10:30:00+05:30",
    displayImage: "/images/cwi-unanswered-files/neet-paper-leak/hero.jpg",
    displayImageAlt: "Student exam stress and public accountability visual for CWI advisory",
    correctionOpen: true,
    sourceRequestOpen: false,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    createdAt: "2026-05-28T07:45:00+05:30",
    updatedAt: "2026-05-28T10:30:00+05:30",
    publishedAt: "2026-05-28T10:30:00+05:30",
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
    lastCheckedAt: "2026-05-28T09:30:00+05:30",
    lastUpdatedAt: "2026-05-28T09:30:00+05:30",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    createdAt: "2026-05-28T08:00:00+05:30",
    updatedAt: "2026-05-28T09:30:00+05:30",
    publishedAt: "2026-05-28T09:30:00+05:30",
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
    lastCheckedAt: "2026-05-28T08:15:00+05:30",
    lastUpdatedAt: "2026-05-28T08:15:00+05:30",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    createdAt: "2026-05-28T07:55:00+05:30",
    updatedAt: "2026-05-28T08:15:00+05:30",
    publishedAt: "2026-05-28T08:15:00+05:30",
    approvedBy: "PNJ / CWI Editorial Desk"
  }
];

export const publicAdvisories: PublicAdvisory[] = [
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
    lastUpdatedAt: "2026-05-28T10:30:00+05:30",
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
    lastUpdatedAt: "2026-05-28T09:30:00+05:30",
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
    lastUpdatedAt: "2026-05-28T08:15:00+05:30",
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
    lastCheckedAt: "2026-05-28T09:30:00+05:30",
    approvalStatus: "approved",
    createdAt: "2026-05-28T08:05:00+05:30",
    updatedAt: "2026-05-28T09:30:00+05:30"
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
    lastCheckedAt: "2026-05-28T08:15:00+05:30",
    approvalStatus: "approved",
    createdAt: "2026-05-28T07:55:00+05:30",
    updatedAt: "2026-05-28T08:15:00+05:30"
  }
];

export const corrections: Correction[] = [];

export const sources: Source[] = [
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
