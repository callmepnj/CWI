import type React from "react";
import { AlertTriangle, CheckCircle2, Clock, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WatchAlertStatus } from "@/data/watch";

const statusStyles: Record<WatchAlertStatus, string> = {
  Developing: "bg-saffron/20 text-saffron ring-saffron/35",
  Verified: "bg-leaf/15 text-leaf ring-leaf/30",
  Advisory: "bg-royal/15 text-white ring-royal/35",
  Unverified: "bg-urgent/15 text-[#ffb199] ring-urgent/35"
};

const statusIcons = {
  Developing: Clock,
  Verified: CheckCircle2,
  Advisory: Radio,
  Unverified: AlertTriangle
} satisfies Record<WatchAlertStatus, React.ComponentType<{ className?: string }>>;

export function WatchStatusBadge({ status, className }: { status: WatchAlertStatus; className?: string }) {
  const Icon = statusIcons[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.14em] ring-1",
        statusStyles[status],
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}
