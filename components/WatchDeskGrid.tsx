"use client";

import { useState } from "react";
import { WatchDeskCard } from "@/components/WatchDeskCard";
import type { WatchPost } from "@/data/posts";
import { cn } from "@/lib/utils";

const filters = ["All", "Movement Update", "Explainer", "Public Issue", "Youth Voice", "Fact Check", "Creator Credit"] as const;

export function WatchDeskGrid({ posts }: { posts: WatchPost[] }) {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const visiblePosts = active === "All" ? posts : posts.filter((post) => post.category === active);

  return (
    <>
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visiblePosts.map((post) => (
          <WatchDeskCard key={post.slug} post={post} />
        ))}
      </div>
    </>
  );
}
