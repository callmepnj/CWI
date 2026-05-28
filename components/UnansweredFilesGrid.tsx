"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CwiDossierCard } from "@/components/CwiDesignSystem";
import { inputClass } from "@/components/ui/input";
import type { UnansweredFile } from "@/data/unanswered-files";

const filesPerPage = 6;
const unansweredFilesPath = "/india-unanswered-files";

export function UnansweredFilesGrid({ files }: { files: UnansweredFile[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const categories = useMemo(() => ["all", ...Array.from(new Set(files.map((file) => file.category)))], [files]);

  const filteredFiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return files.filter((file) => {
      const haystack = [file.title, file.location, file.year, file.peopleAffected, file.mainIssue, file.unansweredQuestion, file.category, file.status, file.keywords.join(" ")]
        .join(" ")
        .toLowerCase();
      return (category === "all" || file.category === category) && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [category, files, query]);

  const pageCount = Math.max(1, Math.ceil(filteredFiles.length / filesPerPage));
  const currentPage = Math.min(page, pageCount);
  const visibleFiles = filteredFiles.slice((currentPage - 1) * filesPerPage, currentPage * filesPerPage);

  function updateCategory(value: string) {
    setCategory(value);
    setPage(1);
  }

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  return (
    <div id="cases" className="rounded-lg border border-cwi-brown/18 bg-white/78 p-4 shadow-[0_16px_44px_rgba(29,18,10,0.08)] sm:p-6">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
        <label className="relative block">
          <span className="sr-only">Search India Unanswered Files</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cwi-green" />
          <input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search files, locations, issues, or questions" className={`${inputClass} min-h-14 pl-11`} />
        </label>
        <label className="block">
          <span className="sr-only">Filter by category</span>
          <select value={category} onChange={(event) => updateCategory(event.target.value)} className={`${inputClass} min-h-14 font-black uppercase tracking-[0.08em]`}>
            {categories.map((option) => <option key={option} value={option}>{option === "all" ? "All categories" : option}</option>)}
          </select>
        </label>
      </div>

      <p className="mt-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-cwi-brown/70">
        Showing {visibleFiles.length} of {filteredFiles.length} files / page {currentPage} of {pageCount}
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visibleFiles.map((file) => (
          <CwiDossierCard
            key={file.slug}
            href={`${unansweredFilesPath}/${file.slug}`}
            title={file.title}
            question={file.unansweredQuestion || file.unansweredQuestions[0] || file.summary}
            meta={[file.category, file.status, `${file.sourceCount} sources`]}
          />
        ))}
      </div>

      {filteredFiles.length > filesPerPage ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-cwi-brown/14 bg-cwi-cream p-4">
          <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="rounded-full border border-cwi-brown/18 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-cwi-ink disabled:opacity-40">
            Previous
          </button>
          <span className="font-mono text-xs font-black uppercase tracking-[0.14em] text-cwi-brown/70">Page {currentPage} of {pageCount}</span>
          <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={currentPage === pageCount} className="rounded-full border border-cwi-brown/18 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-cwi-ink disabled:opacity-40">
            Next
          </button>
        </div>
      ) : null}

      {visibleFiles.length === 0 ? (
        <div className="mt-6 rounded-lg border border-cwi-brown/14 bg-cwi-cream p-6 text-center">
          <p className="font-display text-2xl font-black uppercase text-cwi-ink">No files found</p>
          <p className="mt-2 text-cwi-ink/65">Try a broader search term or switch back to all categories.</p>
        </div>
      ) : null}
    </div>
  );
}