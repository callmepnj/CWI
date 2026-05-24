"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Hand, Radio, ShieldCheck } from "lucide-react";
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
  const tickerItems = [...items, ...items].slice(0, 12);

  return (
    <div className={cn("relative overflow-hidden rounded-[2rem] border border-white/70 bg-[#071123] p-3 shadow-[0_24px_80px_rgba(11,92,255,0.18)]", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(11,92,255,0.32),transparent_18rem),radial-gradient(circle_at_78%_8%,rgba(255,210,63,0.20),transparent_18rem)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative flex items-center justify-between gap-3 px-2 pb-3">
        <div>
          <p className="flex items-center gap-2 font-mono text-[0.68rem] font-black uppercase tracking-[0.18em] text-saffron">
            <span className="h-2 w-2 rounded-full bg-urgent shadow-[0_0_18px_rgba(255,107,53,0.8)]" />
            Moving case watch
          </p>
          <p className="mt-1 text-xs font-semibold text-white/58">Swipe the cards. Follow the source trail.</p>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-2 font-mono text-[0.62rem] font-black uppercase tracking-[0.14em] text-white/70 sm:flex">
          <Hand className="h-3.5 w-3.5 text-saffron" />
          Drag
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.55rem]">
        <motion.div
          className="flex cursor-grab gap-4 active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -860, right: 0 }}
          dragElastic={0.12}
          animate={reduceMotion ? undefined : { x: [0, -32, 0] }}
          transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          {items.map((item, index) => (
            <Link
              key={item.slug}
              href={`/indias-unanswered-files/${item.slug}`}
              className="group relative min-h-[310px] w-[82%] min-w-[260px] overflow-hidden rounded-[1.45rem] border border-white/12 bg-white/[0.06] shadow-[0_18px_50px_rgba(0,0,0,0.24)] outline-none transition hover:border-saffron/55 focus-visible:ring-2 focus-visible:ring-saffron sm:w-[330px] sm:min-w-[330px]"
            >
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 82vw, 330px"
                className="object-cover transition duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/55 to-transparent" />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4">
                <span className="rounded-full bg-white/92 px-3 py-1 font-mono text-[0.58rem] font-black uppercase tracking-[0.14em] text-royal">
                  {item.status}
                </span>
                <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 font-mono text-[0.58rem] font-black uppercase tracking-[0.14em] text-white/78 backdrop-blur">
                  {item.location}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-mono text-[0.62rem] font-black uppercase tracking-[0.18em] text-saffron">{item.category}</p>
                <h3 className="mt-2 font-display text-2xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-white">
                  {item.title}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-white/68">{item.summary}</p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-[0.62rem] font-black uppercase tracking-[0.14em] text-ink transition group-hover:bg-saffron">
                  Read file <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>

      <div className="relative mt-3 overflow-hidden rounded-full border border-white/10 bg-white/[0.08] py-2">
        <motion.div
          className="flex w-max gap-3 whitespace-nowrap px-3"
          animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={reduceMotion ? undefined : { duration: 24, repeat: Infinity, ease: "linear" }}
        >
          {tickerItems.map((item, index) => (
            <span
              key={`${item.slug}-${index}`}
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-3 py-1 font-mono text-[0.62rem] font-black uppercase tracking-[0.14em] text-white/74 ring-1 ring-white/10"
            >
              {index % 2 === 0 ? <Radio className="h-3 w-3 text-saffron" /> : <ShieldCheck className="h-3 w-3 text-sky-300" />}
              {item.title}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
