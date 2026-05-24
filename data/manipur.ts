export type ManipurSourceCategory =
  | "violence"
  | "relief"
  | "court"
  | "politics"
  | "women"
  | "internet shutdown"
  | "displacement"
  | "PM response"
  | "President's Rule"
  | "human rights"
  | "security"
  | "timeline";

export type ManipurSource = {
  id: string;
  title: string;
  publisher: string;
  date: string;
  summary: string;
  keyFact: string;
  communityAffected: string;
  category: ManipurSourceCategory;
  href: string;
  trustScore: "Official" | "High" | "High / attribution required" | "Context source";
  biasNote: string;
};

export type ManipurQuickFact = {
  fact: string;
  sourceLabel: string;
  sourceIds: string[];
};

export type ManipurTimelineItem = {
  date: string;
  title: string;
  summary: string;
  sourceIds: string[];
  status: "Verified" | "Reported" | "Developing";
};

export type ManipurPanel = {
  title: string;
  body: string;
  sourceIds?: string[];
};

export type ManipurResearchAnswer = {
  question: string;
  keywords: string[];
  answer: string;
  sourceIds: string[];
};

export const manipurSeoKeywords = [
  "Manipur violence timeline",
  "Manipur crisis explained",
  "Manipur ethnic violence 2023",
  "Manipur BJP government failure",
  "Manipur relief camps",
  "Manipur displacement",
  "Manipur Kuki Meitei conflict",
  "PM Modi Manipur visit",
  "Biren Singh resignation",
  "President's Rule Manipur",
  "Manipur internet shutdown",
  "Manipur human rights crisis"
];

export const manipurImages = {
  hero: {
    src: "/manipur/street-smoke-civilian-area.jpg",
    alt: "Street in Manipur with smoke visible during the ethnic violence crisis"
  },
  burnedPlace: {
    src: "/manipur/burned-place-of-worship.jpg",
    alt: "Burned place of worship in Manipur after violence"
  },
  security: {
    src: "/manipur/security-patrol.jpg",
    alt: "Security personnel patrolling a residential area in Manipur"
  },
  road: {
    src: "/manipur/burned-vehicle-road.jpg",
    alt: "Burned vehicle and debris on a road in Manipur"
  },
  vigil: {
    src: "/manipur/manipur-vigil-banner.jpg",
    alt: "Manipur vigil banner photographed during public calls for peace"
  }
};

