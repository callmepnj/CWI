"use client";

import { useState } from "react";
import { WatchDeskCard } from "@/components/WatchDeskCard";
import { postCategories, trendingTopics, type WatchPost } from "@/data/posts";
import { cn } from "@/lib/utils";

const filters = ["All", ...postCategories] as const;

export function WatchDeskGrid({ posts }: { posts: WatchPost[] }) {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const visiblePosts = posts.filter((post) => {
    const categoryMatch = active === "All" || post.category === active;
    const queryMatch =
      normalizedQuery.length === 0 ||
      [post.title, post.summary, post.category, post.verificationStatus, ...post.tags].join(" ").toLowerCase().includes(normalizedQuery);

    return categoryMatch && queryMatch;
  });

  return (
    <>
      <div className="mb-8 grid gap-4 rounded-[2rem] border border-line bg-white p-4 shadow-card lg:grid-cols-[1fr_0.7fr]">
        <label className="block">
          <span className="mb-2 block font-mono text-xs font-black uppercase tracking-[0.14em] text-ink/55">Search the archive</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search CJP, Cockroach wave, Gen Z politics..."
            className="h-12 w-full rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-royal focus:ring-4 focus:ring-royal/10"
          />
        </label>
        <div>
          <p className="mb-2 font-mono text-xs font-black uppercase tracking-[0.14em] text-ink/55">Trending now</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {trendingTopics.slice(0, 6).map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setQuery(topic)}
                className="shrink-0 rounded-full bg-skywash px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-royal ring-1 ring-royal/15"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition",
              active === filter
                ? "bg-ink text-white shadow-[0_12px_24px_rgba(11,18,32,0.16)]"
                : "bg-white text-ink/68 ring-1 ring-line hover:bg-skywash hover:text-royal"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <p className="mb-5 font-mono text-xs font-black uppercase tracking-[0.14em] text-ink/50">
        Showing {visiblePosts.length} Watch Desk article{visiblePosts.length === 1 ? "" : "s"}
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visiblePosts.map((post) => (
          <WatchDeskCard key={post.slug} post={post} />
        ))}
      </div>

      {visiblePosts.length === 0 ? (
        <div className="rounded-3xl border border-line bg-white p-8 text-center shadow-card">
          <p className="font-display text-3xl font-black uppercase text-ink">No Watch Desk notes found</p>
          <p className="mt-3 text-ink/65">Try a broader search term or switch the category filter back to All.</p>
        </div>
      ) : null}
    </>
  );
}
