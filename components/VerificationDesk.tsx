import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { LiveNewsroomItem } from "@/data/live-newsroom";

const statusStyles: Record<string, string> = {
  "Verified": "bg-cwi-green text-cwi-cream border-cwi-green",
  "Source-backed": "bg-cwi-green/10 text-cwi-green border-cwi-green/25",
  "Reported": "bg-white text-cwi-brown border-cwi-brown/20",
  "Developing": "bg-cwi-saffron/12 text-cwi-brown border-cwi-saffron/35",
  "Needs Source": "bg-cwi-cream text-cwi-brown border-cwi-brown/20",
  "Unverified": "bg-cwi-cream text-cwi-brown border-cwi-brown/20",
  "False/Misleading": "bg-white text-cwi-brown border-cwi-brown/25",
  "Blocked": "bg-white text-cwi-brown border-cwi-brown/25",
  "Public Advisory": "bg-cwi-saffron/12 text-cwi-brown border-cwi-saffron/35",
  "Correction": "bg-cwi-saffron/12 text-cwi-brown border-cwi-saffron/35"
};

export function VerificationDesk({ items }: { items: LiveNewsroomItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-cwi-brown/15 bg-white/75 p-8 text-sm font-semibold text-cwi-ink/58">
        No Verification Desk claims are approved for publication right now.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border-2 border-cwi-brown/15 bg-white/82 shadow-sm">
      <div className="hidden grid-cols-[1.25fr_0.7fr_1fr_1fr_1fr_0.62fr] gap-4 border-b border-cwi-border bg-cwi-cream px-4 py-3 text-[0.68rem] font-black uppercase tracking-wide text-cwi-ink/52 lg:grid">
        <span>Claim</span>
        <span>Status</span>
        <span>What CWI knows</span>
        <span>Still unclear</span>
        <span>Source gap</span>
        <span>Open note</span>
      </div>
      <div className="divide-y divide-cwi-border/70">
        {items.map((item) => (
          <article key={item.id} className="grid gap-4 p-4 lg:grid-cols-[1.25fr_0.7fr_1fr_1fr_1fr_0.62fr] lg:items-start">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cwi-green">
                <ShieldCheck className="h-4 w-4" /> Verification note
              </div>
              <h3 className="font-display text-lg font-black leading-snug text-cwi-ink">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-cwi-ink/68 lg:hidden">{item.summary}</p>
            </div>
            <div>
              <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-black uppercase tracking-wide ${statusStyles[item.status] ?? statusStyles.Reported}`}>
                {item.status}
              </span>
              <p className="mt-2 text-xs font-semibold text-cwi-ink/52">Last checked {formatDate(item.lastCheckedAt)}</p>
            </div>
            <DeskCell label="What CWI knows" value={item.whatWeKnow} />
            <DeskCell label="What CWI does not know" value={item.whatWeDontKnow} />
            <DeskCell label="Source gap" value={item.sourceGap || "No open source gap logged."} />
            <Link
              href={`/live-newsroom/${item.slug}`}
              className="inline-flex w-fit items-center gap-1 rounded-md border border-cwi-green/30 bg-cwi-green/8 px-3 py-2 text-sm font-black text-cwi-green transition hover:bg-cwi-green/12"
            >
              Open note <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

function DeskCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 text-[0.68rem] font-black uppercase tracking-wide text-cwi-ink/45 lg:hidden">{label}</div>
      <p className="text-sm leading-6 text-cwi-ink/72">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata"
  }).format(new Date(value));
}