export const manipurSources: ManipurSource[] = [
  {
    id: "bbc-explainer",
    title: "Manipur: What is behind the violence in India's north-eastern state?",
    publisher: "BBC News",
    date: "2023-07-20",
    summary:
      "BBC's explainer outlines the Meitei Scheduled Tribe demand, the Tribal Solidarity March, the ethnic geography of Manipur, and the national outrage after the video of women being assaulted became public.",
    keyFact:
      "The violence began after tribal protests linked to the Meitei demand for Scheduled Tribe status and later escalated into wider ethnic violence.",
    communityAffected: "Meitei, Kuki-Zo and wider Manipur public",
    category: "timeline",
    href: "https://www.bbc.com/news/world-asia-india-66260730",
    trustScore: "High",
    biasNote: "Useful for broad context; read alongside Indian and local reporting for ground detail."
  },
  {
    id: "ap-relief-camps",
    title: "Thousands in India are languishing in relief camps after ethnic clashes in Manipur",
    publisher: "Associated Press",
    date: "2023-12-20",
    summary:
      "AP reported from relief camps and documented displacement, loss of homes, schooling disruption, community separation, and the difficulty of returning safely.",
    keyFact:
      "Relief camps became long-term shelters for thousands of people displaced by the violence.",
    communityAffected: "Displaced families and children across affected communities",
    category: "relief",
    href: "https://apnews.com/article/9153549db3852e7f34a3ef70b7bdb349",
    trustScore: "High",
    biasNote: "Ground report focused on humanitarian conditions, not partisan blame."
  },
  {
    id: "ap-jiribam-2024",
    title: "Indian security forces recover bodies in Manipur as ethnic violence continues",
    publisher: "Associated Press",
    date: "2024-11-17",
    summary:
      "AP coverage from 2024 showed that violence and fear had not ended more than a year after the original outbreak.",
    keyFact:
      "The crisis continued beyond 2023, with renewed killings, fear, and heavy security presence reported in later phases.",
    communityAffected: "Civilians in affected districts",
    category: "violence",
    href: "https://apnews.com/article/ae9b0f553a7f631971f5453e3f58e17d",
    trustScore: "High",
    biasNote: "Report is useful for continuity of violence; details should be read with later updates."
  },
  {
    id: "aljazeera-origin",
    title: "India's Manipur state faces new wave of violence after months of ethnic conflict",
    publisher: "Al Jazeera",
    date: "2023-09-08",
    summary:
      "Al Jazeera documented continuing violence, displacement, internet restrictions, and allegations around state response during the 2023 crisis.",
    keyFact:
      "The conflict did not remain a short riot; it became a prolonged security, political, and humanitarian crisis.",
    communityAffected: "Meitei and Kuki-Zo civilians",
    category: "violence",
    href: "https://www.aljazeera.com/news/2023/9/8/india-manipur-state-faces-new-wave-of-violence-after-months-of-ethnic-conflict",
    trustScore: "High / attribution required",
    biasNote: "Strong for international framing; keep allegations attributed."
  },
  {
    id: "aljazeera-weapons",
    title: "'Bombs in every house': Why peace is elusive in India's Manipur",
    publisher: "Al Jazeera",
    date: "2025-03-06",
    summary:
      "This feature examined why weapons, fear, separation, and distrust kept peace fragile even after central intervention.",
    keyFact:
      "Weapons in circulation, armed groups, and community distrust were reported as major barriers to durable peace.",
    communityAffected: "Residents of valley and hill areas",
    category: "security",
    href: "https://www.aljazeera.com/features/2025/3/6/bombs-in-every-house-why-peace-is-elusive-in-indias-manipur",
    trustScore: "High / attribution required",
    biasNote: "Use for reported field conditions and clearly attribute local claims."
  },
  {
    id: "aljazeera-modi-visit",
    title: "India's Modi visits Manipur state two years after ethnic clashes began",
    publisher: "Al Jazeera",
    date: "2025-09-13",
    summary:
      "Al Jazeera reported Prime Minister Narendra Modi's first visit to Manipur after the outbreak of violence, including his peace appeal and criticism over delay.",
    keyFact:
      "The visit took place more than two years after the violence began, drawing both official messaging and public criticism.",
    communityAffected: "Manipur residents awaiting rehabilitation and peace",
    category: "PM response",
    href: "https://www.aljazeera.com/news/2025/9/13/indias-modi-visits-manipur-state-two-years-after-ethnic-clashes",
    trustScore: "High / attribution required",
    biasNote: "Useful for timing and criticism; compare with official PIB statements."
  },
  {
    id: "aljazeera-three-years",
    title: "Thousands in India's Manipur mark three years since ethnic clashes began",
    publisher: "Al Jazeera",
    date: "2026-05-03",
    summary:
      "Coverage of the third anniversary described continuing public memory, protest, and the unresolved character of the crisis.",
    keyFact:
      "The crisis remained publicly contested and unresolved three years after the first outbreak.",
    communityAffected: "Victims, displaced families, and civil society groups",
    category: "timeline",
    href: "https://www.aljazeera.com/video/newsfeed/2026/5/3/thousands-in-indias-manipur-mark-three-years-since-ethnic-clashes-began",
    trustScore: "Context source",
    biasNote: "Video/newsfeed context; use with direct reports for detailed claims."
  },
  {
    id: "hrw-2023-police-bias",
    title: "India: Investigate Police Bias Alleged in Manipur Violence",
    publisher: "Human Rights Watch",
    date: "2023-05-30",
    summary:
      "Human Rights Watch called for investigation into alleged police bias and failures during the early phase of violence.",
    keyFact:
      "Rights groups raised concerns about policing, accountability, and protection of vulnerable civilians.",
    communityAffected: "Civilians alleging lack of equal protection",
    category: "human rights",
    href: "https://www.hrw.org/news/2023/05/30/india-investigate-police-bias-alleged-manipur-violence",
    trustScore: "High / attribution required",
    biasNote: "Human rights advocacy source; allegations require attribution and official response where available."
  },
  {
    id: "hrw-2025-restart",
    title: "India: Ethnic Clashes Restart in Manipur",
    publisher: "Human Rights Watch",
    date: "2025-03-28",
    summary:
      "Human Rights Watch documented renewed violence and argued that impunity and unresolved grievances were keeping the conflict alive.",
    keyFact:
      "Renewed clashes showed that administrative steps alone had not produced durable peace.",
    communityAffected: "Affected civilians in renewed flashpoints",
    category: "violence",
    href: "https://www.hrw.org/news/2025/03/28/india-ethnic-clashes-restart-manipur",
    trustScore: "High / attribution required",
    biasNote: "Use as human-rights context, not as a court finding."
  },
  {
    id: "indianexpress-resignation",
    title: "Manipur Chief Minister N. Biren Singh resigns",
    publisher: "The Indian Express",
    date: "2025-02-09",
    summary:
      "The Indian Express reported Biren Singh's resignation amid sustained political pressure and prolonged unrest.",
    keyFact:
      "The Chief Minister resigned in February 2025 after the state had remained in crisis for an extended period.",
    communityAffected: "Statewide political administration",
    category: "politics",
    href: "https://indianexpress.com/article/india/manipur-cm-biren-singh-resigns-9826593/",
    trustScore: "High",
    biasNote: "Useful for political timeline; read official documents for legal effect."
  },
  {
    id: "indianexpress-president-rule",
    title: "President's Rule imposed in Manipur",
    publisher: "The Indian Express",
    date: "2025-02-13",
    summary:
      "The report covered the imposition of President's Rule after the resignation of N. Biren Singh and continuing political uncertainty.",
    keyFact:
      "President's Rule came only after a prolonged conflict, displacement, and leadership crisis.",
    communityAffected: "Manipur residents under central rule",
    category: "President's Rule",
    href: "https://indianexpress.com/article/india/manipur-president-rule-imposed-9830795/",
    trustScore: "High",
    biasNote: "Useful for political timeline; pair with official gazette/Parliament records where possible."
  },
  {
    id: "pib-churachandpur",
    title: "Prime Minister's Manipur visit: Churachandpur address",
    publisher: "Press Information Bureau",
    date: "2025-09-13",
    summary:
      "Official government release on the Prime Minister's Manipur visit, peace appeal, and development announcements.",
    keyFact:
      "The government publicly framed the visit around peace, rehabilitation, development, and rebuilding.",
    communityAffected: "Manipur residents addressed through official programmes",
    category: "PM response",
    href: "https://www.pib.gov.in/PressReleseDetailm.aspx?PMO=3&PRID=2166235",
    trustScore: "Official",
    biasNote: "Official government position; compare with independent ground reports."
  },
  {
    id: "pib-imphal",
    title: "Prime Minister's Manipur visit: Imphal address",
    publisher: "Press Information Bureau",
    date: "2025-09-13",
    summary:
      "Official government release from the Imphal programme during the Prime Minister's Manipur visit.",
    keyFact:
      "Official statements highlighted peace, infrastructure, and development commitments.",
    communityAffected: "Statewide public response and official accountability",
    category: "PM response",
    href: "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2166296",
    trustScore: "Official",
    biasNote: "Official position; not a substitute for independent verification of ground outcomes."
  },
  {
    id: "pib-president-rule-extension",
    title: "Parliament approves extension of President's Rule in Manipur",
    publisher: "Press Information Bureau",
    date: "2026-02-25",
    summary:
      "Government release on Parliament approval relating to President's Rule in Manipur.",
    keyFact:
      "Central administration remained an active part of Manipur's governance response into 2026.",
    communityAffected: "Manipur residents under central administrative control",
    category: "President's Rule",
    href: "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2211578",
    trustScore: "Official",
    biasNote: "Official procedural record; does not measure rehabilitation or trust on the ground."
  },
  {
    id: "scobserver-internet",
    title: "What is the challenge to the Manipur internet shutdown?",
    publisher: "Supreme Court Observer",
    date: "2023-07-28",
    summary:
      "Supreme Court Observer explained litigation and constitutional concerns around Manipur's prolonged internet shutdown.",
    keyFact:
      "Internet shutdowns became a rights, information-flow, and accountability issue during the crisis.",
    communityAffected: "Residents, journalists, families, students, and relief networks",
    category: "internet shutdown",
    href: "https://www.scobserver.in/journal/what-is-the-challenge-to-the-manipur-internet-shutdown/",
    trustScore: "High",
    biasNote: "Court-focused explanatory source; use for legal context."
  },
  {
    id: "theprint-2026-bombing",
    title: "Two children killed in bomb attack in Manipur",
    publisher: "ThePrint / PTI",
    date: "2026-04-28",
    summary:
      "PTI report carried by ThePrint described a bomb attack in Manipur in which children were reported killed, underscoring renewed danger in 2026.",
    keyFact:
      "Reports of renewed lethal violence in 2026 showed that the crisis had not fully ended.",
    communityAffected: "Children and families in affected villages",
    category: "violence",
    href: "https://theprint.in/india/2-children-killed-in-bomb-attack-in-manipur/2898216/",
    trustScore: "High / attribution required",
    biasNote: "Use as reported event; CWI marks exact circumstances as dependent on official investigation."
  }
];

