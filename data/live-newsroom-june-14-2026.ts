import type { LiveNewsroomItem, Source } from "./live-newsroom";

const publishedAt = "2026-06-14T18:30:00+05:30";
const cwiDossierUrl = "https://cockroachwatchindia.online/live-newsroom";

const cwiJune14Dossier: Source = {
  id: "src-cwi-june-14-osint-dossier",
  name: "CWI editor-supplied OSINT master dossier",
  url: cwiDossierUrl,
  type: "User-submitted",
  reliabilityLabel: "Editor supplied research dossier",
  usedIn: "June 14 CWI Live Newsroom update",
  supports: "Chronology, editorial leads, and unverified-claims ledger supplied to CWI for the June 14 newsroom update.",
  doesNotProve: "It does not replace primary police orders, ministry records, court transcripts, platform notices, or full media URLs where those are not attached.",
  lastUsedAt: publishedAt
};

const tnieUltimatum: Source = {
  id: "src-tnie-cjp-june-13-ultimatum",
  name: "The New Indian Express - June 8 ultimatum report",
  url: "https://www.newindianexpress.com/india/2026/Jun/08/will-protest-across-states-if-pradhan-doesnt-resign-by-june-13-cjp-founder-dipke",
  type: "Established media",
  reliabilityLabel: "Reported",
  supports: "Reported Dipke warning of protests across states and cities if the Education Minister did not resign by June 13.",
  doesNotProve: "It does not prove every later protest size, every local permit, or final government response.",
  lastUsedAt: publishedAt
};

const outlookPune: Source = {
  id: "src-outlook-cjp-pune-sppu-june-12",
  name: "Outlook India - Pune SPPU CJP protest feature",
  url: "https://www.outlookindia.com/national/protest-from-home-ground-inside-the-cockroach-janta-partys-pune-show-of-strength",
  type: "Established media",
  reliabilityLabel: "Reported",
  supports: "Reported June 11 Pune SPPU protest, Dipke speech, and accountability demand framing.",
  doesNotProve: "It does not provide an official crowd count or prove every manifesto claim as policy fact.",
  lastUsedAt: publishedAt
};

const tnieLucknow: Source = {
  id: "src-tnie-lucknow-cjp-eco-garden-june-12",
  name: "The New Indian Express - Lucknow Eco Garden protest",
  url: "https://www.newindianexpress.com/states/uttar-pradesh/2026/Jun/12/lucknow-protest-over-exam-irregularities-draws-students-aspirants-cjp-chief-reiterate-pradhans-resignation",
  type: "Established media",
  reliabilityLabel: "Reported",
  supports: "Reported June 12 Lucknow protest at Eco Garden with students and government job aspirants demanding accountability over exam irregularities.",
  doesNotProve: "It does not independently verify every local chapter claim or all attendance estimates.",
  lastUsedAt: publishedAt
};

const indiaTodayLucknow: Source = {
  id: "src-india-today-lucknow-cjp-june-12",
  name: "India Today - Lucknow protest report",
  url: "https://www.indiatoday.in/amp/india/story/up-paper-leaks-protest-lucknow-eco-garden-students-reject-political-parties-2925923-2026-06-12",
  type: "Established media",
  reliabilityLabel: "Reported",
  supports: "Reported Lucknow protest context after Delhi and Pune, including student anger over exam paper leaks.",
  doesNotProve: "It does not settle exact crowd count or all organizational affiliations.",
  lastUsedAt: publishedAt
};

const toiBengaluru: Source = {
  id: "src-toi-bengaluru-prakash-raj-cjp-june-14",
  name: "Times of India - Bengaluru Freedom Park protest preview",
  url: "https://timesofindia.indiatimes.com/city/bengaluru/prakash-raj-to-join-cockroach-janata-party-protest-in-bengaluru-today/articleshow/131715299.cms",
  type: "Established media",
  reliabilityLabel: "Reported today",
  supports: "Reported June 14 Bengaluru protest plan at Freedom Park with Prakash Raj expected to join.",
  doesNotProve: "It does not prove final attendance, protest outcome, or every demand made on stage.",
  lastUsedAt: publishedAt
};

