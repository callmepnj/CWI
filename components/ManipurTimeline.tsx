"use client";

import { motion } from "framer-motion";
import { Clock3, ShieldAlert } from "lucide-react";
import type { ManipurTimelineItem } from "@/data/manipur";
import { getManipurSources } from "@/data/manipur";

export function ManipurTimeline({ items }: { items: ManipurTimelineItem[] }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-red-500 via-sky-400 to-amber-300 md:block" />
      <div className="space-y-6">
        {items.map((item, index) => {
          const sources = getManipurSources(item.sourceIds);

          return (
            <motion.article
              key={`${item.date}-${item.title}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-90px" }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.25)] backdrop-blur md:ml-12 md:p-6"
            >
              <div className="absolute -left-[3.45rem] top-7 hidden h-7 w-7 rounded-full border border-sky-300/70 bg-[#061326] shadow-[0_0_28px_rgba(14,165,233,0.55)] md:block" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-400/[0.12] px-3 py-1 font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-sky-200 ring-1 ring-sky-300/20">
                  <Clock3 className="h-3.5 w-3.5" />
                  {item.date}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-red-200 ring-1 ring-red-300/20">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {item.status}
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-white/70">{item.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {sources.map((source) => (
                  <a
                    key={source.id}
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-white/60 transition hover:border-sky-300/50 hover:text-sky-100"
                  >
                    {source.publisher}
                  </a>
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
