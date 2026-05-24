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
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur sm:p-6">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
        <label className="relative block">
          <span className="sr-only">Search Manipur source archive</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-200/70" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search sources, facts, publishers, or communities"
            className="min-h-14 w-full rounded-2xl border border-white/10 bg-[#071225] py-3 pl-11 pr-4 text-sm font-semibold text-white outline-none ring-0 placeholder:text-white/40 focus:border-sky-300/60"
          />
        </label>
        <label className="block">
          <span className="sr-only">Filter source archive by category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="min-h-14 w-full rounded-2xl border border-white/10 bg-[#071225] px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-white outline-none focus:border-sky-300/60"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All categories" : item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-white/40">
        Showing {filteredSources.length} of {sources.length} source records
      </p>

      <div className="mt-6 grid gap-4">
        {filteredSources.map((source, index) => (
          <article
            key={source.id}
            className="rounded-[1.5rem] border border-white/10 bg-[#071225]/85 p-5 transition hover:border-sky-300/40 hover:bg-[#0b1830]"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-sky-400/[0.12] px-3 py-1 font-mono text-[0.65rem] font-black uppercase tracking-[0.15em] text-sky-200 ring-1 ring-sky-300/20">
                S{index + 1}
              </span>
              <span className="rounded-full bg-white/[0.06] px-3 py-1 font-mono text-[0.65rem] font-black uppercase tracking-[0.15em] text-white/60 ring-1 ring-white/10">
                {source.category}
              </span>
              <span className="rounded-full bg-amber-300/[0.12] px-3 py-1 font-mono text-[0.65rem] font-black uppercase tracking-[0.15em] text-amber-100 ring-1 ring-amber-300/20">
                {source.trustScore}
              </span>
            </div>
            <h3 className="mt-4 font-display text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
              {source.title}
            </h3>
            <p className="mt-2 font-mono text-xs font-black uppercase tracking-[0.14em] text-sky-100/60">
              {source.publisher} / {source.date}
            </p>
            <p className="mt-4 text-sm leading-7 text-white/70">{source.summary}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-white/[0.055] p-4">
                <p className="font-mono text-[0.65rem] font-black uppercase tracking-[0.16em] text-amber-100">
                  Key fact extracted
                </p>
                <p className="mt-2 text-sm leading-6 text-white/70">{source.keyFact}</p>
              </div>
              <div className="rounded-2xl bg-white/[0.055] p-4">
                <p className="font-mono text-[0.65rem] font-black uppercase tracking-[0.16em] text-amber-100">
                  Bias note
                </p>
                <p className="mt-2 text-sm leading-6 text-white/70">{source.biasNote}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/50">
                Community affected: {source.communityAffected}
              </p>
              <a
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.13em] text-[#061326] transition hover:bg-amber-200"
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
