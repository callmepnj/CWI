import React from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  id?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, id }: SectionHeaderProps) {
  return (
    <div id={id} className="mb-8 lg:mb-10">
      {eyebrow && (
        <div className="mb-3 flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-cwi-green" />
          <span className="font-display text-xs font-bold uppercase tracking-widest text-cwi-green">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-cwi-ink mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-cwi-ink/70 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface NewsroomSectionProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  id?: string;
  children: React.ReactNode;
}

export function NewsroomSection({
  eyebrow,
  title,
  subtitle,
  id,
  children
}: NewsroomSectionProps) {
  return (
    <section className="py-12 lg:py-16">
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} id={id} />
      {children}
    </section>
  );
}
