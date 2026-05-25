import { AdminDashboard } from "@/components/AdminDashboard";
import { requireAdminPage } from "@/lib/admin-auth";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "CWI Admin Overview - Cockroach Watch India",
  description: "Private Cockroach Watch India AI operating system overview.",
  path: "/admin"
});

export default async function AdminPage() {
  await requireAdminPage();
  return <AdminDashboard activeSection="overview" />;
}
