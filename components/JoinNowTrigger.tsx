"use client";

import type React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type JoinNowTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  variant?: "button" | "link";
};

export function JoinNowTrigger({ children = "Join Now", className, variant = "button", onClick, ...props }: JoinNowTriggerProps) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        variant === "button"
          ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-cwi-green px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_0_24px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 hover:bg-cwi-green/92"
          : "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-cwi-ink/70 transition hover:bg-cwi-muted hover:text-cwi-saffron",
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          window.dispatchEvent(new CustomEvent("cwi:open-join"));
        }
      }}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
