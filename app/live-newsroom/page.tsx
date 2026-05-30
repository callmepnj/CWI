import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList, ExternalLink, Radio, Siren } from "lucide-react";
import { CwiGestureBar, CwiTicker, NewsroomJoinForm } from "@/components/CwiCivicLiveKit";
import { PageBackgroundGesture } from "@/components/PageBackgroundGesture";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "CWI Live Newsroom - Cockroach Watch India Latest Updates",
  description:
    "CWI Live Newsroom by Cockroach Watch India tracks source-backed updates on NEET 2026, NTA accountability, student protests, India Unanswered Files, and civic issues with verified context. Updated daily.",
  alternates: { canonical: "https://cockroachwatchindia.online/live-newsroom" },
  openGraph: {
    title: "CWI Live Newsroom - India Is Watching",
    description: "Source-backed civic newsroom. NEET 2026 coverage, India Unanswered Files, protest updates, and public memory archive.",
    url: "https://cockroachwatchindia.online/live-newsroom",
    siteName: "Cockroach Watch India",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "CWI Live Newsroom - India Is Watching",
    description: "Source-backed civic newsroom. NEET 2026 coverage, India Unanswered Files, protest updates, and public memory archive."
  }
};

const tickerItems = [
  "LIVE - NEET UG 2026 re-exam set for June 21. NTA tells Supreme Court security upgraded. Developing.",
  "SC on NEET: 'Very traumatic for students. No lesson learnt.' - May 29, 2026",
  "CBI probe into NEET 2026 paper leak ongoing. Mastermind arrested in Rajasthan network - reported.",
  "LIVE - Supreme Court directs Ministry of Education to file affidavit on exam reform by July hearing.",
  "Manoj Jarange-Patil launches extreme hunger strike on May 30 over OBC reservation demands.",
  "Goa 'Enough Is Enough' movement holds virtual statehood day event after permission denied for public meet.",
  "LIVE - India Unanswered Files: Manipur, Hathras, Electoral Bonds - still open. CWI watching.",
  "CBSE: No confirmed paper leak found in May 2026. Official advisory warns students against fake rumour PDFs.",
  "CWI Newsroom is independent. No party. No funder. Just the watch."
];

