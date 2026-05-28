"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, Copy, ExternalLink, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardLabel } from "@/components/ui/card";
import { site } from "@/lib/site";

export function SupportPaymentPanel({ qrPath }: { qrPath?: string }) {
  const [amount, setAmount] = useState("250");
  const [copied, setCopied] = useState(false);
  const upiId = site.supportUpiId.trim();
  const payeeName = site.supportUpiName.trim() || "Cockroach Watch India";
  const supportQrPath = qrPath || site.supportQrPath.trim();
  const hasUpi = upiId.length > 0;
  const upiUrl = useMemo(() => {
    if (!hasUpi) return "";

    const params = new URLSearchParams({
      pa: upiId,
      pn: payeeName,
      cu: "INR"
    });
    const normalizedAmount = Number(amount);
    if (Number.isFinite(normalizedAmount) && normalizedAmount > 0) {
      params.set("am", normalizedAmount.toFixed(2));
    }

    return `upi://pay?${params.toString()}`;
  }, [amount, hasUpi, payeeName, upiId]);

  async function copyUpiId() {
    if (!hasUpi) return;
    await navigator.clipboard.writeText(upiId).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Card className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <CardLabel>QR card</CardLabel>
        <h2 className="font-display text-4xl font-black uppercase leading-tight text-cwi-ink">Voluntary reader support</h2>
        <p className="mt-4 leading-8 text-cwi-ink/70">
          Support keeps CWI online. It does not buy coverage, influence, or membership.
        </p>

        <div className="mt-6 grid gap-3 rounded-lg border border-cwi-brown/18 bg-cwi-cream p-4">
          <label className="grid gap-2">
            <span className="font-mono text-xs font-black uppercase tracking-[0.14em] text-cwi-brown/70">Amount in INR</span>
            <Input value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^0-9.]/g, ""))} inputMode="decimal" placeholder="250" aria-label="Support amount in rupees" />
          </label>
          <div className="flex flex-wrap gap-2">
            {["100", "250", "500", "1000"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(value)}
                className="rounded-full border border-cwi-brown/18 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-cwi-ink transition hover:border-cwi-green/40 hover:text-cwi-green"
              >
                Rs {value}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <p className="rounded-lg border border-cwi-brown/18 bg-white p-4 font-mono text-sm font-black uppercase tracking-[0.1em] text-cwi-ink">
            UPI ID: {hasUpi ? upiId : "UPI details will be added soon."}
          </p>
          <p className="rounded-lg border border-cwi-brown/18 bg-white p-4 font-mono text-sm font-black uppercase tracking-[0.1em] text-cwi-ink">
            Payee name: {payeeName}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={copyUpiId} variant="outline" disabled={!hasUpi}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy UPI ID"}
            </Button>
            <Button asChild={hasUpi} disabled={!hasUpi}>
              {hasUpi ? (
                <a href={upiUrl} aria-label="Open UPI payment app for CWI support">
                  <ExternalLink className="h-4 w-4" />
                  Open UPI App
                </a>
              ) : (
                <span>Open UPI App</span>
              )}
            </Button>
          </div>
          {!hasUpi ? (
            <p className="rounded-lg border border-cwi-saffron/25 bg-cwi-saffron/10 p-4 text-sm font-bold leading-6 text-cwi-ink/78">
              UPI details will be added soon.
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid place-items-center rounded-lg border border-cwi-brown/18 bg-cwi-cream p-6">
        {supportQrPath ? (
          <Image src={supportQrPath} alt="CWI support UPI QR code for voluntary reader support" width={360} height={360} className="rounded-lg border border-cwi-brown/18 bg-white p-3 shadow-[0_14px_36px_rgba(29,18,10,0.08)]" />
        ) : (
          <div className="grid min-h-80 w-full place-items-center rounded-lg border border-dashed border-cwi-green/30 bg-white p-8 text-center">
            <div>
              <QrCode className="mx-auto h-14 w-14 text-cwi-green" />
              <p className="mt-4 font-display text-2xl font-black uppercase text-cwi-ink">QR code will be added soon.</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-cwi-ink/62">CWI will show only a verified support QR on this page.</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}