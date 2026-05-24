"use client";

import { BrainCircuit, SendHorizontal } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import type { UnansweredFile } from "@/data/unanswered-files";
import { getFileSources } from "@/data/unanswered-files";

export function UnansweredResearchBox({
  files,
  initialSlug
}: {
  files: UnansweredFile[];
  initialSlug?: string;
}) {
  const firstSlug = initialSlug ?? files[0]?.slug ?? "";
  const [selectedSlug, setSelectedSlug] = useState(firstSlug);
  const selectedFile = useMemo(
    () => files.find((file) => file.slug === selectedSlug) ?? files[0],
    [files, selectedSlug]
  );
  const [prompt, setPrompt] = useState(selectedFile?.aiAnswers[0]?.question ?? "");
  const [activeQuestion, setActiveQuestion] = useState(selectedFile?.aiAnswers[0]?.question ?? "");

  const activeAnswer = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    const normalized = activeQuestion.toLowerCase();

    return (
      selectedFile.aiAnswers.find((answer) => answer.question === activeQuestion) ??
      selectedFile.aiAnswers.find((answer) => normalized.includes(answer.question.toLowerCase().replace("?", ""))) ??
      null
    );
  }, [activeQuestion, selectedFile]);

  const citations = selectedFile && activeAnswer ? getFileSources(selectedFile, activeAnswer.sourceIndex) : [];

  function selectFile(slug: string) {
    const nextFile = files.find((file) => file.slug === slug);
    setSelectedSlug(slug);
    setPrompt(nextFile?.aiAnswers[0]?.question ?? "");
    setActiveQuestion(nextFile?.aiAnswers[0]?.question ?? "");
  }

  function submitPrompt(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) {
      return;
    }

    const normalizedPrompt = prompt.trim().toLowerCase();
    const matchedAnswer = selectedFile.aiAnswers.find((answer) => {
      const question = answer.question.toLowerCase().replace("?", "");
      const keywords = question.split(/\W+/).filter((word) => word.length > 3);

      return normalizedPrompt.includes(question) || keywords.some((word) => normalizedPrompt.includes(word));
    });
    setActiveQuestion(matchedAnswer?.question ?? prompt.trim());
  }

  if (!selectedFile) {
    return null;
  }

  return (
    <div id="ai" className="rounded-[2rem] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-skywash text-royal ring-1 ring-royal/15">
            <BrainCircuit className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-2xl font-black uppercase leading-none tracking-[-0.04em] text-ink">
              CWI AI Research Box
            </h3>
            <p className="mt-1 text-sm font-semibold text-ink/58">
              Source-bound answers only. No speculation, no private data, no propaganda.
            </p>
          </div>
        </div>
        <label className="block min-w-0 lg:w-80">
          <span className="sr-only">Select case file for CWI AI research</span>
          <select
            value={selectedFile.slug}
            onChange={(event) => selectFile(event.target.value)}
            className="min-h-12 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-ink outline-none focus:border-royal/50"
          >
            {files.map((file) => (
              <option key={file.slug} value={file.slug}>
                {file.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <form onSubmit={submitPrompt} className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label className="block">
          <span className="sr-only">Ask a source-bound research question</span>
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask from the verified source archive"
            className="min-h-14 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm font-semibold text-ink outline-none placeholder:text-ink/35 focus:border-royal/50"
          />
        </label>
        <button
          type="submit"
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-ink px-5 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-royal"
        >
          Ask <SendHorizontal className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {selectedFile.aiAnswers.map((answer) => (
          <button
            key={answer.question}
            type="button"
            onClick={() => {
              setPrompt(answer.question);
              setActiveQuestion(answer.question);
            }}
            className="rounded-full border border-line bg-paper px-3 py-2 text-left text-[0.68rem] font-black uppercase tracking-[0.1em] text-ink/58 transition hover:border-royal/35 hover:bg-skywash hover:text-royal"
          >
            {answer.question}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-royal/15 bg-skywash p-5">
        {activeAnswer ? (
          <>
            <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-royal">
              Source-bound answer / {selectedFile.title}
            </p>
            <h4 className="mt-3 font-display text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
              {activeAnswer.question}
            </h4>
            <p className="mt-3 text-base leading-8 text-ink/72">{activeAnswer.answer}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {citations.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-royal ring-1 ring-line hover:bg-paper"
                >
                  {source.publisher}
                </a>
              ))}
            </div>
          </>
        ) : (
          <p className="text-base leading-8 text-ink/72">
            CWI can only answer from the verified source archive for this case. Choose one of the listed questions or search the archive for more context.
          </p>
        )}
      </div>
    </div>
  );
}