export const quickFacts: ManipurQuickFact[] = [
  {
    fact: "Violence began on 3 May 2023 after tribal protests against the Meitei demand for Scheduled Tribe status.",
    sourceLabel: "BBC / HRW",
    sourceIds: ["bbc-explainer", "hrw-2023-police-bias"]
  },
  {
    fact: "The conflict largely involved Meitei communities in the valley and Kuki-Zo tribal communities in the hills, while other communities also lived with the fallout.",
    sourceLabel: "BBC / AP",
    sourceIds: ["bbc-explainer", "ap-relief-camps"]
  },
  {
    fact: "Major reports put the death toll above 250, with some accounts using about 260. CWI treats figures as source-dated, not permanently final.",
    sourceLabel: "AP / Al Jazeera",
    sourceIds: ["ap-jiribam-2024", "aljazeera-modi-visit"]
  },
  {
    fact: "More than 60,000 people were displaced according to major reporting, with many families pushed into relief camps or separated zones.",
    sourceLabel: "AP / Al Jazeera",
    sourceIds: ["ap-relief-camps", "aljazeera-modi-visit"]
  },
  {
    fact: "Homes, villages, places of worship, vehicles, and public buildings were destroyed across phases of the violence.",
    sourceLabel: "BBC / HRW",
    sourceIds: ["bbc-explainer", "hrw-2023-police-bias"]
  },
  {
    fact: "Weapons looted from police armouries and later circulation of arms made the conflict more dangerous and harder to de-escalate.",
    sourceLabel: "Al Jazeera",
    sourceIds: ["aljazeera-weapons"]
  },
  {
    fact: "Internet shutdowns limited information flow, affected families and journalists, and delayed wider public awareness of abuses.",
    sourceLabel: "Supreme Court Observer / BBC",
    sourceIds: ["scobserver-internet", "bbc-explainer"]
  },
  {
    fact: "Manipur saw President's Rule after Chief Minister N. Biren Singh resigned in February 2025.",
    sourceLabel: "Indian Express / PIB",
    sourceIds: ["indianexpress-resignation", "indianexpress-president-rule", "pib-president-rule-extension"]
  },
  {
    fact: "Prime Minister Narendra Modi made a reported first visit to Manipur after the outbreak in September 2025, more than two years after violence began.",
    sourceLabel: "Al Jazeera / PIB",
    sourceIds: ["aljazeera-modi-visit", "pib-churachandpur", "pib-imphal"]
  },
  {
    fact: "Reports of renewed violence in 2026, including a bomb attack in which children were reported killed, showed the crisis was still unresolved.",
    sourceLabel: "ThePrint/PTI / Al Jazeera",
    sourceIds: ["theprint-2026-bombing", "aljazeera-three-years"]
  }
];

