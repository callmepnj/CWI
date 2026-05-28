"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Send, ShieldCheck } from "lucide-react";
import { WatchRadarAnimation } from "@/components/WatchRadarAnimation";
import { Button } from "@/components/ui/button";

const signalCards = [
  "Public Advisory",
  "Source-backed Article",
  "Creator Credit",
  "Viral Claim",
  "Youth Voice",
  "Submit Report"
];

export function WatchHighlightSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#071123] px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(11,92,255,0.32),transparent_30%),radial-gradient(circle_at_82%_70%,rgba(255,210,63,0.18),transparent_28%)]" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-mono text-[0.68rem] font-black uppercase tracking-[0.2em] text-saffron ring-1 ring-white/10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-saffron" />
            </span>
            The Watch is Live
          </p>
          <h2 className="font-display text-4xl font-black uppercase leading-none tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            The Watch is Live
          </h2>
          <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-white/78">
            Track public issues, viral claims, civic updates, creator credit requests, and source-backed Archive articles in one place.
          </p>
          <p className="mt-5 max-w-3xl leading-8 text-white/64">
            The Watch never sleeps. CWI tracks public issues, viral claims, creator credit requests, source-backed articles, and youth voice before they disappear from the feed.
          </p>
          <p className="mt-5 max-w-3xl leading-8 text-white/64">
            CWI watches what the feed forgets. Every report, claim, creator post, and public issue is reviewed with context before amplification.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="saffron">
              <Link href="/watch">Enter The Watch <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="border-white/25 bg-white/10 text-white hover:bg-white hover:text-ink">
              <Link href="/submit">Submit a Report <Send className="h-4 w-4" /></Link>
            </Button>
          </div>
          <p className="mt-6 flex max-w-3xl items-start gap-3 rounded-3xl border border-white/10 bg-white/[0.06] p-4 text-sm font-bold leading-6 text-white/68">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-saffron" />
            CWI reviews submissions before publishing. Unverified claims are labelled clearly. Creator credit matters.
          </p>
          <p className="mt-5 font-mono text-xs font-black uppercase tracking-[0.18em] text-saffron">
            Seen something important? Submit it to the Watch.
          </p>
        </motion.div>

        <div className="grid gap-4">
          <WatchRadarAnimation />
          <motion.div
            className="grid gap-3 sm:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.07 }
              }
            }}
          >
            {signalCards.map((card, index) => (
              <motion.div
                key={card}
                variants={{
                  hidden: { opacity: 0, x: index % 2 === 0 ? -24 : 24 },
                  visible: { opacity: 1, x: 0 }
                }}
                transition={{ duration: 0.42, ease: "easeOut" }}
                className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-white/78 backdrop-blur transition hover:border-saffron/35 hover:text-saffron"
              >
                {card}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
