import { Check, Clock, XCircle, HelpCircle } from "lucide-react";
import type { ClaimTrackerItem } from "@/data/live-newsroom";

const statusIcons: Record<string, React.ReactNode> = {
  "Verified": <Check className="h-5 w-5 text-green-600" />,
  "Source-backed": <Check className="h-5 w-5 text-green-600" />,
  "Reported": <Clock className="h-5 w-5 text-blue-600" />,
  "Developing": <Clock className="h-5 w-5 text-amber-600" />,
  "Needs context": <HelpCircle className="h-5 w-5 text-slate-600" />,
  "Unverified": <HelpCircle className="h-5 w-5 text-slate-600" />,
  "False/Misleading": <XCircle className="h-5 w-5 text-red-600" />,
  "Blocked": <XCircle className="h-5 w-5 text-red-600" />
};

const statusBg: Record<string, string> = {
  "Verified": "bg-green-50",
  "Source-backed": "bg-green-50",
  "Reported": "bg-blue-50",
  "Developing": "bg-amber-50",
  "Needs context": "bg-slate-50",
  "Unverified": "bg-slate-50",
  "False/Misleading": "bg-red-50",
  "Blocked": "bg-red-50"
};

interface ClaimTrackerRowProps {
  claim: ClaimTrackerItem;
  index: number;
}

export function ClaimTrackerRow({ claim, index }: ClaimTrackerRowProps) {
  return (
    <div className={`grid gap-4 md:grid-cols-5 p-4 rounded-lg border border-cwi-border/20 ${index % 2 === 0 ? "bg-cwi-cream/30" : "bg-white"}`}>
      {/* Claim */}
      <div className="md:col-span-2">
        <p className="text-sm font-semibold text-cwi-ink">{claim.claim}</p>
        <p className="text-xs text-cwi-ink/50 mt-1">
          First seen: {new Date(claim.firstSeenAt).toLocaleDateString("en-IN")}
        </p>
      </div>

      {/* Status */}
      <div>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusBg[claim.status]}`}>
          {statusIcons[claim.status]}
          <span>{claim.status}</span>
        </div>
      </div>

      {/* Evidence */}
      <div>
        <div className="text-sm font-medium text-cwi-ink mb-1">Evidence</div>
        <div className="text-xs text-cwi-ink/70">{claim.sources.length} source{claim.sources.length !== 1 ? "s" : ""}</div>
      </div>

      {/* CWI Note */}
      <div>
        <p className="text-xs text-cwi-ink/70 line-clamp-2">{claim.cwiNote}</p>
      </div>
    </div>
  );
}

interface ClaimTrackerProps {
  items: ClaimTrackerItem[];
}

export function ClaimTracker({ items }: ClaimTrackerProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-cwi-border bg-cwi-cream/30 p-12 text-center">
        <p className="text-sm text-cwi-ink/50">No active claims in the tracker.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((claim, i) => (
        <ClaimTrackerRow key={claim.id} claim={claim} index={i} />
      ))}
    </div>
  );
}
