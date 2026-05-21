export type VerificationStatus = "Verified" | "Developing" | "Claimed" | "Reported" | "Opinion" | "Opinion/Satire";

export type WatchCategory =
  | "Movement Update"
  | "Explainer"
  | "Public Reaction"
  | "Youth Voice"
  | "Meme Watch"
  | "Fact Check"
  | "Creator Spotlight"
  | "Civic Issue"
  | "Digital Culture"
  | "Opinion"
  | "Archive";

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
};

export type SocialPack = {
  xThread: string[];
  instagramCaption: string;
  redditPost: string;
  youtubeShortsDescription: string;
  seoSummary: string;
};

export type WatchPost = {
  title: string;
  slug: string;
  date: string;
  updatedDate: string;
  category: WatchCategory;
  summary: string;
  content: string[];
  sections: ArticleSection[];
  sourceLabel: string;
  sourceUrl?: string;
  verificationStatus: VerificationStatus;
  credit: string;
  tags: string[];
  author: string;
  readingMinutes: number;
  metaTitle: string;
  metaDescription: string;
  imageAlt: string;
  pullQuote: string;
  relatedSlugs: string[];
  social: SocialPack;
};

type ArticleSeed = {
  title: string;
  slug: string;
  category: WatchCategory;
  focus: string;
  angle: string;
  tags: string[];
  verificationStatus?: VerificationStatus;
};

const author = "Cockroach Watch India Editorial Desk";
const publishDate = "2026-05-21";
const coreDisclaimer =
  "Cockroach Watch India is an independent civic watch, satire, and commentary platform. This article may discuss publicly circulating trends, satire, public reactions, and civic commentary. It should not be read as a legal finding, official statement, or verified claim unless clearly marked as such.";

