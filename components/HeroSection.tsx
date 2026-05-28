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
            Founder-led civic watch platform
          </p>
          <h1 className="max-w-5xl font-display text-5xl font-black uppercase leading-[0.92] tracking-[-0.06em] text-ink sm:text-7xl lg:text-8xl">
            Cockroach Watch India — CWI Civic Watch Platform
          </h1>
          <p className="mt-7 max-w-3xl text-xl font-semibold leading-9 text-ink/82">
            A founder-led civic watch platform documenting youth voice, public issues, civic satire, viral moments, creator culture, and the Cockroach wave across India.
          </p>
          <p className="mt-5 max-w-3xl leading-8 text-ink/68">
            Cockroach Watch India, also known as CWI, is a founder-led independent civic watch platform documenting youth voice, public issues, civic satire, creator credit, viral claims, and public memory across India.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/submit">Submit a civic report to CWI <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="green">
              <Link href="/archive">Read the CWI Archive</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/join">Join the CWI Watch</Link>
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild size="sm" variant="ghost">
              <Link href={site.youtube} target="_blank">YouTube</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href={site.x} target="_blank">Follow on X</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href={site.instagram} target="_blank">Instagram</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href={site.telegram} target="_blank">Telegram</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href={site.bluesky} target="_blank">Bluesky</Link>
            </Button>
          </div>
          <p className="mt-8 flex max-w-3xl items-start gap-3 rounded-3xl border border-royal/15 bg-skywash/85 p-4 text-sm font-bold uppercase leading-6 tracking-[0.06em] text-ink/70">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-royal" />
            {site.shortDisclaimer}
          </p>
        </div>
        <div className="relative">
          <div className="rounded-[2rem] border border-line bg-white p-4 shadow-soft">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-ink via-[#102a63] to-royal p-6 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.22em] text-saffron">
                    CWI Archive
                  </p>
                  <p className="mt-3 font-display text-4xl font-black uppercase leading-none">Public Memory Command</p>
                </div>
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-white/10 ring-1 ring-white/20">
                  <RadioTower className="h-8 w-8 text-saffron" />
                </div>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["Live Newsroom", FileCheck2],
                  ["India Files", UsersRound],
                  ["Submit Evidence", Siren]
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