export const manipurTimeline: ManipurTimelineItem[] = [
  {
    date: "March-April 2023",
    title: "The build-up before the fire",
    summary:
      "Tensions sharpened around land rights, the Meitei Scheduled Tribe demand, eviction drives, drug-war narratives, identity politics, and deepening mistrust between valley and hill communities.",
    sourceIds: ["bbc-explainer", "hrw-2023-police-bias"],
    status: "Reported"
  },
  {
    date: "3 May 2023",
    title: "Tribal Solidarity March and outbreak of clashes",
    summary:
      "A Tribal Solidarity March was held against the Meitei ST demand. Violence spread after clashes broke out, turning a political and identity dispute into a statewide emergency.",
    sourceIds: ["bbc-explainer", "hrw-2023-police-bias"],
    status: "Verified"
  },
  {
    date: "May 2023",
    title: "Homes burned, people fled, internet shut down",
    summary:
      "Reports described arson, displacement, curfew, security deployment, internet restrictions, and the beginning of sharper ethnic separation across hills and valley areas.",
    sourceIds: ["bbc-explainer", "scobserver-internet", "ap-relief-camps"],
    status: "Verified"
  },
  {
    date: "July 2023",
    title: "The delayed national shock",
    summary:
      "A video of women being paraded naked became public and triggered national outrage. The incident had occurred earlier, and internet restrictions were widely cited as a factor in delayed national awareness.",
    sourceIds: ["bbc-explainer", "scobserver-internet"],
    status: "Verified"
  },
  {
    date: "Late 2023",
    title: "Relief camps replaced normal life",
    summary:
      "Displacement continued. Families lived in relief camps, children lost schooling, and communities remained afraid to return to mixed localities or villages.",
    sourceIds: ["ap-relief-camps", "aljazeera-origin"],
    status: "Verified"
  },
  {
    date: "2024",
    title: "A conflict that would not close",
    summary:
      "Security presence did not end the crisis. Reports from later phases described renewed killings, segregation, fear, and continuing criticism that neither state nor central response restored trust.",
    sourceIds: ["ap-jiribam-2024", "aljazeera-weapons"],
    status: "Reported"
  },
  {
    date: "December 2024",
    title: "Public apology, no full peace",
    summary:
      "Reports said Chief Minister N. Biren Singh apologised for the conflict and acknowledged suffering. The apology did not settle questions about accountability, rehabilitation, or return.",
    sourceIds: ["indianexpress-resignation"],
    status: "Reported"
  },
  {
    date: "February 2025",
    title: "Biren Singh resigned; President's Rule followed",
    summary:
      "N. Biren Singh resigned under pressure. President's Rule was imposed days later, marking a formal change in governance after months of unrest.",
    sourceIds: ["indianexpress-resignation", "indianexpress-president-rule", "pib-president-rule-extension"],
    status: "Verified"
  },
  {
    date: "September 2025",
    title: "Prime Minister's first visit after the outbreak",
    summary:
      "PM Modi visited Manipur, appealed for peace, and announced or highlighted development and rehabilitation measures. Critics noted the visit came more than two years after the violence began.",
    sourceIds: ["aljazeera-modi-visit", "pib-churachandpur", "pib-imphal"],
    status: "Verified"
  },
  {
    date: "April-May 2026",
    title: "Renewed violence and unresolved grief",
    summary:
      "A PTI report carried by ThePrint said children were killed in a bomb attack in April 2026. Al Jazeera later covered public marking of three years since the clashes began, showing unresolved trauma and demands for peace.",
    sourceIds: ["theprint-2026-bombing", "aljazeera-three-years"],
    status: "Developing"
  }
];

