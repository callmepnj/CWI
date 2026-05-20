import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Section } from "@/components/Section";
import { SocialLinks } from "@/components/SocialLinks";
import { Card, CardLabel } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact CWI",
  description: "Contact Cockroach Watch India for media inquiry, creator credit, takedown request, submit issue, collaboration, correction, or watcher role."
};

const categories = [
  "Media inquiry",
  "Creator credit",
  "Takedown request",
  "Submit issue",
  "Collaboration",
  "Correction",
  "Volunteer / Watcher role",
  "Telegram community"
];

export default function ContactPage() {
  return (
    <Section eyebrow="Contact" title="Contact CWI" subtitle="For public issues, correction requests, creator credit, takedown review, collaboration, and Watcher roles.">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardLabel>Support Email</CardLabel>
          <Mail className="h-8 w-8 text-royal" />
          <h2 className="mt-5 break-words font-display text-3xl font-black uppercase leading-tight tracking-[-0.04em]">{site.email}</h2>
          <Button asChild className="mt-7">
            <Link href={`mailto:${site.email}`}>Email CWI</Link>
          </Button>
        </Card>
        <Card>
          <CardLabel>Contact Categories</CardLabel>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((category) => (
              <p key={category} className="rounded-2xl border border-line bg-paper p-3 font-black uppercase tracking-[0.08em]">
                {category}
              </p>
            ))}
          </div>
        </Card>
      </div>
      <div className="mt-8">
        <SocialLinks />
      </div>
    </Section>
  );
}
