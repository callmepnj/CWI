import type { LiveNewsroomItem, Source } from "./live-newsroom";

const cwiDossierUrl = "https://cockroachwatchindia.online/live-newsroom";

const cwiJune20Dossier: Source = {
  id: "src-cwi-june-20-cjp-neet-dossier",
  name: "CWI editor-supplied June 13-20 CJP/NEET dossier",
  url: cwiDossierUrl,
  type: "User-submitted",
  reliabilityLabel: "Editor supplied research dossier",
  supports:
    "Editorial chronology and leads supplied to CWI for the June 15-20 Live Newsroom update sequence.",
  doesNotProve:
    "It does not replace named media reports, official police permissions, NTA notices, court records, or primary CJP statements.",
  lastUsedAt: "2026-06-20T19:00:00+05:30"
};

const toiJaipurSlap: Source = {
  id: "src-toi-cjp-jaipur-slap-june-16",
  name: "Times of India - CJP founder Abhijeet Dipke slapped at Jaipur protest",
  url: "https://timesofindia.indiatimes.com/india/cjp-founder-abhijeet-dipke-slapped-multiple-times-at-jaipur-protest-video/articleshow/131745646.cms",
  type: "Established media",
  reliabilityLabel: "Reported / PTI cited",
  supports:
    "Reported that Dipke was slapped during a CJP protest at Shaheed Smarak in Jaipur over alleged NEET paper leak and unemployment issues.",
  doesNotProve:
    "It does not establish the attackers' identity, motive, organisational affiliation, or full legal outcome.",
  lastUsedAt: "2026-06-16T12:00:00+05:30"
};

const alJazeeraCjpMonth: Source = {
  id: "src-aljazeera-cjp-month-june-16",
  name: "Al Jazeera - A month of India's Cockroach Janta Party",
  url: "https://www.aljazeera.com/news/2026/6/16/my-voice-is-being-heard-a-month-of-indias-cockroach-janta-party",
  type: "Established media",
  reliabilityLabel: "Reported / international media",
  supports:
    "Context on CJP's first month, June 6 Jantar Mantar rally, resignation deadline, heat-exhaustion incident, and youth protest framing.",
  doesNotProve:
    "It does not verify every later city protest claim or every social-media statistic.",
  lastUsedAt: "2026-06-16T13:00:00+05:30"
};

const toiNtaTelegram: Source = {
  id: "src-toi-nta-telegram-warning-june-16",
  name: "Times of India - NTA warning after Telegram ban",
  url: "https://timesofindia.indiatimes.com/education/news/nobody-can-access-question-paper-before-june-21-says-nta-after-banning-telegram/articleshow/131772467.cms",
  type: "Established media",
  reliabilityLabel: "Reported NTA message",
  supports:
    "Reported NTA's June 16 warning to NEET re-exam candidates and parents not to fall for Telegram scams claiming leaked question papers.",
  doesNotProve:
    "It does not independently audit the Telegram restriction, prove every scam claim, or settle paper-leak accountability questions.",
  lastUsedAt: "2026-06-16T18:00:00+05:30"
};

const toiNagpur: Source = {
  id: "src-toi-cjp-nagpur-june-17",
  name: "Times of India - Dipke meets NEET suicide victim's family, Nagpur protest",
  url: "https://timesofindia.indiatimes.com/city/nagpur/cjps-dipke-meets-neet-suicide-victims-family-seeks-1crore-relief/articleshow/131781141.cms",
  type: "Established media",
  reliabilityLabel: "Reported",
  supports:
    "Reported Dipke's visit to the family of Akanksha Chaturvedi, Rs 1 crore compensation demand, Nagpur protest, and June 20 Jantar Mantar escalation plan.",
  doesNotProve:
    "It does not independently verify all suicide-causation claims or allegations about the Jaipur attackers.",
  lastUsedAt: "2026-06-17T18:30:00+05:30"
};

const toiJantarMantarJune20: Source = {
  id: "src-toi-cjp-jantar-mantar-june-18",
  name: "Times of India - CJP to hold protest at Jantar Mantar on June 20",
  url: "https://timesofindia.indiatimes.com/city/delhi/cjp-to-hold-protest-at-jantar-mantar-on-june-20/articleshow/131838905.cms",
  type: "Established media",
  reliabilityLabel: "Reported",
  supports:
    "Reported CJP's June 20 Jantar Mantar protest announcement, demand for Dharmendra Pradhan's removal, and CJP's claim about 11 aspirant deaths.",
  doesNotProve:
    "It does not independently verify the claimed death count or final turnout on June 20.",
  lastUsedAt: "2026-06-18T23:30:00+05:30"
};

