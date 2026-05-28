import Link from "next/link";
import type { LiveNewsroomItem } from "@/data/live-newsroom";

interface TimelineItemProps {
  item: LiveNewsroomItem;
  isLast: boolean;
}

export function TimelineItemComponent({ item, isLast }: TimelineItemProps) {
  const date = new Date(item.lastUpdatedAt);
  const dateString = date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="relative flex gap-6">
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div className="h-4 w-4 rounded-full border-3 border-cwi-green bg-white" />
        {!isLast && <div className="h-12 w-1 bg-cwi-green/30" />}
      </div>

      {/* Content */}
      <Link
        href={`/live-newsroom/${item.slug}`}
        className="group pb-8 cursor-pointer flex-1"
      >
        <div className="rounded-lg border-2 border-cwi-green/20 bg-white p-5 transition-all duration-200 hover:border-cwi-green/50 hover:shadow-md hover:bg-cwi-cream/50">
          {/* Date */}
          <div className="text-xs font-bold uppercase tracking-wide text-cwi-green mb-2">
            {dateString}
          </div>

          {/* Headline */}
          <h4 className="font-display font-bold text-cwi-ink text-lg mb-2 group-hover:text-cwi-green transition-colors">
            {item.title}
          </h4>

          {/* Summary */}
          <p className="text-sm text-cwi-ink/70 mb-3">
            {item.summary}
          </p>

          {/* Status and sources */}
          <div className="flex items-center gap-3 text-xs text-cwi-ink/60">
            <span className="inline-block px-2 py-1 rounded-full bg-cwi-saffron/10 text-cwi-brown font-medium">
              {item.status}
            </span>
            {item.sourceTrail.length > 0 && (
              <span className="text-cwi-green font-medium">
                {item.sourceTrail.length} source{item.sourceTrail.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

interface TimelineProps {
  items: LiveNewsroomItem[];
}

export function Timeline({ items }: TimelineProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-cwi-border bg-cwi-cream/30 p-12 text-center">
        <p className="text-sm text-cwi-ink/50">No timeline events recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <TimelineItemComponent key={item.id} item={item} isLast={i === items.length - 1} />
      ))}
    </div>
  );
}
