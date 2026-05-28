import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LiveNewsroomItem } from "@/data/live-newsroom";

const statusStyles: Record<string, string> = {
  "Verified": "border-cwi-green/25 bg-cwi-green/10 text-cwi-green",
  "Source-backed": "border-cwi-green/25 bg-cwi-green/10 text-cwi-green",
  "Developing": "border-cwi-saffron/35 bg-cwi-saffron/12 text-cwi-brown",
  "Public Advisory": "border-cwi-saffron/45 bg-cwi-saffron/16 text-cwi-brown",
  "Needs Source": "border-cwi-brown/20 bg-cwi-cream text-cwi-brown",
  "Correction": "border-cwi-saffron/40 bg-cwi-saffron/12 text-cwi-brown",
  "Reported": "border-cwi-brown/20 bg-cwi-cream text-cwi-brown",
  "Unverified": "border-cwi-brown/20 bg-cwi-cream text-cwi-brown",
  "False/Misleading": "border-cwi-brown/25 bg-white text-cwi-brown",
  "Blocked": "border-cwi-brown/25 bg-white text-cwi-brown"
};

export function LeadStoryCard({ item }: { item: LiveNewsroomItem }) {
  return (
    <article className="relative overflow-hidden rounded-lg border-2 border-cwi-green/35 bg-cwi-cream shadow-card">
      <div className="absolute inset-x-0 top-0 h-2 bg-cwi-saffron" />
      <div className="absolute right-6 top-8 hidden select-none font-display text-7xl font-black uppercase text-cwi-green/[0.055] sm:block">
        CWI
      </div>

      <div className={`grid gap-0 ${item.displayImage ? "lg:grid-cols-[0.92fr_1.08fr]" : ""}`}>
        {item.displayImage ? (
          <div className="relative min-h-[260px] overflow-hidden border-b border-cwi-brown/10 bg-cwi-muted lg:min-h-[520px] lg:border-b-0 lg:border-r">
            <Image
              src={item.displayImage}
              alt={item.displayImageAlt || item.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cwi-ink/42 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 rounded-md border border-cwi-cream/50 bg-cwi-ink/72 px-3 py-2 text-xs font-black uppercase tracking-wide text-cwi-cream backdrop-blur">
              Lead Story
            </div>
          </div>
        ) : null}

        <div className="relative p-5 sm:p-7 lg:p-9">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${statusStyles[item.status] ?? statusStyles.Reported}`}>
              {item.status}
            </span>
            <span className="rounded-full border border-cwi-brown/15 bg-white/72 px-3 py-1 text-xs font-black uppercase tracking-wide text-cwi-brown">
              {item.category}
            </span>
            {item.labels.map((label) => (
              <span key={label} className="rounded-full border border-cwi-saffron/35 bg-cwi-saffron/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-cwi-brown">
                {label}
              </span>
            ))}
          </div>

          <h2 className="font-display text-3xl font-black leading-tight text-cwi-ink sm:text-4xl lg:text-5xl">
            {item.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-cwi-ink/72 sm:text-lg">
            {item.summary}
          </p>

          <div className="mt-7 grid gap-3">
            <FactLine label="What changed" value={item.whatChanged} tone="green" />
            <FactLine label="What remains unclear" value={item.whatWeDontKnow} tone="saffron" />
          </div>

          <div className="mt-8 grid gap-3 border-y border-cwi-brown/10 py-4 sm:grid-cols-3">
            <MiniStat label="Sources" value={`${item.sourceTrail.length}`} />
            <MiniStat label="Last updated" value={formatDateTime(item.lastUpdatedAt)} />
            <MiniStat label="Correction" value={item.correctionOpen ? "Open" : "Closed"} />
          </div>

          {item.sourceGap ? (
            <p className="mt-5 rounded-lg border border-cwi-saffron/35 bg-white/70 p-4 text-sm font-semibold leading-6 text-cwi-brown">
              Source gap: {item.sourceGap}
            </p>
          ) : null}

          <Link
            href={`/live-newsroom/${item.slug}`}
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-cwi-green px-5 py-3 text-sm font-black text-cwi-cream transition hover:bg-cwi-green/90"
          >
            Read full update <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function FactLine({ label, value, tone }: { label: string; value: string; tone: "green" | "saffron" }) {
  return (
    <div className="rounded-lg border border-cwi-brown/10 bg-white/72 p-4">
      <div className={`text-xs font-black uppercase tracking-wide ${tone === "green" ? "text-cwi-green" : "text-cwi-brown"}`}>
        {label}
      </div>
      <p className="mt-1 text-sm leading-6 text-cwi-ink/76">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[0.68rem] font-black uppercase tracking-wide text-cwi-ink/48">{label}</div>
      <div className="mt-1 text-sm font-black text-cwi-ink">{value}</div>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata"
  }).format(new Date(value));
}
