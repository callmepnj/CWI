import { CwiButtonLink, CwiMasthead, CwiPageShell, CwiSectionHeader, CwiSubmitCTA, CwiTrustStrip } from "@/components/CwiDesignSystem";
import { PageBackgroundGesture } from "@/components/PageBackgroundGesture";
import { WatchDeskGrid } from "@/components/WatchDeskGrid";
import { posts, type WatchPost } from "@/data/posts";
import { getPublishedWatchPosts } from "@/lib/db/articles";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const pageDescription = "Older explainers, context posts, and preserved CWI records. Current source-backed updates now live in the Live Newsroom.";

export const metadata = createMetadata({
  title: "CWI Archive - Older Explainers and Context Posts",
  description: pageDescription,
  path: "/archive",
  keywords: ["CWI Archive", "Cockroach Watch India archive", "older CWI explainers", "civic context posts"]
});

const archiveJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "CWI Archive",
  url: absoluteUrl("/archive"),
  description: pageDescription,
  publisher: {
    "@type": "NewsMediaOrganization",
    name: site.name,
    url: site.url
  },
  hasPart: posts.slice(0, 20).map((post, index) => ({
    "@type": "Article",
    position: index + 1,
    headline: post.title,
    url: absoluteUrl(`/archive/${post.slug}`),
    articleSection: post.category
  }))
};

export const revalidate = 300;

export default async function ArchivePage() {
  const dbPosts = await getPublishedWatchPosts(80).catch(() => []);
  const sortedPosts = mergePosts([...posts, ...dbPosts]).sort((first, second) => dateValue(second.updatedAt) - dateValue(first.updatedAt));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(archiveJsonLd) }} />
      <PageBackgroundGesture intensity="moderate">
        <CwiPageShell>
        <CwiMasthead
          label="CWI Archive"
          title="Older records. Current updates live in the Live Newsroom."
          subtitle={pageDescription}
          primaryCta={{ href: "/live-newsroom", label: "Enter Live Newsroom" }}
          secondaryCta={{ href: "#archive-list", label: "Browse Archive" }}
          meta={["Archived context", `${sortedPosts.length} preserved posts`, "Corrections open", "Canonical archive"]}
        />

        <div className="mt-6">
          <CwiTrustStrip items={["Archive is secondary", "Live Newsroom is current", "Older context labelled", "Source trail preserved"]} />
        </div>

        <section id="archive-list" className="mt-12">
          <CwiSectionHeader
            eyebrow="Archived context"
            title="CWI Archive"
            subtitle="Older explainers and context posts. Use Live Newsroom for current daily updates, developing claims, advisories, and corrections."
          />
          <WatchDeskGrid posts={sortedPosts} />
        </section>

        <section className="mt-12 grid gap-5 rounded-lg border border-cwi-brown/18 bg-white/72 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-cwi-green">Need current status?</p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase leading-tight text-cwi-ink">Check today before sharing old context.</h2>
            <p className="mt-3 leading-7 text-cwi-ink/68">Archive posts preserve the record, but dates and platform details can change. The Live Newsroom carries current updates and verification notes.</p>
          </div>
          <CwiButtonLink href="/live-newsroom">Open Live Newsroom</CwiButtonLink>
        </section>

        <div className="mt-12">
          <CwiSubmitCTA />
        </div>
      </CwiPageShell>
      </PageBackgroundGesture>
    </>
  );
}

function dateValue(value: string) {
  return new Date(`${value}T00:00:00+05:30`).getTime();
}
function mergePosts(items: WatchPost[]) {
  return Array.from(new Map(items.map((item) => [item.slug, item])).values());
}