const articleSeeds: ArticleSeed[] = [
  {
    title: "What is Cockroach Janta Party?",
    slug: "what-is-cockroach-janta-party",
    category: "Explainer",
    focus: "the public meaning of Cockroach Janta Party in online discussion",
    angle: "A clear explainer for readers trying to understand CJP without confusing commentary with official claims.",
    tags: ["Cockroach Janta Party", "CJP", "explainer"]
  },
  {
    title: "Why is CJP going viral?",
    slug: "why-cjp-is-going-viral",
    category: "Movement Update",
    focus: "why CJP is traveling across feeds, comments, edits, and creator networks",
    angle: "Virality is not only about jokes; it is also about timing, emotion, and public frustration.",
    tags: ["CJP", "viral", "movement update"],
    verificationStatus: "Developing"
  },
  {
    title: "Meme or movement? Understanding the Cockroach wave",
    slug: "meme-or-movement-understanding-cockroach-wave",
    category: "Meme Watch",
    focus: "the line between meme culture and movement language",
    angle: "The Cockroach wave shows how a format can become shorthand for dignity, anger, and public memory.",
    tags: ["Cockroach wave", "meme politics", "movement"],
    verificationStatus: "Opinion/Satire"
  },
  {
    title: "Why Gen Z connects with political satire",
    slug: "why-gen-z-connects-with-political-satire",
    category: "Youth Voice",
    focus: "why young citizens use satire to process public life",
    angle: "Political satire gives Gen Z a language that is fast, visual, emotionally direct, and difficult to ignore.",
    tags: ["Gen Z politics India", "political satire", "youth voice"]
  },
  {
    title: "Why Main Bhi Cockroach spread online",
    slug: "why-main-bhi-cockroach-exploded-online",
    category: "Digital Culture",
    focus: "the spread of the Main Bhi Cockroach phrase across online spaces",
    angle: "A phrase travels when people see themselves inside it and repeat it as identity, not just as a joke.",
    tags: ["Main Bhi Cockroach", "viral phrase", "digital culture"],
    verificationStatus: "Reported"
  },
  {
    title: "Why youth meme culture is changing politics",
    slug: "why-youth-meme-culture-is-changing-politics",
    category: "Digital Culture",
    focus: "how meme culture changes the speed and style of political conversation",
    angle: "Meme culture compresses complex frustration into forms that are easy to share and hard to dismiss.",
    tags: ["meme politics India", "youth culture", "politics"]
  },
  {
    title: "CJP on X: what the public conversation shows",
    slug: "what-happened-to-cjp-on-x",
    category: "Public Reaction",
    focus: "public discussion around CJP on X and other platforms",
    angle: "The visible conversation around CJP should be read carefully: screenshots, posts, and claims need context.",
    tags: ["CJP on X", "public reaction", "social media"],
    verificationStatus: "Reported"
  },
  {
    title: "Why digital satire travels faster than speeches",
    slug: "why-digital-satire-spreads-faster-than-speeches",
    category: "Digital Culture",
    focus: "why short satirical formats move faster than formal political messaging",
    angle: "Satire is portable; speeches are scheduled. That difference shapes internet-first politics.",
    tags: ["digital satire", "internet movements", "public opinion"]
  },
  {
    title: "Public reaction to the Cockroach wave explained",
    slug: "public-reaction-to-cockroach-wave-explained",
    category: "Public Reaction",
    focus: "how citizens, creators, students, and observers are reacting to the Cockroach wave",
    angle: "Public reaction is rarely one mood. Around the Cockroach wave, it mixes amusement, anger, curiosity, and civic recognition.",
    tags: ["public reaction", "Cockroach wave", "youth voice"],
    verificationStatus: "Reported"
  },
  {
    title: "Why creators are joining the Cockroach movement",
    slug: "why-creators-are-joining-cockroach-movement",
    category: "Creator Spotlight",
    focus: "how creators participate in the Cockroach wave through edits, explainers, posts, and commentary",
    angle: "Creators increasingly translate civic frustration for audiences that do not wait for formal media framing.",
    tags: ["creator-led commentary", "Cockroach movement", "creator credit"]
  },
  {
    title: "How meme politics became mainstream in India",
    slug: "how-meme-politics-became-mainstream-in-india",
    category: "Explainer",
    focus: "the mainstreaming of meme politics in Indian public conversation",
    angle: "Meme politics is no longer side commentary. It shapes attention, language, and public perception.",
    tags: ["meme politics India", "Indian politics", "digital culture"]
  },
  {
    title: "Why internet movements grow faster in 2026",
    slug: "why-internet-movements-grow-faster-in-2026",
    category: "Digital Culture",
    focus: "why internet movements now spread through creators, group chats, short video, and reaction loops",
    angle: "Speed comes from networks, emotion, repetition, and the ability to remix civic anger into shareable language.",
    tags: ["internet movements", "2026", "digital civic culture"]
  },
  {
    title: "The rise of digital civic culture in India",
    slug: "rise-of-digital-civic-culture",
    category: "Digital Culture",
    focus: "digital civic culture as a new layer of public participation",
    angle: "Citizens now record, archive, question, remix, and challenge public narratives from their phones.",
    tags: ["digital civic culture", "citizen media", "public memory"]
  },
  {
    title: "Is CJP satire, commentary, or movement?",
    slug: "is-cjp-satire-commentary-or-movement",
    category: "Explainer",
    focus: "how different audiences interpret CJP",
    angle: "CJP is discussed online as satire, commentary, and movement language, depending on context and source.",
    tags: ["CJP", "satire", "movement"],
    verificationStatus: "Opinion"
  },
  {
    title: "Youth frustration and meme politics",
    slug: "youth-frustration-and-meme-politics",
    category: "Youth Voice",
    focus: "why youth frustration often appears first through meme politics",
    angle: "When formal language feels distant, memes become a public vocabulary for frustration, dignity, and recognition.",
    tags: ["youth frustration", "meme politics", "dignity"]
  },
  {
    title: "Why CWI was created",
    slug: "why-cwi-was-created",
    category: "Archive",
    focus: "the reason Cockroach Watch India exists as an independent civic archive",
    angle: "CWI was built to document, verify, amplify, and preserve public memory around the Cockroach wave.",
    tags: ["Cockroach Watch India", "CWI", "archive"],
    verificationStatus: "Verified"
  },
  {
    title: "What is Cockroach Watch India?",
    slug: "what-is-cockroach-watch-india",
    category: "Explainer",
    focus: "CWI as a founder-led civic watch and commentary platform",
    angle: "Cockroach Watch India tracks public issues, youth voice, creator work, and the Cockroach wave responsibly.",
    tags: ["Cockroach Watch India", "CWI", "civic watch"],
    verificationStatus: "Verified"
  },
  {
    title: "How Gen Z uses memes as public expression",
    slug: "how-gen-z-uses-memes-as-public-expression",
    category: "Youth Voice",
    focus: "memes as a public expression system for Gen Z",
    angle: "For many young citizens, memes carry criticism, memory, protest, and identity at internet speed.",
    tags: ["Gen Z politics India", "public expression", "memes"]
  },
  {
    title: "The psychology behind viral internet movements",
    slug: "psychology-behind-viral-internet-movements",
    category: "Explainer",
    focus: "why people join, repeat, and remix internet movements",
    angle: "Viral movements grow when identity, emotion, simplicity, and public timing meet.",
    tags: ["viral internet movements", "psychology", "digital culture"]
  },
  {
    title: "Why online satire feels more relatable to youth",
    slug: "why-online-satire-feels-relatable-to-youth",
    category: "Youth Voice",
    focus: "why satire feels closer to everyday youth experience than formal messaging",
    angle: "Online satire works because it speaks in the rhythm of feeds, comments, frustration, and lived reality.",
    tags: ["online satire", "youth voice", "political satire India"],
    verificationStatus: "Opinion"
  },
  {
    title: "How political meme culture changed India",
    slug: "how-political-meme-culture-changed-india",
    category: "Digital Culture",
    focus: "how political meme culture changed public attention in India",
    angle: "Political meme culture changed who gets heard, how fast narratives move, and how citizens remember events.",
    tags: ["political meme culture", "India", "public opinion"]
  },
  {
    title: "Why creators are becoming civic voices",
    slug: "why-creators-are-becoming-civic-voices",
    category: "Creator Spotlight",
    focus: "creators as explainers, archivists, and civic voices",
    angle: "Creators often translate public issues into formats that younger audiences actually watch and share.",
    tags: ["creators", "civic voices", "creator-led commentary"]
  },
  {
    title: "What makes a meme become a movement?",
    slug: "what-makes-a-meme-become-a-movement",
    category: "Meme Watch",
    focus: "the conditions that turn a meme into movement language",
    angle: "A meme becomes movement language when it helps people name a shared public feeling with clarity.",
    tags: ["meme movement", "Cockroach wave", "digital culture"],
    verificationStatus: "Opinion/Satire"
  },
  {
    title: "The role of humor in digital protest",
    slug: "role-of-humor-in-digital-protest",
    category: "Digital Culture",
    focus: "humor as a way to communicate public frustration",
    angle: "Humor can reduce fear, widen participation, and make criticism travel without losing seriousness.",
    tags: ["digital protest", "humor", "satire"]
  },
  {
    title: "Why internet culture shapes public opinion",
    slug: "why-internet-culture-shapes-public-opinion",
    category: "Explainer",
    focus: "the influence of internet culture on public opinion",
    angle: "Public opinion is increasingly shaped by what people save, remix, quote, and send to each other.",
    tags: ["internet culture", "public opinion", "civic media"]
  },
  {
    title: "Why youth trust creators more than institutions",
    slug: "why-youth-trust-creators-more-than-institutions",
    category: "Youth Voice",
    focus: "trust gaps between youth, institutions, creators, and civic media",
    angle: "Trust moves toward voices that feel accountable, visible, responsive, and close to lived experience.",
    tags: ["youth trust", "creators", "institutions"],
    verificationStatus: "Opinion"
  },
  {
    title: "Digital movements and public memory",
    slug: "digital-movements-and-public-memory",
    category: "Archive",
    focus: "how digital movements preserve or lose public memory",
    angle: "Trends disappear quickly, but archives can hold the context that platforms forget.",
    tags: ["public memory", "digital movements", "archive"]
  },
  {
    title: "How satire became the language of Gen Z",
    slug: "how-satire-became-language-of-gen-z",
    category: "Youth Voice",
    focus: "satire as a common civic language for young citizens",
    angle: "Satire lets Gen Z say serious things without using the old vocabulary of power.",
    tags: ["Gen Z", "satire", "youth voice"]
  },
  {
    title: "Why online communities become powerful",
    slug: "why-online-communities-become-powerful",
    category: "Digital Culture",
    focus: "online communities as civic and cultural infrastructure",
    angle: "Online communities become powerful when they repeat signals, protect memory, and create belonging.",
    tags: ["online communities", "digital culture", "public issues"]
  },
  {
    title: "CJP and the rise of internet-first public movements",
    slug: "cjp-and-rise-of-internet-first-movements",
    category: "Movement Update",
    focus: "CJP as part of a wider internet-first movement pattern",
    angle: "Internet-first movements begin in feeds before institutions understand their vocabulary.",
    tags: ["CJP", "internet-first movements", "Cockroach wave"],
    verificationStatus: "Developing"
  },
  {
    title: "Cockroach wave timeline: what to archive",
    slug: "cockroach-wave-timeline-what-to-archive",
    category: "Archive",
    focus: "the posts, reactions, creator work, and issue signals worth archiving",
    angle: "A timeline matters because internet memory is fragile and public reaction moves quickly.",
    tags: ["timeline", "archive", "Cockroach wave"]
  },
  {
    title: "How to read viral CJP claims responsibly",
    slug: "how-to-read-viral-cjp-claims-responsibly",
    category: "Fact Check",
    focus: "responsible reading of viral claims connected to CJP",
    angle: "Publicly circulating claims need source trails, dates, and context before they become conclusions.",
    tags: ["fact check", "CJP", "verification"],
    verificationStatus: "Verified"
  },
  {
    title: "The creator credit problem in movement media",
    slug: "creator-credit-problem-in-movement-media",
    category: "Creator Spotlight",
    focus: "why creator credit is a trust issue in movement coverage",
    angle: "When credit disappears, context disappears with it. CWI treats credit as part of public accountability.",
    tags: ["creator credit", "movement media", "trust"],
    verificationStatus: "Verified"
  },
  {
    title: "Why public issues become viral symbols",
    slug: "why-public-issues-become-viral-symbols",
    category: "Civic Issue",
    focus: "how local problems become symbolic in online civic culture",
    angle: "A pothole, paper leak, or service failure can become a national signal when people recognize the pattern.",
    tags: ["public issues India", "civic issue", "viral symbols"],
    verificationStatus: "Reported"
  },
  {
    title: "What CWI means by document, verify, amplify",
    slug: "what-cwi-means-by-document-verify-amplify",
    category: "Archive",
    focus: "CWI's editorial method",
    angle: "Document, Verify, Amplify is not a slogan only; it is the newsroom logic behind CWI.",
    tags: ["Document Verify Amplify", "CWI", "editorial standard"],
    verificationStatus: "Verified"
  },
  {
    title: "Why satire needs context",
    slug: "why-satire-needs-context",
    category: "Opinion",
    focus: "why satire should not become misinformation",
    angle: "Sharp satire can hold power accountable, but context separates commentary from fake claims.",
    tags: ["satire", "context", "misinformation"],
    verificationStatus: "Opinion"
  },
  {
    title: "How public reaction becomes news",
    slug: "how-public-reaction-becomes-news",
    category: "Public Reaction",
    focus: "when public reaction deserves documentation",
    angle: "Public reaction becomes news when it reveals a wider civic mood, not just a temporary comment storm.",
    tags: ["public reaction", "newsroom", "civic mood"],
    verificationStatus: "Reported"
  },
  {
    title: "Why youth voice needs an archive",
    slug: "why-youth-voice-needs-an-archive",
    category: "Youth Voice",
    focus: "archiving youth voice before platforms bury it",
    angle: "Youth voice deserves an archive because public systems often notice it only after the moment has passed.",
    tags: ["youth voice India", "archive", "public memory"]
  },
  {
    title: "The difference between satire and fake news",
    slug: "difference-between-satire-and-fake-news",
    category: "Fact Check",
    focus: "how CWI separates satire from misinformation",
    angle: "Satire signals commentary. Fake news presents unverified claims as fact. The difference matters for trust, safety, and public memory.",
    tags: ["fact check", "satire", "fake news"],
    verificationStatus: "Verified"
  },
  {
    title: "Why citizen reports matter",
    slug: "why-citizen-reports-matter",
    category: "Civic Issue",
    focus: "citizen reports as public-interest evidence",
    angle: "Citizen reports help document what people experience before institutions or media respond.",
    tags: ["citizen reports", "public issues India", "civic watch"],
    verificationStatus: "Verified"
  },
  {
    title: "How local issues become national signals",
    slug: "how-local-issues-become-national-signals",
    category: "Civic Issue",
    focus: "local issues as signals of wider public systems",
    angle: "Local issues become national signals when repeated failures show a pattern beyond one neighborhood.",
    tags: ["local issues", "public issues India", "accountability"],
    verificationStatus: "Reported"
  },
  {
    title: "Why political language is changing online",
    slug: "why-political-language-is-changing-online",
    category: "Digital Culture",
    focus: "how online communities change political vocabulary",
    angle: "Political language now moves through captions, comments, edits, memes, and creator explanations.",
    tags: ["political language", "digital culture", "Gen Z politics India"]
  },
  {
    title: "Civic satire without harassment",
    slug: "civic-satire-without-harassment",
    category: "Opinion",
    focus: "responsible satire standards",
    angle: "Civic satire can be sharp without becoming abuse, doxxing, hate, or targeted harassment.",
    tags: ["civic satire", "editorial standards", "safety"],
    verificationStatus: "Opinion"
  },
  {
    title: "Why public memory matters in internet politics",
    slug: "why-public-memory-matters-in-internet-politics",
    category: "Archive",
    focus: "public memory in fast-moving internet politics",
    angle: "Without archives, platforms turn public anger into yesterday's trend instead of tomorrow's record.",
    tags: ["public memory", "internet politics", "archive"]
  },
  {
    title: "How CWI handles correction requests",
    slug: "how-cwi-handles-correction-requests",
    category: "Fact Check",
    focus: "CWI's correction and takedown process",
    angle: "Corrections are part of trust. CWI treats creator credit, context, and safety updates as editorial duties.",
    tags: ["corrections", "takedown", "creator credit"],
    verificationStatus: "Verified"
  },
  {
    title: "Why the Cockroach identity travels",
    slug: "why-cockroach-identity-travels",
    category: "Meme Watch",
    focus: "why the Cockroach identity is memorable online",
    angle: "The identity travels because it is resilient, uncomfortable, ironic, and easy to remix without losing recognition.",
    tags: ["Cockroach identity", "Cockroach wave", "meme watch"],
    verificationStatus: "Opinion/Satire"
  },
  {
    title: "What students are saying through meme politics",
    slug: "what-students-are-saying-through-meme-politics",
    category: "Youth Voice",
    focus: "student frustration, humor, and civic expression",
    angle: "Student meme politics often carries serious signals about exams, jobs, dignity, and trust in institutions.",
    tags: ["students", "meme politics", "youth voice"],
    verificationStatus: "Reported"
  },
  {
    title: "Why unemployment anger appears online first",
    slug: "why-unemployment-anger-appears-online-first",
    category: "Youth Voice",
    focus: "unemployment anger and digital expression",
    angle: "Online spaces often become the first public record of frustration when offline channels feel closed or unresponsive.",
    tags: ["unemployment", "youth voice India", "public issues"],
    verificationStatus: "Reported"
  },
  {
    title: "The newsroom role of Cockroach Watch India",
    slug: "newsroom-role-of-cockroach-watch-india",
    category: "Archive",
    focus: "CWI's newsroom role in the Cockroach wave",
    angle: "CWI acts as an archive and newsroom for public commentary, creator work, and issue signals.",
    tags: ["Cockroach Watch India", "newsroom", "archive"],
    verificationStatus: "Verified"
  },
  {
    title: "Why digital protest needs verification",
    slug: "why-digital-protest-needs-verification",
    category: "Fact Check",
    focus: "verification as a safety layer for digital protest",
    angle: "Verification protects public-interest speech from being weakened by false claims or missing context.",
    tags: ["digital protest", "verification", "fact check"],
    verificationStatus: "Verified"
  },
  {
    title: "How creators can submit to CWI safely",
    slug: "how-creators-can-submit-to-cwi-safely",
    category: "Creator Spotlight",
    focus: "safe creator submission practices",
    angle: "Creators can help the archive by sending source links, context, permission notes, and credit details.",
    tags: ["creator submissions", "CWI", "safety"],
    verificationStatus: "Verified"
  },
  {
    title: "Why the Cockroach wave is an archive problem",
    slug: "why-cockroach-wave-is-an-archive-problem",
    category: "Archive",
    focus: "why the Cockroach wave needs structured archiving",
    angle: "The Cockroach wave is fast, distributed, and easy to misread unless someone preserves source trails.",
    tags: ["Cockroach wave", "archive", "source trails"]
  },
  {
    title: "How civic media should cover viral politics",
    slug: "how-civic-media-should-cover-viral-politics",
    category: "Opinion",
    focus: "standards for covering viral politics responsibly",
    angle: "Civic media should explain the signal, verify the claim, credit the creator, and avoid panic framing.",
    tags: ["civic media", "viral politics", "editorial standards"],
    verificationStatus: "Opinion"
  },
  {
    title: "What CJP searchers should know first",
    slug: "what-cjp-searchers-should-know-first",
    category: "Explainer",
    focus: "a first-read guide for people searching CJP",
    angle: "Searchers should separate public commentary, satire, reactions, and official claims before drawing conclusions.",
    tags: ["CJP", "Cockroach Janta Party", "search guide"]
  },
  {
    title: "Why CWI tracks public reaction",
    slug: "why-cwi-tracks-public-reaction",
    category: "Public Reaction",
    focus: "public reaction as civic data",
    angle: "Public reaction can reveal where attention, trust, anger, and curiosity are moving.",
    tags: ["public reaction", "CWI", "civic data"],
    verificationStatus: "Verified"
  },
  {
    title: "How the Cockroach wave entered creator culture",
    slug: "how-cockroach-wave-entered-creator-culture",
    category: "Creator Spotlight",
    focus: "creator culture around the Cockroach wave",
    angle: "Creator culture turns a trend into explainers, edits, jokes, critique, and public memory.",
    tags: ["creator culture", "Cockroach wave", "creator spotlight"],
    verificationStatus: "Reported"
  },
  {
    title: "Why viral civic moments need timestamps",
    slug: "why-viral-civic-moments-need-timestamps",
    category: "Fact Check",
    focus: "timestamps and source trails in viral civic content",
    angle: "Timestamps prevent old clips, edited claims, and unclear context from becoming false certainty.",
    tags: ["timestamps", "fact check", "viral civic moments"],
    verificationStatus: "Verified"
  },
  {
    title: "The CWI guide to public-interest commentary",
    slug: "cwi-guide-to-public-interest-commentary",
    category: "Archive",
    focus: "CWI's standard for public-interest commentary",
    angle: "Public-interest commentary should document the issue, protect dignity, and label uncertainty clearly.",
    tags: ["public-interest commentary", "CWI", "standards"],
    verificationStatus: "Verified"
  }
];

