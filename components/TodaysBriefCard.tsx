import { Calendar } from "lucide-react";
import type { TodaysBrief } from "@/data/live-newsroom";

interface TodaysBriefCardProps {
  brief: TodaysBrief;
}

export function TodaysBriefCard({ brief }: TodaysBriefCardProps) {
  return (
    <article className="relative overflow-hidden rounded-lg border-2 border-cwi-green/30 bg-gradient-to-br from-white to-cwi-cream/50 shadow-sm">
      {/* Left accent border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cwi-green via-cwi-saffron to-cwi-brown" />

      {/* Content */}
      <div className="p-6 lg:p-8 pl-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b-2 border-cwi-green/10">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="inline-block h-2 w-2 rounded-full bg-cwi-saffron" />
              <span className="text-xs font-bold uppercase tracking-wide text-cwi-saffron">Today</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-cwi-ink">
              {brief.title}
            </h2>
          </div>
          <div className="text-right whitespace-nowrap">
            <div className="text-xs font-medium text-cwi-ink/50">{brief.date}</div>
            <div className="text-xs font-semibold text-cwi-ink/60 mt-1">By {brief.editorName ?? "CWI Editorial Desk"}</div>
            <div className="text-sm font-semibold text-cwi-green mt-1">{brief.sourceCount} sources</div>
          </div>
        </div>

        {/* Top updates */}
        <div className="mb-6">
          <h3 className="font-bold text-cwi-ink text-sm uppercase tracking-wide mb-3 text-cwi-green">
            Top Updates
          </h3>
          <ul className="space-y-2">
            {brief.topUpdates.map((update, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cwi-green flex-shrink-0" />
                <span className="text-sm text-cwi-ink/80">{update}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Three columns */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-lg bg-green-50/50 border border-green-100 p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-green-700 mb-2">What Changed</div>
            <p className="text-sm text-cwi-ink/80">{brief.whatChanged}</p>
          </div>
          <div className="rounded-lg bg-amber-50/50 border border-amber-100 p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-2">Remains Unclear</div>
            <p className="text-sm text-cwi-ink/80">{brief.whatRemainsUnclear}</p>
          </div>
          <div className="rounded-lg bg-blue-50/50 border border-blue-100 p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-blue-700 mb-2">Source Count</div>
            <p className="text-sm text-cwi-ink/80">{brief.sourceCount} verified sources being tracked</p>
          </div>
        </div>

        {/* Editor note */}
        {brief.editorNote && (
          <div className="mb-6 rounded-lg bg-cwi-saffron/5 border-l-4 border-cwi-saffron p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-cwi-saffron mb-2">Editor Note</div>
            <p className="text-sm text-cwi-ink/80">{brief.editorNote}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-cwi-border/30 text-xs text-cwi-ink/50">
          <span>Prepared for today&apos;s update</span>
          <span className="font-medium text-cwi-ink/70">Check updates below for full details</span>
        </div>
      </div>
    </article>
  );
}

interface TodaysBriefSectionProps {
  brief?: TodaysBrief;
}

export function TodaysBriefSection({ brief }: TodaysBriefSectionProps) {
  if (!brief) {
    return (
      <div className="rounded-lg border-2 border-dashed border-cwi-border bg-cwi-cream/30 p-12 text-center">
        <Calendar className="mx-auto mb-3 h-8 w-8 text-cwi-ink/30" />
        <p className="text-sm font-medium text-cwi-ink/50">
          Today&apos;s Watch Brief is being prepared. Check the latest verified updates below.
        </p>
      </div>
    );
  }

  return <TodaysBriefCard brief={brief} />;
}
