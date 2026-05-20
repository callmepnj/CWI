import { Eye, FileSearch, Megaphone, Scale, ShieldQuestion } from "lucide-react";

export const roles = [
  {
    title: "Field Watcher",
    icon: Eye,
    description:
      "For people who record local issues, public neglect, broken roads, bribe demands, street harassment, public service failures, and ground reality.",
    submits: "Ground reports, photos, public documents, location context, timeline notes.",
    examples: "A broken road outside a school, a stalled public service counter, a visible garbage dump.",
    cta: "Join as Field Watcher"
  },
  {
    title: "Digital Watcher",
    icon: FileSearch,
    description:
      "For people who track viral posts, misinformation, media narratives, online reactions, and public conversations.",
    submits: "Source links, screenshots with dates, correction requests, narrative shifts.",
    examples: "A circulating claim that needs verification, a viral youth reaction thread, a misleading edit.",
    cta: "Join as Digital Watcher"
  },
  {
    title: "Creator Watcher",
    icon: Megaphone,
    description:
      "For meme creators, video editors, reel makers, designers, explainers, and content creators who turn public anger into public memory.",
    submits: "Posters, reels, explainable graphics, credited satire, permissioned edits.",
    examples: "A civic poster, a public-interest reel, a visual explainer with source links.",
    cta: "Join as Creator Watcher"
  },
  {
    title: "Rights Watcher",
    icon: Scale,
    description:
      "For RTI users, law students, activists, constitution readers, civic volunteers, and people who understand legal or public processes.",
    submits: "Legal context, public documents, RTI notes, verified process explainers.",
    examples: "How to file a public complaint, what a civic department is responsible for, policy context.",
    cta: "Join as Rights Watcher"
  },
  {
    title: "Quiet Watcher",
    icon: ShieldQuestion,
    description:
      "For people who do not post much but observe, save screenshots, fact-check family groups, send tips, and help the truth travel.",
    submits: "Tips, private corrections, archived links, context that helps verification.",
    examples: "A deleted post archive, a helpful source trail, a careful fact-check note.",
    cta: "Join as Quiet Watcher"
  }
] as const;
