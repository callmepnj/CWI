export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Cockroach Watch India",
    alternateName: "CWI",
    url: "https://cockroachwatchindia.online",
    logo: "https://cockroachwatchindia.online/brand/logo.png",
    sameAs: [
      "https://x.com/CWatchIndia",
      "https://www.instagram.com/cockroachwatchindia/",
      "https://www.youtube.com/@CockroachWatchIndia",
      "https://bsky.app/profile/cwatchindia.bsky.social"
    ],
    foundingDate: "2026",
    publishingPrinciples: "https://cockroachwatchindia.online/editorial-policy",
    masthead: "https://cockroachwatchindia.online/about",
    correctionsPolicy: "https://cockroachwatchindia.online/corrections",
    ethicsPolicy: "https://cockroachwatchindia.online/editorial-policy"
  };

  return (
    <script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
