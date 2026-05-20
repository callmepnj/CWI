import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card, CardLabel } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function RoleCard({
  title,
  description,
  submits,
  examples,
  cta,
  icon: Icon
}: {
  title: string;
  description: string;
  submits: string;
  examples: string;
  cta: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardLabel>Watcher Role</CardLabel>
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-skywash text-royal">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">{title}</h3>
      <p className="mt-4 leading-7 text-ink/70">{description}</p>
      <div className="mt-6 space-y-3 text-sm">
        <p>
          <span className="font-black uppercase tracking-[0.12em]">Can submit:</span> {submits}
        </p>
        <p>
          <span className="font-black uppercase tracking-[0.12em]">Examples:</span> {examples}
        </p>
      </div>
      <div className="mt-auto pt-7">
        <Button asChild variant="outline" className="w-full text-[0.68rem] sm:text-xs">
          <Link href="/submit">{cta}</Link>
        </Button>
      </div>
    </Card>
  );
}
