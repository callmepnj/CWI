export type FileStatus = "Developing" | "Court-monitored" | "Reported" | "Source-backed" | "Needs transparency";

export type FileSource = {
  name: string;
  publisher: string;
  url: string;
  type: "News report" | "Explainer" | "Court/legal" | "Official response" | "Human-rights report" | "Ground report";
  note: string;
};

export type FileTimelineItem = {
  date: string;
  title: string;
  summary: string;
  sourceIndex: number[];
};

export type FileSection = {
  heading: string;
  body: string;
  sourceIndex: number[];
};

export type FileAnswer = {
  question: string;
  answer: string;
  sourceIndex: number[];
};

export type FileVisual = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  isPhoto: boolean;
  brief: string;
};

export type UnansweredFile = {
  title: string;
  slug: string;
  location: string;
  year: string;
  peopleAffected: string;
  mainIssue: string;
  governmentResponse: string;
  groundReality: string;
  unansweredQuestion: string;
  sourceCount: number;
  status: FileStatus;
  category: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  sources: FileSource[];
  timeline: FileTimelineItem[];
  sections: FileSection[];
  unansweredQuestions: string[];
  aiAnswers: FileAnswer[];
};

const source = (
  publisher: string,
  name: string,
  url: string,
  type: FileSource["type"],
  note: string
): FileSource => ({ publisher, name, url, type, note });

const standardQuestions = [
  "What happened?",
  "What did the government say?",
  "What remains unanswered?"
];

function withStandardAnswers(file: Omit<UnansweredFile, "sourceCount" | "aiAnswers">): UnansweredFile {
  return {
    ...file,
    sourceCount: file.sources.length,
    aiAnswers: [
      {
        question: standardQuestions[0],
        answer: file.sections[0]?.body ?? file.summary,
        sourceIndex: file.sections[0]?.sourceIndex ?? [0]
      },
      {
        question: standardQuestions[1],
        answer: file.governmentResponse,
        sourceIndex: file.sections.find((section) => section.heading === "Government response")?.sourceIndex ?? [0]
      },
      {
        question: standardQuestions[2],
        answer: file.unansweredQuestion,
        sourceIndex: file.sections.find((section) => section.heading === "Unanswered questions")?.sourceIndex ?? [0]
      }
    ]
  };
}