const stories = [
  {
    badge: "NEET 2026",
    status: "DEVELOPING",
    statusClass: "text-[var(--cwi-accent-blue)] border-[var(--cwi-accent-blue)]/40 bg-[var(--cwi-accent-blue)]/10",
    title: "NTA Tells Supreme Court: Enhanced Security in Place for June 21 Re-Exam",
    summary:
      "The National Testing Agency presented new safeguards including CCTV checks, forensic surveillance review, and police coordination to the Supreme Court ahead of the rescheduled NEET-UG exam.",
    source: "Times of India / May 29, 2026",
    url: "https://timesofindia.indiatimes.com/education/news/neet-ug-2026-paper-leak-nta-tells-supreme-court-enhanced-security-measures-in-place-for-june-21-re-exam/articleshow/131385769.cms"
  },
  {
    badge: "LEGAL",
    status: "REPORTED",
    statusClass: "text-[var(--cwi-accent-amber)] border-[var(--cwi-accent-amber)]/40 bg-[var(--cwi-accent-amber)]/10",
    title: "'Very Traumatic': Supreme Court Pulls Up Centre Over NEET Paper Leak",
    summary:
      "The Supreme Court said the leak was traumatic for students and directed the Ministry of Education to explain how NEET would be institutionally reformed going forward.",
    source: "Times of India / May 29, 2026",
    url: "https://timesofindia.indiatimes.com/education/news/very-traumatic-supreme-court-pulls-up-center-over-neet-paper-leak/amp_articleshow/131387858.cms"
  },
  {
    badge: "CBI PROBE",
    status: "REPORTED",
    statusClass: "text-[var(--cwi-accent-amber)] border-[var(--cwi-accent-amber)]/40 bg-[var(--cwi-accent-amber)]/10",
    title: "CBI Probe Ongoing: Alleged Mastermind Arrested, Rajasthan Network Under Investigation",
    summary:
      "Reports cited investigators describing handwritten or scanned material circulating as PDFs, with arrests made and the Rajasthan-linked investigation still ongoing.",
    source: "Times of India / May 13-14, 2026",
    url: "https://timesofindia.indiatimes.com/city/jaipur/cbi-arrests-five-including-three-from-jaipur-family-in-neet-paper-leak-case/amp_articleshow/131076288.cms"
  },
  {
    badge: "EXAM REFORM",
    status: "DEVELOPING",
    statusClass: "text-[var(--cwi-accent-blue)] border-[var(--cwi-accent-blue)]/40 bg-[var(--cwi-accent-blue)]/10",
    title: "Petitions Seek NTA Overhaul and Court-Monitored Exam Reforms",
    summary:
      "Multiple petitions in the Supreme Court have called for the dissolution or overhaul of the NTA and demanded court-monitored reform of India's national entrance exam system.",
    source: "Times of India / May 29, 2026",
    url: "https://timesofindia.indiatimes.com/education/news/neet-ug-2026-leak-crisis-reaches-supreme-court-as-petition-seeks-nta-overhaul-court-monitored-exam-reforms/amp_articleshow/131382494.cms"
  },
  {
    badge: "CBSE",
    status: "OFFICIAL ADVISORY - NO CONFIRMED LEAK",
    statusClass: "text-[var(--cwi-alert-red)] border-[var(--cwi-alert-red)]/40 bg-[var(--cwi-alert-red)]/10",
    title: "CBSE: No Confirmed Paper Leak in May 2026 - Board Warned Against Fake Rumours",
    summary:
      "CBSE issued an official advisory in February 2026 warning students, parents, and schools against fake paper leak PDFs circulating on social media. No confirmed CBSE paper leak has been reported in May 2026.",
    source: "CBSE Official Advisory / Telegraph India, Feb 18-20, 2026",
    url: "https://www.cbse.gov.in/cbsenew/documents/Advisory_Fake_News_Rumours_18022026.pdf"
  },
  {
    badge: "CIVIC",
    status: "PROTEST",
    statusClass: "text-[var(--cwi-warning-yellow)] border-[var(--cwi-warning-yellow)]/40 bg-[var(--cwi-warning-yellow)]/10",
    title: "Manoj Jarange-Patil Launches 'Extreme' Hunger Strike Over OBC Reservation Demands",
    summary:
      "Activist Manoj Jarange-Patil announced an extreme hunger strike on May 30 - no food, no water - to pressure the Maharashtra government on Maratha/OBC reservation demands.",
    source: "Hindustan Times / May 29, 2026",
    url: "https://www.hindustantimes.com/cities/mumbai-news/jarangepatil-to-launch-extreme-hunger-strike-on-may-30-without-food-water-shade-101779996387005-amp.html"
  }
];

const files = [
  ["NEET Paper Leak & NTA Accountability", "OPEN", "/india-unanswered-files/neet-paper-leak-nta-accountability"],
  ["Electoral Bonds & Political Funding Transparency", "OPEN", "/india-unanswered-files/electoral-bonds-transparency"],
  ["Manipur Violence", "ONGOING", "/india-unanswered-files/manipur-violence"],
  ["Hathras Caste-Gender Justice Case", "OPEN", "/india-unanswered-files/hathras-caste-gender-justice"],
  ["Bulldozer Justice & Arbitrary Demolitions", "DEVELOPING", "/india-unanswered-files/bulldozer-justice-demolitions"]
];

