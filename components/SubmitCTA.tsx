import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";

export function SubmitCTA() {
  return (
    <section className="relative overflow-hidden rounded-lg border-2 border-cwi-green bg-cwi-green px-5 py-10 text-cwi-cream shadow-card sm:px-8 lg:px-10">
      <div className="absolute inset-x-0 top-0 h-2 bg-cwi-saffron" />
      <div className="absolute right-6 top-6 hidden select-none font-display text-7xl font-black uppercase text-cwi-cream/[0.08] sm:block">
        CWI
      </div>
      <div className="relative max-w-3xl">
        <h2 className="font-display text-3xl font-black leading-tight sm:text-4xl">Seen a source, correction, or update?</h2>
        <p className="mt-4 text-base leading-7 text-cwi-cream/88 sm:text-lg">
          Send CWI the link, date, creator credit, or missing context. Do not submit private data, threats, hate, or unverified allegations as fact.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/submit"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-cwi-cream px-5 py-3 text-sm font-black text-cwi-green transition hover:bg-white"
          >
            <Send className="h-4 w-4" /> Send source or correction
          </Link>
          <Link
            href="/editorial-policy"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border-2 border-cwi-cream/70 px-5 py-3 text-sm font-black text-cwi-cream transition hover:bg-cwi-cream/10"
          >
            Read editorial policy <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
