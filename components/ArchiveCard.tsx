import { Download, ExternalLink } from "lucide-react";
import { Card, CardLabel } from "@/components/ui/card";

export function ArchiveCard({
  title,
  kind,
  credit,
  platform,
  permission
}: {
  title: string;
  kind: string;
  credit: string;
  platform: string;
  permission: string;
}) {
  return (
    <Card className="p-5">
      <div className="grid aspect-[4/3] place-items-center rounded-3xl bg-gradient-to-br from-ink to-royal text-center text-white">
        <div>
          <p className="font-display text-4xl font-black uppercase">CWI</p>
          <p className="mt-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-saffron">{kind}</p>
        </div>
      </div>
      <CardLabel className="mt-5">{kind}</CardLabel>
      <h3 className="font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em]">{title}</h3>
      <p className="mt-4 text-sm font-bold text-ink/68">Creator credit: {credit}</p>
      <p className="mt-2 text-sm font-bold text-ink/68">Platform: {platform}</p>
      <p className="mt-2 text-sm font-bold text-ink/68">Permission: {permission}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 text-xs font-black uppercase tracking-[0.12em]">
          <Download className="h-4 w-4" />
          Download/share
        </button>
        <a href="/credit-policy" className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 text-xs font-black uppercase tracking-[0.12em]">
          <ExternalLink className="h-4 w-4" />
          Takedown
        </a>
      </div>
    </Card>
  );
}