export default function LiveNewsroomPage() {
  return (
    <PageBackgroundGesture intensity="moderate">
      <div className="cwi-dark-page min-h-screen">
      <CwiTicker items={tickerItems} />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--cwi-alert-red)]/35 bg-[var(--cwi-alert-red)]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[var(--cwi-alert-red)]">
            <Radio className="h-3.5 w-3.5" /> Live civic desk
          </div>
          <h1 className="text-5xl font-black leading-[0.95] tracking-normal text-[var(--cwi-text-primary)] sm:text-6xl lg:text-7xl">India Is Watching. And We&apos;re Writing It Down.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--cwi-text-secondary)] sm:text-xl">
            CWI Live Newsroom tracks what matters - student rights, civic accountability, public memory, and the questions no one wants to answer.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#stories" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--cwi-accent-blue)] px-5 py-3 font-bold text-white shadow-[0_0_24px_rgba(59,130,246,0.28)] transition hover:-translate-y-0.5">
              <Siren className="h-4 w-4" /> Enter Newsroom
            </Link>
            <Link href="#india-unanswered-files" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--cwi-border-dark)] px-5 py-3 font-bold text-[var(--cwi-text-primary)] transition hover:border-[var(--cwi-accent-amber)]/60">
              <ClipboardList className="h-4 w-4" /> Read India Unanswered Files
            </Link>
          </div>
          <div className="mt-8 rounded-lg border border-[var(--cwi-border-dark)] bg-[var(--cwi-card-dark)] px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.08em] text-[var(--cwi-accent-amber)] sm:text-sm">
            17 Open Files <span className="text-[var(--cwi-text-secondary)]">|</span> 3 Active Investigations <span className="text-[var(--cwi-text-secondary)]">|</span> 22L+ Students Affected by NEET Leak <span className="text-[var(--cwi-text-secondary)]">|</span> Updated: 30 May 2026
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><CwiGestureBar count="143 citizens" text="have joined the CWI Watch. Join them." /></section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8" id="join-watch">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black sm:text-5xl">You See It. We Document It. Join the Watch.</h2>
          <p className="mt-3 text-[var(--cwi-text-secondary)]">No spam. No party. No funder. Just citizens who refuse to look away.</p>
        </div>
        <NewsroomJoinForm />
      </section>

      <section id="stories" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--cwi-accent-amber)]">Live newsroom stories</p>
            <h2 className="mt-2 text-3xl font-black sm:text-5xl">Source-backed updates</h2>
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {stories.map((story) => <StoryCard key={story.title} story={story} />)}
        </div>
      </section>

      <section id="india-unanswered-files" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black sm:text-5xl">India&apos;s Unanswered Files - Still Open</h2>
        <div className="mt-7 flex gap-4 overflow-x-auto pb-4">
          {files.map(([title, status, href]) => (
            <Link key={title} href={href} className="min-w-[270px] rounded-lg border border-[var(--cwi-border-dark)] border-l-4 border-l-[var(--cwi-accent-amber)] bg-[var(--cwi-card-dark)] p-5 transition hover:-translate-y-1 hover:border-[var(--cwi-accent-amber)]/55">
              <span className="rounded-full border border-[var(--cwi-accent-amber)]/35 px-2 py-1 text-xs font-black text-[var(--cwi-accent-amber)]">{status}</span>
              <h3 className="mt-4 text-xl font-black leading-tight">{title}</h3>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--cwi-accent-blue)]">View File <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
          <Link href="/india-unanswered-files" className="grid min-w-[270px] place-items-center rounded-lg border border-[var(--cwi-accent-blue)]/45 bg-[var(--cwi-accent-blue)]/10 p-5 text-center font-black text-[var(--cwi-text-primary)]">
            View All 17 Unanswered Files <ArrowRight className="mt-3 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
      </PageBackgroundGesture>
    );
  }

function StoryCard({ story }: { story: (typeof stories)[number] }) {
  return (
    <article className="rounded-lg border border-[var(--cwi-border-dark)] bg-[var(--cwi-card-dark)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[var(--cwi-accent-blue)]/12 px-2.5 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--cwi-accent-blue)]">{story.badge}</span>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-black uppercase tracking-[0.08em] ${story.statusClass}`}>{story.status}</span>
      </div>
      <h3 className="mt-4 text-2xl font-black leading-tight text-[var(--cwi-text-primary)]">{story.title}</h3>
      <p className="mt-3 line-clamp-2 leading-7 text-[var(--cwi-text-secondary)]">{story.summary}</p>
      <p className="mt-5 text-sm font-bold text-[var(--cwi-text-secondary)]">Source: {story.source}</p>
      <a href={story.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 font-black text-[var(--cwi-accent-amber)]">
        Read More <ExternalLink className="h-4 w-4" />
      </a>
    </article>
  );
}

