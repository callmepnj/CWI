import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import type { LiveNewsroomItem } from "@/data/live-newsroom";

interface ReportCardProps {
  item: LiveNewsroomItem;
}

export function ReportCard({ item }: ReportCardProps) {
  return (
    <article className="group h-full overflow-hidden rounded-lg border-2 border-cwi-green/20 bg-gradient-to-br from-cwi-cream to-white p-6 transition-all duration-200 hover:shadow-lg hover:border-cwi-green/40 hover:bg-white flex flex-col">
      {/* Category badge */}
      <div className="mb-3 inline-flex w-fit items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-cwi-green" />
        <span className="text-xs font-bold uppercase tracking-wide text-cwi-green">
          {item.category}
        </span>
      </div>

      {/* Headline */}
      <h3 className="font-display text-lg font-bold text-cwi-ink mb-2 line-clamp-3 group-hover:text-cwi-green transition-colors">
        {item.title}
      </h3>

      {/* Summary */}
      <p className="text-sm text-cwi-ink/70 mb-4 line-clamp-2 flex-grow">
        {item.summary}
      </p>

      {/* What/Know/Unclear boxes */}
      <div className="mb-4 space-y-2 text-xs">
        <div className="rounded-md bg-green-50 p-2 border border-green-100">
          <span className="font-bold text-green-700">What this proves:</span>
          <p className="text-green-700/80 mt-0.5">{item.whatWeKnow}</p>
        </div>
        <div className="rounded-md bg-amber-50 p-2 border border-amber-100">
          <span className="font-bold text-amber-700">What it doesn&apos;t prove:</span>
          <p className="text-amber-700/80 mt-0.5">{item.whatWeDontKnow}</p>
        </div>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between border-t border-cwi-border pt-4 mt-4">
        <div className="flex items-center gap-3 text-xs text-cwi-ink/60">
          <span className="font-medium">{item.sourceTrail.length} source{item.sourceTrail.length !== 1 ? "s" : ""}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(item.lastUpdatedAt), { addSuffix: true })}</span>
        </div>
        <Link
          href={`/live-newsroom/${item.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-cwi-green transition-all hover:gap-2 group-hover:text-cwi-green/90"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

interface SourceBackedReportsProps {
  items: LiveNewsroomItem[];
}

export function SourceBackedReports({ items }: SourceBackedReportsProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-cwi-border/20 bg-cwi-cream/50 p-12 text-center">
        <p className="text-sm text-cwi-ink/50">No source-backed reports at this moment.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ReportCard key={item.id} item={item} />
      ))}
    </div>
  );
}
