import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-cwi-brown/18 bg-white/78 p-6 shadow-[0_14px_36px_rgba(29,18,10,0.08)] transition duration-200 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-cwi-saffron hover:border-cwi-green/35 hover:shadow-[0_18px_52px_rgba(29,18,10,0.1)]",
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
        "mb-4 inline-flex rounded-full border border-cwi-green/18 bg-cwi-green/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-cwi-green",
        className
      )}
    >
      {children}
    </div>
  );
}