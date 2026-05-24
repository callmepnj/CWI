"use client";

import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { FileSource, FileStatus } from "@/data/unanswered-files";

export type UnansweredSourceRecord = {
  id: string;
  fileTitle: string;
  fileSlug: string;
  fileCategory: string;
  fileStatus: FileStatus;
  source: FileSource;
};

export function UnansweredSourceArchive({ records }: { records: UnansweredSourceRecord[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const types = useMemo(() => ["all", ...Array.from(new Set(records.map((record) => record.source.type)))], [records]);

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return records.filter((record) => {
      const haystack = [
        record.fileTitle,
        record.fileCategory,
        record.fileStatus,
        record.source.publisher,
        record.source.name,
        record.source.type,
        record.source.note
      ]
        .join(" ")
        .toLowerCase();

      return (type === "all" || record.source.type === type) && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [query, records, type]);

  return (
    <div id="sources" className="rounded-[2rem] border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
        <label className="relative block">
          <span className="sr-only">Search source archive</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-royal/70" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search sources, publishers, court records, or case names"
            className="min-h-14 w-full rounded-2xl border border-line bg-paper py-3 pl-11 pr-4 text-sm font-semibold text-ink outline-none placeholder:text-ink/35 focus:border-royal/50"
          />
        </label>
        <label className="block">
          <span className="sr-only">Filter sources by type</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="min-h-14 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-ink outline-none focus:border-royal/50"
          >
            {types.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All source types" : item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-ink/45">
        Showing {filteredRecords.length} of {records.length} source records
      </p>

      <div className="mt-6 grid gap-4">
        {filteredRecords.map((record, index) => (
          <article
            key={record.id}
            className="rounded-[1.5rem] border border-line bg-paper p-5 transition hover:-translate-y-0.5 hover:border-royal/35 hover:bg-skywash/60"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-skywash px-3 py-1 font-mono text-[0.65rem] font-black uppercase tracking-[0.15em] text-royal ring-1 ring-royal/15">
                S{index + 1}
              </span>
              <span className="rounded-full bg-white px-3 py-1 font-mono text-[0.65rem] font-black uppercase tracking-[0.15em] text-ink/58 ring-1 ring-line">
                {record.source.type}
              </span>
              <Link
                href={`/unanswered-files/${record.fileSlug}`}
                className="rounded-full bg-saffron/25 px-3 py-1 font-mono text-[0.65rem] font-black uppercase tracking-[0.15em] text-[#8A5B00] ring-1 ring-saffron/35 transition hover:bg-saffron/40"
              >
                {record.fileTitle}
              </Link>
            </div>
            <h3 className="mt-4 font-display text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
              {record.source.name}
            </h3>
            <p className="mt-2 font-mono text-xs font-black uppercase tracking-[0.14em] text-royal/70">
              {record.source.publisher} / {record.fileCategory} / {record.fileStatus}
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/70">{record.source.note}</p>
            <div className="mt-4 flex flex-wrap justify-between gap-3">
              <Link
                href={`/unanswered-files/${record.fileSlug}`}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.13em] text-ink/62 transition hover:border-royal/35 hover:bg-skywash hover:text-royal"
              >
                Open case file
              </Link>
              <a
                href={record.source.url}
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