export const unansweredFiles: UnansweredFile[] = [
  withStandardAnswers({
    title: "Manipur Violence",
    slug: "manipur-violence",
    location: "Manipur",
    year: "2023-2026",
    peopleAffected: "Displaced families, women survivors, children, hill and valley communities",
    mainIssue: "Ethnic violence, displacement, internet shutdowns, delayed political response, and unresolved rehabilitation.",
    governmentResponse:
      "The official response included security deployment, curfews, internet restrictions, President's Rule after the chief minister resigned, peace appeals, and development or rehabilitation announcements.",
    groundReality:
      "Independent reporting continued to show deaths, displacement, segregated zones, relief camp hardship, arms in circulation, and renewed flare-ups.",
    unansweredQuestion: "Why did peace and safe return remain fragile years after the violence began?",
    status: "Developing",
    category: "Ethnic violence",
    summary:
      "Manipur remains a public memory test for India: violence began in May 2023, thousands were displaced, and questions about delayed attention, state trust, and rehabilitation remain unresolved.",
    seoTitle: "Manipur Violence File - India's Unanswered Files",
    seoDescription:
      "CWI tracks the Manipur violence timeline, displacement, official response, relief camps, and unanswered accountability questions.",
    keywords: ["Manipur violence", "Manipur displacement", "Manipur crisis", "India unanswered files"],
    sources: [
      source("BBC News", "Manipur violence explained", "https://www.bbc.com/news/world-asia-india-66260730", "Explainer", "Context on the May 2023 outbreak, ST-status dispute, and national outrage after the July video."),
      source("Associated Press", "Relief camp ground report", "https://apnews.com/article/9153549db3852e7f34a3ef70b7bdb349", "Ground report", "Humanitarian reporting on displaced families and relief camps."),
      source("Al Jazeera", "PM Modi visits Manipur after ethnic clashes", "https://www.aljazeera.com/news/2025/9/13/indias-modi-visits-manipur-state-two-years-after-ethnic-clashes", "News report", "Timing of prime ministerial visit, peace appeal, and criticism over delay.")
    ],
    timeline: [
      { date: "3 May 2023", title: "Violence begins", summary: "Tribal protests over the Meitei Scheduled Tribe demand were followed by clashes and wider violence.", sourceIndex: [0] },
      { date: "July 2023", title: "National outrage", summary: "A video of women being assaulted became public after internet restrictions delayed wider awareness.", sourceIndex: [0] },
      { date: "2023-2025", title: "Relief camps and separation", summary: "Displacement and relief camp life became prolonged rather than temporary.", sourceIndex: [1] },
      { date: "September 2025", title: "Prime ministerial visit", summary: "PM Modi visited Manipur more than two years after the violence began, according to public reporting.", sourceIndex: [2] }
    ],
    sections: [
      { heading: "What happened?", body: "Violence in Manipur began in May 2023 after tribal protests linked to the Meitei demand for Scheduled Tribe status and escalated into prolonged ethnic conflict.", sourceIndex: [0] },
      { heading: "Why it matters", body: "The crisis exposed how quickly local tensions can become displacement, gendered violence, ethnic separation, and a collapse of public trust.", sourceIndex: [0, 1] },
      { heading: "Human cost", body: "Families lived in relief camps, children lost schooling, women survivors carried trauma, and communities became afraid to return home.", sourceIndex: [1] },
      { heading: "Political accountability", body: "Critics questioned delayed national attention and the inability of security deployment and political change to produce durable peace.", sourceIndex: [2] },
      { heading: "Government response", body: "The government cited security deployment, peace appeals, administrative steps, and development commitments; CWI separates those claims from ground outcomes.", sourceIndex: [2] },
      { heading: "Court/legal status", body: "Legal and administrative records around internet shutdowns, violence cases, and relief remain important for accountability, but this file does not present allegations as court findings.", sourceIndex: [0] },
      { heading: "Media silence/bias", body: "Manipur was often framed as distant regional unrest rather than a national humanitarian crisis requiring sustained accountability journalism.", sourceIndex: [0, 2] },
      { heading: "Unanswered questions", body: "Why did safe return, rehabilitation, arms recovery, and trust-building remain incomplete years after the first outbreak?", sourceIndex: [1, 2] }
    ],
    unansweredQuestions: [
      "Why did relief camp life become prolonged?",
      "Why did national attention arrive so late?",
      "What accountability exists for failures of protection?",
      "What guarantees can make return safe for all communities?"
    ]
  }),
  withStandardAnswers({
    title: "Ladakh and Sonam Wangchuk's Sixth Schedule Movement",
    slug: "ladakh-sixth-schedule-statehood",
    location: "Ladakh",
    year: "2019-2026",
    peopleAffected: "Ladakhi residents, youth, pastoral communities, environmental groups",
    mainIssue: "Demand for statehood, Sixth Schedule safeguards, jobs protection, and democratic representation after Ladakh became a Union Territory.",
    governmentResponse:
      "The Centre held talks, issued some notifications and administrative measures, but did not concede the core Sixth Schedule and statehood demands as of the sourced reports.",
    groundReality:
      "Civil society groups and Sonam Wangchuk continued hunger strikes, marches, and protests, arguing that land, jobs, ecology, and identity needed constitutional protection.",
    unansweredQuestion: "Why has a strategically sensitive border region waited years for a clear democratic and constitutional settlement?",
    status: "Developing",
    category: "Federalism",
    summary:
      "Ladakh's protest is not only about one activist. It is a larger demand for representation, land safeguards, jobs, ecology, and local decision-making.",
    seoTitle: "Ladakh Sixth Schedule Movement - India's Unanswered Files",
    seoDescription:
      "CWI explains Ladakh's statehood and Sixth Schedule movement, Sonam Wangchuk's fasts, official talks, and unanswered democratic questions.",
    keywords: ["Ladakh statehood", "Sonam Wangchuk", "Sixth Schedule", "Ladakh protest"],
    sources: [
      source("The Indian Express", "Ladakh protests explained", "https://indianexpress.com/article/explained/ladakh-protests-statehood-autonomy-centre-10269054/", "Explainer", "Background on the four-point demand, Article 370 aftermath, and civil society mobilisation."),
      source("Al Jazeera", "India releases Ladakh activist Sonam Wangchuk", "https://www.aljazeera.com/news/2026/3/14/india-releases-ladakh-activist-sonam-wangchuk-after-six-months-in-jail", "News report", "Report on detention, release, and movement demands."),
      source("Reuters Connect", "Wangchuk hunger strike image/reporting context", "https://www.reutersconnect.com/item/sonam-wangchuk-looks-on-as-he-sits-on-a-hunger-strike-demanding-constitutional-safeguards-and-statehood-in-ladakh/dGFnOnJldXRlcnMuY29tLDIwMjQ6bmV3c21sX1JDMjlRNkE4WEk5Tg", "News report", "Reuters visual record of the 2024 hunger strike for safeguards and statehood.")
    ],
    timeline: [
      { date: "2019", title: "Ladakh becomes Union Territory", summary: "After the Jammu and Kashmir Reorganisation Act, Ladakh became a Union Territory without a legislature.", sourceIndex: [0] },
      { date: "2024", title: "Climate fast and march politics", summary: "Wangchuk and civil society groups pressed statehood and Sixth Schedule demands through fasting and public mobilisation.", sourceIndex: [0, 2] },
      { date: "2025", title: "Longer hunger strike", summary: "Reports described a renewed hunger strike and a growing gap between protest leadership and Centre-led talks.", sourceIndex: [0] },
      { date: "2026", title: "Detention revoked", summary: "Al Jazeera reported that Wangchuk was released after months in preventive detention.", sourceIndex: [1] }
    ],
    sections: [
      { heading: "What happened?", body: "Ladakh's civil society groups demanded statehood, Sixth Schedule protection, job safeguards, and stronger representation after the region became a Union Territory.", sourceIndex: [0] },
      { heading: "Why it matters", body: "The issue links democracy, ecology, border policy, local identity, and the rights of people living in a fragile Himalayan region.", sourceIndex: [0, 2] },
      { heading: "Human cost", body: "Residents argue that without constitutional safeguards, land, jobs, fragile ecology, and cultural identity can be decided without adequate local consent.", sourceIndex: [0] },
      { heading: "Political accountability", body: "The unresolved question is why repeated protests and promises have not produced a clear legal framework for representation and safeguards.", sourceIndex: [0, 1] },
      { heading: "Government response", body: "The official response has included talks and partial administrative measures, while protesters say the core demands remain unresolved.", sourceIndex: [0] },
      { heading: "Court/legal status", body: "The core issue is political and constitutional: whether Ladakh receives Sixth Schedule protections, statehood, or a legislature remains a policy decision.", sourceIndex: [0] },
      { heading: "Media silence/bias", body: "Coverage often reduces the movement to Wangchuk alone, while the larger Ladakhi demands involve elected representation and ecological security.", sourceIndex: [0, 1] },
      { heading: "Unanswered questions", body: "Will Ladakh receive enforceable safeguards, or only administrative promises without democratic control?", sourceIndex: [0, 1] }
    ],
    unansweredQuestions: [
      "Why is there no time-bound statehood roadmap?",
      "Will Sixth Schedule protection be granted or rejected with reasons?",
      "How will Ladakh's ecology and jobs be protected?",
      "Why were peaceful protesters met with detention?"
    ]
  }),
  withStandardAnswers({
    title: "Joshimath Land Subsidence",
    slug: "joshimath-land-subsidence",
    location: "Joshimath, Uttarakhand",
    year: "2023",
    peopleAffected: "Residents, shopkeepers, hotel workers, pilgrims, displaced families",
    mainIssue: "Land subsidence, unsafe buildings, construction pressure, compensation, and rehabilitation.",
    governmentResponse:
      "The state identified unsafe structures, moved some residents, announced relief measures, and courts pushed for expert assessment and construction restrictions.",
    groundReality:
      "Residents faced cracked homes, uncertain compensation, livelihood loss, and fear that warnings about fragile Himalayan development were acted on too late.",
    unansweredQuestion: "Why were warnings about Joshimath's fragility not converted into prevention before homes cracked?",
    status: "Source-backed",
    category: "Ecology",
    summary:
      "Joshimath became a symbol of Himalayan development without enough risk accountability: cracks came first, answers came later.",
    seoTitle: "Joshimath Land Subsidence - India's Unanswered Files",
    seoDescription:
      "CWI tracks Joshimath subsidence, unsafe houses, court observations, construction bans, relief, and rehabilitation questions.",
    keywords: ["Joshimath land subsidence", "Uttarakhand sinking town", "Himalayan development"],
    sources: [
      source("The Indian Express", "Supreme Court asks petitioner to move Uttarakhand High Court", "https://indianexpress.com/article/india/joshimath-land-subsidence-supreme-court-national-disaster-8384969/", "Court/legal", "Court-linked reporting on petitions, expert studies, and construction restrictions."),
      source("The Indian Express", "ISRO images show Joshimath sank over 5 cm in 12 days", "https://indianexpress.com/article/cities/joshimath-sinking-top-developments-january-138379617/", "News report", "Satellite and administrative developments during the January 2023 crisis.")
    ],
    timeline: [
      { date: "January 2023", title: "Cracks widen", summary: "Residents reported widening cracks in homes, roads, and hotels.", sourceIndex: [1] },
      { date: "January 2023", title: "Unsafe buildings identified", summary: "Authorities marked buildings unsafe and moved affected people into temporary accommodation.", sourceIndex: [1] },
      { date: "January 2023", title: "Court scrutiny", summary: "Courts discussed expert studies and construction restrictions in the affected area.", sourceIndex: [0] },
      { date: "After 2023", title: "Rehabilitation questions", summary: "The larger questions moved to compensation, safe relocation, and future development limits.", sourceIndex: [0] }
    ],
    sections: [
      { heading: "What happened?", body: "Joshimath saw sudden and visible land subsidence, with cracks appearing in homes, roads, hotels, and public structures.", sourceIndex: [1] },
      { heading: "Why it matters", body: "The case raises the cost of ignoring geology, hydrology, unplanned construction, and infrastructure pressure in the Himalayas.", sourceIndex: [0, 1] },
      { heading: "Human cost", body: "Families lost the safety of home, workers lost livelihood certainty, and residents were forced to negotiate relief while living with fear.", sourceIndex: [1] },
      { heading: "Political accountability", body: "The accountability question is whether warnings were visible long before the emergency and why prevention was weaker than response.", sourceIndex: [0] },
      { heading: "Government response", body: "Authorities moved affected people, announced relief measures, and faced judicial pressure around studies and construction restrictions.", sourceIndex: [0, 1] },
      { heading: "Court/legal status", body: "The Supreme Court asked the petitioner to approach the Uttarakhand High Court, noting overlap with proceedings there.", sourceIndex: [0] },
      { heading: "Media silence/bias", body: "Coverage often spikes during visible disaster, then fades before rehabilitation and development-policy accountability are complete.", sourceIndex: [0, 1] },
      { heading: "Unanswered questions", body: "Who pays for lost homes, who regulates future construction, and who answers for warnings not acted on earlier?", sourceIndex: [0, 1] }
    ],
    unansweredQuestions: [
      "Was the construction ban enforced strongly enough?",
      "Were residents compensated transparently?",
      "What projects were reviewed after the disaster?",
      "What happens to families whose homes remain unsafe?"
    ]
  }),
  withStandardAnswers({
    title: "Great Nicobar Mega Project",
    slug: "great-nicobar-shompen-nicobarese",
    location: "Great Nicobar Island, Andaman and Nicobar Islands",
    year: "2022-2026",
    peopleAffected: "Shompen, Nicobarese, island residents, coastal ecosystems",
    mainIssue: "Mega infrastructure, tribal rights, environmental clearance, biodiversity, disaster risk, and transparency.",
    governmentResponse:
      "The government has defended the project as strategically and economically important, with official claims of safeguards, scientific scrutiny, and no proposed indigenous displacement.",
    groundReality:
      "Environmentalists, tribal-rights advocates, scientists, and litigants raised concerns about clearance opacity, ecological damage, disaster risk, and impact on Shompen and Nicobarese communities.",
    unansweredQuestion: "Can a mega project proceed in a tribal reserve and fragile island ecosystem without transparent consent and independent ecological scrutiny?",
    status: "Needs transparency",
    category: "Tribal rights",
    summary:
      "Great Nicobar is a test of strategic development versus ecological and tribal-rights safeguards in one of India's most sensitive island regions.",
    seoTitle: "Great Nicobar Project - India's Unanswered Files",
    seoDescription:
      "CWI explains the Great Nicobar mega project, Shompen and Nicobarese concerns, clearances, official claims, and unanswered transparency issues.",
    keywords: ["Great Nicobar project", "Shompen", "Nicobarese", "tribal rights", "environmental clearance"],
    sources: [
      source("The Indian Express", "Development of Great Nicobar: strategic imperative and ecological concerns", "https://indianexpress.com/article/explained/great-nicobar-development-project-proposal-concerns-8281844/", "Explainer", "Project components, strategic rationale, and ecological/tribal concerns."),
      source("The Indian Express", "Legal challenges to the Great Nicobar infrastructure project", "https://indianexpress.com/article/explained/legal-cases-greater-nicobar-infra-project-9490929/", "Court/legal", "Legal challenges on biodiversity, environmental assessment, and due process."),
      source("Business Standard", "Great Nicobar Project: Why it matters and concerns", "https://www.business-standard.com/amp/india-news/great-nicobar-project-explained-strategic-push-ecological-risk-126050601098_1.html", "News report", "Official strategic framing and government claims of safeguards.")
    ],
    timeline: [
      { date: "2022", title: "Environmental clearance", summary: "The project received environmental clearance, triggering legal and ecological scrutiny.", sourceIndex: [0, 1] },
      { date: "2024", title: "Legal challenges continue", summary: "Challenges focused on biodiversity, tribal consultation, and clearance process.", sourceIndex: [1] },
      { date: "2026", title: "Strategic push continues", summary: "Government-linked framing continued to highlight strategic and economic value.", sourceIndex: [2] }
    ],
    sections: [
      { heading: "What happened?", body: "The Great Nicobar project proposes major port, airport, power, and township infrastructure in an ecologically fragile island with indigenous communities.", sourceIndex: [0] },
      { heading: "Why it matters", body: "The island is strategically important, but it is also home to protected ecosystems and vulnerable indigenous communities.", sourceIndex: [0, 2] },
      { heading: "Human cost", body: "The central concern is whether Shompen and Nicobarese rights, consent, health, land, and cultural survival are fully protected.", sourceIndex: [0, 1] },
      { heading: "Political accountability", body: "Accountability depends on transparent clearances, independent studies, tribal consultation, and public disclosure of risk assessment.", sourceIndex: [1] },
      { heading: "Government response", body: "The government has defended the project as a strategic necessity and said safeguards are built into the process.", sourceIndex: [2] },
      { heading: "Court/legal status", body: "Legal challenges have questioned environmental impact assessment, biodiversity risk, and due process.", sourceIndex: [1] },
      { heading: "Media silence/bias", body: "Strategic security framing can overwhelm tribal-rights and ecology questions unless both are documented together.", sourceIndex: [0, 2] },
      { heading: "Unanswered questions", body: "Were tribal communities consulted meaningfully and independently, and will all environmental documents remain public?", sourceIndex: [1] }
    ],
    unansweredQuestions: [
      "What consent process was followed with Shompen and Nicobarese communities?",
      "Are all clearance studies independently reviewable?",
      "How will disaster and seismic risk be handled?",
      "Can strategic urgency override tribal protections?"
    ]
  }),
  withStandardAnswers({
    title: "Hasdeo Aranya Coal Mining and Adivasi Protests",
    slug: "hasdeo-aranya-coal-mining",
    location: "Chhattisgarh",
    year: "2011-2026",
    peopleAffected: "Adivasi villages, forest-dependent communities, wildlife corridors",
    mainIssue: "Coal mining clearances, forest diversion, consent claims, Adivasi protest, and ecological damage.",
    governmentResponse:
      "State and central authorities have defended coal extraction through approvals and energy-supply arguments, while different governments have also issued conflicting political signals.",
    groundReality:
      "Adivasi groups and environmental campaigners argue that forest loss, elephant conflict, livelihood damage, and consent disputes remain unresolved.",
    unansweredQuestion: "Whose consent counts when forests, coal, power demand, and Adivasi land rights collide?",
    status: "Reported",
    category: "Adivasi rights",
    summary:
      "Hasdeo Aranya asks whether energy policy can be legitimate when forest communities say their land and consent were not respected.",
    seoTitle: "Hasdeo Aranya Coal Mining - India's Unanswered Files",
    seoDescription:
      "CWI tracks Hasdeo Aranya mining, Adivasi protests, forest diversion, consent disputes, and accountability questions.",
    keywords: ["Hasdeo Aranya", "Adivasi protest", "coal mining", "forest rights"],
    sources: [
      source("The Indian Express", "Return of Hasdeo Aranya tribal protests", "https://indianexpress.com/article/political-pulse/decode-politics-change-of-govt-return-of-hasdeo-aranya-tribal-protests-in-chhattisgarh-9106062/", "Explainer", "Political context, protests, mining history, and claims by activists."),
      source("The Hindu Learning Corner", "Coal mining protests in Hasdeo Aranya", "https://learningcorner.epaper.thehindu.com/article/65726814", "Explainer", "Background on Hasdeo region, river, coal blocks, and protest politics.")
    ],
    timeline: [
      { date: "2010s", title: "Coal blocks contested", summary: "Hasdeo became a long-running forest-rights and mining conflict.", sourceIndex: [1] },
      { date: "2022", title: "Assembly resolution politics", summary: "Chhattisgarh politics saw conflicting signals around cancellation and continuation of coal blocks.", sourceIndex: [0] },
      { date: "2024", title: "Protests return", summary: "Adivasi and civil society groups protested renewed cutting and mining activity.", sourceIndex: [0] }
    ],
    sections: [
      { heading: "What happened?", body: "Hasdeo Aranya has seen long-running protests against coal mining in forest areas inhabited by Adivasi communities.", sourceIndex: [0, 1] },
      { heading: "Why it matters", body: "The case links energy demand to forest rights, consent, biodiversity, elephants, livelihoods, and state accountability.", sourceIndex: [0] },
      { heading: "Human cost", body: "Villagers fear loss of forest, land, water, livelihood, and cultural continuity tied to the forest.", sourceIndex: [0, 1] },
      { heading: "Political accountability", body: "Different governments have promised protection while mining approvals and tree felling continued or returned.", sourceIndex: [0] },
      { heading: "Government response", body: "Authorities frame coal as necessary for power supply and project approvals; protesters challenge consent and ecological cost.", sourceIndex: [0] },
      { heading: "Court/legal status", body: "Forest clearance, gram sabha consent, and environmental approval questions remain central to legal and administrative scrutiny.", sourceIndex: [0, 1] },
      { heading: "Media silence/bias", body: "Mining is often framed as development, while Adivasi consent and forest dependence are treated as secondary.", sourceIndex: [0] },
      { heading: "Unanswered questions", body: "Were gram sabha processes free, informed, and respected, and who verifies forest-loss claims independently?", sourceIndex: [0, 1] }
    ],
    unansweredQuestions: [
      "Were consent processes genuinely free and informed?",
      "What is the full ecological cost of mining?",
      "How are elephant corridors and water systems protected?",
      "Why do protection promises keep colliding with approvals?"
    ]
  }),
  withStandardAnswers({
    title: "Women Wrestlers' Sexual Harassment Case",
    slug: "women-wrestlers-sexual-harassment-case",
    location: "Delhi / Wrestling Federation of India",
    year: "2023-2026",
    peopleAffected: "Women wrestlers, athletes, complainants, sports institutions",
    mainIssue: "Sexual harassment allegations against former WFI chief Brij Bhushan Sharan Singh, institutional delay, athlete protest, and trial.",
    governmentResponse:
      "The official response included an oversight process, police action after court pressure, and later legal proceedings; the accused has denied wrongdoing.",
    groundReality:
      "Elite athletes had to protest publicly before the case moved, raising questions about sports power structures and complainant protection.",
    unansweredQuestion: "Why did decorated athletes have to sit on the street for a sexual harassment complaint to receive serious institutional attention?",
    status: "Court-monitored",
    category: "Gender justice",
    summary:
      "The wrestlers' case is a test of how Indian sport handles sexual harassment allegations when accused officials have political and institutional power.",
    seoTitle: "Women Wrestlers Case - India's Unanswered Files",
    seoDescription:
      "CWI tracks the women wrestlers' sexual harassment case, court charges, athlete protests, government response, and institutional accountability.",
    keywords: ["women wrestlers case", "Brij Bhushan", "sexual harassment", "WFI"],
    sources: [
      source("The Indian Express", "Wrestler deposes before court", "https://indianexpress.com/article/cities/delhi/brij-bhushan-case-women-wrestlers-sexual-harassment-chargesheet-9530189/", "Court/legal", "Trial-stage reporting on complainant deposition."),
      source("NDTV", "Delhi court frames charges", "https://www.ndtv.com/india-news/frame-charges-against-ex-wrestling-body-chief-brij-bhushan-delhi-court-5633227", "Court/legal", "Court order framing charges against Brij Bhushan in relation to five complainants; he denied allegations.")
    ],
    timeline: [
      { date: "January 2023", title: "Athlete protest begins", summary: "Top wrestlers publicly accused the WFI chief and demanded action.", sourceIndex: [0] },
      { date: "2023", title: "Police and court process", summary: "The case moved through police complaints, charge sheet, and court proceedings.", sourceIndex: [0] },
      { date: "May 2024", title: "Charges framed", summary: "A Delhi court ordered framing of charges in the case, according to reports.", sourceIndex: [1] },
      { date: "2024 onward", title: "Trial continues", summary: "Complainants began deposition before court.", sourceIndex: [0] }
    ],
    sections: [
      { heading: "What happened?", body: "Women wrestlers alleged sexual harassment by former WFI chief Brij Bhushan Sharan Singh, who denied the allegations.", sourceIndex: [0, 1] },
      { heading: "Why it matters", body: "The case tests whether women athletes can report abuse without public protest, intimidation, or institutional delay.", sourceIndex: [0] },
      { heading: "Human cost", body: "Complainants had to navigate publicity, legal pressure, career risk, and power imbalance inside Indian sport.", sourceIndex: [0] },
      { heading: "Political accountability", body: "The accused was both a sports administrator and BJP politician, making institutional independence a central question.", sourceIndex: [0, 1] },
      { heading: "Government response", body: "The government used an oversight process and police investigation; critics questioned delay and complainant confidence.", sourceIndex: [0] },
      { heading: "Court/legal status", body: "A Delhi court ordered charges to be framed; trial-stage depositions were reported later. This is not a final conviction.", sourceIndex: [0, 1] },
      { heading: "Media silence/bias", body: "Some coverage focused on athlete politics rather than the basic question of safe reporting in sport.", sourceIndex: [0] },
      { heading: "Unanswered questions", body: "What institutional safeguards will prevent athletes from needing public protest before action?", sourceIndex: [0] }
    ],
    unansweredQuestions: [
      "Why was public protest necessary?",
      "Are complainants protected from retaliation?",
      "Will WFI reforms outlast media attention?",
      "How are minors and women athletes safeguarded?"
    ]
  }),
  withStandardAnswers({
    title: "NEET Paper Leak and NTA Accountability Crisis",
    slug: "neet-paper-leak-nta-accountability",
    location: "India / Patna / Hazaribagh",
    year: "2024",
    peopleAffected: "Medical aspirants, families, teachers, exam centres",
    mainIssue: "NEET-UG 2024 leak, grace marks controversy, NTA credibility, investigation, and exam reform.",
    governmentResponse:
      "The government and NTA defended the exam process in parts, investigations were handed to agencies, and a reform committee was announced; the Supreme Court declined a full retest.",
    groundReality:
      "Students faced anxiety, uncertainty, litigation, and trust collapse in a high-stakes exam that shapes careers and family finances.",
    unansweredQuestion: "How can a national exam remain credible when leaks are acknowledged but systemic accountability feels diffuse?",
    status: "Court-monitored",
    category: "Students",
    summary:
      "The NEET crisis is not only about one exam paper. It is about whether students can trust India's testing machinery.",
    seoTitle: "NEET Paper Leak and NTA Crisis - India's Unanswered Files",
    seoDescription:
      "CWI tracks NEET-UG 2024 leak, Supreme Court findings, NTA accountability, student impact, and reform questions.",
    keywords: ["NEET paper leak", "NTA accountability", "NEET UG 2024", "student justice"],
    sources: [
      source("The Indian Express", "Supreme Court rules out NEET retest", "https://indianexpress.com/article/education/neet-ug-2024-sc-rules-out-cancellation-and-retest-paper-leak-final-verdict-9403650/", "Court/legal", "Supreme Court's final decision not to cancel the exam while noting leak locations."),
      source("The Indian Express", "Leak took place, says Supreme Court", "https://indianexpress.com/article/education/neet-ug-2024-sc-directs-cbi-to-submit-report-on-status-of-investigation-next-hearing-on-july-11-9439462/", "Court/legal", "Court observations that a leak took place and the key question was scale and beneficiary segregation.")
    ],
    timeline: [
      { date: "5 May 2024", title: "NEET-UG held", summary: "The national medical entrance exam was conducted across India.", sourceIndex: [0] },
      { date: "June-July 2024", title: "Leak allegations and litigation", summary: "Students and petitioners challenged the exam process and sought relief.", sourceIndex: [1] },
      { date: "July 2024", title: "Supreme Court ruling", summary: "The court declined a full retest but addressed leak locations and exam corrections.", sourceIndex: [0] }
    ],
    sections: [
      { heading: "What happened?", body: "NEET-UG 2024 faced allegations and later court-recognised findings around paper leak events in Patna and Hazaribagh.", sourceIndex: [0, 1] },
      { heading: "Why it matters", body: "Medical entrance exams shape years of preparation, family spending, student mental health, and public trust in merit.", sourceIndex: [0] },
      { heading: "Human cost", body: "Students lived through uncertainty over retest, rank validity, counselling, and whether hard work was being measured fairly.", sourceIndex: [1] },
      { heading: "Political accountability", body: "The NTA and education ministry faced questions over exam design, centre control, leak prevention, and public communication.", sourceIndex: [0, 1] },
      { heading: "Government response", body: "Authorities pointed to investigation and reform while the court declined a full cancellation after assessing available material.", sourceIndex: [0] },
      { heading: "Court/legal status", body: "The Supreme Court ruled out a retest, while recognising leak issues and directing corrections where necessary.", sourceIndex: [0] },
      { heading: "Media silence/bias", body: "Student distress can be reduced to partisan shouting unless reporting separates verified leak facts from viral claims.", sourceIndex: [1] },
      { heading: "Unanswered questions", body: "What concrete institutional reform prevents repetition, and who is accountable beyond arrested intermediaries?", sourceIndex: [0, 1] }
    ],
    unansweredQuestions: [
      "Who is accountable for exam security design?",
      "Will NTA reform be transparent?",
      "How will future leak claims be verified quickly?",
      "What compensation exists for student anxiety and delay?"
    ]
  }),
  withStandardAnswers({
    title: "Electoral Bonds and Political Funding Transparency",
    slug: "electoral-bonds-transparency",
    location: "India",
    year: "2018-2024",
    peopleAffected: "Voters, political parties, donors, public institutions",
    mainIssue: "Anonymous political funding, voters' right to know, corporate influence, and transparency.",
    governmentResponse:
      "The government defended electoral bonds as a cleaner alternative to cash donations and argued the scheme could protect donor privacy.",
    groundReality:
      "The Supreme Court struck down the scheme as unconstitutional and ordered disclosure, turning political finance into a major transparency file.",
    unansweredQuestion: "What replaced the scheme, and will voters get real-time transparency on political money?",
    status: "Court-monitored",
    category: "Democracy",
    summary:
      "Electoral bonds forced India to confront a simple democratic question: can voters judge parties without knowing who funds them?",
    seoTitle: "Electoral Bonds Transparency - India's Unanswered Files",
    seoDescription:
      "CWI tracks the Supreme Court electoral bonds judgment, donor disclosure, official response, and political funding transparency questions.",
    keywords: ["electoral bonds", "political funding", "Supreme Court", "transparency"],
    sources: [
      source("The Indian Express", "Supreme Court strikes down electoral bonds scheme", "https://indianexpress.com/article/india/supreme-court-electoral-bonds-9162593/", "Court/legal", "Supreme Court held the scheme unconstitutional and tied it to the voter's right to information."),
      source("The Indian Express", "SC turns down SBI plea", "https://indianexpress.com/article/political-pulse/electoral-bonds-supreme-court-sbi-donors-9208115/", "Court/legal", "Reporting on disclosure deadlines and SBI's extension plea.")
    ],
    timeline: [
      { date: "2018", title: "Scheme begins", summary: "Electoral bonds became a route for political donations through banks.", sourceIndex: [0] },
      { date: "February 2024", title: "Scheme struck down", summary: "The Supreme Court held the scheme unconstitutional.", sourceIndex: [0] },
      { date: "March 2024", title: "Disclosure fight", summary: "The court rejected SBI's extension plea and pushed disclosure of donor details.", sourceIndex: [1] }
    ],
    sections: [
      { heading: "What happened?", body: "The Supreme Court struck down the electoral bonds scheme, holding that anonymous political funding violated voters' right to information.", sourceIndex: [0] },
      { heading: "Why it matters", body: "Political money shapes policy, access, and public trust. Without disclosure, voters cannot judge conflicts of interest.", sourceIndex: [0] },
      { heading: "Human cost", body: "The cost is democratic rather than individual: citizens vote without knowing financial networks behind parties.", sourceIndex: [0] },
      { heading: "Political accountability", body: "All parties that received funds are part of the transparency question; CWI does not frame this as one-party-only accountability.", sourceIndex: [0, 1] },
      { heading: "Government response", body: "The official defence emphasised clean banking channels and donor privacy, but the court prioritised voter information.", sourceIndex: [0] },
      { heading: "Court/legal status", body: "The Supreme Court struck down the scheme and ordered disclosure processes.", sourceIndex: [0, 1] },
      { heading: "Media silence/bias", body: "Coverage can become party-scorekeeping, but the core issue is system-level political finance transparency.", sourceIndex: [0] },
      { heading: "Unanswered questions", body: "What transparent funding regime replaces electoral bonds, and will disclosure become timely and searchable?", sourceIndex: [1] }
    ],
    unansweredQuestions: [
      "Will India create real-time political funding disclosure?",
      "How will quid-pro-quo concerns be investigated?",
      "Will all parties support transparent funding reform?",
      "What safeguards prevent another opaque system?"
    ]
  }),
  withStandardAnswers({
    title: "Bulldozer Justice and Arbitrary Demolitions",
    slug: "bulldozer-justice-demolitions",
    location: "Multiple states",
    year: "2022-2024",
    peopleAffected: "Families facing demolitions, accused persons, tenants, informal workers",
    mainIssue: "Punitive demolitions, due process, collective punishment, housing rights, and Supreme Court guidelines.",
    governmentResponse:
      "State authorities often described demolitions as action against illegal encroachment or unauthorised construction.",
    groundReality:
      "Rights groups and courts raised concerns that demolitions were used as punishment after accusations, protests, or communal violence without due process.",
    unansweredQuestion: "Can the state demolish homes while claiming legality if the timing signals punishment?",
    status: "Court-monitored",
    category: "Civil liberties",
    summary:
      "Bulldozer justice became shorthand for punishment before trial. The Supreme Court's guidelines made due process central.",
    seoTitle: "Bulldozer Justice - India's Unanswered Files",
    seoDescription:
      "CWI tracks arbitrary demolitions, Supreme Court guidelines, official encroachment claims, and housing-rights concerns.",
    keywords: ["bulldozer justice", "arbitrary demolitions", "Supreme Court demolition guidelines"],
    sources: [
      source("India Today", "Supreme Court frames demolition guidelines", "https://www.indiatoday.in/india/law-news/story/supreme-court-frames-guidelines-demolitions-15-day-notice-video-recording-2632614-2024-11-13", "Court/legal", "Guidelines including notice, documentation, and due process."),
      source("DW", "India: Supreme Court bans 'bulldozer justice'", "https://www.dw.com/en/india-supreme-court-bans-bulldozer-justice/a-70771474", "News report", "International report on Supreme Court decision and rights concerns."),
      source("Amnesty International", "Bulldozer Injustice in India", "https://www.amnesty.org/en/documents/asa20/8796/2024/en/", "Human-rights report", "Human-rights allegations around punitive demolitions.")
    ],
    timeline: [
      { date: "2022-2024", title: "Demolition pattern", summary: "Several states saw demolitions after protests, violence, or accusations.", sourceIndex: [2] },
      { date: "November 2024", title: "Supreme Court guidelines", summary: "The Supreme Court issued pan-India demolition safeguards.", sourceIndex: [0, 1] }
    ],
    sections: [
      { heading: "What happened?", body: "Demolitions were reported in multiple states in contexts where families alleged punishment without trial or adequate notice.", sourceIndex: [1, 2] },
      { heading: "Why it matters", body: "A home cannot become a punishment tool. Due process protects both accused persons and innocent family members.", sourceIndex: [0] },
      { heading: "Human cost", body: "Demolitions can displace children, elders, tenants, and workers who are not accused of any offence.", sourceIndex: [2] },
      { heading: "Political accountability", body: "The core question is whether governments used municipal law neutrally or selectively as public punishment.", sourceIndex: [1, 2] },
      { heading: "Government response", body: "Authorities often claimed action was against illegal structures; the court emphasised that illegality still requires due process.", sourceIndex: [0] },
      { heading: "Court/legal status", body: "The Supreme Court issued guidelines requiring notice, documentation, and safeguards against arbitrary demolition.", sourceIndex: [0] },
      { heading: "Media silence/bias", body: "Some coverage celebrated demolitions as instant justice, ignoring constitutional protections and family displacement.", sourceIndex: [1, 2] },
      { heading: "Unanswered questions", body: "Who compensates families if demolition is later found illegal or selective?", sourceIndex: [0, 2] }
    ],
    unansweredQuestions: [
      "Will officials be personally liable for illegal demolitions?",
      "How are tenants and children protected?",
      "Are demolition records public?",
      "Will states comply with Supreme Court safeguards?"
    ]
  }),
  withStandardAnswers({
    title: "Assam Evictions",
    slug: "assam-evictions",
    location: "Assam",
    year: "2021-2026",
    peopleAffected: "Evicted families, Bengali-origin Muslims, riverine communities, landless households",
    mainIssue: "Eviction drives, land conflict, citizenship anxiety, rehabilitation, and police violence.",
    governmentResponse:
      "The Assam government framed drives as removal of encroachment from government land and linked some cleared land to agricultural or public projects.",
    groundReality:
      "Independent reports described families losing homes, inadequate rehabilitation, deaths during Dholpur violence, and fear among vulnerable communities.",
    unansweredQuestion: "Can eviction be lawful if rehabilitation, notice, and humane treatment are weak or contested?",
    status: "Reported",
    category: "Housing rights",
    summary:
      "Assam's eviction file connects land, migration politics, flood displacement, citizenship anxiety, and the basic right to shelter.",
    seoTitle: "Assam Evictions - India's Unanswered Files",
    seoDescription:
      "CWI tracks Assam evictions, Dholpur/Gorukhuti violence, government encroachment claims, and rehabilitation questions.",
    keywords: ["Assam evictions", "Dholpur", "Gorukhuti", "housing rights"],
    sources: [
      source("The Indian Express", "Explained: Assam's conflict over land", "https://indianexpress.com/article/explained/assam-sipajhar-eviction-drive-violence-police-civilians-protests-7536183/", "Explainer", "Land conflict, eviction drive, and political background."),
      source("Al Jazeera", "Indian Muslims forcibly evicted in Assam", "https://www.aljazeera.com/news/2021/10/12/india-assam-muslims-forcibly-evicted-dhalpur-bjp-darrang", "Ground report", "Ground reporting from displaced families after Dhalpur evictions."),
      source("Scroll", "Assam government resumes eviction drive", "https://scroll.in/latest/1068156/assam-government-resumes-eviction-drive-against-bengali-muslim-families-in-dhalpur", "News report", "Later reporting on continued evictions in the same area.")
    ],
    timeline: [
      { date: "September 2021", title: "Dholpur eviction violence", summary: "An eviction drive in Darrang district turned violent and deaths were reported.", sourceIndex: [0, 1] },
      { date: "2024", title: "Evictions continue", summary: "Reports described renewed demolition of homes in Dhalpur.", sourceIndex: [2] },
      { date: "2021-2026", title: "Rehabilitation questions", summary: "Families and rights groups continued raising concerns over housing and due process.", sourceIndex: [1, 2] }
    ],
    sections: [
      { heading: "What happened?", body: "Eviction drives in Assam removed families from land the government described as encroached, including in Dholpur/Gorukhuti.", sourceIndex: [0] },
      { heading: "Why it matters", body: "Eviction without robust rehabilitation creates a public-interest issue even where land titles are disputed.", sourceIndex: [1] },
      { heading: "Human cost", body: "Families lost homes, documents, schooling stability, livelihood access, and safety.", sourceIndex: [1, 2] },
      { heading: "Political accountability", body: "The issue sits at the intersection of land policy, citizenship politics, policing, and minority rights.", sourceIndex: [0, 1] },
      { heading: "Government response", body: "Authorities framed the drives as anti-encroachment and land recovery, while critics questioned notice and rehabilitation.", sourceIndex: [0, 2] },
      { heading: "Court/legal status", body: "Land, eviction, and rehabilitation questions require documentary verification case by case; this file avoids treating all residents as lawful owners or illegal encroachers.", sourceIndex: [0] },
      { heading: "Media silence/bias", body: "Evictees are often reduced to labels before their documents, history, and rehabilitation claims are examined.", sourceIndex: [1] },
      { heading: "Unanswered questions", body: "Where were evicted families supposed to go, and how was eligibility for rehabilitation verified?", sourceIndex: [1, 2] }
    ],
    unansweredQuestions: [
      "Were notices adequate and understandable?",
      "Was rehabilitation offered before demolition?",
      "Were policing actions independently reviewed?",
      "How does river erosion affect land claims?"
    ]
  }),
  withStandardAnswers({
    title: "Farmers' MSP Protest",
    slug: "farmers-msp-protest",
    location: "Punjab-Haryana borders / Delhi route",
    year: "2024-2025",
    peopleAffected: "Farmers, farm labourers, consumers, rural families",
    mainIssue: "Legal guarantee for MSP, farm incomes, debt, protest restrictions, and failed talks.",
    governmentResponse:
      "The Centre held rounds of talks and offered procurement-related proposals, while ministers said MSP law could not be rushed without stakeholder consultation.",
    groundReality:
      "Farmers remained at borders, faced barricades and tear gas, and argued that earlier promises after repeal of farm laws did not produce a legal MSP guarantee.",
    unansweredQuestion: "Why has the MSP debate remained stuck between affordability claims and farmer income insecurity?",
    status: "Developing",
    category: "Farmers",
    summary:
      "The MSP protest is a long argument over whether minimum crop prices should be an administrative announcement or a legal right.",
    seoTitle: "Farmers MSP Protest - India's Unanswered Files",
    seoDescription:
      "CWI tracks farmers' MSP protest, Shambhu border, government talks, legal guarantee demands, and rural distress questions.",
    keywords: ["farmers MSP protest", "legal MSP guarantee", "Shambhu border", "farmer income"],
    sources: [
      source("Associated Press", "Police use tear gas against farmers", "https://apnews.com/article/fb01da65634b532d92bc017cc3be730b", "News report", "February 2024 march, barricades, tear gas, and MSP demand."),
      source("Associated Press", "Young man dies during clashes", "https://apnews.com/article/6fca589a5895501b7d9eb9a7e85bd123", "News report", "Report on death of Shubhkaran Singh during farmer-police clashes."),
      source("The Indian Express", "How would MSP guarantee work?", "https://indianexpress.com/article/explained/explained-economics/farmers-protest-msp-guarantee-law-9157499/", "Explainer", "Economic complexity of legal MSP guarantee.")
    ],
    timeline: [
      { date: "February 2024", title: "Delhi Chalo blocked", summary: "Farmers marching toward Delhi were stopped at borders and faced tear gas.", sourceIndex: [0] },
      { date: "February 2024", title: "Death during clashes", summary: "AP reported a young farmer died as clashes continued.", sourceIndex: [1] },
      { date: "2024-2025", title: "MSP demand remains", summary: "Legal guarantee for MSP remained the central demand.", sourceIndex: [2] }
    ],
    sections: [
      { heading: "What happened?", body: "Farmers from Punjab and Haryana renewed protests demanding a legal guarantee for MSP and other farm-related relief.", sourceIndex: [0, 2] },
      { heading: "Why it matters", body: "MSP policy affects food security, crop choice, procurement, rural income, and public finances.", sourceIndex: [2] },
      { heading: "Human cost", body: "Farmers faced barricades, tear gas, border camps, injury risk, and uncertainty over livelihood security.", sourceIndex: [0, 1] },
      { heading: "Political accountability", body: "The unresolved issue is whether promises after the farm-law repeal translated into enforceable policy.", sourceIndex: [0, 2] },
      { heading: "Government response", body: "The government held talks and offered procurement proposals while arguing that a legal MSP framework requires broader consultation.", sourceIndex: [2] },
      { heading: "Court/legal status", body: "The MSP guarantee demand is legislative and policy-driven rather than a single criminal trial or court order.", sourceIndex: [2] },
      { heading: "Media silence/bias", body: "The debate is often reduced to traffic disruption or partisan farming politics instead of examining farm income data and policy design.", sourceIndex: [2] },
      { heading: "Unanswered questions", body: "What exact legal architecture can protect farmers without breaking procurement systems?", sourceIndex: [2] }
    ],
    unansweredQuestions: [
      "Can MSP be legally guaranteed without universal procurement?",
      "What happened to earlier committee promises?",
      "Who is accountable for protest injuries?",
      "How are small farmers included in policy design?"
    ]
  }),
  withStandardAnswers({
    title: "Wayanad Landslide and Ignored Ecological Warnings",
    slug: "wayanad-landslide-ecological-warnings",
    location: "Wayanad, Kerala",
    year: "2024",
    peopleAffected: "Landslide survivors, families of the dead and missing, plantation workers, displaced households",
    mainIssue: "Deadly landslides, early warning disputes, ecological risk, rehabilitation, and climate vulnerability.",
    governmentResponse:
      "The Centre said warnings were issued and NDRF teams were moved; Kerala disputed the precision of landslide warnings and sought support for rescue and rehabilitation.",
    groundReality:
      "The disaster destroyed homes and settlements, killed hundreds according to major reports, and raised hard questions about land-use change, risk maps, and last-mile alerts.",
    unansweredQuestion: "Why did known ecological vulnerability not translate into safer settlement, warning, and evacuation systems?",
    status: "Reported",
    category: "Climate disaster",
    summary:
      "Wayanad shows how ecological warnings become political arguments after lives are lost, instead of prevention before disaster.",
    seoTitle: "Wayanad Landslide - India's Unanswered Files",
    seoDescription:
      "CWI tracks the Wayanad landslide, ecological warnings, official early-warning dispute, rehabilitation, and climate-risk accountability.",
    keywords: ["Wayanad landslide", "Kerala landslide", "ecological warnings", "climate disaster India"],
    sources: [
      source("The Indian Express", "Wayanad tragedy is a warning", "https://indianexpress.com/article/opinion/columns/before-the-landslide-wayanad-tragedy-is-a-warning-dont-ignore-ecology-9491745/", "Explainer", "Ecological warning frame and reported scale of the disaster."),
      source("Business Standard", "Amit Shah says early warning was given", "https://www.business-standard.com/india-news/kerala-was-given-early-warning-on-july-23-says-amit-shah-on-wayanad-landslides-124073100965_1.html", "Official response", "Reported central government position on early warnings."),
      source("Onmanorama", "Kerala CM counters early-warning claim", "https://www.onmanorama.com/news/kerala/2024/07/31/wayanad-landslides-kerala-cm-pinarayi-vijayan-update.html", "News report", "Kerala government's response disputing landslide warning precision.")
    ],
    timeline: [
      { date: "30 July 2024", title: "Landslides hit Wayanad", summary: "Landslides struck villages in Wayanad after intense rainfall.", sourceIndex: [0] },
      { date: "31 July 2024", title: "Warning dispute", summary: "Centre and Kerala publicly disagreed over the nature and timing of warnings.", sourceIndex: [1, 2] },
      { date: "After July 2024", title: "Rehabilitation and ecology debate", summary: "The disaster revived debate on land use, plantations, tourism, climate, and risk mapping.", sourceIndex: [0] }
    ],
    sections: [
      { heading: "What happened?", body: "A catastrophic landslide hit Wayanad in July 2024, destroying settlements and causing major loss of life.", sourceIndex: [0] },
      { heading: "Why it matters", body: "The disaster sits inside a larger Western Ghats debate over land-use change, rainfall extremes, and last-mile warnings.", sourceIndex: [0] },
      { heading: "Human cost", body: "Survivors lost relatives, homes, livelihoods, documents, and community networks in minutes.", sourceIndex: [0] },
      { heading: "Political accountability", body: "After the disaster, political focus shifted to whether warnings were sent and understood, but prevention systems remained the deeper question.", sourceIndex: [1, 2] },
      { heading: "Government response", body: "The Centre claimed early warnings and NDRF movement; Kerala disputed whether specific landslide red alerts were issued in time.", sourceIndex: [1, 2] },
      { heading: "Court/legal status", body: "The file is primarily about disaster governance, ecological planning, and rehabilitation rather than a single court verdict.", sourceIndex: [0] },
      { heading: "Media silence/bias", body: "Disaster coverage often peaks at death tolls and fades before rehabilitation and land-use accountability are complete.", sourceIndex: [0] },
      { heading: "Unanswered questions", body: "Who is responsible for turning hazard maps into relocation, warning, and evacuation systems?", sourceIndex: [0, 2] }
    ],
    unansweredQuestions: [
      "Were risk maps acted on before the disaster?",
      "Were warnings specific enough for evacuation?",
      "How will survivors be permanently rehabilitated?",
      "Will fragile areas face new construction limits?"
    ]
  }),
  withStandardAnswers({
    title: "Vizhinjam Port Fisherfolk Protest",
    slug: "vizhinjam-port-fisherfolk-protest",
    location: "Vizhinjam, Kerala",
    year: "2022-2023",
    peopleAffected: "Fisherfolk, coastal families, port workers, Kerala residents",
    mainIssue: "Port construction, coastal erosion, livelihood loss, rehabilitation, and development consent.",
    governmentResponse:
      "The Kerala government said rehabilitation and livelihoods were priorities while supporting continuation of the port project; courts also weighed construction access.",
    groundReality:
      "Fisherfolk said coastal erosion, housing loss, weather-day compensation, and scientific study concerns were not resolved before construction moved ahead.",
    unansweredQuestion: "Can a port be called development if fishing communities are not convinced their homes and coast are safe?",
    status: "Reported",
    category: "Livelihood",
    summary:
      "Vizhinjam is a development-versus-livelihood file where fisherfolk demanded rehabilitation and coastal safety before the project proceeded.",
    seoTitle: "Vizhinjam Port Fisherfolk Protest - India's Unanswered Files",
    seoDescription:
      "CWI tracks the Vizhinjam port protest, fisherfolk demands, coastal erosion concerns, government response, and rehabilitation questions.",
    keywords: ["Vizhinjam port protest", "fisherfolk Kerala", "Adani port", "coastal erosion"],
    sources: [
      source("The Indian Express", "Why fisherfolk are protesting Vizhinjam port", "https://indianexpress.com/article/explained/kerala-fishermen-vizhinjam-adani-port-protest-explained-8107064/", "Explainer", "Background on fisherfolk demands and project concerns."),
      source("Reuters", "Adani mega port and fishing community protest", "https://www.investing.com/news/stock-market-news/indian-tycoon-adanis-mega-port-hangs-in-the-balance-as-a-fishing-community-protests-2950354", "News report", "Reuters report on the blockade and fishing community concerns."),
      source("NDTV/PTI", "Kerala CM says rehabilitation is priority", "https://www.ndtv.com/kerala-news/rehabilitation-of-locals-top-priority-kerala-chief-minister-on-adani-port-row-3585166", "Official response", "Reported state government position after protest talks.")
    ],
    timeline: [
      { date: "2022", title: "Protests intensify", summary: "Fisherfolk protested from land and sea against the under-construction port.", sourceIndex: [0] },
      { date: "November 2022", title: "Clashes and tension", summary: "Reuters reported escalation and injuries during the months-long protest.", sourceIndex: [1] },
      { date: "December 2022", title: "Protest called off for now", summary: "State leadership said rehabilitation and livelihood protection were priorities.", sourceIndex: [2] }
    ],
    sections: [
      { heading: "What happened?", body: "Fisherfolk protested the Vizhinjam port project, citing coastal erosion, livelihood, housing, and rehabilitation concerns.", sourceIndex: [0, 1] },
      { heading: "Why it matters", body: "Coastal infrastructure affects communities whose work, housing, and safety depend directly on the sea.", sourceIndex: [0] },
      { heading: "Human cost", body: "Fishing families feared loss of homes to erosion, reduced livelihood, and inadequate compensation for dangerous weather days.", sourceIndex: [0] },
      { heading: "Political accountability", body: "The state had to balance a major infrastructure project with coastal community rights and scientific accountability.", sourceIndex: [0, 2] },
      { heading: "Government response", body: "The Kerala government said rehabilitation and livelihood protection were priorities, while the port project continued.", sourceIndex: [2] },
      { heading: "Court/legal status", body: "Construction access and protest rights became matters of legal and administrative concern during the standoff.", sourceIndex: [0, 1] },
      { heading: "Media silence/bias", body: "Fisherfolk were often framed as anti-development rather than residents demanding coastal safety evidence.", sourceIndex: [0] },
      { heading: "Unanswered questions", body: "Were independent coastal impact studies enough, and were all fisher families rehabilitated fairly?", sourceIndex: [0, 2] }
    ],
    unansweredQuestions: [
      "Were erosion claims independently reviewed?",
      "Did rehabilitation reach all affected families?",
      "Who monitors long-term coastal change?",
      "How are fisherfolk represented in project oversight?"
    ]
  }),
  withStandardAnswers({
    title: "Jammu and Kashmir Statehood Delay",
    slug: "jammu-kashmir-statehood-delay",
    location: "Jammu and Kashmir",
    year: "2019-2026",
    peopleAffected: "J&K residents, elected representatives, civil society",
    mainIssue: "Statehood restoration after Article 370 abrogation, elected government under UT powers, and democratic accountability.",
    governmentResponse:
      "The Centre told courts and Parliament that statehood would be restored at an appropriate time or at the earliest, while elections were held under Union Territory status.",
    groundReality:
      "Even after elected government returned, statehood remained delayed and power-sharing with the Lieutenant Governor limited local control.",
    unansweredQuestion: "Why does restoration of statehood remain without a clear deadline after elections were completed?",
    status: "Needs transparency",
    category: "Federalism",
    summary:
      "J&K's statehood file asks whether democracy is complete when voters elect a government without full state powers.",
    seoTitle: "Jammu and Kashmir Statehood Delay - India's Unanswered Files",
    seoDescription:
      "CWI tracks Jammu and Kashmir statehood delay, Article 370 judgment, elections, central promises, and democratic accountability.",
    keywords: ["Jammu Kashmir statehood", "Article 370", "J&K elections", "federalism India"],
    sources: [
      source("Supreme Court Observer", "Article 370 judgement summary", "https://www.scobserver.in/reports/abrogation-of-article-370-judgement-summary/", "Court/legal", "Supreme Court judgment summary including election direction and statehood discussion."),
      source("The Indian Express", "J&K has an elected government. It needs to be a state", "https://indianexpress.com/article/opinion/editorials/jk-elected-government-needs-state-10313622/", "Explainer", "Editorial argument on statehood delay after elections."),
      source("Al Jazeera", "Modi's Kashmir statehood promise", "https://www.aljazeera.com/news/2024/9/30/modis-kashmir-statehood-promise-poll-rhetoric-or-genuine-outreach", "News report", "Election-period reporting on statehood promise and UT powers.")
    ],
    timeline: [
      { date: "August 2019", title: "State downgraded to UT", summary: "Jammu and Kashmir was reorganised into Union Territories after Article 370 changes.", sourceIndex: [0] },
      { date: "December 2023", title: "Supreme Court verdict", summary: "The court upheld Article 370 abrogation and directed elections by September 2024.", sourceIndex: [0] },
      { date: "2024", title: "Assembly elections", summary: "Elections returned an elected government, but statehood was not restored.", sourceIndex: [1, 2] },
      { date: "2025-2026", title: "Delay continues", summary: "Public debate continued around absence of a clear statehood deadline.", sourceIndex: [1] }
    ],
    sections: [
      { heading: "What happened?", body: "Jammu and Kashmir lost statehood in 2019 and became a Union Territory; elections later returned an assembly but not full statehood.", sourceIndex: [0, 1] },
      { heading: "Why it matters", body: "Statehood determines democratic control, legislative power, federal dignity, and accountability to residents.", sourceIndex: [1] },
      { heading: "Human cost", body: "Residents face a political system where elected representatives operate under a Union Territory structure with central oversight.", sourceIndex: [2] },
      { heading: "Political accountability", body: "The unresolved question is why statehood restoration has no concrete timeline despite repeated assurances.", sourceIndex: [0, 1] },
      { heading: "Government response", body: "The Centre has said statehood will be restored at an appropriate time or as soon as possible, while citing security and administrative concerns.", sourceIndex: [0, 2] },
      { heading: "Court/legal status", body: "The Supreme Court directed elections and noted statehood restoration, but did not set a firm statehood deadline.", sourceIndex: [0] },
      { heading: "Media silence/bias", body: "Coverage often frames the issue as security only, while residents' democratic power and federal status also require scrutiny.", sourceIndex: [1, 2] },
      { heading: "Unanswered questions", body: "What exact conditions must be met for statehood and who decides when they are satisfied?", sourceIndex: [1] }
    ],
    unansweredQuestions: [
      "What is the statehood timeline?",
      "What powers remain with the Lieutenant Governor?",
      "What security conditions are being used to delay restoration?",
      "Will Parliament debate a time-bound bill?"
    ]
  }),
  withStandardAnswers({
    title: "Delhi Riots and UAPA Pre-trial Detention",
    slug: "delhi-riots-uapa-pretrial-detention",
    location: "Delhi",
    year: "2020-2026",
    peopleAffected: "Riot victims, accused persons, families, students, activists",
    mainIssue: "UAPA conspiracy case, long pre-trial detention, bail standards, and delayed trial.",
    governmentResponse:
      "Delhi Police and prosecutors have treated the case as a serious conspiracy investigation under UAPA; courts have considered bail under restrictive legal standards.",
    groundReality:
      "Several accused spent years in custody before trial conclusion, raising questions about whether pre-trial incarceration becomes punishment.",
    unansweredQuestion: "How long can a person remain jailed before trial before process itself becomes punishment?",
    status: "Court-monitored",
    category: "Civil liberties",
    summary:
      "The Delhi riots UAPA file is not about declaring guilt or innocence. It is about trial delay, liberty, and how anti-terror law handles protest-era cases.",
    seoTitle: "Delhi Riots UAPA Detention - India's Unanswered Files",
    seoDescription:
      "CWI tracks Delhi riots UAPA pre-trial detention, bail, court reasoning, and civil-liberty questions.",
    keywords: ["Delhi riots UAPA", "pre-trial detention", "Umar Khalid", "Sharjeel Imam", "civil liberties"],
    sources: [
      source("The Indian Express", "Supreme Court denies bail to Umar Khalid, Sharjeel Imam", "https://indianexpress.com/article/legal-news/delhi-riots-case-supreme-court-denies-bail-umar-khalid-sharjeel-imam-10456027/", "Court/legal", "Court reasoning on bail denial and conditional bail for other accused."),
      source("The Indian Express", "Why SC denied bail", "https://indianexpress.com/article/explained/explained-law/delhi-riots-case-bail-umar-khalid-sharjeel-imam-10457036/", "Explainer", "Explainer on UAPA bail standards and prolonged incarceration.")
    ],
    timeline: [
      { date: "February 2020", title: "Delhi riots", summary: "Northeast Delhi saw communal violence and deaths.", sourceIndex: [1] },
      { date: "2020 onward", title: "UAPA conspiracy case", summary: "Police filed a larger conspiracy case under UAPA against multiple accused.", sourceIndex: [1] },
      { date: "2026", title: "Supreme Court bail order", summary: "The Supreme Court denied bail to Umar Khalid and Sharjeel Imam while granting conditional bail to others.", sourceIndex: [0] }
    ],
    sections: [
      { heading: "What happened?", body: "After the 2020 Delhi riots, police pursued a larger conspiracy case under UAPA against multiple accused.", sourceIndex: [1] },
      { heading: "Why it matters", body: "UAPA makes bail difficult; when trials take years, the line between detention and punishment becomes a constitutional concern.", sourceIndex: [0, 1] },
      { heading: "Human cost", body: "Accused persons and families live with years of uncertainty, while riot victims also wait for closure and accountability.", sourceIndex: [0] },
      { heading: "Political accountability", body: "The state must investigate riots seriously, but also ensure trial speed, evidence scrutiny, and equal accountability.", sourceIndex: [1] },
      { heading: "Government response", body: "Police and prosecutors presented the case as a serious conspiracy matter under UAPA; courts assessed bail within that framework.", sourceIndex: [0] },
      { heading: "Court/legal status", body: "Bail decisions remain case-specific and do not decide guilt; trial conclusion and evidence testing are still central.", sourceIndex: [0, 1] },
      { heading: "Media silence/bias", body: "Media often frames accused people as guilty or innocent before trial; CWI tracks process, evidence, and rights without declaring legal conclusions.", sourceIndex: [0] },
      { heading: "Unanswered questions", body: "What safeguards ensure that long pre-trial detention under UAPA does not become punishment without conviction?", sourceIndex: [1] }
    ],
    unansweredQuestions: [
      "When will trial conclude?",
      "How should courts balance UAPA and Article 21?",
      "Are riot victims receiving justice in parallel?",
      "Can prolonged detention become punishment?"
    ]
  }),
  withStandardAnswers({
    title: "Sambhal Mosque Survey Violence",
    slug: "sambhal-mosque-survey-violence",
    location: "Sambhal, Uttar Pradesh",
    year: "2024",
    peopleAffected: "Families of the dead, local residents, mosque committee, police personnel",
    mainIssue: "Court-ordered mosque survey, public order failure, deaths, internet shutdown, and judicial probe.",
    governmentResponse:
      "Authorities said the survey was court-ordered, restricted gatherings, suspended internet, made arrests, and later formed a judicial probe.",
    groundReality:
      "Four people died in violence around the survey, the Supreme Court paused trial-court proceedings, and questions remain about haste, policing, and prevention.",
    unansweredQuestion: "Why did a court-ordered survey become a fatal public-order crisis?",
    status: "Court-monitored",
    category: "Communal violence",
    summary:
      "Sambhal is a reminder that courts, administrations, and police must anticipate how religious-site disputes can turn deadly.",
    seoTitle: "Sambhal Mosque Survey Violence - India's Unanswered Files",
    seoDescription:
      "CWI tracks Sambhal mosque survey violence, deaths, Supreme Court intervention, judicial probe, and unanswered policing questions.",
    keywords: ["Sambhal mosque survey", "Sambhal violence", "Shahi Jama Masjid", "court ordered survey"],
    sources: [
      source("Associated Press", "Four killed after mosque survey sparks clashes", "https://apnews.com/article/c046e9ae829c15279c41b2832f66f3aa", "News report", "Report on deaths, survey context, school closures, and internet shutdown."),
      source("The Indian Express", "SC asks mosque management to approach HC", "https://indianexpress.com/article/india/supreme-court-sambhal-mosque-survey-case-live-updates-9696603/", "Court/legal", "Supreme Court intervention and trial-court pause."),
      source("The Indian Express", "Judicial panel to probe Sambhal violence", "https://indianexpress.com/article/cities/lucknow/3-member-judicial-panel-to-probe-sambhal-violence-9711273/", "News report", "UP government judicial committee reporting.")
    ],
    timeline: [
      { date: "19 November 2024", title: "Survey order", summary: "A trial court allowed a survey after claims about the mosque site.", sourceIndex: [1] },
      { date: "24 November 2024", title: "Violence and deaths", summary: "Violence broke out during the survey process and four deaths were reported.", sourceIndex: [0, 1] },
      { date: "29 November 2024", title: "Supreme Court steps in", summary: "The Supreme Court directed the mosque committee to approach the High Court and paused trial-court proceedings.", sourceIndex: [1] },
      { date: "December 2024", title: "Judicial probe", summary: "The state formed a judicial committee to probe the violence.", sourceIndex: [2] }
    ],
    sections: [
      { heading: "What happened?", body: "A court-ordered survey of Shahi Jama Masjid in Sambhal triggered violence in which four people were reported killed.", sourceIndex: [0, 1] },
      { heading: "Why it matters", body: "Religious-site disputes can become lethal if courts and administrations do not manage process, timing, communication, and public order carefully.", sourceIndex: [1] },
      { heading: "Human cost", body: "Families lost relatives, residents faced internet restrictions, and police personnel were also reported injured.", sourceIndex: [0] },
      { heading: "Political accountability", body: "The question is not which community to blame; it is whether the administration anticipated risk and protected life.", sourceIndex: [0, 2] },
      { heading: "Government response", body: "Authorities cited the court order, imposed restrictions, made arrests, and formed a judicial probe.", sourceIndex: [0, 2] },
      { heading: "Court/legal status", body: "The Supreme Court paused lower-court proceedings and asked the mosque management to approach the High Court.", sourceIndex: [1] },
      { heading: "Media silence/bias", body: "Coverage can become communal blame before facts are settled; CWI separates court process, police claims, deaths, and unanswered questions.", sourceIndex: [0, 1] },
      { heading: "Unanswered questions", body: "Could the timing, communication, policing, and crowd management have prevented deaths?", sourceIndex: [0, 2] }
    ],
    unansweredQuestions: [
      "Why was public-order risk not contained?",
      "What did the judicial probe find?",
      "Were police firing allegations independently examined?",
      "How will religious-site survey processes prevent future violence?"
    ]
  }),
  withStandardAnswers({
    title: "Lakhimpur Kheri Farmers Case",
    slug: "lakhimpur-kheri-farmers-case",
    location: "Lakhimpur Kheri, Uttar Pradesh",
    year: "2021-2026",
    peopleAffected: "Farmers, journalist's family, accused persons, witnesses",
    mainIssue: "Farmers killed during protest violence, trial delay, witness protection, and political accountability.",
    governmentResponse:
      "Police investigated and prosecuted accused persons; courts handled bail and trial oversight, while the accused denied wrongdoing.",
    groundReality:
      "Families of victims waited years as trial pace drew Supreme Court concern and witness influence allegations surfaced in court reporting.",
    unansweredQuestion: "Why did a case involving farmers killed during a national protest move so slowly through trial?",
    status: "Court-monitored",
    category: "Farmers",
    summary:
      "Lakhimpur Kheri remains a justice-delay file where political power, protest deaths, and slow trial all meet.",
    seoTitle: "Lakhimpur Kheri Farmers Case - India's Unanswered Files",
    seoDescription:
      "CWI tracks Lakhimpur Kheri violence, Ashish Mishra trial, Supreme Court delay concerns, bail, and witness protection questions.",
    keywords: ["Lakhimpur Kheri", "farmers case", "Ashish Mishra", "trial delay"],
    sources: [
      source("The Indian Express", "SC flags delay in Lakhimpur Kheri trial", "https://indianexpress.com/article/legal-news/sc-lakhimpur-kheri-violence-trial-ashish-mishra-delay-10679254/", "Court/legal", "Supreme Court concern over pace of trial."),
      source("The Indian Express", "SC declines to cancel Ashish Mishra bail", "https://indianexpress.com/article/india/lakhimpur-kheri-violence-case-sc-declines-cancel-bail-granted-ashish-mishra-9902995/", "Court/legal", "Bail-condition allegations and police status report."),
      source("New Indian Express", "SC orders probe into witness-influence claims", "https://www.newindianexpress.com/nation/2025/Jan/20/lakhimpur-kheri-case-sc-orders-probe-into-claims-ashish-mishra-influenced-witnesses", "Court/legal", "Report on Supreme Court asking police to enquire into witness influence allegations.")
    ],
    timeline: [
      { date: "3 October 2021", title: "Violence during farm protest", summary: "Eight people died in Lakhimpur Kheri violence, including farmers and a journalist according to public reporting.", sourceIndex: [1] },
      { date: "2023-2025", title: "Bail and witness concerns", summary: "Courts considered bail conditions and allegations of witness influence.", sourceIndex: [1, 2] },
      { date: "2026", title: "Trial delay flagged", summary: "The Supreme Court expressed concern over trial pace.", sourceIndex: [0] }
    ],
    sections: [
      { heading: "What happened?", body: "Violence in Lakhimpur Kheri during farm-law protests led to deaths and criminal proceedings against Ashish Mishra and others.", sourceIndex: [1] },
      { heading: "Why it matters", body: "The case tests whether protest deaths involving politically connected accused can be tried swiftly and fairly.", sourceIndex: [0, 1] },
      { heading: "Human cost", body: "Families of the dead waited for trial progress, accountability, and witness protection.", sourceIndex: [0, 2] },
      { heading: "Political accountability", body: "The accused is the son of a former Union minister, making public confidence in independent prosecution central.", sourceIndex: [1] },
      { heading: "Government response", body: "Police investigated and prosecuted the case, while courts monitored bail and trial issues.", sourceIndex: [0, 1] },
      { heading: "Court/legal status", body: "The Supreme Court considered bail and later flagged delay in the trial process.", sourceIndex: [0, 1] },
      { heading: "Media silence/bias", body: "Coverage can become partisan, but the core record is trial pace, evidence, witness safety, and victim families' right to closure.", sourceIndex: [0] },
      { heading: "Unanswered questions", body: "Why has trial progress remained slow despite national attention and Supreme Court scrutiny?", sourceIndex: [0] }
    ],
    unansweredQuestions: [
      "When will trial conclude?",
      "Are witnesses fully protected?",
      "How are victim families updated?",
      "What does delay mean for justice?"
    ]
  }),
  withStandardAnswers({
    title: "Hathras Caste-Gender Justice Case",
    slug: "hathras-caste-gender-justice",
    location: "Hathras, Uttar Pradesh",
    year: "2020-2023",
    peopleAffected: "Dalit woman's family, local community, accused persons, caste-gender justice advocates",
    mainIssue: "Death of a Dalit woman after alleged assault, hurried cremation controversy, trial outcome, and family demand for justice.",
    governmentResponse:
      "Authorities investigated through police and CBI processes, and the matter went to a special court; the government also faced criticism over handling of the cremation and family access.",
    groundReality:
      "The court convicted one accused of culpable homicide not amounting to murder and SC/ST Act charges while acquitting three; the family said it would appeal.",
    unansweredQuestion: "Why did a case that symbolised caste-gender violence leave the victim's family feeling justice was incomplete?",
    status: "Court-monitored",
    category: "Caste-gender justice",
    summary:
      "Hathras remains a test of whether caste, gender, policing, medical evidence, and family dignity can be handled transparently in a high-pressure case.",
    seoTitle: "Hathras Caste-Gender Justice Case - India's Unanswered Files",
    seoDescription:
      "CWI tracks the Hathras case, trial outcome, family appeal concerns, caste-gender justice, and unanswered accountability questions.",
    keywords: ["Hathras case", "Dalit woman justice", "caste gender violence", "UP court"],
    sources: [
      source("The Indian Express", "Main accused convicted, three acquitted", "https://indianexpress.com/article/cities/delhi/hathras-gangrape-murder-case-up-court-convicts-main-accused-acquits-3-others-8475386/", "Court/legal", "Trial verdict reporting and family/legal response."),
      source("Economic Times", "Court finds none guilty of rape", "https://economictimes.indiatimes.com/news/india/hathras-case-court-finds-none-guilty-of-rape/articleshow/98363282.cms", "Court/legal", "Verdict details including conviction under IPC 304 and SC/ST Act, and family appeal position."),
      source("NDTV", "Three acquitted accused walk out", "https://www.ndtv.com/india-news/3-men-acquitted-in-hathras-gangrape-murder-case-walk-out-of-jail-3831101", "News report", "Aftermath of acquittals and release from jail.")
    ],
    timeline: [
      { date: "September 2020", title: "Assault and death", summary: "A 19-year-old Dalit woman died after alleged assault in Hathras.", sourceIndex: [0, 2] },
      { date: "2020", title: "National outrage", summary: "The case drew protests over caste-gender violence and police handling.", sourceIndex: [0] },
      { date: "March 2023", title: "Trial verdict", summary: "One accused was convicted on lesser charges and three were acquitted.", sourceIndex: [0, 1] },
      { date: "After verdict", title: "Appeal concerns", summary: "The family expressed dissatisfaction and said it would challenge the verdict.", sourceIndex: [1] }
    ],
    sections: [
      { heading: "What happened?", body: "The Hathras case involved the death of a Dalit woman after alleged assault, national outrage, and a later special court verdict.", sourceIndex: [0] },
      { heading: "Why it matters", body: "The case became a symbol of caste-gender justice, policing, evidence, dignity of the dead, and family trust in investigation.", sourceIndex: [0, 1] },
      { heading: "Human cost", body: "The victim's family endured grief, public scrutiny, security pressure, and a verdict they considered incomplete.", sourceIndex: [1] },
      { heading: "Political accountability", body: "Questions centred on police handling, cremation controversy, medical and forensic process, and whether caste power shaped access to justice.", sourceIndex: [0] },
      { heading: "Government response", body: "Authorities used police and CBI processes and the case went to trial; criticism focused on handling and family dignity.", sourceIndex: [0, 1] },
      { heading: "Court/legal status", body: "A special court convicted one accused for culpable homicide not amounting to murder and SC/ST Act offences while acquitting three; this file does not override the court record.", sourceIndex: [0, 1] },
      { heading: "Media silence/bias", body: "Coverage swung between outrage and verdict headlines, while long-term family dignity and appeal process received less sustained attention.", sourceIndex: [0, 2] },
      { heading: "Unanswered questions", body: "What failed in evidence, protection, communication, or prosecution if the family still believes justice was incomplete?", sourceIndex: [1] }
    ],
    unansweredQuestions: [
      "What is the status of appeals?",
      "Was the family treated with dignity throughout?",
      "What lessons changed caste-gender investigation protocols?",
      "How are witness and family protections monitored?"
    ]
  })
];

