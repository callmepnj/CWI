import { ExternalLink } from "lucide-react";
import type { Source } from "@/data/live-newsroom";

const typeStyles: Record<string, string> = {
  Official: "bg-cwi-green/10 text-cwi-green border-cwi-green/25",
  "Court/legal": "bg-cwi-cream text-cwi-brown border-cwi-brown/20",
  "Established media": "bg-cwi-saffron/12 text-cwi-brown border-cwi-saffron/35",
  "Fact-check": "bg-cwi-green/10 text-cwi-green border-cwi-green/25",
  "Public statement": "bg-cwi-cream text-cwi-brown border-cwi-brown/20",
  "Social post": "bg-cwi-cream text-cwi-brown border-cwi-brown/20",
  "User-submitted": "bg-cwi-cream text-cwi-brown border-cwi-brown/20",
  Unverified: "bg-white text-cwi-brown border-cwi-brown/20"
};

export function SourceLedger({ sources }: { sources: Source[] }) {
  if (sources.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-cwi-brown/20 bg-cwi-cream/50 p-8 text-sm font-semibold text-cwi-ink/58">
        No sources are published in the ledger yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border-2 border-cwi-brown/15 bg-white shadow-sm">
      <div className="hidden grid-cols-[1.1fr_0.65fr_1fr_1fr_0.7fr] gap-4 border-b border-cwi-border bg-cwi-cream px-4 py-3 text-[0.68rem] font-black uppercase tracking-wide text-cwi-ink/52 lg:grid">
        <span>Source</span>
        <span>Type</span>
        <span>What it supports</span>
        <span>What it does not prove</span>
        <span>Last used</span>
      </div>
      <div className="divide-y divide-cwi-border/70">
        {sources.map((source) => (
          <div key={source.id} className="grid gap-4 p-4 lg:grid-cols-[1.1fr_0.65fr_1fr_1fr_0.7fr] lg:items-start">
            <div>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-1.5 font-display text-base font-black leading-snug text-cwi-ink hover:text-cwi-green"
              >
                {source.name}
                <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0" />
              </a>
              {source.usedIn ? <p className="mt-1 text-xs font-semibold text-cwi-ink/52">Used in: {source.usedIn}</p> : null}
            </div>
            <div>
              <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-black uppercase tracking-wide ${typeStyles[source.type] ?? typeStyles.Unverified}`}>
                {source.type}
              </span>
            </div>
            <LedgerCell label="What it supports" value={source.supports || source.usedFor?.join(", ") || "Source context logged."} />
            <LedgerCell label="What it does not prove" value={source.doesNotProve || "No limits recorded."} />
            <div>
              <div className="mb-1 text-[0.68rem] font-black uppercase tracking-wide text-cwi-ink/45 lg:hidden">Last used</div>
              <p className="text-sm font-semibold text-cwi-ink/64">{source.lastUsedAt ? formatDate(source.lastUsedAt) : "Not dated"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LedgerCell({ label, value }: { label: string; value: string }) {
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
    year: "numeric",
    timeZone: "Asia/Kolkata"
  }).format(new Date(value));
}