export const humanCostPanels: ManipurPanel[] = [
  {
    title: "Displaced families",
    body:
      "For thousands of families, displacement meant more than leaving a house. It meant losing documents, schools, routines, neighbours, income, and the ability to safely cross areas that once formed ordinary public life.",
    sourceIds: ["ap-relief-camps"]
  },
  {
    title: "Children in camps",
    body:
      "Relief camps turned childhood into waiting: waiting for school, waiting for safety, waiting for clarity, and waiting for adults to answer when home would become possible again.",
    sourceIds: ["ap-relief-camps"]
  },
  {
    title: "Women survivors",
    body:
      "The July 2023 national outrage showed how gendered violence becomes both a personal wound and a public test of law, policing, and national conscience.",
    sourceIds: ["bbc-explainer"]
  },
  {
    title: "Burned homes and villages",
    body:
      "Destroyed homes and villages are not only property loss. They erase local memory, family security, worship spaces, markets, and the feeling that the state can protect ordinary people.",
    sourceIds: ["bbc-explainer", "hrw-2023-police-bias"]
  },
  {
    title: "Loss of education and livelihood",
    body:
      "When families live in camps or segregated zones, education, daily wages, farming, trade, and local businesses all become collateral damage.",
    sourceIds: ["ap-relief-camps"]
  },
  {
    title: "Fear of return",
    body:
      "Return is not only a transport question. It requires safety guarantees, trust, justice, compensation, and confidence that violence will not repeat.",
    sourceIds: ["aljazeera-weapons", "hrw-2025-restart"]
  }
];

