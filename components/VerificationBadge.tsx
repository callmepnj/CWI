import type React from "react";
import { CheckCircle2, Clock, FileWarning, MessageSquareQuote, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VerificationStatus } from "@/data/posts";

const styles: Record<VerificationStatus, string> = {
  Verified: "bg-leaf/12 text-[#047766] ring-leaf/25",
  Developing: "bg-saffron/25 text-[#8A5B00] ring-saffron/35",
  Claimed: "bg-royal/10 text-royal ring-royal/20",
  Reported: "bg-ink text-white ring-ink",
  Opinion: "bg-skywash text-royal ring-royal/20",
  "Opinion/Satire": "bg-urgent/10 text-urgent ring-urgent/20"
};

const icons = {
  Verified: CheckCircle2,
  Developing: Clock,
  Claimed: MessageSquareQuote,
  Reported: Radio,
  Opinion: MessageSquareQuote,
  "Opinion/Satire": FileWarning
} satisfies Record<VerificationStatus, React.ComponentType<{ className?: string }>>;

export function VerificationBadge({ status, className }: { status: VerificationStatus; className?: string }) {
  const Icon = icons[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.66rem] font-black uppercase tracking-[0.14em] ring-1",
        styles[status],
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}
