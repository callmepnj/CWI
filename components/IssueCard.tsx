import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { issueActions } from "@/data/issues";

export function IssueCard({
  title,
  description,
  proof,
  icon: Icon
}: {
  title: string;
  description: string;
  proof: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="flex h-full flex-col p-5">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-royal/10 text-royal">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">{title}</h3>
      <p className="mt-4 text-sm leading-6 text-ink/70">{description}</p>
      <p className="mt-4 text-xs font-bold uppercase leading-5 tracking-[0.08em] text-ink/62">
        Useful proof: {proof}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {issueActions.map((action) => (
          <span key={action} className="rounded-full bg-paper px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-ink/70 ring-1 ring-line">
            {action}
          </span>
        ))}
      </div>
      <Link href="/submit" className="mt-auto inline-block pt-6 font-mono text-xs font-black uppercase tracking-[0.16em] text-royal">
        Submit issue
      </Link>
    </Card>
  );
}
