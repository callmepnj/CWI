import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WatchStatusBadge } from "@/components/WatchStatusBadge";
import type { watchAdvisories } from "@/data/watch";

type WatchAlert = (typeof watchAdvisories)[number];

export function WatchAlertCard({ alert }: { alert: WatchAlert }) {
  return (
    <article className="group flex h-full min-w-[17rem] flex-col rounded-3xl border border-white/10 bg-white/[0.07] p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-saffron/40 hover:bg-white/[0.1]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <WatchStatusBadge status={alert.status} />
        <span className="font-mono text-[0.66rem] font-black uppercase tracking-[0.16em] text-white/45">
          {alert.date}
        </span>
      </div>
      <h3 className="mt-5 font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em]">
        {alert.title}
      </h3>
      <p className="mt-4 flex-1 text-sm leading-7 text-white/68">{alert.summary}</p>
      <Link
        href={alert.href}
        className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-[0.14em] text-saffron"
      >
        Read Update <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </Link>
    </article>
  );
}
