import { AdminDashboard } from "@/components/AdminDashboard";
import { requireAdminPage } from "@/lib/admin-auth";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "CWI Source Library - Cockroach Watch India",
  description: "Private CWI Live Newsroom source library.",
  path: "/admin/live-newsroom/sources"
});

export default async function AdminLiveNewsroomSourcesPage() {
  await requireAdminPage();
  return <AdminDashboard activeSection="live-newsroom" />;
}