const toiAmritsar: Source = {
  id: "src-toi-amritsar-cjp-june-14",
  name: "Times of India - Amritsar CJP protest report",
  url: "https://timesofindia.indiatimes.com/city/chandigarh/cjp-holds-protest-in-amritsar-aap-workers-lend-voice/articleshow/131710624.cms",
  type: "Established media",
  reliabilityLabel: "Reported today",
  supports: "Reported Amritsar protest, moderate attendance, and participation by some AAP-linked individuals in a personal capacity.",
  doesNotProve: "It does not establish official party endorsement or final statewide turnout.",
  lastUsedAt: publishedAt
};

const toiJaipur: Source = {
  id: "src-toi-jaipur-cjp-protest-june-15-preview",
  name: "Times of India - Jaipur protest preview",
  url: "https://timesofindia.indiatimes.com/city/jaipur/cjp-to-hold-protest-in-jaipur-tomorrow-seeks-dharmendra-pradhans-resignation-over-neet-paper-leak/articleshow/131721146.cms",
  type: "Established media",
  reliabilityLabel: "Reported today",
  supports: "Reported planned Jaipur protest at Shaheed Smarak on June 15 demanding the Education Minister's resignation over the NEET paper leak issue.",
  doesNotProve: "It does not prove the protest occurred, attendance, or police permission status before June 15.",
  lastUsedAt: publishedAt
};

const etJantarMantar: Source = {
  id: "src-et-jantar-mantar-six-detained-june-8",
  name: "Economic Times - Jantar Mantar detentions report",
  url: "https://m.economictimes.com/news/politics-and-nation/6-detained-during-cockroach-janta-party-protest-at-delhis-jantar-mantar/articleshow/131548151.cms",
  type: "Established media",
  reliabilityLabel: "Reported",
  supports: "Reported six detentions during the Jantar Mantar protest and heavy security around the demonstration.",
  doesNotProve: "It does not identify every detained person or prove the motive/background of each individual.",
  lastUsedAt: publishedAt
};

const common = {
  lastCheckedAt: publishedAt,
  lastUpdatedAt: publishedAt,
  createdAt: publishedAt,
  updatedAt: publishedAt,
  publishedAt,
  approvedBy: "Cockroach Watch India Editorial Desk"
};

export const june14Sources: Source[] = [
  cwiJune14Dossier,
  tnieUltimatum,
  outlookPune,
  tnieLucknow,
  toiBengaluru,
  toiAmritsar,
  toiJaipur,
  etJantarMantar
];

