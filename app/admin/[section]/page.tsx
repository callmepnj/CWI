import { AdminDashboard } from "@/components/AdminDashboard";
import { requireAdminPage } from "@/lib/admin-auth";
import { createMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ section: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { section } = await params;
  return createMetadata({
    title: `CWI Admin ${section.replace(/-/g, " ")} - Cockroach Watch India`,
    description: "Private Cockroach Watch India AI operating system section.",
    path: `/admin/${section}`
  });
}

export default async function AdminSectionPage({ params }: Props) {
  await requireAdminPage();
  const { section } = await params;
  return <AdminDashboard activeSection={section} />;
}
