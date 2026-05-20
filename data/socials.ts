import { Mail, Twitter, Youtube, Instagram, Send } from "lucide-react";
import { site } from "@/lib/site";

export const socials = [
  {
    label: "X / Twitter",
    href: site.x,
    handle: "@CWatchIndia",
    icon: Twitter
  },
  {
    label: "Instagram",
    href: site.instagram,
    handle: "@cockroachwatchindia",
    icon: Instagram
  },
  {
    label: "YouTube",
    href: site.youtube,
    handle: "@CockroachWatchIndia",
    icon: Youtube
  },
  {
    label: "Telegram",
    href: site.telegram,
    handle: "t.me/cockroachwatchindia",
    icon: Send
  },
  {
    label: "Email",
    href: `mailto:${site.email}`,
    handle: site.email,
    icon: Mail
  }
] as const;
