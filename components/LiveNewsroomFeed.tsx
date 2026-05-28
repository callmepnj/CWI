"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LiveNewsroomItem } from "@/data/live-newsroom";

type FeedTab = "Today" | "This Week" | "Verified" | "Developing" | "Advisories" | "Files";

const tabs: FeedTab[] = ["Today", "This Week", "Verified", "Developing", "Advisories", "Files"];

const developingStatuses = new Set(["Developing", "Needs Source", "Reported", "Unverified"]);
const verifiedStatuses = new Set(["Verified", "Source-backed"]);

export function LiveNewsroomFeed({ items }: { items: LiveNewsroomItem[] }) {
  const [activeTab, setActiveTab] = useState<FeedTab>("Today");

  const visibleItems = useMemo(() => {
    const filtered = items.filter((item) => {
      if (activeTab === "Today") {
        return item.labels.includes("NEW TODAY") || item.labels.includes("UPDATED TODAY");
      }
      if (activeTab === "Verified") {
        return verifiedStatuses.has(item.status);
      }
      if (activeTab === "Developing") {
        return developingStatuses.has(item.status);
      }
      if (activeTab === "Advisories") {
        return item.status === "Public Advisory" || item.sections.includes("public-advisory");
      }
      if (activeTab === "Files") {
        return item.sections.includes("india-unanswered-files");
      }
      return true;
    });

    return filtered.slice(0, 10);
  }, [activeTab, items]);

  return (
    <div className="rounded-lg border-2 border-cwi-brown/15 bg-white/80 shadow-sm">
      <div className="flex gap-1 overflow-x-auto border-b border-cwi-border/70 p-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 rounded-md px-3 py-2 text-sm font-bold transition ${
              activeTab === tab
                ? "bg-cwi-green text-cwi-cream"
                : "text-cwi-ink/68 hover:bg-cwi-cream hover:text-cwi-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="divide-y divide-cwi-border/60">
        {visibleItems.length > 0 ? (
          visibleItems.map((item) => (
            <Link
              key={item.id}
              href={`/live-newsroom/${item.slug}`}
              className="group grid gap-3 p-4 transition hover:bg-cwi-cream/60 sm:grid-cols-[1fr_auto] sm:p-5"
            >
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-cwi-green/10 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-cwi-green">
                    {item.status}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wide text-cwi-brown/70">
                    {item.category}
                  </span>
                  {item.labels.slice(0, 2).map((label) => (
                    <span key={label} className="rounded-full border border-cwi-saffron/35 bg-cwi-saffron/10 px-2 py-0.5 text-[0.68rem] font-black text-cwi-brown">
                      {label}
                    </span>
                  ))}
                </div>
                <h3 className="font-display text-lg font-black leading-snug text-cwi-ink group-hover:text-cwi-green">
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-cwi-ink/70">{item.summary}</p>
              </div>
              <div className="flex items-end justify-between gap-4 sm:block sm:text-right">
                <div className="text-xs font-semibold uppercase tracking-wide text-cwi-ink/52">
                  {formatDateTime(item.lastUpdatedAt)}
                </div>
                <div className="mt-2 text-xs font-bold text-cwi-green">
                  {item.sourceTrail.length} source{item.sourceTrail.length === 1 ? "" : "s"}
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-black text-cwi-green">
                  Open update <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-8 text-sm font-semibold text-cwi-ink/58">
            No approved {activeTab.toLowerCase()} updates are published in this feed yet.
          </div>
        )}
      </div>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata"
  }).format(new Date(value));
}
