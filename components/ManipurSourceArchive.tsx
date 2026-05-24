"use client";

import { ExternalLink, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { ManipurSource } from "@/data/manipur";

export function ManipurSourceArchive({ sources }: { sources: ManipurSource[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const categories = useMemo(() => ["all", ...Array.from(new Set(sources.map((source) => source.category)))], [sources]);

  const filteredSources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sources.filter((source) => {
      const matchesCategory = category === "all" || source.category === category;
      const haystack = [
        source.title,
        source.publisher,
        source.summary,
        source.keyFact,
        source.communityAffected,
        source.category,
        source.biasNote
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [category, query, sources]);

  return (
    <div className="rounded-[2rem] border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
        <label className="relative block">
          <span className="sr-only">Search Manipur source archive</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-royal/70" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search sources, facts, publishers, or communities"
            className="min-h-14 w-full rounded-2xl border border-line bg-paper py-3 pl-11 pr-4 text-sm font-semibold text-ink outline-none ring-0 placeholder:text-ink/35 focus:border-royal/50"
          />
        </label>
        <label className="block">
          <span className="sr-only">Filter source archive by category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="min-h-14 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-ink outline-none focus:border-royal/50"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All categories" : item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-ink/45">
        Showing {filteredSources.length} of {sources.length} source records
      </p>

      <div className="mt-6 grid gap-4">
        {filteredSources.map((source, index) => (
          <article
            key={source.id}
            className="rounded-[1.5rem] border border-line bg-paper p-5 transition hover:-translate-y-0.5 hover:border-royal/35 hover:bg-skywash/60"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-skywash px-3 py-1 font-mono text-[0.65rem] font-black uppercase tracking-[0.15em] text-royal ring-1 ring-royal/15">
                S{index + 1}
              </span>
              <span className="rounded-full bg-white px-3 py-1 font-mono text-[0.65rem] font-black uppercase tracking-[0.15em] text-ink/58 ring-1 ring-line">
                {source.category}
              </span>
              <span className="rounded-full bg-saffron/25 px-3 py-1 font-mono text-[0.65rem] font-black uppercase tracking-[0.15em] text-[#8A5B00] ring-1 ring-saffron/35">
                {source.trustScore}
              </span>
            </div>
            <h3 className="mt-4 font-display text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
              {source.title}
            </h3>
            <p className="mt-2 font-mono text-xs font-black uppercase tracking-[0.14em] text-royal/70">
              {source.publisher} / {source.date}
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/70">{source.summary}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-line bg-white p-4">
                <p className="font-mono text-[0.65rem] font-black uppercase tracking-[0.16em] text-royal">
                  Key fact extracted
                </p>
                <p className="mt-2 text-sm leading-6 text-ink/70">{source.keyFact}</p>
              </div>
              <div className="rounded-2xl border border-line bg-white p-4">
                <p className="font-mono text-[0.65rem] font-black uppercase tracking-[0.16em] text-royal">
                  Bias note
                </p>
                <p className="mt-2 text-sm leading-6 text-ink/70">{source.biasNote}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-ink/52">
                Community affected: {source.communityAffected}
              </p>
              <a
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-black uppercase tracking-[0.13em] text-white transition hover:bg-royal"
              >
                Open source <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
