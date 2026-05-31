import { site } from "@/lib/site";

export const joinConfig = {
  enabled: true,
  buttonLabel: "Join Now",
  compactLabel: "Join the Watch",
  modalTitle: "Join the Watch",
  subtitle: "Support CWI, follow the movement, submit updates, and help document public memory.",
  supportText:
    "Support Cockroach Watch India so we can keep documenting, verifying, and amplifying public-interest updates.",
  qrPath: "/images/support/cwi-support-qr.png",
  qrLabel: "Scan to Support CWI",
  supportEmail: site.email,
  websiteLink: site.url,
  submitLink: `${site.url}/submit`,
  liveNewsroomLink: `${site.url}/live-newsroom`,
  defaultPosition: "right" as const,
  glowIntensity: "medium" as const,
  showOnMobile: true,
  socialLinks: [
    { label: "Join Reddit", href: site.reddit },
    { label: "Follow Instagram", href: site.instagram },
    { label: "Follow X", href: site.x },
    { label: "Subscribe YouTube", href: site.youtube },
    { label: "Visit Website", href: site.url },
    { label: "Submit Report", href: `${site.url}/submit` }
  ],
  whyJoin:
    "CWI is building a public archive for youth voice, civic issues, creator credit, digital rights, public advisories, and India's unanswered files. Join the Watch to help keep public memory alive.",
  safetyNote:
    "CWI reviews submissions before publishing. Unverified claims are labelled clearly. Creator credit matters."
};
