import Link from "next/link";
import { socials } from "@/data/socials";
import { Card } from "@/components/ui/card";

export function SocialLinks() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {socials.map((social) => {
        const Icon = social.icon;

        return (
          <Card key={social.href} className="group p-5">
            <Link href={social.href} className="block" target={social.href.startsWith("http") ? "_blank" : undefined}>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-skywash text-royal">
                <Icon className="h-6 w-6" />
              </div>
              <p className="mt-5 font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">{social.label}</p>
              <p className="mt-2 break-words text-sm font-bold text-ink/68">{social.handle}</p>
              <p className="mt-5 font-mono text-xs font-black uppercase tracking-[0.14em] text-royal group-hover:text-ink">
                Follow CWI
              </p>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
