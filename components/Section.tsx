import type React from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  titleAs?: "h1" | "h2";
};

export function Section({ eyebrow, title, subtitle, children, className, titleAs = "h2" }: SectionProps) {
  const TitleTag = titleAs;

  return (
    <section className={cn("mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20", className)}>
      <div className="mb-9 max-w-3xl">
        {eyebrow ? (
          <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.24em] text-royal">{eyebrow}</p>
        ) : null}
        <TitleTag className="font-display text-3xl font-black uppercase leading-tight tracking-[-0.04em] text-ink sm:text-5xl">
          {title}
        </TitleTag>
        {subtitle ? <p className="mt-5 text-base leading-8 text-ink/70 sm:text-lg">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
