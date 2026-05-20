import {
  AlertTriangle,
  Banknote,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  Bus,
  FileWarning,
  GraduationCap,
  Leaf,
  Newspaper,
  RadioTower,
  Route,
  Trash2,
  Users
} from "lucide-react";

export const issues = [
  {
    title: "Bribe Demands",
    icon: Banknote,
    description: "Public-facing corruption claims that need careful evidence, context, and safety review.",
    proof: "Receipts, complaint numbers, public office details, dates, non-private recordings where lawful."
  },
  {
    title: "Broken Roads",
    icon: Route,
    description: "Road damage, unsafe public routes, stalled repairs, and visible infrastructure neglect.",
    proof: "Photos, location, date, ward or department details, previous complaint references."
  },
  {
    title: "Garbage Dumps",
    icon: Trash2,
    description: "Waste accumulation, sanitation failures, and repeated civic service gaps.",
    proof: "Location photos, timeline, municipal complaint numbers, visible public impact."
  },
  {
    title: "Paper Leaks",
    icon: FileWarning,
    description: "Claims around exam paper leaks or compromised recruitment processes requiring verification.",
    proof: "Official notices, credible reports, exam details, source links, timeline."
  },
  {
    title: "Job Scams",
    icon: BriefcaseBusiness,
    description: "Employment fraud, fake recruitment, and youth-targeted financial deception.",
    proof: "Job post links, payment requests, company details, screenshots with dates."
  },
  {
    title: "Exam Delays",
    icon: GraduationCap,
    description: "Delayed exams, results, admit cards, counseling, or recruitment timelines.",
    proof: "Official notices, candidate screenshots, timeline, affected exam name."
  },
  {
    title: "Fake News",
    icon: AlertTriangle,
    description: "Publicly circulating claims that may mislead citizens or inflame civic discussion.",
    proof: "Original source, platform link, screenshot date, counter-source if available."
  },
  {
    title: "Street Vendor Harassment",
    icon: Bus,
    description: "Public-space conflicts involving vendors, enforcement, livelihoods, and dignity.",
    proof: "Location, time, public official context, visible incident evidence, witness notes."
  },
  {
    title: "Public Service Failure",
    icon: Building2,
    description: "Breakdowns in essential services, offices, helplines, counters, and public access.",
    proof: "Complaint ID, service name, office location, timeline, public-facing evidence."
  },
  {
    title: "River Pollution",
    icon: Leaf,
    description: "Visible water pollution, dumping, industrial discharge claims, and local ecological harm.",
    proof: "Photos, coordinates, time, nearby source details, official complaint references."
  },
  {
    title: "Green Cover Loss",
    icon: Leaf,
    description: "Tree cutting, public land concerns, heat impact, and environmental accountability.",
    proof: "Before/after photos, permission notices, site details, dates."
  },
  {
    title: "Campus Issues",
    icon: BookOpenCheck,
    description: "Student safety, fees, facilities, administration delays, and campus public-interest concerns.",
    proof: "Notices, photos, anonymous student notes, official emails, dates."
  },
  {
    title: "Digital Misinformation",
    icon: RadioTower,
    description: "Manipulated clips, false captions, cropped claims, and platform-driven confusion.",
    proof: "Original link, circulated version, upload dates, context sources."
  },
  {
    title: "Representation",
    icon: Users,
    description: "Public concerns around youth, women, marginalized voices, and decision-making access.",
    proof: "Public data, official rosters, credible reports, affected community context."
  },
  {
    title: "Media Accountability",
    icon: Newspaper,
    description: "Coverage gaps, ownership transparency concerns, corrections, and public trust issues.",
    proof: "Article links, broadcast clips, correction requests, source comparison."
  }
] as const;

export const issueActions = ["document", "verify", "amplify", "credit", "archive"] as const;