const tniePmLetter: Source = {
  id: "src-tnie-cjp-pm-letter-june-19",
  name: "The New Indian Express - CJP founder writes to PM Modi",
  url: "https://www.newindianexpress.com/india/2026/Jun/19/cjp-founder-writes-to-pm-modi-seeks-rs-1-crore-aid-for-families-of-students-who-died-by-suicide",
  type: "Established media",
  reliabilityLabel: "Reported",
  supports:
    "Reported Dipke's open letter to PM Modi seeking Rs 1 crore aid for families of students who allegedly died by suicide and removal of the Education Minister.",
  doesNotProve:
    "It does not verify each death as paper-leak-linked or prove government acceptance of the demand.",
  lastUsedAt: "2026-06-19T06:08:00+05:30"
};

const htPmLetter: Source = {
  id: "src-ht-cjp-pm-letter-june-19",
  name: "Hindustan Times - CJP open letter seeks Rs 1 crore compensation",
  url: "https://www.hindustantimes.com/india-news/cockroach-janta-party-in-open-letter-to-pm-demands-rs-1-crore-compensation-for-neet-paper-leak-linked-suicides-101781843776573.html",
  type: "Established media",
  reliabilityLabel: "Reported",
  supports:
    "Reported the Rs 1 crore compensation demand and Dipke's claim of 11 NEET aspirant deaths in a week, including five in 48 hours.",
  doesNotProve:
    "It records the claim and demand; CWI still needs official or independently verified death-by-death documentation.",
  lastUsedAt: "2026-06-19T10:26:00+05:30"
};

const toiThali: Source = {
  id: "src-toi-cjp-thali-chammach-june-20",
  name: "Times of India - Bring thali and chammach appeal",
  url: "https://timesofindia.indiatimes.com/india/bring-thali-and-chammach-cjps-abhijeet-dipke-urges-cockroaches-ahead-of-second-jantar-mantar-protest/articleshow/131862120.cms",
  type: "Established media",
  reliabilityLabel: "Reported",
  supports:
    "Reported Dipke's appeal asking June 20 Jantar Mantar protest attendees to bring a thali and chammach.",
  doesNotProve:
    "It does not prove final crowd size, police action, or protest outcome.",
  lastUsedAt: "2026-06-20T09:30:00+05:30"
};

const htLiveJune20: Source = {
  id: "src-ht-cjp-delhi-live-june-20",
  name: "Hindustan Times - CJP protest in Delhi live updates",
  url: "https://www.hindustantimes.com/india-news/cjp-protest-delhi-live-updates-abhijeet-dipke-jantar-mantar-cockroach-janta-party-sonam-wangchuk-dharmendra-pradhan-neet-101781924276120.html",
  type: "Established media",
  reliabilityLabel: "Live reported",
  supports:
    "Reported June 20 Chalo Dilli call, heavy security, scheduled 1 pm protest, permission status, plates-and-spoons symbolism, Telegram-ban criticism, and Sonam Wangchuk attendance claim.",
  doesNotProve:
    "Live pages can change; final turnout, detentions, police action, and outcome require later source checks.",
  lastUsedAt: "2026-06-20T12:00:00+05:30"
};

const common = {
  correctionOpen: true,
  sourceRequestOpen: true,
  hiddenFromLiveNewsroom: false,
  isArchivedContext: false,
  approvalStatus: "approved" as const,
  approvedBy: "Cockroach Watch India Editorial Desk"
};

