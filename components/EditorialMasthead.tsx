import { Send, Archive, FileText } from "lucide-react";
import Link from "next/link";

export function EditorialMasthead() {
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cwi-cream via-white to-cwi-cream/80 px-6 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      {/* Decorative elements */}
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cwi-saffron/5 blur-3xl" />
      <div className="absolute left-0 bottom-0 h-32 w-32 rounded-full bg-cwi-green/5 blur-3xl" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cwi-green to-transparent" />

      <div className="relative z-10">
        {/* Top label */}
        <div className="mb-6 inline-flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cwi-green" />
          <span className="font-display text-xs font-bold uppercase tracking-widest text-cwi-ink/60">
            CWI Live Newsroom
          </span>
        </div>

        {/* Main headline */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-cwi-ink mb-4 max-w-3xl">
          What is verified. What is still unclear. What needs public attention.
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-cwi-ink/70 max-w-2xl mb-8">
          A source-backed civic newsroom by Cockroach Watch India tracking public issues, viral claims, youth voice, platform updates, advisories, and India Unanswered Files.
        </p>

        {/* Date and trust row */}
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pb-8 border-b-2 border-cwi-green/10">
          <div className="text-sm font-medium text-cwi-ink/60">
            Updated <span className="font-semibold text-cwi-ink">{dateString}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-cwi-ink/60">
            <span className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-cwi-green" />
              Independent
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-cwi-green" />
              Source-led
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-cwi-green" />
              Human approved
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-cwi-green" />
              Corrections open
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <Link
            href="/submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-cwi-green px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-cwi-green/90 hover:shadow-lg active:scale-95"
          >
            <Send className="h-5 w-5" />
            Submit source or correction
          </Link>
          <Link
            href="#verification-desk"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-cwi-green bg-transparent px-6 py-3 font-semibold text-cwi-green transition-all duration-200 hover:bg-cwi-green/5 active:scale-95"
          >
            <FileText className="h-5 w-5" />
            View today&apos;s brief
          </Link>
          <Link
            href="/india-unanswered-files"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-cwi-brown/30 bg-transparent px-6 py-3 font-semibold text-cwi-brown/70 transition-all duration-200 hover:bg-cwi-brown/5 active:scale-95"
          >
            <Archive className="h-5 w-5" />
            Browse archive
          </Link>
        </div>
      </div>
    </section>
  );
}
