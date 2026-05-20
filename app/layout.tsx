import type { Metadata } from "next";
import type React from "react";
import { Archivo, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

const display = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display"
});

const sans = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Cockroach Watch India — Civic Watch, Youth Voice & Movement Archive",
    template: "%s | Cockroach Watch India"
  },
  description: site.description,
  keywords: site.keywords,
  openGraph: {
    title: "Cockroach Watch India — Civic Watch, Youth Voice & Movement Archive",
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: [
      {
        url: "/brand/banner.png",
        width: 1200,
        height: 630,
        alt: "Cockroach Watch India civic watch banner"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Cockroach Watch India",
    description: site.description,
    images: ["/brand/banner.png"]
  },
  icons: {
    icon: "/brand/logo.png",
    apple: "/brand/logo.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <DisclaimerBanner />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
