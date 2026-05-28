import { CwiButtonLink, CwiDossierCard, CwiEditorialCard, CwiLeadCard, CwiMasthead, CwiPageShell, CwiSectionHeader, CwiSubmitCTA, CwiTimeline, CwiTrustStrip } from "@/components/CwiDesignSystem";
import { getLeadStory, getLiveUpdates, getTodaysTopItems, getWhatChangedToday, todaysBriefs } from "@/data/live-newsroom";
import { posts } from "@/data/posts";
import { unansweredFiles } from "@/data/unanswered-files";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const description = "Cockroach Watch India is an independent civic watch, satire, commentary, Live Newsroom, and public archive platform tracking public issues, viral claims, source trails, corrections, youth voice, and India Unanswered Files.";

export const metadata = createMetadata({
  title: "Cockroach Watch India - CWI Live Newsroom",
  description,
  path: "/",
  keywords: ["Cockroach Watch India", "CWI Live Newsroom", "India Unanswered Files", "Submit source correction", "CWI Archive"]
});

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  email: site.email,
  sameAs: [site.x, site.instagram, site.youtube, site.reddit, site.facebook, site.bluesky]
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  description,
  potentialAction: {
    "@type": "SearchAction",
    target: `${site.url}/live-newsroom?search={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

export default function HomePage() {
  const todaysTop = getTodaysTopItems(3);
  const changedToday = getWhatChangedToday(4);
  const leadStory = getLeadStory();
  const latestUpdates = getLiveUpdates(3);
  const archiveItems = [...posts].sort((first, second) => dateValue(second.updatedAt) - dateValue(first.updatedAt)).slice(0, 3);
  const priorityFiles = unansweredFiles.slice(0, 3);
  const todayBrief = todaysBriefs[0];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <CwiPageShell>
        <CwiMasthead
          label="CWI Live Newsroom is the main desk"
          title="Cockroach Watch India - CWI"
          subtitle="Document. Verify. Amplify."
          body={description}
          primaryCta={{ href: "/live-newsroom", label: "Enter Live Newsroom" }}
          secondaryCta={{ href: "/submit", label: "Submit Source or Correction" }}
          tertiaryCta={{ href: "/support", label: "Support CWI" }}
          meta={["Independent", "Source-led", "Human approved", "Corrections open"]}
        />

        <div className="mt-6">
          <CwiTrustStrip items={["What changed today", "What remains unclear", "Source trail visible", "Correction path open"]} />
        </div>

        <section className="mt-12">
          <CwiSectionHeader
            eyebrow="Today from Live Newsroom"
            title="What readers should check first"
            subtitle={todayBrief?.whatChanged ?? "Current daily updates, developing claims, advisories, and verification notes live in the newsroom."}
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {todaysTop.map((item) => (
              <CwiEditorialCard
                key={item.id}
                href={`/live-newsroom/${item.slug}`}
                label={item.status}
                title={item.title}
                summary={item.summary}
                meta={[item.changeType, `${item.sourceTrail.length} sources`, formatTime(item.lastUpdatedAt)]}
              />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <CwiSectionHeader
            eyebrow="Daily log"
            title="What Changed Today preview"
            subtitle="A short look at updates CWI added, corrected, or is still checking."
          />
          <CwiTimeline
            items={changedToday.map((item) => ({
              time: formatTime(item.lastUpdatedAt),
              title: item.title,
              body: item.whatChanged,
              badge: item.changeType,
              meta: `${item.status} / ${item.sourceTrail.length} sources`
            }))}
          />
        </section>

        {leadStory ? (
          <section className="mt-12">
            <CwiSectionHeader eyebrow="Lead Story" title="The main record right now" />
            <CwiLeadCard
              image={leadStory.displayImage?.startsWith("/") ? leadStory.displayImage : undefined}
              alt={leadStory.displayImageAlt}
              label={leadStory.status}
              title={leadStory.title}
              summary={leadStory.summary}
              href={`/live-newsroom/${leadStory.slug}`}
            >
              <div className="grid gap-3 text-sm font-bold leading-6 text-cwi-ink/70 sm:grid-cols-2">
                <p className="rounded-lg border border-cwi-brown/14 bg-cwi-cream p-3">What changed: {leadStory.whatChanged}</p>
                <p className="rounded-lg border border-cwi-brown/14 bg-cwi-cream p-3">Still unclear: {leadStory.whatWeDontKnow}</p>
              </div>
            </CwiLeadCard>
          </section>
        ) : null}

        <section className="mt-12">
          <CwiSectionHeader eyebrow="Developing desk" title="Latest updates" subtitle="Compact newsroom feed from the current public record." />
          <div className="divide-y divide-cwi-brown/12 overflow-hidden rounded-lg border border-cwi-brown/18 bg-white/78">
            {latestUpdates.map((item) => (
              <a key={item.id} href={`/live-newsroom/${item.slug}`} className="grid gap-2 p-4 transition hover:bg-cwi-cream sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-cwi-green">{item.status} / {item.category}</p>
                  <h3 className="mt-1 font-display text-xl font-black uppercase leading-tight text-cwi-ink">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-cwi-ink/68">{item.summary}</p>
                </div>
                <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-cwi-brown/70">{formatTime(item.lastUpdatedAt)} / {item.sourceTrail.length} sources</span>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <CwiSectionHeader
            eyebrow="Public files"
            title="India Unanswered Files preview"
            subtitle="Priority files where records, responsibility, or official answers still need closer tracking."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {priorityFiles.map((file) => (
              <CwiDossierCard
                key={file.slug}
                href={`/india-unanswered-files/${file.slug}`}
                title={file.title}
                question={file.unansweredQuestions[0] ?? file.summary}
                meta={[file.category, `${file.sourceCount} sources`, file.status]}
              />
            ))}
          </div>
          <div className="mt-6">
            <CwiButtonLink href="/india-unanswered-files" variant="secondary">View all files</CwiButtonLink>
          </div>
        </section>

        <div className="mt-12">
          <CwiSubmitCTA />
        </div>

        <section className="mt-12 grid gap-5 rounded-lg border border-cwi-brown/18 bg-white/72 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-cwi-green">Support CWI</p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase leading-tight text-cwi-ink">Keep the newsroom online.</h2>
            <p className="mt-3 leading-7 text-cwi-ink/68">Support keeps CWI online. It does not buy coverage, influence, or membership.</p>
          </div>
          <CwiButtonLink href="/support" variant="saffron">Support CWI</CwiButtonLink>
        </section>

        <section className="mt-12">
          <CwiSectionHeader eyebrow="From the Archive" title="Older explainers and context" subtitle="Archive is preserved context. Current updates live in Live Newsroom." />
          <div className="grid gap-5 md:grid-cols-3">
            {archiveItems.map((post) => (
              <CwiEditorialCard
                key={post.slug}
                href={`/archive/${post.slug}`}
                label="Archived context"
                title={post.title}
                summary={post.summary}
                meta={[post.category, `${post.sources.length} sources`, formatDate(post.updatedAt)]}
              />
            ))}
          </div>
          <div className="mt-6">
            <CwiButtonLink href="/archive" variant="secondary">Browse Archive</CwiButtonLink>
          </div>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-lg border border-cwi-brown/18 bg-white/78 p-6">
            <CwiSectionHeader eyebrow="About CWI" title="Independent, direct, and correction-open" />
            <p className="leading-8 text-cwi-ink/70">
              CWI tracks public issues, viral claims, source trails, corrections, youth voice, and India Unanswered Files with editorial distance from political parties and organizations unless officially declared.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CwiButtonLink href="/about" variant="secondary">About CWI</CwiButtonLink>
              <CwiButtonLink href="/editorial-policy" variant="secondary">Editorial Policy</CwiButtonLink>
              <CwiButtonLink href="/corrections" variant="secondary">Corrections</CwiButtonLink>
            </div>
          </div>
          <div className="rounded-lg border border-cwi-green bg-cwi-green p-6 text-cwi-cream">
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-cwi-saffron">Join Watchlist</p>
            <h2 className="mt-3 font-display text-3xl font-black uppercase leading-tight">Send sources. Follow the record.</h2>
            <p className="mt-4 leading-7 text-cwi-cream/78">Use the submit desk for source links, corrections, creator credit, missing context, or public issue leads. CWI reviews before publishing.</p>
            <CwiButtonLink href="/submit" variant="saffron" className="mt-6">Send source or correction</CwiButtonLink>
          </div>
        </section>
      </CwiPageShell>
    </>
  );
}

function dateValue(value: string) {
  return new Date(`${value}T00:00:00+05:30`).getTime();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00+05:30`));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).format(new Date(value));
}