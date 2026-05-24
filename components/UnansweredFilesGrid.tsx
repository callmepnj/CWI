"use client";

import Link from "next/link";
import type React from "react";
import { useMemo, useState } from "react";
import { ArrowRight, FileText, HelpCircle, MapPin, Search, UsersRound } from "lucide-react";
import { UnansweredFileVisual } from "@/components/UnansweredFileVisual";
import { UnansweredStatusBadge } from "@/components/UnansweredStatusBadge";
import type { UnansweredFile } from "@/data/unanswered-files";

export function UnansweredFilesGrid({ files }: { files: UnansweredFile[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const categories = useMemo(() => ["all", ...Array.from(new Set(files.map((file) => file.category)))], [files]);
  const statuses = useMemo(() => ["all", ...Array.from(new Set(files.map((file) => file.status)))], [files]);

  const filteredFiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return files.filter((file) => {
      const haystack = [
        file.title,
        file.location,
        file.year,
        file.peopleAffected,
        file.mainIssue,
        file.governmentResponse,
        file.unansweredQuestion,
        file.category,
        file.status,
        file.keywords.join(" ")
      ]
        .join(" ")
        .toLowerCase();

      return (
        (category === "all" || file.category === category) &&
        (status === "all" || file.status === status) &&
        (!normalizedQuery || haystack.includes(normalizedQuery))
      );
    });
  }, [category, files, query, status]);

  return (
    <div id="cases" className="rounded-[2rem] border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_230px_230px]">
        <label className="relative block">
          <span className="sr-only">Search India&apos;s Unanswered Files</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-royal/70" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search cases, locations, issues, or questions"
            className="min-h-14 w-full rounded-2xl border border-line bg-paper py-3 pl-11 pr-4 text-sm font-semibold text-ink outline-none placeholder:text-ink/35 focus:border-royal/50"
          />
        </label>
        <FilterSelect label="Filter by category" value={category} onChange={setCategory} options={categories} allLabel="All categories" />
        <FilterSelect label="Filter by status" value={status} onChange={setStatus} options={statuses} allLabel="All statuses" />
      </div>

      <p className="mt-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-ink/45">
        Showing {filteredFiles.length} of {files.length} source-backed files
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {filteredFiles.map((file) => (
          <article
            key={file.slug}
            className="group overflow-hidden rounded-[2rem] border border-line bg-paper shadow-card transition hover:-translate-y-1 hover:border-royal/30 hover:shadow-soft"
          >
            <UnansweredFileVisual file={file} imageClassName="transition duration-500 group-hover:scale-[1.03]" />
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <UnansweredStatusBadge status={file.status} />
                <span className="rounded-full bg-white px-3 py-1 font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-ink/55 ring-1 ring-line">
                  {file.category}
                </span>
              </div>
              <h3 className="mt-5 font-display text-3xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
                {file.title}
              </h3>
              <p className="mt-3 text-base font-semibold leading-8 text-ink/70">{file.summary}</p>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <FactLine icon={<MapPin className="h-4 w-4" />} label="Location" value={`${file.location} / ${file.year}`} />
                <FactLine icon={<UsersRound className="h-4 w-4" />} label="People affected" value={file.peopleAffected} />
                <FactLine icon={<FileText className="h-4 w-4" />} label="Main issue" value={file.mainIssue} />
                <FactLine icon={<HelpCircle className="h-4 w-4" />} label="Unanswered question" value={file.unansweredQuestion} />
              </div>

              <div className="mt-5 rounded-2xl border border-line bg-white p-4">
                <p className="font-mono text-[0.66rem] font-black uppercase tracking-[0.16em] text-royal">
                  Government response
                </p>
                <p className="mt-2 text-sm leading-7 text-ink/68">{file.governmentResponse}</p>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-white px-3 py-1 font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-ink/55 ring-1 ring-line">
                  {file.sourceCount} sources
                </span>
                <Link
                  href={`/unanswered-files/${file.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-royal"
                >
                  Read full investigation <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  allLabel: string;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-14 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-ink outline-none focus:border-royal/50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? allLabel : option}
          </option>
        ))}
      </select>
    </label>
  );
}

function FactLine({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="inline-flex items-center gap-2 font-mono text-[0.64rem] font-black uppercase tracking-[0.16em] text-royal">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-ink/68">{value}</p>
    </div>
  );
}
