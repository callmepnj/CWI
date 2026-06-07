import type { LiveNewsroomItem } from "./live-newsroom";

const publishedAt = "2026-06-08T10:30:00+05:30";
const sourcePackUrl = "https://cockroachwatchindia.online/live-newsroom";

const researchPackSource = {
  id: "src-cwi-june-8-research-pack",
  name: "CWI editor-supplied research pack, 30 May-8 June 2026",
  url: sourcePackUrl,
  type: "User-submitted" as const,
  reliabilityLabel: "Editor supplied research data",
  supports: "Compiled CWI research notes used as the only source material for this June 8 newsroom update.",
  doesNotProve: "It does not replace primary official orders, affidavits, police permissions, or agency notices where those are not directly linked.",
  lastUsedAt: publishedAt
};

const ntaOfficialSource = {
  id: "src-nta-neet-june-2026-official",
  name: "NTA NEET(UG) official public notices and X denial referenced in research pack",
  url: "https://neet.nta.nic.in/document-category/public-notices/",
  type: "Official" as const,
  reliabilityLabel: "Official",
  supports: "NEET re-exam date, city intimation/refund windows where posted, and NTA denial of fresh re-exam paper-leak sale messages described in the research data.",
  doesNotProve: "It does not verify Telegram screenshots or private paper-sale claims.",
  lastUsedAt: publishedAt
};

const cbseOfficialSource = {
  id: "src-cbse-osm-june-2026-official",
  name: "CBSE official communications referenced in research pack",
  url: "https://www.cbse.gov.in/cbsenew/cbse.html",
  type: "Official" as const,
  reliabilityLabel: "Official",
  supports: "CBSE OSM portal, re-evaluation schedule, vendor penalty, cybersecurity hardening, and official student action routes where publicly posted.",
  doesNotProve: "It does not adjudicate every individual answer-sheet complaint.",
  lastUsedAt: publishedAt
};

const parliamentSource = {
  id: "src-parliament-committee-june-2026",
  name: "Parliamentary committee and DoPT probe details referenced in research pack",
  url: sourcePackUrl,
  type: "Official" as const,
  reliabilityLabel: "Official details via research pack",
  supports: "Reported agenda for Parliamentary Standing Committee meetings, NTA/CBSE testimony context, DoPT one-member OSM procurement probe, and transfer of senior CBSE officials.",
  doesNotProve: "It does not publish the full internal minutes or complete procurement file.",
  lastUsedAt: publishedAt
};

const policeProtestSource = {
  id: "src-delhi-police-cjp-permission-june-6",
  name: "Delhi Police Jantar Mantar permission order described in research pack",
  url: sourcePackUrl,
  type: "Official" as const,
  reliabilityLabel: "Official order via media/research pack",
  supports: "Permission for a one-time CJP protest at Jantar Mantar on 6 June 2026 from 10 am to 5 pm, subject to law-and-order and Supreme Court guideline conditions.",
  doesNotProve: "It does not settle exact turnout, every detention count, or every organizer instruction.",
  lastUsedAt: publishedAt
};

const mediaProtestSource = {
  id: "src-cjp-protest-media-june-6",
  name: "Al Jazeera, The News Mill, The Eastern Herald and other reports summarized in research pack",
  url: sourcePackUrl,
  type: "Established media" as const,
  reliabilityLabel: "Reported",
  supports: "Reported protest visuals, slogans, public reaction, crowd descriptions, CJP messaging, and student/youth framing.",
  doesNotProve: "It does not provide an official consolidated turnout or complete list of detained people.",
  lastUsedAt: publishedAt
};

const wangchukSource = {
  id: "src-sonam-wangchuk-education-discussion-june-2026",
  name: "Sonam Wangchuk public discussion and protest-support reports summarized in research pack",
  url: sourcePackUrl,
  type: "Established media" as const,
  reliabilityLabel: "Reported / public sentiment",
  supports: "Reported public discussion around Wangchuk as an education reform voice and his support for student accountability protests.",
  doesNotProve: "It does not prove any official appointment, government consideration, endorsement by CWI, or formal ministerial process.",
  lastUsedAt: publishedAt
};

