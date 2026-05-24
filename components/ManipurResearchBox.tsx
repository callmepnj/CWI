"use client";

import { BrainCircuit, SendHorizontal } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { getManipurSources, type ManipurResearchAnswer } from "@/data/manipur";

export function ManipurResearchBox({ answers }: { answers: ManipurResearchAnswer[] }) {
  const [prompt, setPrompt] = useState(answers[0]?.question ?? "");
  const [activeQuestion, setActiveQuestion] = useState(answers[0]?.question ?? "");

  const activeAnswer = useMemo(() => {
    const normalized = activeQuestion.toLowerCase();

    return (
      answers.find((answer) => answer.question === activeQuestion) ??
      answers.find((answer) => answer.keywords.some((keyword) => normalized.includes(keyword))) ??
      null
    );
  }, [activeQuestion, answers]);

  const citations = activeAnswer ? getManipurSources(activeAnswer.sourceIds) : [];

  function submitPrompt(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedPrompt = prompt.trim().toLowerCase();
    const matchedAnswer = answers.find((answer) =>
      [answer.question, ...answer.keywords].some((keyword) => normalizedPrompt.includes(keyword.toLowerCase()))
    );
    setActiveQuestion(matchedAnswer?.question ?? prompt.trim());
  }

  return (
    <div className="rounded-[2rem] border border-sky-300/20 bg-[#071225] p-5 shadow-[0_24px_90px_rgba(14,165,233,0.14)] sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-400/[0.12] text-sky-200 ring-1 ring-sky-300/20">
          <BrainCircuit className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-2xl font-black uppercase leading-none tracking-[-0.04em] text-white">
            CWI AI Research Box
          </h3>
          <p className="mt-1 text-sm font-semibold text-white/50">
            Source-bound answers only. No speculation, no private data, no propaganda.
          </p>
        </div>
      </div>

      <form onSubmit={submitPrompt} className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label className="block">
          <span className="sr-only">Ask a source-bound Manipur research question</span>
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask from the verified source archive"
            className="min-h-14 w-full rounded-2xl border border-white/10 bg-[#040914] px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-white/40 focus:border-sky-300/60"
          />
        </label>
        <button
          type="submit"
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-sky-400 px-5 text-xs font-black uppercase tracking-[0.14em] text-[#061326] transition hover:bg-amber-200"
        >
          Ask <SendHorizontal className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {answers.map((answer) => (
          <button
            key={answer.question}
            type="button"
            onClick={() => {
              setPrompt(answer.question);
              setActiveQuestion(answer.question);
            }}
            className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-2 text-left text-[0.68rem] font-black uppercase tracking-[0.1em] text-white/60 transition hover:border-sky-300/50 hover:text-sky-100"
          >
            {answer.question}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5">
        {activeAnswer ? (
          <>
            <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-amber-100">
              Source-bound answer
            </p>
            <h4 className="mt-3 font-display text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
              {activeAnswer.question}
            </h4>
            <p className="mt-3 text-base leading-8 text-white/70">{activeAnswer.answer}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {citations.map((source) => (
                <a
                  key={source.id}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white/[0.08] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-sky-100 ring-1 ring-white/10 hover:bg-white/[0.12]"
                >
                  {source.publisher}
                </a>
              ))}
            </div>
          </>
        ) : (
          <p className="text-base leading-8 text-white/70">
            CWI can only answer from the verified source archive on this page. Choose one of the listed questions or search the archive for more context.
          </p>
        )}
      </div>
    </div>
  );
}
