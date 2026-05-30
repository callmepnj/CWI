import Link from "next/link";
import { Mail } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { CwiButtonLink, CwiMasthead, CwiPageShell, CwiSectionHeader } from "@/components/CwiDesignSystem";
import { PageBackgroundGesture } from "@/components/PageBackgroundGesture";
import { SocialLinks } from "@/components/SocialLinks";
import { Card, CardLabel } from "@/components/ui/card";
import { site } from "@/lib/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact Cockroach Watch India - CWI",
  description: "Contact CWI for email, source/correction, creator credit, takedown, support questions, and social links.",
  path: "/contact",
  keywords: ["Contact CWI", "Cockroach Watch India contact", "CWI correction request"]
});

const contactCards = [
  ["Submit source/correction", "/submit"],
  ["Creator credit/takedown", "/credit-policy"],
  ["Support questions", "/support"],
  ["Editorial policy", "/editorial-policy"]
];

export default function ContactPage() {
  return (
    <PageBackgroundGesture intensity="moderate">
      <CwiPageShell>
      <CwiMasthead
        label="Contact CWI"
        title="Contact Cockroach Watch India"
        subtitle="Email, source/correction intake, creator credit, takedown, support questions, and social links."
        primaryCta={{ href: "/submit", label: "Send source or correction" }}
        secondaryCta={{ href: `mailto:${site.email}`, label: "Email CWI" }}
        meta={["Clean contact", "Corrections open", "No private data unless needed"]}
      />

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="grid gap-6">
          <Card>
            <CardLabel>Email</CardLabel>
            <Mail className="h-8 w-8 text-cwi-green" />
            <h2 className="mt-5 break-words font-display text-3xl font-black uppercase leading-tight text-cwi-ink">{site.email}</h2>
            <CwiButtonLink href={`mailto:${site.email}`} className="mt-7">Email CWI</CwiButtonLink>
          </Card>
          <Card>
            <CwiSectionHeader eyebrow="Common routes" title="Use the right desk" />
            <div className="grid gap-3">
              {contactCards.map(([label, href]) => <Link key={href} href={href} className="rounded-lg border border-cwi-brown/14 bg-cwi-cream p-4 font-black uppercase tracking-[0.08em] text-cwi-ink hover:text-cwi-green">{label}</Link>)}
            </div>
          </Card>
        </div>
        <ContactForm />
      </section>

      <section className="mt-10">
        <CwiSectionHeader eyebrow="Social" title="CWI social links" />
        <SocialLinks />
      </section>
    </CwiPageShell>
      </PageBackgroundGesture>
    );
  }