function limitText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.slice(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(" ");
  const cleanText = lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated;

  return `${cleanText.trimEnd()}...`;
}

function metaTitle(title: string) {
  const suffix = " | CWI";
  const maxTitleLength = 60 - suffix.length;
  return `${limitText(title, maxTitleLength)}${suffix}`;
}

function pick<T>(items: T[], index: number) {
  return items[index % items.length];
}

function socialPack(seed: ArticleSeed, summary: string): SocialPack {
  return {
    xThread: [
      `${seed.title}: a Watch Desk brief from CWI.`,
      "Cockroach Watch India is tracking the public conversation around Cockroach Janta Party, the Cockroach wave, creator commentary, and civic satire with context.",
      "Read the article, check the labels, and send corrections or creator-credit notes when context is missing."
    ],
    instagramCaption: `${seed.title}. Cockroach Watch India explains the public context around CJP, the Cockroach wave, youth voice, civic satire, and creator-led commentary. Document. Verify. Amplify.`,
    redditPost: `${summary} This CWI post is meant for source-checking, public-interest discussion, and responsible context around the Cockroach wave.`,
    youtubeShortsDescription: `${seed.title} - CWI explains the Cockroach wave, Cockroach Janta Party discussion, Gen Z politics, civic satire, and creator culture in India.`,
    seoSummary: summary
  };
}