export const accountabilityFrames: ManipurPanel[] = [
  {
    title: "Delayed national attention",
    body:
      "The violence began in May 2023, while PM Modi's reported first visit after the outbreak came in September 2025. Critics argue this delay sent a message that Manipur was not treated with the urgency of a national emergency.",
    sourceIds: ["aljazeera-modi-visit", "pib-churachandpur"]
  },
  {
    title: "State leadership crisis",
    body:
      "Chief Minister N. Biren Singh, from the BJP, faced accusations of bias from Kuki groups and pressure from allies and opposition. He denied allegations of bias, but resigned in February 2025 after prolonged unrest.",
    sourceIds: ["indianexpress-resignation", "hrw-2023-police-bias"]
  },
  {
    title: "President's Rule after prolonged violence",
    body:
      "President's Rule was imposed only after months of continuing unrest, displacement, political breakdown, and inability to restore confidence under the elected state leadership.",
    sourceIds: ["indianexpress-president-rule", "pib-president-rule-extension"]
  },
  {
    title: "Security deployment did not bring full peace",
    body:
      "The government said security forces were deployed and official measures were taken. Independent reports still documented killings, weapons in circulation, displacement, and distrust.",
    sourceIds: ["aljazeera-weapons", "ap-jiribam-2024"]
  },
  {
    title: "Internet shutdown and information control",
    body:
      "Internet restrictions affected information flow, families, journalists, students, and public awareness. The delayed national visibility of atrocities became part of the accountability debate.",
    sourceIds: ["scobserver-internet", "bbc-explainer"]
  },
  {
    title: "Relief camps and displacement",
    body:
      "More than 60,000 people were reported displaced. Camps kept people alive, but camps are not peace; they are evidence that home, safety, and trust have not been restored.",
    sourceIds: ["ap-relief-camps", "aljazeera-modi-visit"]
  },
  {
    title: "Development cannot replace justice",
    body:
      "Government releases highlighted development, housing support, and peace appeals. Those steps matter, but infrastructure alone cannot resolve trauma, accountability, rehabilitation, legal process, and community trust.",
    sourceIds: ["pib-churachandpur", "pib-imphal", "hrw-2025-restart"]
  },
  {
    title: "Unanswered questions",
    body:
      "Why did it take so long to restore peace? Why were so many people displaced for so long? Why were weapons allowed to circulate? Why did relief and rehabilitation move slowly? Why did communities lose trust in the state?",
    sourceIds: ["aljazeera-weapons", "ap-relief-camps", "hrw-2025-restart"]
  }
];

