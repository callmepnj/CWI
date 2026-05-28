import Link from "next/link";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { PublicAdvisory } from "@/data/live-newsroom";

const advisoryIcons = {
  "Verify before sharing": CheckCircle2,
  "Screenshot context": Info,
  "Suspicious link warning": AlertTriangle,
  "Creator credit notice": Info,
  "Platform restriction update": Info,
  "Correction notice": AlertTriangle
};

export function PublicAdvisoryBoard({ advisories }: { advisories: PublicAdvisory[] }) {
  if (advisories.length === 0) {
    return (
      <div className="rounded-lg border border-cwi-brown/15 bg-white/75 p-8 text-sm font-semibold text-cwi-ink/58">
        No public advisories are approved for publication right now.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {advisories.map((advisory) => {
        const Icon = advisoryIcons[advisory.type] ?? Info;
        return (
          <article key={advisory.id} className="relative overflow-hidden rounded-lg border-2 border-cwi-saffron/35 bg-white p-5 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-cwi-saffron" />
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="rounded-full bg-cwi-saffron/14 p-2 text-cwi-brown">
                <Icon className="h-5 w-5" />
              </div>
              <span className="rounded-full border border-cwi-brown/15 bg-cwi-cream px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-wide text-cwi-brown">
                {advisory.type}
              </span>
            </div>
            <h3 className="font-display text-xl font-black leading-tight text-cwi-ink">{advisory.title}</h3>
            <p className="mt-3 text-sm leading-6 text-cwi-ink/72">{advisory.warning}</p>
            <div className="mt-4 rounded-md border border-cwi-brown/10 bg-cwi-cream/80 p-4">
              <div className="text-xs font-black uppercase tracking-wide text-cwi-brown">What readers should do</div>
              <p className="mt-1 text-sm leading-6 text-cwi-ink/76">{advisory.whatToRead}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-cwi-border pt-4">
              <span className="text-xs font-semibold text-cwi-ink/52">Updated {formatDate(advisory.lastUpdatedAt)}</span>
              {advisory.relatedLink ? (
                <Link href={advisory.relatedLink} className="text-sm font-black text-cwi-green hover:underline">
                  {advisory.relatedLinkText ?? "Open advisory"}
                </Link>
              ) : null}
            </div>
          </article>
        );
      })}
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
