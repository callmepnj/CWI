"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, Copy, ExternalLink, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardLabel } from "@/components/ui/card";
import { site } from "@/lib/site";

export function SupportPaymentPanel() {
  const [amount, setAmount] = useState("250");
  const [copied, setCopied] = useState(false);
  const upiId = site.supportUpiId.trim();
  const hasUpi = upiId.length > 0;
  const upiUrl = useMemo(() => {
    if (!hasUpi) return "";

    const params = new URLSearchParams({
      pa: upiId,
      pn: site.supportUpiName,
      cu: "INR"
    });
    const normalizedAmount = Number(amount);
    if (Number.isFinite(normalizedAmount) && normalizedAmount > 0) {
      params.set("am", normalizedAmount.toFixed(2));
    }

    return `upi://pay?${params.toString()}`;
  }, [amount, hasUpi, upiId]);

  async function copyUpiId() {
    if (!hasUpi) return;
    await navigator.clipboard.writeText(upiId).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Card className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <CardLabel>UPI support</CardLabel>
        <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
          Support independent civic documentation
        </h2>
        <p className="mt-4 leading-8 text-ink/70">
          Reader support helps CWI maintain source archives, image hosting, reporting tools, corrections work, and public-interest research. Support never buys coverage, influence, article priority, or editorial access.
        </p>

        <div className="mt-6 grid gap-3 rounded-3xl border border-line bg-paper p-4">
          <label className="grid gap-2">
            <span className="font-mono text-xs font-black uppercase tracking-[0.14em] text-ink/55">Amount in INR</span>
            <Input
              value={amount}
              onChange={(event) => setAmount(event.target.value.replace(/[^0-9.]/g, ""))}
              inputMode="decimal"
              placeholder="250"
              aria-label="Support amount in rupees"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {["100", "250", "500", "1000"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(value)}
                className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-ink ring-1 ring-line transition hover:bg-skywash hover:text-royal"
              >
                Rs {value}
              </button>
            ))}
          </div>
        </div>

        {hasUpi ? (
          <div className="mt-6 grid gap-3">
            <p className="rounded-2xl border border-line bg-white p-4 font-mono text-sm font-black uppercase tracking-[0.1em] text-ink">
              UPI ID: {upiId}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={copyUpiId} variant="outline">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy UPI ID"}
              </Button>
              <Button asChild>
                <a href={upiUrl} aria-label="Open UPI payment app for CWI support">
                  <ExternalLink className="h-4 w-4" />
                  Open UPI App
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-warning/25 bg-warning/10 p-5 text-sm font-bold leading-6 text-ink/78">
            UPI is not configured for this deployment. Set <code>NEXT_PUBLIC_CWI_UPI_ID</code> and, optionally, <code>NEXT_PUBLIC_CWI_UPI_QR_PATH</code> before promoting the Support page.
          </div>
        )}
      </div>

      <div className="grid place-items-center rounded-3xl border border-line bg-paper p-6">
        {site.supportQrPath ? (
          <Image
            src={site.supportQrPath}
            alt="CWI UPI payment QR code"
            width={360}
            height={360}
            className="rounded-3xl border border-line bg-white p-3 shadow-card"
          />
        ) : (
          <div className="grid min-h-80 w-full place-items-center rounded-3xl border border-dashed border-royal/30 bg-white p-8 text-center">
            <div>
              <QrCode className="mx-auto h-14 w-14 text-royal" />
              <p className="mt-4 font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">QR code slot</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-ink/62">
                Add a verified QR image path through <code>NEXT_PUBLIC_CWI_UPI_QR_PATH</code>. The UPI deeplink above works when the UPI ID is configured.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