const peacefulProtestParagraph = "CWI believes public protest must remain peaceful, disciplined, and source-aware. The strength of a student movement is not in chaos, but in clarity: clear demands, verified information, lawful assembly, and public accountability. India's youth have every right to ask questions about exams, jobs, fairness, and the future, but the movement must protect its credibility by rejecting violence, misinformation, hate, and reckless rumours.";

const wangchukDiscussionParagraph = "Amid growing frustration around exam integrity, student stress, and education accountability, some voices online have started asking whether India needs an education reformer, not just another political administrator, at the centre of national education policy. One name often discussed in youth and reform spaces is Sonam Wangchuk, known for his work around education, innovation, climate, and Ladakh's public movements. CWI is not presenting this as an official possibility or endorsement. This is a public sentiment question: what kind of leadership do students want for India's education system?";

const commonDates = {
  lastCheckedAt: publishedAt,
  lastUpdatedAt: publishedAt,
  createdAt: publishedAt,
  updatedAt: publishedAt,
  publishedAt,
  approvedBy: "Cockroach Watch India Editorial Desk"
};

export const june2026LiveNewsroomItems: LiveNewsroomItem[] = [
  {
    id: "live-june-8-peaceful-protest-student-anger",
    slug: "peaceful-protest-student-anger-education-accountability-june-2026",
    title: "From Online Anger to Peaceful Protest: What Students Are Asking",
    summary: "From 30 May to 8 June, CJP and student/youth anger moved from online satire into a reported peaceful Jantar Mantar protest focused on NEET, CBSE OSM, exam trust, youth frustration, and public accountability.",
    content: `Short answer: The June 6 Jantar Mantar protest is best treated as a reported peaceful youth movement with official permission context, not as a final policy outcome. The research data describes students, parents, and young supporters gathering around exam integrity, NEET accountability, CBSE OSM complaints, and wider education frustration. ${peacefulProtestParagraph}\n\nBadge: Peaceful protest. Verified information. Public accountability.`,
    status: "Reported",
    sections: ["lead-story", "top-3", "what-changed", "latest-updates", "verification-desk", "public-advisory", "featured"],
    category: "Students / Peaceful Protest",
    isLeadStory: true,
    topStoryRank: 1,
    priorityScore: 110,
    changeType: "New update",
    labels: ["NEW TODAY", "UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote: "CWI records the movement as peaceful and constitutional based on the supplied research, while turnout, detention numbers, and all individual quotes remain reported unless primary footage/order records are added.",
    whatChanged: "CWI added a June 8 record covering the 31 May protest call, Delhi Police permission for 6 June, reported Jantar Mantar visuals, peaceful-protest messaging, student interviews described in the research pack, and the shift from online meme to street protest.",
    whatWeKnow: "A CJP protest call was reported on 31 May; Delhi Police permission was described for a one-time Jantar Mantar protest on 6 June from 10 am to 5 pm; reports described young protesters using cockroach masks, exam books, flowers, slogans, and peaceful framing; CJP messaging connected the protest to NEET, CBSE OSM and wider exam accountability concerns.",
    whatWeDontKnow: "Exact turnout, final detention counts, the full list of participating student groups, and direct policy impact remain unclear. Some student interview details, crowd-size claims, and organizer logistics are reported rather than official consolidated records.",
    sourceGap: "Primary Delhi Police order copy, full protest footage archive, verified turnout estimate, and official post-protest statement are still useful additions.",
    sourceTrail: [researchPackSource, policeProtestSource, mediaProtestSource, ntaOfficialSource, cbseOfficialSource],
    displayImage: "/images/cwi-unanswered-files/neet-paper-leak/hero.jpg",
    displayImageAlt: "CWI Live Newsroom visual for peaceful student protest and education accountability",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    ...commonDates
  },
  {
    id: "live-june-8-neet-nta-exam-trust",
    slug: "neet-nta-exam-trust-accountability-continues-june-2026",
    title: "NEET, NTA and Exam Trust: Why Accountability Questions Continue",
    summary: "NTA's Supreme Court affidavit, the June 21 re-exam, CBI probe updates, city intimation, refund-window references, and fresh Telegram leak rumours keep NEET accountability at the centre of student concern.",
    content: "Short answer: NEET UG 2026 remains an official-plus-developing accountability story. NTA has described enhanced safeguards for the June 21 re-exam, including CCTV checks, mock drills, contingency planning, forensic review and new senior security/technology posts. Fresh Telegram claims about a re-exam paper leak are treated as unverified and contested because the research data says NTA denied any confirmed fresh leak and warned students against fraudulent paper-sale messages.",
    status: "Developing",
    sections: ["top-3", "what-changed", "latest-updates", "verification-desk", "public-advisory", "featured"],
    category: "Students / NEET Accountability",
    isLeadStory: false,
    topStoryRank: 2,
    priorityScore: 108,
    changeType: "New update",
    labels: ["NEW TODAY", "UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote: "Do not merge the confirmed original NEET cancellation/probe with fresh Telegram leak screenshots. The latter stays unverified unless an official body confirms it.",
    whatChanged: "CWI added the 30 May-8 June NEET thread: NTA's affidavit/security reforms, CBI/Parliamentary briefing context, June 21 re-exam logistics, city-intimation/refund-window references, and NTA's denial of fresh re-exam leak rumours.",
    whatWeKnow: "The research data says NTA told the Supreme Court the 3 May cancellation was in students' interest; enhanced re-exam security was described; the re-exam is scheduled for 21 June; city intimation and refund-window references were active around 6-7 June; CBI and NTA officials briefed a Parliamentary Standing Committee; NTA denied fresh paper-sale/leak messages as false and fraudulent.",
    whatWeDontKnow: "CWI has not reviewed the full affidavit text, all CBI filings, committee minutes, or the complete technical protocol. It remains unclear whether future NEET attempts, age limits, CBT shift, or direct NTA accountability changes will be formally notified.",
    sourceGap: "Full Supreme Court affidavit, NTA X denial permalink, Parliamentary committee minutes, CBI release, and final centre-wise re-exam protocol would strengthen this record.",
    sourceTrail: [researchPackSource, ntaOfficialSource, parliamentSource, mediaProtestSource],
    displayImage: "/images/cwi-unanswered-files/neet-paper-leak/hero.jpg",
    displayImageAlt: "CWI visual for NEET NTA accountability and exam trust",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    ...commonDates
  },
  {
    id: "live-june-8-peaceful-protest-advisory",
    slug: "peaceful-protest-advisory-student-movements-credible-june-2026",
    title: "Peaceful Protest Advisory: How Student Movements Can Stay Credible",
    summary: "A CWI public advisory for students and supporters: protest peacefully, verify before sharing, avoid hate and rumours, follow lawful assembly conditions, and keep exam accountability demands source-backed.",
    content: `Short answer: Peaceful protest protects student credibility. ${peacefulProtestParagraph} CWI's advisory is simple: carry verified demands, preserve source links, avoid rumour-based accusations, follow police and court conditions, keep emergency contacts, avoid blocking essential services, and reject violence or hate from any side.\n\nBadge: Peaceful protest. Verified information. Public accountability.`,
    status: "Public Advisory",
    sections: ["public-advisory", "what-changed", "latest-updates", "featured"],
    category: "Public Advisory / Students",
    isLeadStory: false,
    priorityScore: 104,
    changeType: "Advisory posted",
    labels: ["NEW TODAY", "UPDATED TODAY"],
    editorNote: "This is guidance, not a call for unlawful assembly. CWI supports constitutional, peaceful, source-aware civic action and rejects violence, hate, misinformation and reckless rumours.",
    whatChanged: "CWI added a dedicated peaceful-protest advisory linked to the June 6 Jantar Mantar research, Delhi Police permission context, and student/youth accountability demands.",
    whatWeKnow: "The research data describes the CJP protest as framed as peaceful and constitutional; Delhi Police permission was reported with time and guideline conditions; organizers reportedly asked supporters to keep the protest disciplined; CWI's role is documentation and verification.",
    whatWeDontKnow: "CWI cannot verify every instruction followed on the ground, every participant action, or every viral protest clip. Official clarification may still be needed for disputed incidents.",
    sourceGap: "Primary organizer advisory, police permission copy, and verified incident logs would improve this advisory.",
    sourceTrail: [researchPackSource, policeProtestSource, mediaProtestSource],
    displayImage: "/images/cwi-unanswered-files/farmers-msp-protest/hero.jpg",
    displayImageAlt: "CWI public advisory visual for peaceful constitutional protest",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    ...commonDates
  },
  {
    id: "live-june-8-sonam-wangchuk-education-leadership-discussion",
    slug: "sonam-wangchuk-education-reform-leadership-public-discussion-june-2026",
    title: "Should India Listen to Education Reform Voices Like Sonam Wangchuk?",
    summary: "CWI documents a public sentiment question, not an appointment claim: amid exam-integrity anger, some students and reform spaces are asking what kind of education leadership India needs.",
    content: `Short answer: This is a public discussion, not an official appointment claim. ${wangchukDiscussionParagraph} CWI is not endorsing any appointment and is not saying Sonam Wangchuk is becoming Education Minister. CWI is documenting public sentiment around education reform leadership, student trust, and the symbolic demand for people with deep education experience to be heard at national policy level.`,
    status: "Opinion / public sentiment",
    sections: ["what-changed", "latest-updates", "verification-desk", "featured"],
    category: "Education Reform / Public Sentiment",
    isLeadStory: false,
    priorityScore: 102,
    changeType: "New update",
    labels: ["NEW TODAY", "UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote: "Do not frame this as official. The safe wording is public discussion, symbolic demand, poll idea, and education reform debate.",
    whatChanged: "CWI added a responsible public-discussion record around Sonam Wangchuk as an education reform voice after reports described his support for the June 6 student accountability protest.",
    whatWeKnow: "The research data says Wangchuk is discussed in youth and reform spaces for education, innovation, climate and Ladakh public movements; reports linked him to support for the June 6 protest if the Education Minister did not resign by 5 June; students reportedly saw his intervention as broader than one exam.",
    whatWeDontKnow: "There is no official appointment process, no government announcement, and no verified claim that Wangchuk is becoming Education Minister. CWI does not know whether any ministry, party or official body is considering such an idea.",
    sourceGap: "Primary Wangchuk statement, full protest interview archive, and official ministry response would help separate public sentiment from policy reality.",
    sourceTrail: [researchPackSource, wangchukSource, mediaProtestSource],
    displayImage: "/images/cwi-unanswered-files/ladakh-sonam-wangchuk/hero.jpg",
    displayImageAlt: "CWI visual for Sonam Wangchuk education reform public discussion",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    ...commonDates
  },
  {
    id: "live-june-8-education-minister-public-poll",
    slug: "cwi-public-poll-education-minister-india-needs-june-2026",
    title: "CWI Public Poll: What Kind of Education Minister Does India Need?",
    summary: "CWI opens a public opinion poll asking whether India should consider education reform voices like Sonam Wangchuk for national education leadership, with a clear disclaimer that this is not official or an endorsement.",
    content: "Short answer: This is a CWI public opinion poll, not a government poll, election survey, endorsement, or appointment claim. The question is: Should India consider education reform voices like Sonam Wangchuk for national education leadership? Options include yes, no, maybe through an independent reform council, or not sure. The poll is meant to document public sentiment around education leadership after NEET, CBSE OSM, student stress, and accountability failures described in the June research data.",
    status: "Opinion / public sentiment",
    sections: ["what-changed", "latest-updates", "public-advisory", "featured"],
    category: "Public Poll / Education Reform",
    isLeadStory: false,
    priorityScore: 101,
    changeType: "New update",
    labels: ["NEW TODAY", "UPDATED TODAY"],
    editorNote: "Poll language must remain explicit: not official, not government, not appointment claim, not CWI endorsement. Results are public sentiment only.",
    whatChanged: "CWI added a public poll section to the Live Newsroom around education leadership, Sonam Wangchuk as a reform voice, and student demands for accountability.",
    whatWeKnow: "The research data describes public discussion around education reform leadership and Wangchuk's symbolic role in student/reform spaces. CWI can ask readers what kind of education leadership they want, while marking the poll as public opinion only.",
    whatWeDontKnow: "Poll results do not represent India, government policy, electoral data, or a verified appointment process. Device/session limits can reduce repeat voting but cannot fully prevent coordinated spam without collecting more personal data.",
    sourceGap: "Independent polling, official education-ministry response, and broader student-union statements would give stronger public-sentiment context.",
    sourceTrail: [researchPackSource, wangchukSource],
    displayImage: "/images/cwi-unanswered-files/ladakh-sonam-wangchuk/hero.jpg",
    displayImageAlt: "CWI public poll visual about education reform leadership in India",
    correctionOpen: true,
    sourceRequestOpen: false,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    ...commonDates
  },
  {
    id: "live-june-8-cbse-osm-nta-accountability-roundup",
    slug: "cbse-osm-nta-accountability-official-probe-june-2026",
    title: "CBSE OSM, DoPT Probe and Exam Accountability: What Is Official, Reported and Still Unclear",
    summary: "The Union government probe into CBSE OSM procurement, transfer of CBSE top officials, vendor penalty, portal security claims, and student complaints now sit beside NEET/NTA accountability demands.",
    content: "Short answer: CBSE OSM is now an official-probe story plus a reported student-grievance story. The research data says the Union Government ordered a one-member inquiry into OSM procurement, transferred CBSE Chairman Rahul Singh and Secretary Himanshu Gupta, and that CBSE penalised vendor Coempt Edu Teck after acknowledging technical discrepancies. Student complaints about blurred scans, mismatched sheets and unevaluated answers remain reported unless resolved case by case.",
    status: "Source-backed",
    sections: ["top-3", "what-changed", "latest-updates", "verification-desk", "featured"],
    category: "CBSE / Public Accountability",
    isLeadStory: false,
    topStoryRank: 3,
    priorityScore: 106,
    changeType: "New update",
    labels: ["NEW TODAY", "UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote: "Keep CBSE official actions, student complaints, cyber-attempt claims, and tender-favouritism questions in separate lanes. Do not state procurement wrongdoing as fact before the probe reports.",
    whatChanged: "CWI added the June 1-2 Centre intervention, DoPT inquiry, transfer of senior CBSE officials, vendor penalty, June 6 portal deadline, cyber-hardening claims, and Parliamentary Committee context.",
    whatWeKnow: "The research data says a one-member S. Radha Chauhan committee was set up with a one-month deadline; CBSE top officials were transferred; CBSE penalised Coempt Edu Teck; the re-evaluation portal was kept open until 6 June; cybersecurity experts from government agencies and IIT systems were reportedly deployed; nearly 100,000 unauthorised access attempts were reported via CBSE statements in media.",
    whatWeDontKnow: "The probe outcome, whether tender guidelines were relaxed to favour any vendor, full cyber logs, exact number of affected students, and final case-level student relief remain unclear.",
    sourceGap: "DoPT memo, CBSE vendor penalty order, committee terms, cyber incident report, and official affected-count data are still needed for final verification.",
    sourceTrail: [researchPackSource, cbseOfficialSource, parliamentSource],
    displayImage: "/images/cwi-unanswered-files/neet-paper-leak/hero.jpg",
    displayImageAlt: "CWI visual for CBSE OSM accountability and official probe",
    correctionOpen: true,
    sourceRequestOpen: true,
    hiddenFromLiveNewsroom: false,
    isArchivedContext: false,
    approvalStatus: "approved",
    ...commonDates
  }
];
