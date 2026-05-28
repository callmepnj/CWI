import { redirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function LegacyArticleRedirectPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/archive/${slug}`);
}
