"use client";

import { useEffect, useMemo, useState } from "react";
import type React from "react";
import { Bookmark, Check, Copy, Eye, Facebook, Heart, Linkedin, MessageCircle, Share2 } from "lucide-react";
import { site } from "@/lib/site";

type Counts = {
  views: number;
  likes: number;
  shares: number;
  bookmarks: number;
};

type Props = {
  slug: string;
  title: string;
  summary: string;
  path: string;
  compact?: boolean;
  trackView?: boolean;
};

const initialCounts: Counts = {
  views: 0,
  likes: 0,
  shares: 0,
  bookmarks: 0
};

export function UnansweredArticleActions({ slug, title, summary, path, compact = false, trackView = false }: Props) {
  const [counts, setCounts] = useState<Counts>(initialCounts);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pendingAction, setPendingAction] = useState("");
  const url = `${site.url}${path}`;
  const shareText = `Read this CWI investigation: ${title} - ${summary}`;

  const shareLinks = useMemo(
    () => [
      {
        label: "WhatsApp",
        platform: "whatsapp",
        href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`,
        icon: MessageCircle
      },
      {
        label: "X",
        platform: "x",
        href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
        icon: Share2
      },
      {
        label: "Facebook",
        platform: "facebook",
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        icon: Facebook
      },
      {
        label: "LinkedIn",
        platform: "linkedin",
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        icon: Linkedin
      },
      {
        label: "Reddit",
        platform: "reddit",
        href: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
        icon: MessageCircle
      }
    ],
    [shareText, title, url]
  );

  useEffect(() => {
    let active = true;
    fetch(`/api/unanswered-files/metrics?slug=${encodeURIComponent(slug)}`)
      .then((response) => response.json())
      .then((data) => {
        if (!active || !data.ok) {
          return;
        }
        setCounts(data.counts ?? initialCounts);
        setLiked(Boolean(data.liked));
        setBookmarked(Boolean(data.bookmarked) || localStorage.getItem(bookmarkKey(slug)) === "1");
      })
      .catch(() => {
        setBookmarked(localStorage.getItem(bookmarkKey(slug)) === "1");
      });

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!trackView) {
      return;
    }
    postAction("view").catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackView, slug]);

  async function postAction(action: "view" | "like" | "bookmark" | "share", platform?: string) {
    const response = await fetch("/api/unanswered-files/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, action, platform })
    });
    const data = await response.json().catch(() => null);
    if (response.ok && data?.ok) {
      setCounts(data.counts ?? counts);
      setLiked(Boolean(data.liked));
      setBookmarked(Boolean(data.bookmarked));
    }
  }

  async function toggleLike() {
    setPendingAction("like");
    setLiked((value) => !value);
    setCounts((value) => ({ ...value, likes: value.likes + (liked ? -1 : 1) }));
    await postAction("like").catch(() => undefined);
    setPendingAction("");
  }

  async function toggleBookmark() {
    setPendingAction("bookmark");
    const nextValue = !bookmarked;
    setBookmarked(nextValue);
    if (nextValue) {
      localStorage.setItem(bookmarkKey(slug), "1");
    } else {
      localStorage.removeItem(bookmarkKey(slug));
    }
    await postAction("bookmark").catch(() => undefined);
    setPendingAction("");
  }

  async function share(platform: string, href: string) {
    await postAction("share", platform).catch(() => undefined);
    window.open(href, "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url).catch(() => undefined);
    setCopied(true);
    await postAction("share", "copy").catch(() => undefined);
    setTimeout(() => setCopied(false), 1800);
  }

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={toggleLike}
          disabled={pendingAction === "like"}
          aria-label={liked ? `Remove like for ${title}` : `Like ${title}`}
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.12em] ring-1 transition ${
            liked ? "bg-urgent/10 text-urgent ring-urgent/25" : "bg-white text-ink/58 ring-line hover:bg-skywash hover:text-royal"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} />
          {counts.likes}
        </button>
        <button
          type="button"
          onClick={toggleBookmark}
          disabled={pendingAction === "bookmark"}
          aria-label={bookmarked ? `Remove saved item ${title}` : `Save ${title}`}
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.12em] ring-1 transition ${
            bookmarked ? "bg-saffron/25 text-[#8A5B00] ring-saffron/35" : "bg-white text-ink/58 ring-line hover:bg-skywash hover:text-royal"
          }`}
        >
          <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? "fill-current" : ""}`} />
          Save
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Metric label="Views" value={counts.views} icon={<Eye className="h-4 w-4" />} />
        <Metric label="Shares" value={counts.shares} icon={<Share2 className="h-4 w-4" />} />
        <Metric label="Likes" value={counts.likes} icon={<Heart className="h-4 w-4" />} />
        <Metric label="Saves" value={counts.bookmarks} icon={<Bookmark className="h-4 w-4" />} />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={toggleLike}
          disabled={pendingAction === "like"}
          aria-label={liked ? `Remove like for ${title}` : `Like ${title}`}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.12em] ring-1 transition ${
            liked ? "bg-urgent/10 text-urgent ring-urgent/25" : "bg-white text-ink ring-line hover:bg-skywash hover:text-royal"
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          {liked ? "Liked" : "Like"}
        </button>
        <button
          type="button"
          onClick={toggleBookmark}
          disabled={pendingAction === "bookmark"}
          aria-label={bookmarked ? `Remove saved item ${title}` : `Save ${title}`}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.12em] ring-1 transition ${
            bookmarked ? "bg-saffron/25 text-[#8A5B00] ring-saffron/35" : "bg-white text-ink ring-line hover:bg-skywash hover:text-royal"
          }`}
        >
          <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
          {bookmarked ? "Saved" : "Save"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {shareLinks.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.platform}
              type="button"
              onClick={() => share(item.platform, item.href)}
              aria-label={`Share ${title} on ${item.label}`}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-ink transition hover:border-royal hover:bg-skywash hover:text-royal"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={copyLink}
          aria-label={`Copy link to ${title}`}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-ink transition hover:border-royal hover:bg-skywash hover:text-royal"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-3">
      <p className="inline-flex items-center gap-2 font-mono text-[0.65rem] font-black uppercase tracking-[0.14em] text-royal">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-ink">{value.toLocaleString("en-IN")}</p>
    </div>
  );
}

function bookmarkKey(slug: string) {
  return `cwi-unanswered-bookmark:${slug}`;
}
