import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { Card, CardLabel } from "@/components/ui/card";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Creator Credit Policy",
  description: "CWI creator credit, correction, and takedown policy for reposted, quoted, explained, or archived content."
};

const policies = [
  "We do not remove watermarks.",
  "We do not claim ownership of user-created content.",
  "We credit original creators wherever visible.",
  "We respond to correction and takedown requests.",
  "We may use short clips for commentary, criticism, explanation, or public-interest discussion where legally allowed.",
  "Permission is preferred for reposting full videos.",
  "If content includes private individuals, minors, or safety concerns, CWI may blur, remove, or decline publication."
];

export default function CreditPolicyPage() {
  return (
    <Section eyebrow="Creator Rights" title="Creator Credit Policy" subtitle="CWI respects creators. If we use, repost, quote, explain, or archive your content, we will try to credit your public handle clearly. If you want content removed, corrected, or credited differently, contact us.">
      <Card>
        <CardLabel>Policy Desk</CardLabel>
        <p className="text-lg font-black uppercase tracking-[0.08em] text-royal">
          Email: <Link href={`mailto:${site.email}`} className="underline">{site.email}</Link>
        </p>
        <div className="mt-8 grid gap-3">
          {policies.map((policy) => (
            <p key={policy} className="rounded-2xl border border-line bg-paper p-4 font-bold leading-7">
              {policy}
            </p>
          ))}
        </div>
      </Card>
    </Section>
  );
}
