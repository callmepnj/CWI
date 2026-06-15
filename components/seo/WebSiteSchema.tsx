import { site } from "@/lib/site";

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    description: site.description,
    publisher: { "@type": "NewsMediaOrganization", name: site.name, url: site.url },
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/live-newsroom?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
