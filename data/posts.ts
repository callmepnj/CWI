export type VerificationStatus =
  | "Verified"
  | "Developing"
  | "Claimed"
  | "Reported"
  | "Opinion/Satire";

export type WatchPost = {
  title: string;
  slug: string;
  date: string;
  category:
    | "Movement Update"
    | "Explainer"
    | "Public Issue"
    | "Youth Voice"
    | "Meme Watch"
    | "Fact Check"
    | "Creator Credit"
    | "Correction"
    | "Civic Alert"
    | "Archive";
  summary: string;
  content: string[];
  sourceLabel: string;
  sourceUrl?: string;
  verificationStatus: VerificationStatus;
  credit: string;
  tags: string[];
};

export const posts: WatchPost[] = [
  {
    title: "What is the Cockroach wave?",
    slug: "what-is-the-cockroach-wave",
    date: "2026-05-20",
    category: "Explainer",
    summary:
      "A working explainer on how a satire identity became a wider civic language for ignored citizens and young voters.",
    content: [
      "The Cockroach wave is publicly circulating as a civic-satire identity: resilient, hard to ignore, and rooted in anger at neglect.",
      "CWI documents the language, symbols, public reactions, and issues attached to the wave without claiming to represent any political party.",
      "The responsible way to read the wave is as a signal: young citizens are using satire to discuss systems, dignity, accountability, and public memory."
    ],
    sourceLabel: "CWI editorial desk",
    verificationStatus: "Opinion/Satire",
    credit: "Cockroach Watch India",
    tags: ["movement", "satire", "youth"]
  },
  {
    title: "Why youth satire is becoming civic language",
    slug: "youth-satire-civic-language",
    date: "2026-05-20",
    category: "Youth Voice",
    summary:
      "Satire is becoming the grammar young people use when formal institutions fail to listen.",
    content: [
      "Youth satire compresses frustration into a format that travels quickly, but speed does not remove the duty to verify.",
      "CWI separates sharp commentary from fake claims, hate, and harassment.",
      "The public-interest value of satire rises when it points toward evidence, context, and accountability."
    ],
    sourceLabel: "CWI analysis",
    verificationStatus: "Opinion/Satire",
    credit: "Cockroach Watch India",
    tags: ["youth", "satire", "civic language"]
  },
  {
    title: "Five-point agenda explained",
    slug: "five-point-agenda-explained",
    date: "2026-05-20",
    category: "Explainer",
    summary:
      "A context-first explainer of the viral five-point agenda circulating online.",
    content: [
      "The five-point agenda is being discussed online as a shorthand for institutional accountability, voting rights, representation, media independence, and defection reform.",
      "CWI does not present this page as an official endorsement. It is public-interest commentary on circulating demands.",
      "Each claim needs legal, constitutional, and policy context before being treated as a concrete reform proposal."
    ],
    sourceLabel: "Publicly circulating discussion",
    verificationStatus: "Reported",
    credit: "Public conversation, explained by CWI",
    tags: ["agenda", "policy", "explainer"]
  },
  {
    title: "Meme or movement?",
    slug: "meme-or-movement",
    date: "2026-05-20",
    category: "Meme Watch",
    summary:
      "A serious question: when does repeated satire become public identity, and when does identity become movement memory?",
    content: [
      "A meme becomes movement language when people use it to describe lived reality, not only to laugh.",
      "CWI does not reduce civic anger to entertainment. We archive the issue behind the post.",
      "The test is whether the format helps people document, verify, amplify, and organize public memory."
    ],
    sourceLabel: "CWI Watch Desk",
    verificationStatus: "Opinion/Satire",
    credit: "Cockroach Watch India",
    tags: ["meme watch", "movement", "archive"]
  },
  {
    title: "How to submit a civic report safely",
    slug: "submit-civic-report-safely",
    date: "2026-05-20",
    category: "Civic Alert",
    summary:
      "A safety-first submission guide for public issues, viral claims, and local reports.",
    content: [
      "Do not submit private personal data, home addresses, phone numbers, or content that can put vulnerable people at risk.",
      "Send public evidence: dates, locations, complaint IDs, official notices, source links, and clear context.",
      "Use reported, alleged, claimed, or requires verification where proof is incomplete."
    ],
    sourceLabel: "CWI safety protocol",
    verificationStatus: "Verified",
    credit: "Cockroach Watch India",
    tags: ["submission", "safety", "verification"]
  },
  {
    title: "Why creator credit matters",
    slug: "why-creator-credit-matters",
    date: "2026-05-20",
    category: "Creator Credit",
    summary:
      "Movements travel through creators. CWI credits public handles and respects correction or takedown requests.",
    content: [
      "Creator credit is not cosmetic. It preserves authorship, protects context, and keeps civic media accountable.",
      "CWI does not remove watermarks or claim ownership of user-created work.",
      "If credit is missing or wrong, creators can contact CWI for correction or takedown review."
    ],
    sourceLabel: "CWI credit policy",
    verificationStatus: "Verified",
    credit: "Cockroach Watch India",
    tags: ["creator credit", "policy", "media"]
  },
  {
    title: "How to verify viral political posts",
    slug: "verify-viral-political-posts",
    date: "2026-05-20",
    category: "Fact Check",
    summary:
      "A practical checklist for source tracing, edit detection, date checking, and claim labeling.",
    content: [
      "Start with the earliest visible upload, not the loudest repost.",
      "Check dates, location markers, official documents, credible reporting, and whether captions add claims not present in the footage.",
      "If CWI cannot independently verify a claim, it must be labeled as reported, claimed, alleged, or developing."
    ],
    sourceLabel: "CWI verification checklist",
    verificationStatus: "Verified",
    credit: "Cockroach Watch India",
    tags: ["fact check", "verification", "media literacy"]
  },
  {
    title: "What counts as public-interest satire?",
    slug: "public-interest-satire",
    date: "2026-05-20",
    category: "Archive",
    summary:
      "Satire can be sharp and responsible when it targets power, systems, and public actions instead of private dignity.",
    content: [
      "Public-interest satire comments on systems, institutions, public promises, and civic failures.",
      "It must not become harassment, hate, doxxing, or unverified allegation packaged as humor.",
      "CWI keeps satire sharp, but responsible."
    ],
    sourceLabel: "CWI editorial standard",
    verificationStatus: "Verified",
    credit: "Cockroach Watch India",
    tags: ["satire", "public interest", "standards"]
  }
];

export const postCategories = [
  "Movement Update",
  "Explainer",
  "Public Issue",
  "Youth Voice",
  "Meme Watch",
  "Fact Check",
  "Creator Credit",
  "Correction",
  "Civic Alert",
  "Archive"
] as const;
