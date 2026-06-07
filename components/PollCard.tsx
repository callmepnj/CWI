"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, RotateCcw, ShieldCheck } from "lucide-react";

const pollKey = "cwi-education-leadership-poll-v1";
const archiveKey = "cwi-education-leadership-poll-archived-v1";
const voteKey = "cwi-education-leadership-poll-voted-v1";

const options = [
  "Yes - India needs an education reformer",
  "No - education should stay with elected political leadership",
  "Maybe - create an independent education reform council",
  "Not sure - need more discussion"
];

const seedVotes = [42, 18, 31, 9];

type PollState = {
  votes: number[];
  selected: number | null;
  votedAt: string | null;
};

function initialState(): PollState {
  return { votes: seedVotes, selected: null, votedAt: null };
}

export function PollCard({ admin = false }: { admin?: boolean }) {
  const [state, setState] = useState<PollState>(initialState);
  const [isArchived, setIsArchived] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(pollKey);
      const voted = window.localStorage.getItem(voteKey);
      const archived = window.localStorage.getItem(archiveKey) === "true";
      setIsArchived(archived);
      if (saved) {
        const parsed = JSON.parse(saved) as PollState;
        setState({ votes: Array.isArray(parsed.votes) ? parsed.votes : seedVotes, selected: parsed.selected ?? null, votedAt: parsed.votedAt ?? voted });
      } else if (voted) {
        setState((current) => ({ ...current, votedAt: voted }));
      }
    } catch {
      setState(initialState());
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(pollKey, JSON.stringify(state));
    if (state.votedAt) window.localStorage.setItem(voteKey, state.votedAt);
    window.localStorage.setItem(archiveKey, String(isArchived));
  }, [isArchived, loaded, state]);

  const totalVotes = useMemo(() => state.votes.reduce((sum, count) => sum + count, 0), [state.votes]);
  const hasVoted = state.selected !== null || Boolean(state.votedAt);

  function vote(index: number) {
    if (hasVoted || isArchived) return;
    setState((current) => {
      const votes = current.votes.map((count, voteIndex) => voteIndex === index ? count + 1 : count);
      return { votes, selected: index, votedAt: new Date().toISOString() };
    });
  }

  function resetPoll() {
    const next = initialState();
    setState(next);
    setIsArchived(false);
    window.localStorage.removeItem(pollKey);
    window.localStorage.removeItem(voteKey);
    window.localStorage.removeItem(archiveKey);
  }

  return (
    <section className="rounded-lg border-2 border-[var(--cwi-accent-blue)]/45 bg-[var(--cwi-card)] p-5 text-[var(--cwi-text-primary)] shadow-[0_18px_50px_var(--cwi-shadow-soft)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--cwi-accent-blue)]/45 bg-[var(--cwi-accent-blue)]/10 px-3 py-1 font-mono text-xs font-black uppercase tracking-[0.16em] text-[var(--cwi-accent-blue)]">
            <BarChart3 className="h-3.5 w-3.5" /> Public poll
          </p>
          <h2 className="mt-4 text-2xl font-black leading-tight sm:text-4xl">Public Poll: What kind of Education Minister does India need?</h2>
          <p className="mt-3 leading-7 text-[var(--cwi-text-secondary)]">Should India consider education reform voices like Sonam Wangchuk for national education leadership?</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--cwi-accent-amber)]/45 bg-[var(--cwi-accent-amber)]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[var(--cwi-accent-amber)]">
          <ShieldCheck className="h-3.5 w-3.5" /> Privacy safe
        </span>
      </div>

      <div className="mt-6 grid gap-3">
        {options.map((option, index) => {
          const percent = totalVotes > 0 ? Math.round((state.votes[index] / totalVotes) * 100) : 0;
          const selected = state.selected === index;
          return (
            <button
              key={option}
              type="button"
              onClick={() => vote(index)}
              disabled={hasVoted || isArchived}
              className={`group overflow-hidden rounded-lg border p-4 text-left transition ${selected ? "border-[var(--cwi-warning-yellow)] bg-[var(--cwi-warning-yellow)]/15" : "border-[var(--cwi-border)] bg-[var(--cwi-card)] hover:border-[var(--cwi-accent-blue)]/65"} ${hasVoted || isArchived ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-[var(--cwi-text-primary)]">{option}</span>
                {hasVoted ? <span className="font-mono text-xs font-black text-[var(--cwi-accent-blue)]">{percent}%</span> : null}
              </div>
              {hasVoted ? (
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--cwi-border)]/60">
                  <div className="h-full rounded-full bg-[var(--cwi-accent-blue)]" style={{ width: `${percent}%` }} />
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm font-bold text-[var(--cwi-text-secondary)]">
        <span>{hasVoted ? `Results shown after your vote. Total votes: ${totalVotes}` : `Vote once on this device/session. Current tracked votes: ${totalVotes}`}</span>
        {state.votedAt ? <span>Vote timestamp stored locally: {new Date(state.votedAt).toLocaleString("en-IN")}</span> : null}
      </div>

      <p className="mt-4 border-t border-[var(--cwi-border)] pt-4 text-xs font-semibold leading-5 text-[var(--cwi-text-secondary)]">
        This is a public opinion poll by CWI. It is not an official government poll, election survey, endorsement, or appointment claim. CWI stores only this browser&apos;s vote timestamp locally and does not ask for personal data.
      </p>

      {admin ? (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--cwi-border)] pt-4">
          <button type="button" onClick={resetPoll} className="inline-flex items-center gap-2 rounded-md border border-[var(--cwi-border)] px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-[var(--cwi-text-primary)]">
            <RotateCcw className="h-3.5 w-3.5" /> Reset local poll
          </button>
          <button type="button" onClick={() => setIsArchived((value) => !value)} className="rounded-md border border-[var(--cwi-border)] px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-[var(--cwi-text-primary)]">
            {isArchived ? "Unarchive local poll" : "Archive local poll"}
          </button>
        </div>
      ) : null}
    </section>
  );
}

