import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileCheck2, RadioTower, ShieldCheck, Siren, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

const stats = [
  "Founder-led platform",
  "India-wide civic watch",
  "Public submissions open",
  "Creator credit policy active"
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <div className="absolute inset-0 -z-10 cwi-grid opacity-80" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-royal px-4 py-2 font-mono text-[0.7rem] font-black uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(11,92,255,0.22)]">
            <ShieldCheck className="h-4 w-4" />
            CWI Live Newsroom is the main desk
          </p>
          <h1 className="max-w-5xl font-display text-5xl font-black uppercase leading-[0.92] tracking-[-0.06em] text-ink sm:text-7xl lg:text-8xl">
            Cockroach Watch India - CWI
          </h1>
          <p className="mt-6 font-display text-3xl font-black uppercase leading-none tracking-[-0.03em] text-royal sm:text-4xl">
            Document. Verify. Amplify.
          </p>
          <p className="mt-7 max-w-3xl text-xl font-semibold leading-9 text-ink/82">
            Independent civic watch, satire, and commentary platform tracking youth voice, public issues, creator credit, source trails, and corrections.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/live-newsroom">Enter Live Newsroom</Link>
            </Button>
            <Button asChild variant="green">
              <Link href="/submit">Submit Report <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/archive">Browse Archive</Link>
            </Button>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-black uppercase tracking-[0.14em] text-ink/58">
            <span>Follow CWI:</span>
            <Link href={site.youtube} target="_blank" rel="noreferrer" className="transition hover:text-royal">YouTube</Link>
            <Link href={site.x} target="_blank" rel="noreferrer" className="transition hover:text-royal">X</Link>
            <Link href={site.instagram} target="_blank" rel="noreferrer" className="transition hover:text-royal">Instagram</Link>
            <Link href={site.telegram} target="_blank" rel="noreferrer" className="transition hover:text-royal">Telegram</Link>
            <Link href={site.bluesky} target="_blank" rel="noreferrer" className="transition hover:text-royal">Bluesky</Link>
          </div>
          <p className="mt-8 flex max-w-3xl items-start gap-3 rounded-3xl border border-royal/15 bg-skywash/85 p-4 text-sm font-bold uppercase leading-6 tracking-[0.06em] text-ink/70">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-royal" />
            {site.shortDisclaimer}
          </p>
        </div>
        <div className="relative">
          <div className="absolute -right-2 top-6 z-10 hidden rounded-2xl bg-saffron px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.16em] text-ink shadow-soft sm:block">
            Document. Verify. Amplify.
          </div>
          <div className="rounded-[2rem] border border-line bg-white p-4 shadow-soft">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-ink via-[#102a63] to-royal p-6 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.22em] text-saffron">
                    CWI Live Newsroom
                  </p>
                  <p className="mt-3 font-display text-4xl font-black uppercase leading-none">Live Newsroom Desk</p>
                </div>
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-white/10 ring-1 ring-white/20">
                  <RadioTower className="h-8 w-8 text-saffron" />
                </div>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["Document", FileCheck2],
                  ["Youth Voice", UsersRound],
                  ["Civic Alert", Siren]
                ].map(([label, Icon]) => (
                  <div key={label as string} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                    <Icon className="h-6 w-6 text-saffron" />
                    <p className="mt-4 font-black uppercase tracking-[0.1em]">{label as string}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 overflow-hidden rounded-3xl border border-white/15 bg-white/10">
                <Image
                  src="/brand/banner.png"
                  width={900}
                  height={560}
                  alt="Cockroach Watch India civic watch platform banner"
                  className="aspect-[16/10] h-full w-full object-cover opacity-80 saturate-150"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat} className="rounded-2xl border border-line bg-white p-4 text-sm font-black uppercase leading-5 tracking-[0.08em] text-ink shadow-card">
                {stat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
