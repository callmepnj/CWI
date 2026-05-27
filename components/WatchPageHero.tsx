import Link from "next/link";
import { Archive, ArrowRight, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WatchPageHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#071123] px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-20">
      <div className="absolute inset-0 -z-10 bg-[#071123]" />
      <div className="mx-auto max-w-7xl">
        <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-mono text-[0.68rem] font-black uppercase tracking-[0.2em] text-saffron ring-1 ring-white/10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-saffron" />
          </span>
          Live civic watch hub
        </p>
        <h1 className="max-w-5xl font-display text-5xl font-black uppercase leading-[0.9] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
          The Watch
        </h1>
        <p className="mt-7 max-w-3xl text-xl font-semibold leading-9 text-white/78">
          A civic watch hub for public issues, viral claims, source trails, corrections, and youth voice.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="saffron">
            <Link href="/submit">Submit Report <Send className="h-4 w-4" /></Link>
          </Button>
          <Button asChild className="bg-white text-ink hover:bg-skywash">
            <Link href="/archive">Browse Archive <Archive className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline" className="border-white/25 bg-white/10 text-white hover:bg-white hover:text-ink">
            <a href="#advisories">View Advisories <ArrowRight className="h-4 w-4" /></a>
          </Button>
        </div>
        <div className="mt-10 overflow-hidden rounded-full border border-white/10 bg-white/[0.06] px-4 py-3">
          <p className="whitespace-nowrap font-mono text-[0.68rem] font-black uppercase tracking-[0.2em] text-saffron">
            Live Watch - Public Issues - Verify Before Sharing - Corrections Open - Youth Voice
          </p>
        </div>
        <p className="mt-6 flex max-w-3xl items-start gap-3 rounded-3xl border border-white/10 bg-white/[0.06] p-4 text-sm font-bold leading-6 text-white/68">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-saffron" />
          Check the source trail before sharing. Send corrections when the record changes.
        </p>
      </div>
    </section>
  );
}
