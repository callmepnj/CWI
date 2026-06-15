interface NewsArticleSchemaProps {
  headline: string;
  datePublished: string;
  dateModified?: string;
  description: string;
  url: string;
  imageUrl?: string;
  authorName?: string;
  sectionName?: string;
  sectionUrl?: string;
}

export function NewsArticleSchema({
  headline,
  datePublished,
  dateModified,
  description,
  url,
  imageUrl,
  authorName,
  sectionName = "Live Newsroom",
  sectionUrl = "https://cockroachwatchindia.online/live-newsroom"
}: NewsArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline,
    description,
    datePublished,
    dateModified: dateModified ?? datePublished,
    url,
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "Cockroach Watch India",
      logo: {
        "@type": "ImageObject",
        url: "https://cockroachwatchindia.online/brand/logo.png"
      }
    },
    ...(authorName && {
      author: { "@type": "Organization", name: authorName }
    }),
    ...(imageUrl && {
      image: {
        "@type": "ImageObject",
        url: imageUrl,
        width: 1200,
        height: 630
      }
    })
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://cockroachwatchindia.online" },
      { "@type": "ListItem", position: 2, name: sectionName, item: sectionUrl },
      { "@type": "ListItem", position: 3, name: headline, item: url }
    ]
  };

  const idSuffix = url.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase();

  return (
    <>
      <script
        id={`news-article-schema-${idSuffix}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        id={`breadcrumb-schema-${idSuffix}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