function makeArticle(seed: ArticleSeed, index: number): Omit<WatchPost, "relatedSlugs"> {
  const metaClosers = [
    "CWI tracks the context around CJP, the Cockroach wave, and civic satire.",
    "A CWI Watch Desk brief on CJP, youth voice, and digital civic culture.",
    "Cockroach Watch India explains the public context with careful labels."
  ];
  const summary = seed.angle;
  const metaDescription = limitText(`${seed.angle} ${pick(metaClosers, index)}`, 155);
  const readingMinutes = 4 + (index % 4);
  const pullQuote = pick(
    [
      "A viral moment becomes useful only when it is documented with context, credit, and care.",
      "The internet moves quickly; public memory needs a slower, more responsible record.",
      "CWI treats the Cockroach wave as a civic signal, not as a rumor machine.",
      "Satire can travel fast, but public-interest commentary still needs verification."
    ],
    index
  );
  const articleOpeners = [
    `${seed.title} matters because it points to ${seed.focus}. CWI is tracking this subject as part of a public archive, not as an official voice of Cockroach Janta Party or any political organization.`,
    `At the center of this story is ${seed.focus}. Cockroach Watch India follows the discussion as independent civic commentary, with clear distance from official party claims or endorsements.`,
    `The subject matters because it helps explain ${seed.focus}. CWI's role is to document the public conversation, identify context, and avoid treating viral claims as settled facts.`
  ];
  const contextParagraphs = [
    "The discussion is moving through posts, edits, short videos, comment sections, and creator-led explainers. That visibility matters, but visibility alone does not verify a claim.",
    "Online attention can make a topic feel settled before the facts are clear. CWI separates public reaction from confirmation, especially when screenshots, reposts, or edited clips are involved.",
    "The strongest public signal is not only that people are sharing the topic. It is that they are using it to talk about recognition, frustration, accountability, and digital civic culture."
  ];
  const cwiMethodParagraphs = [
    "Cockroach Watch India uses careful labels for developing material: reportedly, publicly circulating, online discussion, internet reaction, viral trend, and public commentary. The aim is clarity, not exaggeration.",
    "CWI's editorial standard is simple: document the moment, verify the source trail where possible, credit creators, and explain the public-interest context without impersonating Cockroach Janta Party.",
    "The Watch Desk avoids presenting unverified allegations as fact. When a claim is unclear, the responsible label is reported, developing, alleged, or requires verification."
  ];
  const closingParagraphs = [
    "What happens next depends on how creators, students, first-time voters, civic observers, and local communities continue to use the language. CWI will keep the record focused on context, safety, and public memory.",
    "The next phase will be shaped by correction, repetition, creator credit, and whether the conversation stays attached to real public issues. CWI will continue to archive the signal without inflating it.",
    "Readers should follow the source trail, compare claims, and treat viral certainty with caution. The purpose of the archive is to make the moment easier to understand, not louder than the evidence."
  ];
  const sections = [
    {
      heading: pick(["Why this matters", "The context", "Why readers are watching"], index),
      paragraphs: [
        pick(articleOpeners, index),
        `The Cockroach wave is being discussed through humor, anger, creator work, and public commentary. CWI tracks those signals while keeping the distinction clear between satire, public reaction, and verified information.`
      ]
    },
    {
      heading: pick(["The public signal", "What the conversation shows", "How it is spreading"], index),
      paragraphs: [
        pick(contextParagraphs, index),
        `The link to Cockroach Janta Party and CJP-related search interest should be read as part of a wider digital culture story: people are looking for language that makes public frustration visible without relying only on formal speeches or statements.`
      ]
    },
    {
      heading: pick(["CWI context", "Editorial note", "How CWI reads it"], index),
      paragraphs: [
        pick(cwiMethodParagraphs, index),
        `This is why CWI keeps creator credit, correction requests, and cautious verification labels inside the article record. The goal is a usable archive, not a louder version of the feed.`
      ]
    },
    {
      heading: pick(["What to watch next", "What comes next", "Where the record goes"], index),
      paragraphs: [
        pick(closingParagraphs, index),
        coreDisclaimer
      ]
    }
  ];

  const content = sections.flatMap((section) => section.paragraphs);

  return {
    title: seed.title,
    slug: seed.slug,
    date: publishDate,
    updatedDate: publishDate,
    category: seed.category,
    summary,
    content,
    sections,
    sourceLabel: "CWI Watch Desk",
    verificationStatus: seed.verificationStatus ?? "Reported",
    credit: "Cockroach Watch India",
    tags: Array.from(new Set([...seed.tags, "Cockroach Watch India", "CWI", "Cockroach wave"])),
    author,
    readingMinutes,
    metaTitle: metaTitle(seed.title),
    metaDescription,
    imageAlt: `${seed.title} - Cockroach Watch India Watch Desk article graphic`,
    pullQuote,
    social: socialPack(seed, summary)
  };
}

const generatedPosts = articleSeeds.map(makeArticle);

export const posts: WatchPost[] = generatedPosts.map((post, index) => {
  const relatedSlugs = [1, 2, 3]
    .map((offset) => generatedPosts[(index + offset) % generatedPosts.length].slug)
    .filter((slug) => slug !== post.slug);

  return {
    ...post,
    relatedSlugs
  };
});

export const postCategories: WatchCategory[] = [
  "Movement Update",
  "Explainer",
  "Public Reaction",
  "Youth Voice",
  "Meme Watch",
  "Fact Check",
  "Creator Spotlight",
  "Civic Issue",
  "Digital Culture",
  "Opinion",
  "Archive"
];

export const trendingTopics = [
  "Cockroach Janta Party",
  "CJP",
  "Cockroach wave",
  "Main Bhi Cockroach",
  "Gen Z politics India",
  "Meme politics India",
  "Youth voice India",
  "Political satire India",
  "Creator-led commentary",
  "Digital civic culture"
];
