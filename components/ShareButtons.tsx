import Link from "next/link";
import { Facebook, MessageCircle, Send, Share2 } from "lucide-react";
import { site } from "@/lib/site";

type ShareButtonsProps = {
  title: string;
  path: string;
  summary: string;
};

export function ShareButtons({ title, path, summary }: ShareButtonsProps) {
  const url = `${site.url}${path}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(`${title} - ${summary}`);

  const links = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      icon: Share2
    },
    {
      label: "Share on Reddit",
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: MessageCircle
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Facebook
    },
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      icon: MessageCircle
    },
    {
      label: "Share on Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      icon: Send
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${item.label}: ${title}`}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-ink transition hover:border-royal hover:bg-skywash hover:text-royal"
          >
            <Icon className="h-4 w-4" />
            {item.label.replace("Share on ", "")}
          </Link>
        );
      })}
    </div>
  );
}
