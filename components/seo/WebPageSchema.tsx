interface WebPageSchemaProps {
  type?: "WebPage" | "AboutPage" | "ContactPage";
  name: string;
  description: string;
  url: string;
}

export function WebPageSchema({ type = "WebPage", name, description, url }: WebPageSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "Cockroach Watch India",
      url: "https://cockroachwatchindia.online"
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "Cockroach Watch India",
      url: "https://cockroachwatchindia.online",
      logo: {
        "@type": "ImageObject",
        url: "https://cockroachwatchindia.online/brand/logo.png"
      }
    }
  };

  const idSuffix = url.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase();

  return (
    <script
      id={`webpage-schema-${idSuffix}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
