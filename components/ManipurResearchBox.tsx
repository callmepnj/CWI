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
    <div className="rounded-[2rem] border border-line bg-white p-5 shadow-card sm:p-6">
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

      <form onSubmit={submitPrompt} className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label className="block">
          <span className="sr-only">Ask a source-bound Manipur research question</span>
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
        {answers.map((answer) => (
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
              Source-bound answer
            </p>
            <h4 className="mt-3 font-display text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
              {activeAnswer.question}
            </h4>
            <p className="mt-3 text-base leading-8 text-ink/72">{activeAnswer.answer}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {citations.map((source) => (
                <a
                  key={source.id}
                  href={source.href}
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
            CWI can only answer from the verified source archive on this page. Choose one of the listed questions or search the archive for more context.
          </p>
        )}
      </div>
    </div>
  );
}
