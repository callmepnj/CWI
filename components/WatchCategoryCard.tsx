import { Bell, FileSearch, Megaphone, Newspaper, RadioTower, ShieldCheck, UsersRound, Zap } from "lucide-react";
import { Card, CardLabel } from "@/components/ui/card";

const icons = [RadioTower, FileSearch, ShieldCheck, Megaphone, UsersRound, Newspaper, Bell, Zap];

export function WatchCategoryCard({ title, summary, index }: { title: string; summary: string; index: number }) {
  const Icon = icons[index % icons.length];

  return (
    <Card className="h-full">
      <CardLabel>Watch Track</CardLabel>
      <Icon className="h-8 w-8 text-royal" />
      <h3 className="mt-5 font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">
        {title}
      </h3>
      <p className="mt-4 leading-7 text-ink/70">{summary}</p>
    </Card>
  );
}