export const governmentResponsePanels: ManipurPanel[] = [
  {
    title: "What the government said",
    body:
      "Official releases presented the response through peace appeals, development announcements, rehabilitation language, housing support, and central administrative steps. Government voices also cited cross-border and Myanmar-related instability as part of the security context.",
    sourceIds: ["pib-churachandpur", "pib-imphal", "pib-president-rule-extension"]
  },
  {
    title: "What ground reports still showed",
    body:
      "Independent reporting continued to show deaths, displacement, ethnic separation, relief camp hardship, weapons in circulation, and renewed flare-ups. This gap between official action and lived reality is the heart of the accountability question.",
    sourceIds: ["ap-relief-camps", "aljazeera-weapons", "theprint-2026-bombing"]
  }
];

export const communityExplainers: ManipurPanel[] = [
  {
    title: "Who are the Meiteis?",
    body:
      "Meiteis are Manipur's largest community and are concentrated mainly in the Imphal valley. Many Meiteis are Hindu, while others follow Sanamahism or other traditions. Community identity cannot be reduced to religion or one political view.",
    sourceIds: ["bbc-explainer"]
  },
  {
    title: "Who are the Kuki-Zo communities?",
    body:
      "Kuki-Zo refers to several tribal communities, many based in hill districts. Many are Christian, but the conflict should not be simplified into a Hindu-versus-Christian story. Land, identity, representation, security, and governance failures matter.",
    sourceIds: ["bbc-explainer", "aljazeera-origin"]
  },
  {
    title: "Who are the Nagas in Manipur?",
    body:
      "Naga communities are also a major part of Manipur's hill society and political history. Any serious explainer must recognise that Manipur is not a two-community map.",
    sourceIds: ["bbc-explainer"]
  },
  {
    title: "What is Scheduled Tribe status?",
    body:
      "Scheduled Tribe status can affect land protections, reservation, representation, and access to state support. The Meitei demand for ST status became one trigger in an already tense political environment.",
    sourceIds: ["bbc-explainer"]
  },
  {
    title: "Why does land matter so much?",
    body:
      "Manipur's valley-hill geography shapes law, identity, economy, and political power. Land is tied to security, belonging, autonomy, and fears of demographic or legal change.",
    sourceIds: ["bbc-explainer", "aljazeera-origin"]
  },
  {
    title: "Why did the hills and valley divide deepen?",
    body:
      "Violence, fear, displacement, segregated zones, armed mobilisation, misinformation, and political mistrust made physical separation harder to reverse.",
    sourceIds: ["ap-relief-camps", "aljazeera-weapons"]
  },
  {
    title: "Why is the conflict so difficult to solve?",
    body:
      "Durable peace requires security, return, compensation, legal accountability, disarmament, credible dialogue, and a state that all communities believe will protect them equally.",
    sourceIds: ["hrw-2025-restart", "aljazeera-weapons"]
  }
];

export const mediaBiasPanels: ManipurPanel[] = [
  {
    title: "Silence as framing",
    body:
      "When a crisis receives limited sustained national attention, silence itself becomes a political frame. It tells victims that their suffering can be treated as regional background noise."
  },
  {
    title: "Over-simple communal framing",
    body:
      "Some narratives reduced Manipur to Hindu versus Christian. That framing hides land, governance, tribal status, policing, displacement, weapons, and state accountability."
  },
  {
    title: "Single-community pain",
    body:
      "A responsible archive must show the pain of every victim without turning one community's suffering into a weapon against another community."
  },
  {
    title: "Accountability avoidance",
    body:
      "Some coverage focused on disorder without asking why protection failed, why displacement lasted, why arms circulated, and why political leadership could not restore confidence."
  }
];

