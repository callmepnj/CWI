import { ShieldAlert } from "lucide-react";
import { site } from "@/lib/site";

export function DisclaimerBanner() {
  return (
    <div className="border-b border-cwi-border bg-cwi-night px-4 py-2.5 text-[var(--cwi-text-primary)]">
      <div className="mx-auto flex max-w-7xl items-start gap-3 text-[0.68rem] font-bold uppercase leading-5 tracking-[0.1em] sm:items-center">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0" />
        <p>{site.disclaimer}</p>
      </div>
    </div>
  );
}


