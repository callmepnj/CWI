"use client";

import { motion } from "framer-motion";
import { Clock3, ExternalLink } from "lucide-react";
import type { UnansweredFile } from "@/data/unanswered-files";
import { getFileSources } from "@/data/unanswered-files";

export function UnansweredTimeline({ file }: { file: UnansweredFile }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-urgent via-royal to-saffron md:block" />
      <div className="space-y-6">
        {file.timeline.map((item, index) => {
          const sources = getFileSources(file, item.sourceIndex);

          return (
            <motion.article
              key={`${item.date}-${item.title}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -22 : 22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-90px" }}
              transition={{ duration: 0.42, ease: "easeOut" }}
              className="relative rounded-[1.75rem] border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft md:ml-12 md:p-6"
            >
              <div className="absolute -left-[3.45rem] top-7 hidden h-7 w-7 rounded-full border border-royal/30 bg-white shadow-[0_0_28px_rgba(11,92,255,0.28)] md:block" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-skywash px-3 py-1 font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-royal ring-1 ring-royal/15">
                  <Clock3 className="h-3.5 w-3.5" />
                  {item.date}
                </span>
                <span className="rounded-full bg-paper px-3 py-1 font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-ink/55 ring-1 ring-line">
                  {sources.length} source{sources.length === 1 ? "" : "s"}
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-ink md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-8 text-ink/72">{item.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-line bg-paper px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-ink/58 transition hover:border-royal/35 hover:bg-skywash hover:text-royal"
                  >
                    {source.publisher}
                    <ExternalLink className="h-3 w-3" />
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
