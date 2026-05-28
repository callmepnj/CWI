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
            <Link href={social.href} className="block" target={social.href.startsWith("http") ? "_blank" : undefined} rel={social.href.startsWith("http") ? "noreferrer" : undefined}>
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-cwi-green/10 text-cwi-green">
                <Icon className="h-6 w-6" />
              </div>
              <p className="mt-5 font-display text-2xl font-black uppercase text-cwi-ink">{social.label}</p>
              <p className="mt-2 break-words text-sm font-bold text-cwi-ink/68">{social.handle}</p>
              <p className="mt-5 font-mono text-xs font-black uppercase tracking-[0.14em] text-cwi-green group-hover:text-cwi-ink">Open social link</p>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}