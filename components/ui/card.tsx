import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-card transition duration-200 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-royal before:via-saffron before:to-leaf hover:-translate-y-1 hover:shadow-soft",
        className
      )}
      {...props}
    />
  );
}

export function CardLabel({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mb-4 inline-flex rounded-full bg-skywash px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-royal ring-1 ring-royal/15",
        className
      )}
    >
      {children}
    </div>
  );
}
