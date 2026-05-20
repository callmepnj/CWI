import { Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { site } from "@/lib/site";

export function CreditPolicyBox() {
  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
      <ShieldCheck className="h-8 w-8 text-leaf" />
      <h3 className="mt-4 font-display text-3xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">Creator Credit Is Policy</h3>
      <p className="mt-4 leading-7 text-ink/70">
        No watermark removal. No fake ownership. Credit is mandatory wherever visible and reasonably traceable.
      </p>
      <Link href={`mailto:${site.email}`} className="mt-5 inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-[0.16em] text-royal">
        <Mail className="h-4 w-4" />
        {site.email}
      </Link>
    </div>
  );
}
