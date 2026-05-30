import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileArchive, Megaphone, ShieldCheck } from "lucide-react";
import { CwiGestureBar, CwiJoinButton, CwiTicker, SupportDeclarationForm } from "@/components/CwiCivicLiveKit";
import { PageBackgroundGesture } from "@/components/PageBackgroundGesture";

export const metadata: Metadata = {
  title: "Support CWI - Cockroach Watch India | Independent Civic Watch",
  description:
    "Support Cockroach Watch India - an independent civic watch platform that documents NEET paper leaks, electoral bonds, bulldozer justice, Manipur, and India's unanswered files. No party. No funder. Just citizens.",
  alternates: { canonical: "https://cockroachwatchindia.online/support" },
  openGraph: {
    title: "Support the Watch - Cockroach Watch India",
    description:
      "Support Cockroach Watch India - an independent civic watch platform that documents India's unanswered files. No party. No funder. Just citizens.",
    url: "https://cockroachwatchindia.online/support",
    siteName: "Cockroach Watch India",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Support the Watch - Cockroach Watch India",
    description: "No party. No funder. No compromise. Just citizens keeping the record honest."
  }
};

const refusalItems = [
  "We don't take money from political parties -",
  "We don't soften stories for advertisers -",
  "We don't delete inconvenient facts -",
  "We don't give platforms to hate -",
  "We don't forget what powerful people want buried -",
  "We don't pretend the system is fine -",
  "We don't protect corrupt institutions -",
  "We don't stay silent when youth are wronged -",
  "We don't take sides. We take notes. -",
  "We don't run from accountability. We run toward it. -"
];

const quoteCards = [
  "If the cockroach survives everything - so does the truth.",
  "India has unanswered files. We refuse to close them.",
  "The watch never sleeps because the issues never sleep."
];

const supportReasons = [
  {
    icon: <FileArchive className="h-8 w-8" />,
    heading: "Keep the Files Open",
    text: "India's unanswered files don't close themselves. Your support keeps CWI documenting, updating, and amplifying."
  },
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    heading: "Stay Independent",
    text: "No advertiser. No funder. No party line. Your support is the only thing that keeps CWI free from pressure."
  },
  {
    icon: <Megaphone className="h-8 w-8" />,
    heading: "Amplify Youth Voice",
    text: "Students, citizens, and communities deserve a platform that amplifies their voices - not silences them."
  }
];

export default function SupportPage() {
  return (
    <PageBackgroundGesture intensity="strong">
      <div className="cwi-dark-page min-h-screen">
      <section className="flex min-h-screen items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--cwi-accent-amber)]">This is not a party. This is not a brand.</p>
          <h1 className="cwi-word-reveal mt-6 max-w-5xl text-5xl font-black leading-[0.94] tracking-normal sm:text-7xl lg:text-8xl">
            <span>We</span> <span>Don&apos;t</span> <span>Work</span> <span>for</span> <span>Them.</span><br />
            <span>We</span> <span>Work</span> <span>for</span> <span>You.</span>
          </h1>
          <p className="mt-7 max-w-3xl animate-[word-rise_700ms_ease_1s_forwards] text-lg leading-8 text-[var(--cwi-text-secondary)] opacity-0 sm:text-xl">
            CWI is fully independent. We have no political funder. No corporate sponsor. No party line. Just citizens documenting what India&apos;s powerful would rather you forget.
          </p>
          <div className="my-8 h-px w-full bg-[var(--cwi-accent-amber)] shadow-[0_0_18px_rgba(245,158,11,0.7)]" />
          <div className="grid gap-3 text-lg font-bold text-[var(--cwi-text-primary)]">
            <p className="animate-[word-rise_600ms_ease_1.15s_forwards] opacity-0">No electoral bond. No government grant. No advertiser.</p>
            <p className="animate-[word-rise_600ms_ease_1.35s_forwards] opacity-0">Every story is source-backed. Every file is public memory.</p>
            <p className="animate-[word-rise_600ms_ease_1.55s_forwards] opacity-0">The watch only works if citizens keep it running.</p>
          </div>
          <div className="mt-9"><CwiJoinButton>SUPPORT THE WATCH</CwiJoinButton></div>
        </div>
      </section>

      <CwiTicker items={refusalItems} tone="refusal" />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.72fr] lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--cwi-accent-blue)]">Who we are</p>
          <h2 className="mt-3 text-4xl font-black sm:text-6xl">Built by Youth. Backed by No One But You.</h2>
          <div className="mt-6 grid gap-5 text-lg leading-8 text-[var(--cwi-text-secondary)]">
            <p>Cockroach Watch India started because the news we needed wasn&apos;t being told the way we needed it told. Not softened. Not sanitised. Not spun. Just documented, verified, and amplified.</p>
            <p>We cover NEET paper leaks, electoral bond scandals, bulldozer justice, Manipur, Hathras, Wayanad - the files that keep getting buried. We don&apos;t just cover them once and move on. We keep them open.</p>
            <p>We are not journalists trying to break a career. We are citizens trying to build a record. Every article we publish is public memory - yours and ours.</p>
          </div>
        </div>
        <div className="grid gap-4">
          {quoteCards.map((quote) => (
            <figure key={quote} className="rounded-lg border border-[var(--cwi-border-dark)] border-l-4 border-l-[var(--cwi-accent-blue)] bg-[var(--cwi-card-dark)] p-5">
              <blockquote className="text-xl font-black leading-tight">{quote}</blockquote>
              <figcaption className="mt-3 text-sm font-bold text-[var(--cwi-text-secondary)]">- CWI</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8" id="support-form">
        <div className="mb-7 text-center">
          <h2 className="text-4xl font-black sm:text-6xl">Support the Watch. Keep It Independent.</h2>
          <p className="mt-3 text-[var(--cwi-text-secondary)]">No party. No funder. No compromise. Just citizens keeping the record honest.</p>
        </div>
        <SupportDeclarationForm />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"><CwiGestureBar count="156 citizens" text="already watching. Be next." support /></section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {supportReasons.map((reason) => (
            <article key={reason.heading} className="rounded-lg border border-[var(--cwi-border-dark)] bg-[var(--cwi-card-dark)] p-6">
              <div className="text-[var(--cwi-accent-amber)]">{reason.icon}</div>
              <h3 className="mt-5 text-2xl font-black">{reason.heading}</h3>
              <p className="mt-3 leading-7 text-[var(--cwi-text-secondary)]">{reason.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-4xl text-5xl font-black leading-tight sm:text-7xl">
          Cockroaches survive everything.<br />So does the truth.<br />So do we.
        </h2>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.22em] text-[var(--cwi-accent-amber)]">Cockroach Watch India - Document. Verify. Amplify.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="#support-form"><CwiJoinButton>JOIN THE WATCH</CwiJoinButton></Link>
          <Link href="/live-newsroom" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--cwi-border-dark)] px-5 py-3 font-black text-[var(--cwi-text-primary)] transition hover:border-[var(--cwi-accent-blue)]/70">
            Read Live Newsroom <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
      </PageBackgroundGesture>
    );
  }