export const unansweredFilesKeywords = [
  "India's Unanswered Files",
  "CWI investigative archive",
  "public interest India",
  "delayed justice India",
  "citizen rights India",
  "tribal rights India",
  "student justice India",
  "farmers protest India",
  "political accountability India",
  "source-backed investigation"
];

export function getUnansweredFile(slug: string) {
  return unansweredFiles.find((file) => file.slug === slug);
}

export function getFileSources(file: UnansweredFile, indexes: number[]) {
  return indexes
    .map((index) => file.sources[index])
    .filter((sourceItem): sourceItem is FileSource => Boolean(sourceItem));
}

export function getFileVisual(file: UnansweredFile): FileVisual {
  return getFileVisuals(file)[0];
}

export function getFileVisuals(file: UnansweredFile): FileVisual[] {
  if (file.slug === "manipur-violence") {
    return [
      {
        src: "/manipur/manipur-vigil-banner.jpg",
        alt: "Cockroach Watch India documentary visual for the Manipur violence file",
        caption: "CWI Manipur archive visual used for documentary context. No graphic victim imagery is shown.",
        credit: "CWI visual archive",
        isPhoto: true,
        brief: "Manipur public memory and peace vigil visual"
      },
      {
        src: "/manipur/burned-place-of-worship.jpg",
        alt: "Non-graphic documentary visual of destruction in Manipur",
        caption: "Non-graphic CWI archive visual used to represent destruction without identifying private victims.",
        credit: "CWI visual archive",
        isPhoto: true,
        brief: "Burned homes and worship spaces after violence"
      },
      {
        src: "/manipur/security-patrol.jpg",
        alt: "Security patrol visual for Manipur crisis context",
        caption: "Security deployment became part of ordinary life, but deployment alone did not rebuild trust.",
        credit: "CWI visual archive",
        isPhoto: true,
        brief: "Security deployment and guarded zones"
      },
      {
        src: "/manipur/burned-vehicle-road.jpg",
        alt: "Road damage and burned vehicle visual for Manipur crisis context",
        caption: "Roads, debris, and disrupted mobility became part of the human cost of the crisis.",
        credit: "CWI visual archive",
        isPhoto: true,
        brief: "Roads, debris, and disrupted mobility"
      }
    ];
  }

  const briefs = unansweredFileVisualBriefs[file.slug] ?? [
    "public records and source archive",
    "citizen testimony and official response",
    "timeline, legal status, and unanswered questions"
  ];

  return briefs.map((brief, index) => ({
    src: `/unanswered-files/visual/${file.slug}/${index + 1}`,
    alt: `CWI image-pack visual for ${file.title}: ${brief}`,
    caption: `Image-pack brief: ${brief}. This is a CWI editorial research visual, not an incident photograph.`,
    credit: "CWI image-pack visual brief",
    isPhoto: false,
    brief
  }));
}

