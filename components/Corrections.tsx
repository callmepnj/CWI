import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import type { Correction } from "@/data/live-newsroom";

export function Corrections({ corrections }: { corrections: Correction[] }) {
  const publishedCorrections = corrections
    .filter((correction) => correction.status === "published")
    .sort((a, b) => new Date(b.correctionDate).getTime() - new Date(a.correctionDate).getTime());
  const latest = publishedCorrections[0];

  if (!latest) {
    return (
      <div className="rounded-lg border-2 border-cwi-brown/15 bg-white/78 p-6 shadow-sm">
        <p className="font-display text-xl font-black text-cwi-ink">No public corrections have been logged yet.</p>
        <p className="mt-2 text-sm leading-6 text-cwi-ink/68">
          If something changes, the record should change too. Corrections remain open through CWI Submit.
        </p>
        <Link href="/submit" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-cwi-green hover:underline">
          Send source or correction <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <article className="rounded-lg border-2 border-cwi-saffron/35 bg-white p-6 shadow-sm">
      <div className="flex gap-4">
        <div className="rounded-full bg-cwi-saffron/14 p-2 text-cwi-brown">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-black uppercase tracking-wide text-cwi-brown">Latest correction</div>
          <h3 className="mt-1 font-display text-xl font-black text-cwi-ink">{latest.itemTitle}</h3>
          <p className="mt-1 text-xs font-semibold text-cwi-ink/52">{formatDate(latest.correctionDate)}</p>
          <div className="mt-4 rounded-md border border-cwi-brown/10 bg-cwi-cream/70 p-4">
            <div className="text-xs font-black uppercase tracking-wide text-cwi-brown">What changed</div>
            <p className="mt-1 text-sm leading-6 text-cwi-ink/74">{latest.whatChanged}</p>
          </div>
          <Link href="/corrections" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-cwi-green hover:underline">
            View correction log <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata"
  }).format(new Date(value));
}
