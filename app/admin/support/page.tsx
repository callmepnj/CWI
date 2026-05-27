import { AdminDashboard } from "@/components/AdminDashboard";
import { requireAdminPage } from "@/lib/admin-auth";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "CWI Support Admin - Cockroach Watch India",
  description: "Private CWI support notes moderation and settings.",
  path: "/admin/support"
});

export default async function AdminSupportPage() {
  await requireAdminPage();
  return <AdminDashboard activeSection="support" />;
}
