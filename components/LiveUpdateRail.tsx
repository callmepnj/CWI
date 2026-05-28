import { formatDistanceToNow } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { LiveNewsroomItem } from "@/data/live-newsroom";

const statusDots: Record<string, string> = {
  "Source-backed": "bg-green-500",
  "Verified": "bg-green-500",
  "Developing": "bg-amber-500",
  "Reported": "bg-blue-500",
  "Advisory": "bg-orange-500",
  "Needs source": "bg-slate-400",
  "Blocked": "bg-red-500",
  "Correction issued": "bg-purple-500"
};

interface UpdateRailItemProps {
  item: LiveNewsroomItem;
}

export function UpdateRailItem({ item }: UpdateRailItemProps) {
  const dotColor = statusDots[item.status] || "bg-slate-400";

  return (
    <Link
      href={`/live-newsroom/${item.slug}`}
      className="group flex items-start gap-3 rounded-lg border border-cwi-border/30 bg-cwi-cream p-3 transition-all duration-200 hover:bg-white hover:border-cwi-green/30 hover:shadow-sm"
    >
      {/* Status indicator */}
      <div className="mt-1 flex flex-col gap-2">
        <div className={`h-2 w-2 rounded-full ${dotColor}`} />
        <div className="h-10 w-0.5 bg-cwi-border/20" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium text-cwi-ink/50">
          {formatDistanceToNow(new Date(item.lastUpdatedAt), { addSuffix: true })}
        </div>
        <h4 className="line-clamp-2 text-sm font-semibold text-cwi-ink group-hover:text-cwi-green">
          {item.title}
        </h4>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs font-medium text-cwi-ink/60">{item.status}</span>
          {item.sourceTrail.length > 0 && (
            <span className="text-xs text-cwi-green">
              {item.sourceTrail.length}s
            </span>
          )}
        </div>
      </div>

      {/* Arrow indicator */}
      <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-cwi-green/0 transition-all group-hover:text-cwi-green" />
    </Link>
  );
}

interface LiveUpdateRailProps {
  items: LiveNewsroomItem[];
}

export function LiveUpdateRail({ items }: LiveUpdateRailProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-cwi-border/20 bg-cwi-cream/50 p-8 text-center">
        <p className="text-sm text-cwi-ink/50">No live updates at this moment. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <UpdateRailItem key={item.id} item={item} />
      ))}
    </div>
  );
}
