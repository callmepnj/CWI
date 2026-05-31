import type { Metadata } from "next";
import type React from "react";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Footer } from "@/components/Footer";
import { FloatingJoinButton } from "@/components/FloatingJoinButton";
import { MobileNav } from "@/components/MobileNav";
import { Navbar } from "@/components/Navbar";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display"
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  ...createMetadata({
    title: "Cockroach Watch India - CWI Live Newsroom",
    description: site.description,
    path: "/"
  }),
  metadataBase: new URL(site.url),
  applicationName: site.name,
  manifest: "/manifest.webmanifest",
  category: "civic media",
  verification: {
    google: "Wqz_bAcrTX-o4uXV83OWMUA3qSLYj3lHYanoWci9BPY"
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png", sizes: "512x512" }
    ],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "512x512" }]
  }
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  email: site.email,
  description: "Founder-led civic watch, satire, and commentary platform.",
  logo: `${site.url}/brand/logo.png`,
  sameAs: [site.x, site.instagram, site.youtube, site.telegram, site.reddit, site.facebook, site.bluesky]
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  description: site.description,
  potentialAction: {
    "@type": "SearchAction",
    target: `${site.url}/live-newsroom?search={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var stored=localStorage.getItem('cwi-theme');var system=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var theme=stored||'light';document.documentElement.classList.toggle('dark',theme==='dark');document.documentElement.dataset.theme=theme;}catch(e){document.documentElement.classList.remove('dark');document.documentElement.dataset.theme='light';}})();`
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <DisclaimerBanner />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <MobileNav />
        <FloatingJoinButton />
      </body>
    </html>
  );
}