export const june14LiveNewsroomItems: LiveNewsroomItem[] = [
  {
    id: "live-june-14-cjp-ultimatum-expired-national-mobilisation",
    slug: "cjp-june-13-ultimatum-expired-national-mobilisation-june-14-2026",
    title: "CJP After June 13: Ultimatum Expires, State-by-State Student Mobilisation Begins",
    summary: "CWI updates the record through June 14: the June 13 resignation ultimatum has passed, with CJP-linked protests reported or planned in Pune, Lucknow, Amritsar, Bengaluru and Jaipur.",
    content: "Short answer: CWI is treating the post-June 13 phase as a developing national mobilisation story, not as a settled institutional outcome. Reports show the movement expanding beyond Delhi into Pune, Lucknow, Amritsar, Bengaluru and Jaipur, while the central demand around Education Minister Dharmendra Pradhan remains political pressure rather than an official result. Crowd counts, local permissions and organizer claims must stay attributed.",
    status: "Developing",
    sections: ["lead-story", "top-3", "what-changed", "latest-updates", "verification-desk", "featured"],
    category: "Youth Voice / Exam Accountability",
    isLeadStory: true,
    topStoryRank: 1,
    priorityScore: 130,
    changeType: "New update",
    labels: ["NEW TODAY", "UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote: "Use reported/developing language for crowd counts, permission details, party participation and future strike dates. Do not describe any unverified June 25 strike or crackdown claims as fact.",
    whatChanged: "The June 14 dossier adds the expiry of the June 13 ultimatum, reported Pune and Lucknow mobilisations, today\'s Bengaluru/Amritsar/Jaipur updates, and a high-scrutiny ledger for unverified strike, funding and police-crackdown claims.",
    whatWeKnow: "The New Indian Express reported Dipke warning of protests across states if Pradhan did not resign by June 13. Outlook reported the June 11 Pune SPPU protest. The New Indian Express and India Today reported the June 12 Lucknow Eco Garden protest. Times of India reported June 14 Bengaluru, Amritsar and Jaipur developments.",
    whatWeDontKnow: "CWI has not verified final attendance numbers across all cities, full police permission records, every local organizer, all party affiliations, or whether a larger New Delhi action date has been officially locked.",
    sourceGap: "Primary protest permissions, official police logs, full organizer statements, city-wise footage archives, and ministry response are still needed.",
    sourceTrail: [cwiJune14Dossier, tnieUltimatum, outlookPune, tnieLucknow, indiaTodayLucknow, toiBengaluru, toiAmritsar, toiJaipur],
    displayImage: "/images/cwi-unanswered-files/neet-paper-leak/hero.jpg",
    displayImageAlt: "CWI visual for national student mobilisation after June 13 ultimatum",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    ...common
  },
  {
    id: "live-june-14-pune-lucknow-regional-expansion",
    slug: "pune-lucknow-cjp-regional-expansion-exam-protests-june-2026",
    title: "Pune to Lucknow: CJP's Exam-Accountability Protest Moves Into Regional Student Hubs",
    summary: "Pune SPPU and Lucknow Eco Garden reports show the movement expanding from a Delhi-centred protest into regional student and aspirant networks.",
    content: "Short answer: Pune and Lucknow are now part of the source-backed regional-expansion record. Outlook reported thousands at SPPU demanding accountability on June 11. The New Indian Express reported students and government job aspirants gathering at Lucknow's Eco Garden on June 12. CWI will not merge these into one crowd-size claim; each city needs its own source trail.",
    status: "Source-backed",
    sections: ["top-3", "what-changed", "latest-updates", "featured"],
    category: "Regional Protest / Students",
    isLeadStory: false,
    topStoryRank: 2,
    priorityScore: 122,
    changeType: "Source added",
    labels: ["NEW TODAY", "UPDATED TODAY"],
    editorNote: "Keep Pune, Lucknow and Delhi as separate records. Do not reuse the highest crowd estimate across cities.",
    whatChanged: "CWI added source-backed regional records for Pune SPPU and Lucknow Eco Garden, including the demand for accountability over exam irregularities and the resignation demand around the Education Minister.",
    whatWeKnow: "Outlook reported the Pune SPPU show of strength on June 11. The New Indian Express reported Lucknow Eco Garden protest participation by students and aspirants on June 12. India Today separately reported Lucknow protest context after Delhi and Pune.",
    whatWeDontKnow: "Official attendance numbers, exact permit terms, complete organizer list, and whether each protest produced any formal institutional response remain unclear.",
    sourceGap: "Police permission records and city-wise organizer statements are still needed.",
    sourceTrail: [outlookPune, tnieLucknow, indiaTodayLucknow, cwiJune14Dossier],
    displayImage: "/images/cwi-unanswered-files/neet-paper-leak/hero.jpg",
    displayImageAlt: "CWI visual for Pune and Lucknow student protest expansion",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    ...common
  },
  {
    id: "live-june-14-bengaluru-amritsar-jaipur-watch",
    slug: "bengaluru-amritsar-jaipur-cjp-protest-watch-june-14-2026",
    title: "Bengaluru, Amritsar, Jaipur: CWI Watchlist for June 14-15 CJP Protests",
    summary: "Times of India reported Bengaluru and Amritsar developments today and a Jaipur protest planned for June 15. CWI marks this as a city watchlist until outcomes are verified.",
    content: "Short answer: Bengaluru, Amritsar and Jaipur are now on CWI's city watchlist. Times of India reported Prakash Raj was expected to join a June 14 Bengaluru protest, reported an Amritsar protest with some AAP-linked individuals participating personally, and reported a Jaipur protest planned for June 15. CWI treats planned and completed protests differently: Bengaluru/Amritsar need outcome checks; Jaipur is still a preview until it happens.",
    status: "Reported",
    sections: ["top-3", "what-changed", "latest-updates", "verification-desk", "featured"],
    category: "City Watch / Protest",
    isLeadStory: false,
    topStoryRank: 3,
    priorityScore: 120,
    changeType: "New update",
    labels: ["NEW TODAY", "SOURCE REQUEST OPEN"],
    editorNote: "Do not treat personal participation by political workers as official party support unless the party formally says so. Keep Jaipur as planned until verified after June 15.",
    whatChanged: "CWI added June 14 city-watch entries for Bengaluru, Amritsar and Jaipur, including the need to verify final attendance, police conditions and whether party-linked participation is personal or official.",
    whatWeKnow: "Times of India reported the Bengaluru plan involving Prakash Raj, the Amritsar protest and AAP-linked individual participation, and a Jaipur protest planned for June 15 at Shaheed Smarak.",
    whatWeDontKnow: "Final protest outcomes, attendance, police permissions, speeches, detentions, and formal party positions remain to be verified city by city.",
    sourceGap: "Post-event reports, police records, organizer statements and complete footage are needed for each city.",
    sourceTrail: [toiBengaluru, toiAmritsar, toiJaipur, cwiJune14Dossier],
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    ...common
  },
  {
    id: "live-june-14-unverified-claims-ledger",
    slug: "cjp-unverified-claims-ledger-june-14-2026",
    title: "CJP Unverified Claims Ledger: Strike Date, Foreign Funding Screenshots and Crackdown Rumours",
    summary: "CWI quarantines high-risk claims from the June 14 dossier: a possible June 25 strike date, foreign-funding screenshots and alleged Patna crackdowns are not confirmed.",
    content: "Short answer: CWI is not publishing the June 25 strike date, foreign-funding screenshot chains, or Patna crackdown clips as confirmed facts. They remain quarantined until primary sources, police records, platform metadata or named reporting supports them. Readers should not forward these claims as verified.",
    status: "Unverified",
    sections: ["what-changed", "latest-updates", "verification-desk", "public-advisory"],
    category: "Verification Desk",
    isLeadStory: false,
    priorityScore: 118,
    changeType: "Advisory posted",
    labels: ["NEW TODAY", "SOURCE REQUEST OPEN"],
    editorNote: "This item exists to stop unsafe amplification. Keep the wording blunt: unverified, quarantined, official clarification awaited.",
    whatChanged: "CWI added a high-scrutiny isolation zone for three fast-moving claims in the June 14 dossier: a claimed June 25 strike date, alleged foreign-funding banking screenshots, and claimed Patna dormitory crackdowns.",
    whatWeKnow: "The dossier says these claims are active across student networks but lack absolute evidentiary confirmation. It also says the foreign-funding screenshots show manipulation indicators and metadata stripping, and that regional strings found no verified police logs or hospital admission charts for Patna crackdowns.",
    whatWeDontKnow: "CWI has not seen official strike confirmation, bank-record authentication, platform metadata, police logs, hospital records or named reporting that confirms these claims.",
    sourceGap: "Primary CJP announcement, police logs, hospital records, forensic metadata, bank-record authentication and named media reports are required before escalation.",
    sourceTrail: [cwiJune14Dossier],
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    ...common
  },
  {
    id: "live-june-14-neet-june-21-security-audit-watch",
    slug: "neet-june-21-reexam-security-audit-watch-cwi-june-14-2026",
    title: "NEET June 21 Re-Exam: CWI Opens Security Audit Watch",
    summary: "With the NEET re-exam approaching on June 21, CWI is tracking whether NTA publishes enough security detail to reassure 22 lakh affected students.",
    content: "Short answer: The NEET June 21 re-exam remains an active security-audit watch. CWI has recorded earlier NTA security assurances and the June 14 dossier's concern that students still need a transparent paper-protection protocol. Fresh paper-sale messages or Telegram claims remain unverified unless official sources confirm them.",
    status: "Developing",
    sections: ["what-changed", "latest-updates", "verification-desk", "public-advisory", "featured"],
    category: "NEET 2026 / Security Watch",
    isLeadStory: false,
    priorityScore: 116,
    changeType: "Status changed",
    labels: ["UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote: "Keep this focused on student safety and official notices. Do not amplify fresh leak-sale claims without NTA, court or investigative confirmation.",
    whatChanged: "CWI added a June 14 security-watch angle for the June 21 NEET re-exam, based on the dossier's emphasis on paper-protection transparency and student concern.",
    whatWeKnow: "Earlier CWI records cite NTA's security-assurance framing and the scheduled June 21 re-exam. The June 14 dossier says transparency around physical paper protection remains a major point of contention for student groups.",
    whatWeDontKnow: "CWI has not reviewed the full final re-exam security protocol, centre-wise safeguards, transport-chain controls, or any fresh official leak confirmation.",
    sourceGap: "Final NTA protocol, court affidavit text, centre-wise instructions, police coordination notice and official fraud-warning permalinks are needed.",
    sourceTrail: [cwiJune14Dossier, tnieUltimatum],
    displayImage: "/images/cwi-unanswered-files/neet-paper-leak/hero.jpg",
    displayImageAlt: "CWI visual for NEET June 21 re-exam security audit watch",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    ...common
  }
];
