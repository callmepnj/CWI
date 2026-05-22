import { AtSign, Facebook, Instagram, Mail, MessageCircle, Send, Twitter, Youtube } from "lucide-react";
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
    label: "Reddit",
    href: site.reddit,
    handle: "r/CockroachwatchIndia",
    icon: MessageCircle
  },
  {
    label: "Facebook",
    href: site.facebook,
    handle: "Cockroach Watch India",
    icon: Facebook
  },
  {
    label: "Bluesky",
    href: site.bluesky,
    handle: "cwatchindia.bsky.social",
    icon: AtSign
  },
  {
    label: "Email",
    href: `mailto:${site.email}`,
    handle: site.email,
    icon: Mail
  }
] as const;
