import { ShieldAlert } from "lucide-react";
import type { FileStatus } from "@/data/unanswered-files";
import { cn } from "@/lib/utils";

const statusStyles: Record<FileStatus, string> = {
  Developing: "bg-urgent/10 text-urgent ring-urgent/20",
  "Court-monitored": "bg-skywash text-royal ring-royal/15",
  Reported: "bg-saffron/25 text-[#8A5B00] ring-saffron/35",
  "Source-backed": "bg-leaf/10 text-leaf ring-leaf/20",
  "Needs transparency": "bg-ink/8 text-ink/70 ring-ink/10"
};

export function UnansweredStatusBadge({ status, className }: { status: FileStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] ring-1",
        statusStyles[status],
        className
      )}
    >
      <ShieldAlert className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}
