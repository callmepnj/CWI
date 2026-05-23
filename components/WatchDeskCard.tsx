import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Card, CardLabel } from "@/components/ui/card";
import type { WatchPost } from "@/data/posts";

export function WatchDeskCard({ post }: { post: WatchPost }) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-2">
          <CardLabel className="mb-0">{post.category}</CardLabel>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.14em] text-white">
            <CalendarDays className="h-3.5 w-3.5 text-saffron" />
            {formatArticleDate(post.date)}
          </span>
        </div>
        <VerificationBadge status={post.verificationStatus} />
      </div>
      <h3 className="mt-5 font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">{post.title}</h3>
      <p className="mt-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-ink/50">
        Updated {formatArticleDate(post.updatedAt)} / {post.sources.length} sources / {post.readingMinutes} min read
      </p>
      <p className="mt-5 flex-1 leading-7 text-ink/70">{post.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {post.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-paper px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.1em] text-ink/58 ring-1 ring-line">
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-5 text-xs font-bold uppercase leading-5 tracking-[0.08em] text-ink/58">
        Source/Credit: {post.sourceLabel} / {post.credit}
      </p>
      <Link href={`/watch-desk/${post.slug}`} className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-[0.16em] text-royal">
        Read on CWI Watch Desk <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}

function formatArticleDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00+05:30`));
}
