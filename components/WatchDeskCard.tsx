import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardLabel } from "@/components/ui/card";
import { VerificationBadge } from "@/components/VerificationBadge";
import type { WatchPost } from "@/data/posts";

export function WatchDeskCard({ post }: { post: WatchPost }) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CardLabel className="mb-0">{post.category}</CardLabel>
        <VerificationBadge status={post.verificationStatus} />
      </div>
      <h3 className="mt-5 font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">{post.title}</h3>
      <p className="mt-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-ink/50">{post.date}</p>
      <p className="mt-5 flex-1 leading-7 text-ink/70">{post.summary}</p>
      <p className="mt-5 text-xs font-bold uppercase leading-5 tracking-[0.08em] text-ink/58">
        Source/Credit: {post.sourceLabel} · {post.credit}
      </p>
      <Link href={`/watch-desk/${post.slug}`} className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-[0.16em] text-royal">
        Read more <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}