export function getVisualBrief(file: UnansweredFile, index: number) {
  return getFileVisuals(file)[index] ?? getFileVisual(file);
}

export const unansweredFileVisualBriefs: Record<string, string[]> = {
  "ladakh-sixth-schedule-statehood": [
    "Sonam Wangchuk and Ladakh statehood protest context",
    "Sixth Schedule and constitutional safeguard placards",
    "Himalayan ecology, glaciers, and local land protection",
    "Leh and Kargil civil society mobilisation",
    "pastoral communities, border livelihoods, and representation",
    "Delhi march, detention, and democratic-rights questions"
  ],
  "joshimath-land-subsidence": [
    "cracked homes and unsafe buildings in a sinking Himalayan town",
    "evacuated families and temporary accommodation",
    "mountain roads, construction pressure, and warning signs",
    "hydropower and tunnelling concerns in fragile terrain",
    "compensation, relocation, and livelihood uncertainty",
    "scientific monitoring and public risk communication"
  ],
  "great-nicobar-shompen-nicobarese": [
    "Great Nicobar rainforest and coastal biodiversity",
    "Galathea Bay and transshipment port project context",
    "Shompen and Nicobarese rights shown without intrusive imagery",
    "strategic infrastructure, ecological clearance, and consultation",
    "coastal habitat, turtles, forests, and protected areas",
    "official project map, public hearings, and unanswered safeguards"
  ],
  "hasdeo-aranya-coal-mining": [
    "Hasdeo Aranya forest and coal block conflict",
    "Adivasi Gram Sabha consent and forest-rights protest",
    "tree felling, mining roads, and elephant habitat concerns",
    "village sit-ins and forest protection slogans",
    "coal machinery beside forest-dependent livelihoods",
    "public records, clearances, and rehabilitation questions"
  ],
  "women-wrestlers-sexual-harassment-case": [
    "women wrestlers' protest at Jantar Mantar",
    "athlete testimony, court process, and institutional accountability",
    "candle march and public support for complainants",
    "Delhi Police action and protest-site tension",
    "WFI governance, charges framed, and trial status",
    "sports, gender justice, and survivor dignity"
  ],
  "neet-paper-leak-nta-accountability": [
    "NEET-UG student protest and exam accountability",
    "NTA office, petitions, and demand for transparency",
    "Supreme Court hearing and source-backed legal record",
    "answer sheets, exam centres, and verification process",
    "students, coaching hubs, and uncertainty after results",
    "paper leak allegations, retest debate, and public trust"
  ],
  "electoral-bonds-transparency": [
    "Supreme Court electoral bonds verdict and political funding",
    "SBI disclosure timeline and donor data transparency",
    "Election Commission publication of electoral bond data",
    "money trail, anonymous donations, and voter right to know",
    "party funding records and public-interest scrutiny",
    "constitutional accountability and campaign finance reform"
  ],
  "bulldozer-justice-demolitions": [
    "bulldozer demolition and due-process question",
    "families after demolition without graphic imagery",
    "municipal notices, property records, and legal safeguards",
    "Supreme Court pan-India demolition guidelines",
    "punitive demolition debate and arbitrary state power",
    "housing rights, compensation, and accountability"
  ],
  "assam-evictions": [
    "Assam eviction drive and displaced families",
    "char areas, riverine land, and shelter uncertainty",
    "police operation, bulldozers, and rehabilitation questions",
    "land rights, identity politics, and due process",
    "temporary shelters after demolition",
    "state response, public records, and human cost"
  ],
  "farmers-msp-protest": [
    "farmers' MSP protest at Delhi borders",
    "tractor lines, barricades, and march restrictions",
    "Shambhu border, tear gas, and protest safety",
    "MSP legal guarantee placards and union demands",
    "langar, protest camps, and rural solidarity",
    "women farmers and public policy accountability"
  ],
  "wayanad-landslide-ecological-warnings": [
    "Wayanad landslide rescue and disaster response",
    "destroyed homes, mud, and non-graphic aftermath",
    "Chooralmala and Mundakkai ecological risk context",
    "relief camps, missing families, and rehabilitation",
    "rainfall, fragile slopes, plantations, and tourism pressure",
    "ignored warnings, official alerts, and public accountability"
  ],
  "vizhinjam-port-fisherfolk-protest": [
    "Vizhinjam port fisherfolk protest",
    "coastal erosion and homes near the sea",
    "fishing boats, harbour livelihoods, and protest lines",
    "port cranes, breakwater construction, and public claims",
    "rehabilitation package and livelihood protection",
    "church-led protest, state talks, and unanswered concerns"
  ],
  "jammu-kashmir-statehood-delay": [
    "Jammu and Kashmir statehood demand after Union Territory status",
    "assembly election and restoration-of-statehood promises",
    "Srinagar public spaces, security presence, and civic rights",
    "Article 370 verdict and statehood timeline questions",
    "government offices, elected assembly, and limited powers",
    "federalism, representation, and democratic accountability"
  ],
  "delhi-riots-uapa-pretrial-detention": [
    "Delhi riots court record and UAPA bail hearings",
    "burned vehicles and aftermath shown non-graphically",
    "due process, prison bars, and long pre-trial detention",
    "court building, bail orders, and legal status",
    "families, accused persons, and victims awaiting closure",
    "communal violence coverage without communal blame"
  ],
  "sambhal-mosque-survey-violence": [
    "Sambhal mosque survey and court-order context",
    "police barricades, crowd control, and public-order risk",
    "religious-site dispute handled without communal targeting",
    "Supreme Court pause and High Court route",
    "judicial probe, official claims, and deaths reported",
    "media framing, rumours, and source verification"
  ],
  "lakhimpur-kheri-farmers-case": [
    "Lakhimpur Kheri farmers case and protest context",
    "victim families, memorials, and trial delay",
    "court record, bail conditions, and witness concerns",
    "farm protest route, vehicles, and public accountability",
    "politically connected accused and independent prosecution",
    "Supreme Court concern over trial pace"
  ],
  "hathras-caste-gender-justice": [
    "Hathras caste-gender justice protest",
    "village lane, police barricade, and family dignity",
    "court verdict, appeal concerns, and legal process",
    "Dalit rights protest and gender justice demands",
    "night cremation controversy represented without graphic imagery",
    "evidence, investigation, and survivor-family dignity"
  ]
};
