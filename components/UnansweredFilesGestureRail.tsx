"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Hand, Radio, ShieldCheck, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type UnansweredGestureItem = {
  title: string;
  slug: string;
  category: string;
  status: string;
  location: string;
  summary: string;
  imageSrc: string;
  imageAlt: string;
};

type Props = {
  items: UnansweredGestureItem[];
  className?: string;
};

export function UnansweredFilesGestureRail({ items, className }: Props) {
  const reduceMotion = useReducedMotion();
  const movingItems = [...items, ...items];
  const tickerItems = [...items, ...items, ...items].slice(0, 18);

  return (
    <div className={cn("relative overflow-hidden rounded-[2rem] border border-royal/15 bg-white p-3 shadow-[0_22px_70px_rgba(11,92,255,0.16)]", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(11,92,255,0.14),transparent_16rem),radial-gradient(circle_at_82%_18%,rgba(255,210,63,0.22),transparent_15rem),linear-gradient(135deg,#ffffff,#eef5ff_62%,#fff7d6)]" />
      <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(rgba(11,92,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(11,92,255,0.07)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative flex items-center justify-between gap-3 px-2 pb-3">
        <div>
          <p className="flex items-center gap-2 font-mono text-[0.68rem] font-black uppercase tracking-[0.18em] text-royal">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-urgent opacity-55" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-urgent" />
            </span>
            Moving news watch
          </p>
          <p className="mt-1 text-xs font-semibold text-ink/58">Live-style case cards with moving headlines and source-backed files.</p>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-royal/15 bg-skywash px-3 py-2 font-mono text-[0.62rem] font-black uppercase tracking-[0.14em] text-royal sm:flex">
          <Hand className="h-3.5 w-3.5 text-urgent" />
          Swipe rail
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.55rem] border border-royal/10 bg-white/70 py-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-white to-transparent" />
        <motion.div
          className="flex w-max gap-4 px-3"
          animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={reduceMotion ? undefined : { duration: 26, repeat: Infinity, ease: "linear" }}
        >
          {movingItems.map((item, index) => (
            <Link
              key={`${item.slug}-${index}`}
              href={`/indias-unanswered-files/${item.slug}`}
              className="group w-[285px] overflow-hidden rounded-[1.35rem] border border-line bg-white shadow-[0_16px_38px_rgba(11,18,32,0.12)] outline-none transition hover:-translate-y-0.5 hover:border-royal/35 hover:shadow-[0_22px_46px_rgba(11,92,255,0.18)] focus-visible:ring-2 focus-visible:ring-royal"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-skywash">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  priority={index === 0}
                  sizes="285px"
                  className="object-cover transition duration-700 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/34 via-transparent to-white/10" />
                <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2">
                  <span className="rounded-full bg-white/95 px-3 py-1 font-mono text-[0.56rem] font-black uppercase tracking-[0.14em] text-royal shadow-sm">
                    {item.status}
                  </span>
                  <span className="rounded-full bg-ink/78 px-3 py-1 font-mono text-[0.56rem] font-black uppercase tracking-[0.14em] text-white shadow-sm backdrop-blur">
                    {item.location}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="font-mono text-[0.6rem] font-black uppercase tracking-[0.18em] text-urgent">{item.category}</p>
                <h3 className="mt-2 line-clamp-2 font-display text-xl font-black uppercase leading-[0.96] tracking-[-0.045em] text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 line-clamp-2 text-xs font-semibold leading-5 text-ink/62">{item.summary}</p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 font-mono text-[0.6rem] font-black uppercase tracking-[0.14em] text-white transition group-hover:bg-royal">
                  Read file <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>

      <div className="relative mt-3 overflow-hidden rounded-full border border-royal/15 bg-ink py-2">
        <motion.div
          className="flex w-max gap-3 whitespace-nowrap px-3"
          animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={reduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {tickerItems.map((item, index) => (
            <span
              key={`${item.slug}-${index}`}
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-3 py-1 font-mono text-[0.62rem] font-black uppercase tracking-[0.14em] text-white/78 ring-1 ring-white/10"
            >
              {index % 3 === 0 ? (
                <Radio className="h-3 w-3 text-saffron" />
              ) : index % 3 === 1 ? (
                <ShieldCheck className="h-3 w-3 text-sky-300" />
              ) : (
                <Sparkles className="h-3 w-3 text-emerald-300" />
              )}
              {item.title}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
