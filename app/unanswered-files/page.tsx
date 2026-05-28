import { CwiButtonLink, CwiDossierCard, CwiMasthead, CwiPageShell, CwiSectionHeader, CwiSubmitCTA, CwiTrustStrip } from "@/components/CwiDesignSystem";
import { UnansweredFilesGrid } from "@/components/UnansweredFilesGrid";
import { unansweredFiles, unansweredFilesKeywords } from "@/data/unanswered-files";
import { getLiveUpdates } from "@/data/live-newsroom";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const pagePath = "/india-unanswered-files";
const pageDescription = "Public issues where records, responsibility, or official answers still need closer tracking.";

export const metadata = createMetadata({
  title: "India Unanswered Files - Cockroach Watch India",
  description: pageDescription,
  path: pagePath,
  keywords: [...unansweredFilesKeywords, "India Unanswered Files", "CWI dossier files"]
});

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "India Unanswered Files",
  url: absoluteUrl(pagePath),
  description: pageDescription,
  publisher: { "@type": "NewsMediaOrganization", name: site.name, url: site.url },
  hasPart: unansweredFiles.map((file, index) => ({
    "@type": "Article",
    position: index + 1,
    headline: file.title,
    url: absoluteUrl(`${pagePath}/${file.slug}`),
    articleSection: file.category
  }))
};

const filters = ["Students", "Justice", "Environment", "Governance", "Digital Rights", "Public Safety"];

export default function UnansweredFilesPage() {
  const priorityFiles = unansweredFiles.slice(0, 6);
  const relatedUpdates = getLiveUpdates(3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <CwiPageShell>
        <CwiMasthead
          label="CWI public files"
          title="India Unanswered Files"
          subtitle={pageDescription}
          body="Dossier-style records for public issues where timelines, responsibility, official response, legal status, or public harm need continued tracking."
          primaryCta={{ href: "#cases", label: "Browse files" }}
          secondaryCta={{ href: "/submit", label: "Send source or correction" }}
          meta={["Dossier style", `${unansweredFiles.length} files`, "Correction open", "Source trail visible"]}
        />

        <div className="mt-6"><CwiTrustStrip items={["No overstatement", "Sources shown", "Unanswered questions visible", "Official response separated"]} /></div>

        <section className="mt-10">
          <CwiSectionHeader eyebrow="Priority files" title="Open files CWI is tracking" subtitle="Six priority dossiers first. Use filters and pagination for the rest." />
          <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => <span key={filter} className="shrink-0 rounded-full border border-cwi-brown/18 bg-white px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.12em] text-cwi-brown">{filter}</span>)}
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {priorityFiles.map((file) => (
              <CwiDossierCard
                key={file.slug}
                href={`${pagePath}/${file.slug}`}
                title={file.title}
                question={file.unansweredQuestion || file.unansweredQuestions[0] || file.summary}
                meta={[file.category, file.status, `${file.sourceCount} sources`]}
              />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <CwiSectionHeader eyebrow="Dossier grid" title="Browse all files" subtitle="Search, filter, and open files without loading a dense wall of cards." />
          <UnansweredFilesGrid files={unansweredFiles} />
        </section>

        <div className="mt-12"><CwiSubmitCTA /></div>

        <section className="mt-12">
          <CwiSectionHeader eyebrow="Related Live Newsroom updates" title="Current updates belong in Live Newsroom" />
          <div className="grid gap-5 md:grid-cols-3">
            {relatedUpdates.map((item) => (
              <a key={item.id} href={`/live-newsroom/${item.slug}`} className="rounded-lg border border-cwi-brown/18 bg-white/78 p-5 transition hover:border-cwi-green/35">
                <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-cwi-green">{item.status} / {item.category}</p>
                <h3 className="mt-3 font-display text-xl font-black uppercase leading-tight text-cwi-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-cwi-ink/68">{item.summary}</p>
              </a>
            ))}
          </div>
          <div className="mt-6"><CwiButtonLink href="/live-newsroom" variant="secondary">Open Live Newsroom</CwiButtonLink></div>
        </section>
      </CwiPageShell>
    </>
  );
}