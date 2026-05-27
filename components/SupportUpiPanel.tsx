"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CheckCircle, Copy, CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const amountOptions = [
  { label: "INR 49", value: "49", note: "Keeps small updates moving." },
  { label: "INR 99", value: "99", note: "Helps cover tools, hosting, and basic research time." },
  { label: "INR 199", value: "199", note: "Supports source tracking and newsroom maintenance." },
  { label: "INR 499", value: "499", note: "Helps improve Live Newsroom, archive work, and public advisories." },
  { label: "Custom", value: "custom", note: "Support any amount you are comfortable with." }
];

export function SupportUpiPanel({
  upiId,
  payeeName,
  qrAvailable,
  qrPath
}: {
  upiId: string;
  payeeName: string;
  qrAvailable: boolean;
  qrPath: string;
}) {
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const upiReady = Boolean(upiId && payeeName);
  const activeAmount = selectedAmount === "custom" ? customAmount.trim() : selectedAmount;
  const amountIsValid = !activeAmount || (/^\d+(\.\d{1,2})?$/.test(activeAmount) && Number(activeAmount) >= 1);
  const upiLink = useMemo(() => {
    if (!upiReady) return "";
    const params = new URLSearchParams({
      pa: upiId,
      pn: payeeName,
      cu: "INR"
    });
    if (activeAmount && amountIsValid) {
      params.set("am", activeAmount);
    }
    return `upi://pay?${params.toString()}`;
  }, [activeAmount, amountIsValid, payeeName, upiId, upiReady]);

  async function copyUpiId() {
    if (!upiReady) return;
    await navigator.clipboard.writeText(upiId).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function openUpiApp() {
    if (!upiReady || !amountIsValid || !upiLink) return;
    window.location.href = upiLink;
  }

  return (
    <div className="grid gap-5">
      <section id="upi" className="rounded-[1.5rem] border border-[#CAD8C7] bg-white p-5 shadow-card">
        <div className="flex items-start justify-between gap-4 border-b border-[#E2E8D9] pb-4">
          <div>
            <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#1E6B4A]">Voluntary reader support</p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">Support through UPI</h2>
          </div>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#E9F4E8] text-[#1E6B4A]">
            <CreditCard className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-[180px_1fr]">
          <div className="grid min-h-[180px] place-items-center rounded-2xl border border-dashed border-[#B9C9B5] bg-[#F6F2E8] p-4">
            {qrAvailable ? (
              <Image src={qrPath} alt="CWI UPI QR code" width={160} height={160} className="h-40 w-40 rounded-xl object-contain" />
            ) : (
              <div className="grid h-40 w-40 place-items-center rounded-xl border border-[#D9CFAE] bg-white text-center">
                <p className="px-4 text-sm font-black uppercase leading-5 tracking-[0.08em] text-ink/54">QR code coming soon</p>
              </div>
            )}
          </div>

          <div className="grid gap-4">
            {upiReady ? (
              <>
                <div className="rounded-2xl border border-[#E2E8D9] bg-[#FAF7EF] p-4">
                  <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-ink/48">UPI ID</p>
                  <p className="mt-1 break-all text-lg font-black text-ink">{upiId}</p>
                </div>
                <div className="rounded-2xl border border-[#E2E8D9] bg-[#FAF7EF] p-4">
                  <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-ink/48">Payee name</p>
                  <p className="mt-1 text-lg font-black text-ink">{payeeName}</p>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-[#D9CFAE] bg-[#FFF7D6] p-4">
                <p className="font-bold leading-7 text-[#6D4B00]">UPI details will be added soon.</p>
              </div>
            )}

            {selectedAmount === "custom" ? (
              <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-ink/62">
                Custom amount
                <input
                  inputMode="decimal"
                  value={customAmount}
                  onChange={(event) => setCustomAmount(event.target.value)}
                  placeholder="Enter amount in INR"
                  className="rounded-2xl border border-[#CAD8C7] bg-white px-4 py-3 text-base font-bold normal-case tracking-normal outline-none focus:border-[#1E6B4A]"
                />
                {!amountIsValid ? <span className="text-xs font-bold normal-case tracking-normal text-urgent">Enter a numeric amount of INR 1 or more.</span> : null}
              </label>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button type="button" disabled={!upiReady} onClick={copyUpiId} className="bg-[#1E6B4A] hover:bg-[#16563B]">
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "UPI ID copied" : "Copy UPI ID"}
              </Button>
              <Button type="button" disabled={!upiReady || !amountIsValid} onClick={openUpiApp} variant="outline">
                <ExternalLink className="h-4 w-4" />
                Open UPI App
              </Button>
            </div>
            <p className="text-sm font-semibold leading-6 text-ink/60">Please double-check the UPI name before sending support.</p>
          </div>
        </div>
      </section>

      <section id="amounts" className="rounded-[1.5rem] border border-[#CAD8C7] bg-white p-5 shadow-card">
        <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">Choose what feels right</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-ink/62">These are suggestions only. The site does not process payments.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {amountOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedAmount(option.value)}
              className={`rounded-2xl border p-4 text-left transition ${
                selectedAmount === option.value
                  ? "border-[#1E6B4A] bg-[#E9F4E8] shadow-card"
                  : "border-[#E2E8D9] bg-[#FAF7EF] hover:border-[#1E6B4A]/50"
              }`}
            >
              <span className="font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">{option.label}</span>
              <span className="mt-2 block text-sm font-semibold leading-6 text-ink/64">{option.note}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
