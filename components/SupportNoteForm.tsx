"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

export function SupportNoteForm() {
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [comment, setComment] = useState("");
  const [amountDisplayMode, setAmountDisplayMode] = useState("hidden");
  const [amount, setAmount] = useState("");
  const [consentToDisplay, setConsentToDisplay] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<SubmitState>({ type: "idle", message: "" });

  const amountError = useMemo(() => {
    const trimmed = amount.trim();
    if (!trimmed) return "";
    if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return "Enter a numeric amount.";
    if (Number(trimmed) < 1) return "Amount must be ₹1 or more.";
    return "";
  }, [amount]);

  async function submitNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ type: "idle", message: "" });

    if (amountError) {
      setState({ type: "error", message: amountError });
      return;
    }

    if (!consentToDisplay || !confirmation) {
      setState({ type: "error", message: "Please confirm both consent boxes before submitting a public note." });
      return;
    }

    setPending(true);
    const response = await fetch("/api/supporter-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName,
        handle,
        amount,
        amountDisplayMode,
        comment,
        consentToDisplay,
        confirmation
      })
    }).catch(() => null);
    const json = await response?.json().catch(() => null);
    setPending(false);

    if (!response?.ok || !json?.ok) {
      setState({ type: "error", message: json?.error ?? "Supporter note could not be submitted." });
      return;
    }

    setDisplayName("");
    setHandle("");
    setComment("");
    setAmount("");
    setAmountDisplayMode("hidden");
    setConsentToDisplay(false);
    setConfirmation(false);
    setState({
      type: "success",
      message: json.message ?? "Supporter note submitted for review."
    });
  }

  return (
    <form className="grid gap-4 rounded-[1.5rem] border border-[#DED6C7] bg-white p-5 shadow-card" onSubmit={submitNote}>
      <div>
        <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#1E6B4A]">Optional public note</p>
        <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">Share a note after supporting</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-ink/64">
          If you supported CWI and want to leave a public note, submit it for review. Payment is not verified by this form.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-ink/62">
          Display name or handle
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            maxLength={80}
            placeholder="CWI Supporter"
            className="rounded-2xl border border-[#CAD8C7] bg-[#FAF7EF] px-4 py-3 text-base font-bold normal-case tracking-normal outline-none focus:border-[#1E6B4A]"
          />
        </label>
        <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-ink/62">
          Handle
          <input
            value={handle}
            onChange={(event) => setHandle(event.target.value)}
            maxLength={80}
            placeholder="@handle"
            className="rounded-2xl border border-[#CAD8C7] bg-[#FAF7EF] px-4 py-3 text-base font-bold normal-case tracking-normal outline-none focus:border-[#1E6B4A]"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-ink/62">
        Comment
        <textarea
          required
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={320}
          placeholder="Keep it short, clean, and public-safe."
          className="min-h-28 rounded-2xl border border-[#CAD8C7] bg-[#FAF7EF] px-4 py-3 text-base font-bold normal-case tracking-normal outline-none focus:border-[#1E6B4A]"
        />
        <span className="text-right text-xs font-bold normal-case tracking-normal text-ink/48">{comment.length}/320</span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-ink/62">
          Amount display preference
          <select
            value={amountDisplayMode}
            onChange={(event) => setAmountDisplayMode(event.target.value)}
            className="rounded-2xl border border-[#CAD8C7] bg-[#FAF7EF] px-4 py-3 text-base font-bold normal-case tracking-normal outline-none focus:border-[#1E6B4A]"
          >
            <option value="hidden">Hide amount</option>
            <option value="range">Show range</option>
            <option value="exact">Show exact amount</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-ink/62">
          Optional amount
          <input
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Optional INR amount"
            className="rounded-2xl border border-[#CAD8C7] bg-[#FAF7EF] px-4 py-3 text-base font-bold normal-case tracking-normal outline-none focus:border-[#1E6B4A]"
          />
          {amountError ? <span className="text-xs font-bold normal-case tracking-normal text-urgent">{amountError}</span> : null}
        </label>
      </div>

      <div className="grid gap-3 rounded-2xl border border-[#D9CFAE] bg-[#FFF7D6] p-4">
        <label className="flex items-start gap-3 text-sm font-bold leading-6 text-ink/72">
          <input className="mt-1" type="checkbox" checked={consentToDisplay} onChange={(event) => setConsentToDisplay(event.target.checked)} />
          <span>I allow CWI to display this note publicly after review.</span>
        </label>
        <label className="flex items-start gap-3 text-sm font-bold leading-6 text-ink/72">
          <input className="mt-1" type="checkbox" checked={confirmation} onChange={(event) => setConfirmation(event.target.checked)} />
          <span>I understand this does not create membership, coverage, or editorial influence.</span>
        </label>
      </div>

      {state.message ? (
        <p className={`rounded-2xl p-4 text-sm font-bold leading-6 ${state.type === "success" ? "bg-[#E9F4E8] text-[#1E6B4A]" : "bg-urgent/10 text-urgent"}`}>
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending || Boolean(amountError)} className="bg-[#1E6B4A] hover:bg-[#16563B]">
        {state.type === "success" ? <CheckCircle className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        {pending ? "Submitting..." : "Submit note for review"}
      </Button>
    </form>
  );
}