export const june15To20LiveNewsroomItems: LiveNewsroomItem[] = [
  {
    id: "live-june-15-jaipur-cjp-protest-volatile",
    slug: "jaipur-cjp-protest-dipke-slapped-neet-accountability-june-15-2026",
    title: "Jaipur CJP Protest Turns Volatile: Dipke Slapped During NEET Accountability Demonstration",
    summary:
      "CWI adds the June 15 Jaipur flashpoint to the record: media reported that CJP founder Abhijeet Dipke was slapped during a Shaheed Smarak protest over alleged NEET paper leak and unemployment issues.",
    content:
      "Short answer: The Jaipur protest is a reported public-order and movement-safety flashpoint, not a settled account of who attacked whom or why. Times of India, citing police and eyewitnesses through PTI, reported that Dipke was slapped multiple times during a CJP demonstration at Shaheed Smarak. CWI is treating claims about attacker identity, motive, affiliation, and legal action as requiring further verification.",
    status: "Reported",
    sections: ["what-changed", "latest-updates", "verification-desk", "featured"],
    category: "Youth Voice / Protest Watch",
    isLeadStory: false,
    priorityScore: 138,
    changeType: "New update",
    labels: ["UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote:
      "Do not present attacker identity or organisational affiliation as fact without police records or independent verification.",
    whatChanged:
      "CWI added the Jaipur protest incident to the June 15-20 timeline and separated the verified report of an assault from unverified claims about who was behind it.",
    whatWeKnow:
      "Times of India reported that Dipke was slapped during a Jaipur CJP protest at Shaheed Smarak over alleged NEET paper leak and unemployment issues. The incident was reportedly captured on video and described by police and eyewitnesses cited by PTI.",
    whatWeDontKnow:
      "The attackers' identity, motive, organisational affiliation, FIR status, injuries, and final police action remain unclear from the available public reporting.",
    sourceGap: "Primary FIR, police statement, medical record if any, and full unedited video are still needed.",
    sourceTrail: [toiJaipurSlap, cwiJune20Dossier],
    lastCheckedAt: "2026-06-20T19:00:00+05:30",
    lastUpdatedAt: "2026-06-15T19:30:00+05:30",
    createdAt: "2026-06-15T19:30:00+05:30",
    updatedAt: "2026-06-15T19:30:00+05:30",
    publishedAt: "2026-06-15T19:30:00+05:30",
    ...common
  },
  {
    id: "live-june-16-cjp-month-nta-telegram-warning",
    slug: "cjp-one-month-nta-telegram-warning-neet-reexam-june-16-2026",
    title: "CJP at One Month, NTA Warns NEET Candidates Against Telegram Leak Scams",
    summary:
      "June 16 brought two parallel updates: international media documented CJP's first month, while NTA warned NEET re-exam candidates not to fall for Telegram paper-leak scams.",
    content:
      "Short answer: June 16 was both a movement-context day and an official caution day. Al Jazeera documented CJP's first month and the June 6 Jantar Mantar deadline politics. Times of India reported NTA's warning to NEET candidates and parents that nobody could access the June 21 question paper and that Telegram leak-sale claims should not be trusted.",
    status: "Developing",
    sections: ["what-changed", "latest-updates", "verification-desk", "public-advisory", "featured"],
    category: "NEET / Digital Verification",
    isLeadStory: false,
    priorityScore: 137,
    changeType: "Source added",
    labels: ["UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote:
      "Keep official NTA anti-scam warnings separate from wider accountability questions about the original paper-leak controversy.",
    whatChanged:
      "CWI added June 16 context: CJP's movement arc entered international coverage, and NTA issued a re-exam warning against Telegram-linked fake paper claims.",
    whatWeKnow:
      "Al Jazeera reported the June 6 Jantar Mantar deadline and broader CJP movement context. Times of India reported NTA's June 16 warning to NEET UG 2026 re-exam candidates and parents not to trust Telegram claims offering leaked papers.",
    whatWeDontKnow:
      "CWI has not independently audited the Telegram restriction, the scale of scam groups, or the full technical/security protocol for the June 21 re-exam.",
    sourceGap: "NTA original video/post permalink, Telegram restriction order, and official cyber complaint details are needed.",
    sourceTrail: [alJazeeraCjpMonth, toiNtaTelegram, cwiJune20Dossier],
    lastCheckedAt: "2026-06-20T19:00:00+05:30",
    lastUpdatedAt: "2026-06-16T18:00:00+05:30",
    createdAt: "2026-06-16T18:00:00+05:30",
    updatedAt: "2026-06-16T18:00:00+05:30",
    publishedAt: "2026-06-16T18:00:00+05:30",
    ...common
  },
  {
    id: "live-june-17-nagpur-victim-family-cjp",
    slug: "nagpur-cjp-victim-family-compensation-demand-june-17-2026",
    title: "Nagpur Stop: Dipke Meets NEET Victim's Family, Raises Rs 1 Crore Relief Demand",
    summary:
      "Times of India reported that CJP founder Abhijeet Dipke met the family of Akanksha Chaturvedi in Nagpur, demanded Rs 1 crore relief, and linked the stop to the June 20 Jantar Mantar escalation.",
    content:
      "Short answer: The Nagpur update is a reported escalation in CJP's student-safety and compensation campaign. TOI reported Dipke's visit to a family whose daughter's death was linked in the report to stress over the NEET paper leak and retest. CWI treats suicide-causation claims with caution and requires case-by-case documentation before treating every death as confirmed paper-leak-linked.",
    status: "Reported",
    sections: ["what-changed", "latest-updates", "verification-desk", "featured"],
    category: "Student Safety / NEET Accountability",
    isLeadStory: false,
    priorityScore: 136,
    changeType: "New update",
    labels: ["UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote:
      "Suicide reporting must stay careful. Do not repeat causal claims without named reports, family consent/context, and official records where available.",
    whatChanged:
      "CWI added the June 17 Nagpur stop, victim-family visit, Rs 1 crore compensation demand, and June 20 Jantar Mantar escalation plan.",
    whatWeKnow:
      "Times of India reported Dipke met the family of Akanksha Chaturvedi, demanded Rs 1 crore compensation for NEET victims, addressed a press conference under security, and said CJP's next major move would be at Jantar Mantar on June 20.",
    whatWeDontKnow:
      "CWI does not have official death records, family documents, mental-health context, or a verified consolidated list of all deaths claimed by CJP.",
    sourceGap: "Case-by-case documentation for student deaths and official compensation-policy response remain needed.",
    sourceTrail: [toiNagpur, cwiJune20Dossier],
    lastCheckedAt: "2026-06-20T19:00:00+05:30",
    lastUpdatedAt: "2026-06-17T18:30:00+05:30",
    createdAt: "2026-06-17T18:30:00+05:30",
    updatedAt: "2026-06-17T18:30:00+05:30",
    publishedAt: "2026-06-17T18:30:00+05:30",
    ...common
  },
  {
    id: "live-june-18-cjp-jantar-mantar-announcement",
    slug: "cjp-announces-june-20-jantar-mantar-protest-neet-row-june-18-2026",
    title: "CJP Announces June 20 Jantar Mantar Protest Over NEET Row and Pradhan Resignation Demand",
    summary:
      "Times of India reported CJP's June 20 Jantar Mantar protest announcement, with spokespersons citing NEET accountability, Dharmendra Pradhan's removal, and alleged student deaths.",
    content:
      "Short answer: The June 18 update moved the next Delhi protest from social-media talk to a mainstream reported announcement. CJP spokespersons said the group would protest at Jantar Mantar on June 20 over alleged inaction on its demand to remove the Education Minister. The claimed student-death count remains a reported CJP claim unless verified case by case.",
    status: "Reported",
    sections: ["top-3", "what-changed", "latest-updates", "verification-desk", "featured"],
    category: "CJP / Jantar Mantar",
    isLeadStory: false,
    topStoryRank: 3,
    priorityScore: 140,
    changeType: "New update",
    labels: ["UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote:
      "CJP's demand and death-count claims should be attributed. Permission, turnout, and police deployment required separate June 20 checks.",
    whatChanged:
      "CWI added the June 18 announcement record for the second Jantar Mantar protest and tied it to NEET accountability and ministerial-resignation demands.",
    whatWeKnow:
      "Times of India reported that CJP announced a June 20 Jantar Mantar protest, alleging inaction on its demand to remove Union Education Minister Dharmendra Pradhan over the NEET-UG paper leak row. The report also recorded CJP's claim that exam controversies had led to 11 aspirant deaths.",
    whatWeDontKnow:
      "Final police permission terms, turnout, detentions, protest duration, and official government response were not settled in the June 18 announcement report.",
    sourceGap: "Delhi Police permission copy and any government response to CJP demands remain needed.",
    sourceTrail: [toiJantarMantarJune20, cwiJune20Dossier],
    lastCheckedAt: "2026-06-20T19:00:00+05:30",
    lastUpdatedAt: "2026-06-18T23:30:00+05:30",
    createdAt: "2026-06-18T23:30:00+05:30",
    updatedAt: "2026-06-18T23:30:00+05:30",
    publishedAt: "2026-06-18T23:30:00+05:30",
    ...common
  },
  {
    id: "live-june-19-cjp-open-letter-thali-telegram",
    slug: "cjp-open-letter-pm-modi-thali-chammach-telegram-row-june-19-2026",
    title: "Open Letter, Rs 1 Crore Demand, Thali-Chammach Call: CJP Escalates Before June 20",
    summary:
      "On June 19, reports recorded Dipke's open letter to PM Modi seeking Rs 1 crore aid for families of students who allegedly died by suicide, plus the plates-and-spoons protest call and Telegram-ban criticism.",
    content:
      "Short answer: June 19 became the pre-protest escalation day. Reports from TNIE and Hindustan Times recorded CJP's open letter to PM Modi seeking Rs 1 crore compensation for families of students who allegedly died by suicide amid exam controversies. Times of India and HT live updates recorded Dipke's thali-chammach appeal and his criticism of the Telegram restriction ahead of the NEET re-exam.",
    status: "Developing",
    sections: ["top-3", "what-changed", "latest-updates", "verification-desk", "featured"],
    category: "CJP / Protest Escalation",
    isLeadStory: false,
    topStoryRank: 2,
    priorityScore: 142,
    changeType: "New update",
    labels: ["NEW TODAY", "UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote:
      "Compensation and death-count claims remain demands/allegations unless official records verify each case and the government responds.",
    whatChanged:
      "CWI added the June 19 escalation: PM open letter, Rs 1 crore demand, Education Minister removal demand, thali-chammach protest symbolism, and Telegram-ban criticism.",
    whatWeKnow:
      "TNIE and Hindustan Times reported Dipke's open letter to PM Modi seeking Rs 1 crore compensation for families of students who allegedly died by suicide. HT and TOI reported the thali-chammach appeal before the June 20 Jantar Mantar protest. HT live updates recorded Dipke's criticism of the Telegram restriction.",
    whatWeDontKnow:
      "CWI has not verified every death case, whether PMO acknowledged the letter, the legal basis of the Telegram restriction, or how many supporters would attend on June 20.",
    sourceGap: "Open letter original copy, PMO acknowledgement if any, official Telegram order, and death-by-death documentation remain needed.",
    sourceTrail: [tniePmLetter, htPmLetter, toiThali, htLiveJune20, cwiJune20Dossier],
    lastCheckedAt: "2026-06-20T19:00:00+05:30",
    lastUpdatedAt: "2026-06-19T19:00:00+05:30",
    createdAt: "2026-06-19T19:00:00+05:30",
    updatedAt: "2026-06-19T19:00:00+05:30",
    publishedAt: "2026-06-19T19:00:00+05:30",
    ...common
  },
  {
    id: "live-june-20-cjp-chalo-dilli-jantar-mantar",
    slug: "cjp-chalo-dilli-jantar-mantar-live-protest-june-20-2026",
    title: "CJP Chalo Dilli: Second Jantar Mantar Protest Begins Under Heavy Security",
    summary:
      "Hindustan Times live updates reported Dipke's Chalo Dilli call, a 1 pm Jantar Mantar protest schedule, permission status, heavy security, plates-and-spoons symbolism, and Sonam Wangchuk attendance claim.",
    content:
      "Short answer: June 20 is a live developing protest day, not a final outcome. Hindustan Times reported CJP's Chalo Dilli call, a 1 pm Jantar Mantar schedule, permission for the demonstration, heavy security, plates-and-spoons symbolism, and a reported Sonam Wangchuk attendance message. CWI will update after final turnout, detentions, police statements, and protest outcome are source-checked.",
    status: "Developing",
    sections: ["lead-story", "top-3", "what-changed", "latest-updates", "verification-desk", "featured"],
    category: "CJP / Live Protest",
    isLeadStory: false,
    topStoryRank: 2,
    priorityScore: 146,
    changeType: "New update",
    labels: ["NEW TODAY", "UPDATED TODAY", "SOURCE REQUEST OPEN"],
    editorNote:
      "This remains a live update. Avoid final claims on crowd size, detentions, police conduct, or government response until post-event reports are verified.",
    whatChanged:
      "CWI added the June 20 Chalo Dilli protest record so the Live Newsroom now shows the day-by-day escalation after June 14.",
    whatWeKnow:
      "Hindustan Times reported Dipke's Chalo Dilli call, a 1 pm protest schedule at Jantar Mantar, official permission, heavy security, thali-chammach symbolism, Telegram-ban criticism, and a reported Sonam Wangchuk attendance message.",
    whatWeDontKnow:
      "Final turnout, detentions, protest duration, any police action, formal government response, and whether all announced participants attended remain unclear.",
    sourceGap: "Post-event police statement, ground reports, final turnout estimate, detention list if any, and official response from Education Ministry remain needed.",
    sourceTrail: [htLiveJune20, toiThali, toiJantarMantarJune20, cwiJune20Dossier],
    lastCheckedAt: "2026-06-20T19:00:00+05:30",
    lastUpdatedAt: "2026-06-20T12:00:00+05:30",
    createdAt: "2026-06-20T12:00:00+05:30",
    updatedAt: "2026-06-20T12:00:00+05:30",
    publishedAt: "2026-06-20T12:00:00+05:30",
    ...common
  }
];
