import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Card, CardLabel } from "@/components/ui/card";
import { posts } from "@/data/posts";
import { site } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return { title: "Watch Desk Post" };
  }

  return {
    title: post.title,
    description: post.summary
  };
}

export default async function WatchPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <Section eyebrow={post.category} title={post.title} subtitle={post.summary}>
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <CardLabel className="mb-0">{post.date}</CardLabel>
          <VerificationBadge status={post.verificationStatus} />
        </div>
        <div className="mt-8 space-y-5 text-lg leading-8 text-ink/70">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 border-t border-line pt-5 text-sm font-bold uppercase leading-6 tracking-[0.08em] text-ink/62">
          <p>Source/Credit: {post.sourceLabel}</p>
          <p>Credit: {post.credit}</p>
          <p>Tags: {post.tags.join(", ")}</p>
          <p className="mt-4">{site.disclaimer}</p>
        </div>
      </Card>
    </Section>
  );
}
