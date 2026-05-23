"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, RadioTower } from "lucide-react";
import { watchHighlightItems } from "@/data/watch";

export function WatchRadarAnimation() {
  return (
    <div className="relative min-h-[28rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#071123] p-5 shadow-[0_30px_90px_rgba(11,92,255,0.28)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(11,92,255,0.34),transparent_38%),linear-gradient(135deg,rgba(255,210,63,0.14),transparent_28%)]" />
      <motion.div
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-royal/35"
        animate={{ scale: [0.82, 1.12, 0.82], opacity: [0.5, 0.95, 0.5] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-saffron/30"
        animate={{ scale: [1.05, 0.78, 1.05], opacity: [0.35, 0.82, 0.35] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[1px] w-64 origin-left bg-gradient-to-r from-saffron via-saffron/60 to-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 5.4, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-x-5 top-8 h-20 rounded-3xl border border-white/10 bg-white/[0.06]"
        animate={{ x: ["-8%", "8%", "-8%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative z-10 grid min-h-[24rem] place-items-center">
        <div className="relative grid h-36 w-36 place-items-center rounded-[2rem] border border-white/15 bg-white/10 shadow-[0_0_60px_rgba(11,92,255,0.55)] backdrop-blur-xl">
          <Image
            src="/brand/logo.png"
            alt="Cockroach Watch India CWI logo inside live watch radar"
            width={92}
            height={92}
            className="rounded-2xl"
          />
          <motion.span
            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-saffron text-ink"
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <Eye className="h-4 w-4" />
          </motion.span>
        </div>
      </div>
      <div className="absolute inset-x-4 bottom-4 z-10 overflow-hidden">
        <motion.div
          className="flex w-max gap-3"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {[...watchHighlightItems, ...watchHighlightItems].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-white/78 backdrop-blur"
            >
              <RadioTower className="h-3.5 w-3.5 text-saffron" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