export const researchAnswers: ManipurResearchAnswer[] = [
  {
    question: "What happened on 3 May 2023?",
    keywords: ["3 may", "may 3", "solidarity march", "what happened"],
    answer:
      "On 3 May 2023, a Tribal Solidarity March against the Meitei demand for Scheduled Tribe status was followed by clashes that escalated into wider ethnic violence. CWI treats this as a verified timeline point, while the exact local sequence in each district should be read through source-specific reports.",
    sourceIds: ["bbc-explainer", "hrw-2023-police-bias"]
  },
  {
    question: "Why did violence begin?",
    keywords: ["why did violence begin", "why violence", "cause", "started"],
    answer:
      "The immediate trigger was the dispute around Meitei Scheduled Tribe status, but the deeper context included land anxieties, hill-valley mistrust, eviction drives, drug-war narratives, identity politics, and weak trust in governance. No whole community should be blamed for the conflict.",
    sourceIds: ["bbc-explainer", "aljazeera-origin"]
  },
  {
    question: "How many people were displaced?",
    keywords: ["displaced", "relief camp", "60000", "60,000"],
    answer:
      "Major reports have placed displacement above 60,000 people. CWI uses that figure as a source-dated estimate, because displacement numbers can change as people move between camps, relatives' homes, and safer districts.",
    sourceIds: ["ap-relief-camps", "aljazeera-modi-visit"]
  },
  {
    question: "What did the Supreme Court say?",
    keywords: ["supreme court", "court", "shutdown", "legal"],
    answer:
      "Court-linked coverage focused on the legality and rights impact of prolonged internet shutdowns and wider accountability concerns around the crisis. The page uses Supreme Court Observer for legal context rather than presenting court commentary as a full factual investigation of every event.",
    sourceIds: ["scobserver-internet"]
  },
  {
    question: "When did PM Modi visit Manipur?",
    keywords: ["modi", "prime minister", "pm visit", "september 2025"],
    answer:
      "Prime Minister Narendra Modi visited Manipur in September 2025, more than two years after the violence began. Official PIB releases described peace and development messaging; independent coverage also recorded criticism over the delay.",
    sourceIds: ["aljazeera-modi-visit", "pib-churachandpur", "pib-imphal"]
  },
  {
    question: "Why did Biren Singh resign?",
    keywords: ["biren", "resign", "chief minister"],
    answer:
      "N. Biren Singh resigned in February 2025 after prolonged unrest and political pressure. Critics had accused his government of bias and failure; he denied bias. CWI presents the resignation as a verified political timeline event, not a court finding on personal wrongdoing.",
    sourceIds: ["indianexpress-resignation", "indianexpress-president-rule", "hrw-2023-police-bias"]
  },
  {
    question: "What are the biggest unanswered questions?",
    keywords: ["unanswered", "questions", "biggest"],
    answer:
      "The largest unanswered questions are why protection failed early, why displacement lasted so long, why arms circulated, why internet restrictions delayed awareness, why trust collapsed between communities and the state, and why peace remained fragile even after central intervention.",
    sourceIds: ["ap-relief-camps", "aljazeera-weapons", "hrw-2025-restart"]
  },
  {
    question: "What evidence supports criticism of BJP's handling?",
    keywords: ["bjp", "government failure", "criticism", "accountability"],
    answer:
      "Evidence cited by critics includes the long delay before the Prime Minister's visit, resignation of the BJP Chief Minister after prolonged unrest, President's Rule, continued displacement, renewed violence, internet restrictions, and independent reports describing fragile security. The government response must also be stated fairly: it deployed security forces, appealed for peace, announced development and housing support, and cited cross-border factors.",
    sourceIds: [
      "aljazeera-modi-visit",
      "indianexpress-resignation",
      "indianexpress-president-rule",
      "pib-churachandpur",
      "ap-relief-camps",
      "hrw-2025-restart"
    ]
  }
];

export function getManipurSources(ids: string[]) {
  return ids
    .map((id) => manipurSources.find((source) => source.id === id))
    .filter((source): source is ManipurSource => Boolean(source));
}
