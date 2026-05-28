export type WatchAlertStatus = "Developing" | "Verified" | "Advisory" | "Unverified";

export const watchAdvisories = [
  {
    title: "CJP Instagram hack claims circulating",
    status: "Unverified" as const,
    date: "May 23, 2026",
    summary:
      "Claims about account access and suspicious activity are circulating online. CWI treats this as unverified until a clear official clarification or reliable source trail is available.",
    href: "/archive/how-to-verify-viral-cjp-claims-before-sharing"
  },
  {
    title: "Verify before sharing suspicious posts",
    status: "Advisory" as const,
    date: "May 23, 2026",
    summary:
      "Check the original post, timestamp, account handle, archived links, and multiple reliable sources before forwarding screenshots or claims.",
    href: "/archive/how-to-read-viral-cjp-claims-responsibly"
  },
  {
    title: "Await official clarification",
    status: "Developing" as const,
    date: "May 23, 2026",
    summary:
      "Fast-moving platform claims should be read as developing. CWI separates public reaction, satire, verified reporting, and unanswered questions.",
    href: "/archive/what-happened-after-cjp-x-account-withheld"
  },
  {
    title: "Source request open",
    status: "Advisory" as const,
    date: "May 23, 2026",
    summary:
      "CWI prioritizes source trails, creator credit, and correction paths before amplification. Readers can submit context through the intake form.",
    href: "/submit"
  }
];

export const watchCategories = [
  {
    title: "Public Issues",
    summary: "Local problems, civic failures, and public concerns that need context before they disappear."
  },
  {
    title: "Viral Claims",
    summary: "Screenshots, posts, and fast-moving claims that require source trails and careful labels."
  },
  {
    title: "Creator Credit",
    summary: "Credit requests, takedown concerns, and creator attribution for public-interest media."
  },
  {
    title: "Satire / Context",
    summary: "Satirical posts and public commentary explained with responsibility and context."
  },
  {
    title: "Youth Voice",
    summary: "Student concerns, first-time voter questions, unemployed youth dignity, and public reaction."
  },
  {
    title: "Archive Records",
    summary: "Older explainers with visible sources, dates, verification labels, and correction paths."
  },
  {
    title: "Digital Safety Alerts",
    summary: "Verification guidance for suspicious links, impersonation, account claims, and misinformation."
  },
  {
    title: "CWI Updates",
    summary: "Publicly available updates about CWI's independent newsroom and public archive work."
  }
];

export const watchHighlightItems = [
  "Public Advisory",
  "Archive Record",
  "Creator Credit",
  "Viral Claim",
  "Youth Voice",
  "Send Source"
];