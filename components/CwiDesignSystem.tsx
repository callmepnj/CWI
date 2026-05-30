import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Send, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type CwiButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "saffron" | "quiet";
  className?: string;
};

export function CwiPageShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <main className={cn("bg-cwi-cream text-cwi-ink", className)}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </main>
  );
}

export function CwiMasthead({
  label,
  title,
  subtitle,
  body,
  primaryCta,
  secondaryCta,
  tertiaryCta,
  meta,
  className
}: {
  label: string;
  title: string;
  subtitle?: string;
  body?: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  tertiaryCta?: { href: string; label: string };
  meta?: string[];
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden rounded-lg border border-cwi-green/55 bg-cwi-card p-6 shadow-[0_22px_70px_var(--cwi-shadow-soft)] ring-1 ring-cwi-green/10 sm:p-8 lg:p-10",
        "before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-1.5 before:bg-cwi-saffron",
        "after:pointer-events-none after:absolute after:inset-0 after:z-0 after:bg-[radial-gradient(circle_at_20%_15%,rgba(59,130,246,0.18),transparent_26rem)]",
        className
      )}
    >
      <span className="pointer-events-none absolute right-0 top-0 z-0 select-none overflow-hidden font-display text-[clamp(3rem,10vw,6rem)] font-black uppercase leading-none text-cwi-green/[0.018] sm:right-2 sm:top-2 lg:right-4 lg:top-4">
        CWI
      </span>
      <div className="relative z-20 max-w-5xl">
        <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-cwi-green">{label}</p>
        <h1 className="mt-4 font-display text-4xl font-black uppercase leading-[0.95] text-cwi-ink sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {subtitle ? <p className="mt-5 max-w-3xl text-xl font-bold leading-8 text-cwi-brown">{subtitle}</p> : null}
        {body ? <p className="mt-4 max-w-4xl leading-8 text-cwi-ink/72">{body}</p> : null}
      </div>

      {meta?.length ? (
        <div className="relative z-20 mt-7 flex flex-wrap gap-2">
          {meta.map((item) => (
            <span
              key={item}
              className="rounded-full border border-cwi-brown/20 bg-white/65 px-3 py-1.5 font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-cwi-brown"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}

      {primaryCta || secondaryCta || tertiaryCta ? (
        <div className="relative z-20 mt-8 flex flex-wrap gap-3">
          {primaryCta ? (
            <CwiButtonLink href={primaryCta.href}>
              {primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </CwiButtonLink>
          ) : null}
          {secondaryCta ? <CwiButtonLink href={secondaryCta.href} variant="secondary">{secondaryCta.label}</CwiButtonLink> : null}
          {tertiaryCta ? <CwiButtonLink href={tertiaryCta.href} variant="quiet">{tertiaryCta.label}</CwiButtonLink> : null}
        </div>
      ) : null}
    </section>
  );
}

export function CwiSectionHeader({
  eyebrow,
  title,
  subtitle,
  className
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 max-w-4xl", className)}>
      {eyebrow ? <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-cwi-green">{eyebrow}</p> : null}
      <h2 className="mt-2 font-display text-3xl font-black uppercase leading-tight text-cwi-ink sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-base leading-7 text-cwi-ink/68 sm:text-lg">{subtitle}</p> : null}
    </div>
  );
}

export function CwiTrustStrip({ items }: { items: string[] }) {
  return (
    <div className="grid gap-2 rounded-lg border border-cwi-brown/18 bg-white/70 p-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-2 rounded-md bg-cwi-cream px-3 py-2 text-sm font-bold text-cwi-ink/75">
          <ShieldCheck className="h-4 w-4 text-cwi-green" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export function CwiStatusBadge({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "saffron" | "brown" | "ink" }) {
  const toneClass = {
    green: "border-cwi-green/20 bg-cwi-green/10 text-cwi-green",
    saffron: "border-cwi-saffron/25 bg-cwi-saffron/12 text-cwi-brown",
    brown: "border-cwi-brown/20 bg-cwi-brown/10 text-cwi-brown",
    ink: "border-cwi-ink/18 bg-cwi-ink text-cwi-cream"
  }[tone];

  return (
    <span className={cn("inline-flex w-fit rounded-full border px-3 py-1 font-mono text-[0.68rem] font-black uppercase tracking-[0.14em]", toneClass)}>
      {children}
    </span>
  );
}

export function CwiSourceChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit rounded-full border border-cwi-brown/18 bg-white/70 px-2.5 py-1 font-mono text-[0.65rem] font-black uppercase tracking-[0.1em] text-cwi-brown">
      {children}
    </span>
  );
}

export function CwiEditorialCard({
  label,
  title,
  summary,
  href,
  meta,
  className
}: {
  label?: string;
  title: string;
  summary?: string;
  href?: string;
  meta?: string[];
  className?: string;
}) {
  const content = (
    <article className={cn("h-full rounded-lg border border-cwi-brown/18 bg-white/78 p-5 shadow-[0_14px_38px_rgba(29,18,10,0.08)] transition hover:border-cwi-green/35", className)}>
      {label ? <CwiStatusBadge tone="saffron">{label}</CwiStatusBadge> : null}
      <h3 className="mt-4 font-display text-2xl font-black uppercase leading-tight text-cwi-ink">{title}</h3>
      {summary ? <p className="mt-3 leading-7 text-cwi-ink/70">{summary}</p> : null}
      {meta?.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {meta.map((item) => <CwiSourceChip key={item}>{item}</CwiSourceChip>)}
        </div>
      ) : null}
      {href ? (
        <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-[0.14em] text-cwi-green">
          Open update <ArrowRight className="h-4 w-4" />
        </span>
      ) : null}
    </article>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export function CwiLeadCard({
  image,
  alt,
  label,
  title,
  summary,
  href,
  children
}: {
  image?: string;
  alt?: string;
  label?: string;
  title: string;
  summary?: string;
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-lg border-2 border-cwi-green bg-white shadow-[0_18px_52px_rgba(29,18,10,0.12)] lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <div className="relative min-h-64 bg-cwi-green/10">
        {image ? (
          <Image src={image} alt={alt ?? title} fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
        ) : (
          <div className="grid h-full min-h-64 place-items-center bg-[radial-gradient(circle_at_20%_20%,rgba(245,124,0,0.18),transparent_18rem),linear-gradient(135deg,rgba(27,94,32,0.16),rgba(253,248,243,0.9))] p-8 text-center">
            <FileText className="h-16 w-16 text-cwi-green" />
          </div>
        )}
      </div>
      <div className="p-6 sm:p-8">
        {label ? <CwiStatusBadge>{label}</CwiStatusBadge> : null}
        <h3 className="mt-4 font-display text-3xl font-black uppercase leading-tight text-cwi-ink sm:text-4xl">{title}</h3>
        {summary ? <p className="mt-4 text-lg leading-8 text-cwi-ink/70">{summary}</p> : null}
        {children ? <div className="mt-5">{children}</div> : null}
        {href ? (
          <CwiButtonLink href={href} className="mt-7">
            Open update <ArrowRight className="h-4 w-4" />
          </CwiButtonLink>
        ) : null}
      </div>
    </article>
  );
}

export function CwiTimeline({ items }: { items: Array<{ time: string; title: string; body: string; badge?: string; meta?: string }> }) {
  return (
    <div className="relative grid gap-4 md:pl-8">
      <span className="absolute bottom-2 left-3 top-2 hidden w-px bg-cwi-brown/22 md:block" />
      {items.map((item) => (
        <article key={`${item.time}-${item.title}`} className="relative rounded-lg border border-cwi-brown/18 bg-white/78 p-5 shadow-sm">
          <span className="absolute -left-[1.9rem] top-6 hidden h-3 w-3 rounded-full border-2 border-cwi-green bg-cwi-cream md:block" />
          <div className="flex flex-wrap items-center gap-2">
            <CwiStatusBadge tone="ink">{item.time}</CwiStatusBadge>
            {item.badge ? <CwiStatusBadge tone="saffron">{item.badge}</CwiStatusBadge> : null}
          </div>
          <h3 className="mt-3 font-display text-xl font-black uppercase leading-tight text-cwi-ink">{item.title}</h3>
          <p className="mt-2 leading-7 text-cwi-ink/70">{item.body}</p>
          {item.meta ? <p className="mt-3 font-mono text-xs font-black uppercase tracking-[0.12em] text-cwi-brown/70">{item.meta}</p> : null}
        </article>
      ))}
    </div>
  );
}

export function CwiDossierCard({ title, question, href, meta }: { title: string; question: string; href: string; meta?: string[] }) {
  return (
    <Link href={href} className="group block h-full">
      <article className="relative h-full rounded-lg border border-cwi-brown/20 bg-[#fffaf0] p-5 shadow-sm transition hover:border-cwi-green/35 hover:shadow-[0_14px_38px_rgba(29,18,10,0.1)]">
        <span className="absolute right-4 top-4 rotate-[-5deg] rounded-sm border-2 border-cwi-saffron px-2 py-1 font-mono text-[0.62rem] font-black uppercase tracking-[0.14em] text-cwi-saffron">
          File open
        </span>
        <h3 className="pr-24 font-display text-2xl font-black uppercase leading-tight text-cwi-ink">{title}</h3>
        <p className="mt-4 leading-7 text-cwi-ink/70">{question}</p>
        {meta?.length ? <div className="mt-5 flex flex-wrap gap-2">{meta.map((item) => <CwiSourceChip key={item}>{item}</CwiSourceChip>)}</div> : null}
        <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-[0.14em] text-cwi-green">
          Open file <ArrowRight className="h-4 w-4" />
        </span>
      </article>
    </Link>
  );
}

export function CwiAdvisoryCard({ title, body, action }: { title: string; body: string; action?: string }) {
  return (
    <article className="rounded-lg border border-cwi-saffron/30 bg-cwi-saffron/10 p-5">
      <CwiStatusBadge tone="saffron">Public advisory</CwiStatusBadge>
      <h3 className="mt-4 font-display text-2xl font-black uppercase leading-tight text-cwi-ink">{title}</h3>
      <p className="mt-3 leading-7 text-cwi-ink/70">{body}</p>
      {action ? <p className="mt-4 font-bold text-cwi-brown">{action}</p> : null}
    </article>
  );
}

export function CwiCorrectionCard({ title, body, href = "/corrections" }: { title: string; body: string; href?: string }) {
  return (
    <article className="rounded-lg border border-cwi-brown/18 bg-white/78 p-5">
      <CheckCircle2 className="h-6 w-6 text-cwi-green" />
      <h3 className="mt-4 font-display text-2xl font-black uppercase leading-tight text-cwi-ink">{title}</h3>
      <p className="mt-3 leading-7 text-cwi-ink/70">{body}</p>
      <Link href={href} className="mt-5 inline-flex font-mono text-xs font-black uppercase tracking-[0.14em] text-cwi-green">
        View correction log
      </Link>
    </article>
  );
}

export function CwiLedgerTable({ rows }: { rows: Array<{ name: string; type: string; supports: string; limits: string; lastUsed?: string }> }) {
  return (
    <div className="overflow-hidden rounded-lg border border-cwi-brown/18 bg-white/78">
      <div className="hidden grid-cols-[1fr_0.6fr_1fr_1fr_0.7fr] gap-4 border-b border-cwi-brown/14 bg-cwi-green px-4 py-3 font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-cwi-cream md:grid">
        <span>Source</span>
        <span>Type</span>
        <span>Supports</span>
        <span>Does not prove</span>
        <span>Last used</span>
      </div>
      <div className="divide-y divide-cwi-brown/12">
        {rows.map((row) => (
          <div key={`${row.name}-${row.supports}`} className="grid gap-3 p-4 text-sm md:grid-cols-[1fr_0.6fr_1fr_1fr_0.7fr]">
            <strong className="text-cwi-ink">{row.name}</strong>
            <span className="font-bold text-cwi-green">{row.type}</span>
            <span className="text-cwi-ink/70">{row.supports}</span>
            <span className="text-cwi-ink/62">{row.limits}</span>
            <span className="font-mono text-xs font-black uppercase tracking-[0.1em] text-cwi-brown/70">{row.lastUsed ?? "Last checked"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CwiSubmitCTA({
  title = "Seen a source, correction, or update?",
  body = "Send CWI the link, date, creator credit, or missing context. Do not submit private data, threats, hate, or unverified allegations as fact."
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="rounded-lg border border-cwi-green bg-cwi-green p-6 text-cwi-cream shadow-[0_18px_52px_rgba(27,94,32,0.18)] sm:p-8">
      <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-cwi-saffron">Correction open</p>
      <h2 className="mt-3 font-display text-3xl font-black uppercase leading-tight sm:text-4xl">{title}</h2>
      <p className="mt-4 max-w-3xl leading-8 text-cwi-cream/78">{body}</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <CwiButtonLink href="/submit" variant="saffron">
          <Send className="h-4 w-4" />
          Send source or correction
        </CwiButtonLink>
        <CwiButtonLink href="/editorial-policy" variant="secondary" className="border-cwi-cream/30 bg-cwi-cream/10 text-cwi-cream hover:bg-cwi-cream/18">
          Read editorial policy
        </CwiButtonLink>
      </div>
    </section>
  );
}

export function CwiButtonLink({ href, children, variant = "primary", className }: CwiButtonLinkProps) {
  const variantClass = {
    primary: "bg-cwi-green text-cwi-cream hover:bg-[#164d1a]",
    secondary: "border border-cwi-brown/22 bg-white/70 text-cwi-green hover:border-cwi-green/40 hover:bg-white",
    saffron: "bg-cwi-saffron text-cwi-ink hover:bg-[#df6f00]",
    quiet: "bg-transparent text-cwi-green underline-offset-4 hover:underline"
  }[variant];

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black uppercase tracking-[0.12em] transition",
        variantClass,
        className
      )}
    >
      {children}
    </Link>
  );
}
export function CwiUpdateFeedItem({
  href,
  status,
  title,
  summary,
  meta
}: {
  href: string;
  status: string;
  title: string;
  summary: string;
  meta?: string;
}) {
  return (
    <Link href={href} className="grid gap-2 border-b border-cwi-brown/12 p-4 transition last:border-b-0 hover:bg-cwi-cream sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <CwiStatusBadge>{status}</CwiStatusBadge>
        <h3 className="mt-2 font-display text-xl font-black uppercase leading-tight text-cwi-ink">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-cwi-ink/68">{summary}</p>
      </div>
      {meta ? <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-cwi-brown/70">{meta}</span> : null}
    </Link>
  );
}

export function CwiArchivePreviewCard({ title, summary, href, meta }: { title: string; summary: string; href: string; meta?: string }) {
  return <CwiEditorialCard label="Archived context" title={title} summary={summary} href={href} meta={meta ? [meta] : undefined} />;
}

export function CwiSupportCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-lg border border-cwi-brown/18 bg-white/78 p-5">
      <CwiStatusBadge tone="saffron">Support CWI</CwiStatusBadge>
      <h3 className="mt-4 font-display text-2xl font-black uppercase leading-tight text-cwi-ink">{title}</h3>
      <p className="mt-3 leading-7 text-cwi-ink/70">{body}</p>
    </article>
  );
}

export function CwiQRCodeCard({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-80 place-items-center rounded-lg border border-cwi-brown/18 bg-cwi-cream p-6 text-center">{children}</div>;
}

export function CwiEmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="rounded-lg border border-cwi-brown/18 bg-white/78 p-6 text-center">
      <p className="font-display text-2xl font-black uppercase text-cwi-ink">{title}</p>
      {body ? <p className="mt-2 leading-7 text-cwi-ink/65">{body}</p> : null}
    </div>
  );
}
