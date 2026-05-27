import { AdminDashboard } from "@/components/AdminDashboard";
import { requireAdminPage } from "@/lib/admin-auth";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "CWI News Intelligence - Cockroach Watch India",
  description: "Private CWI Live Newsroom intelligence controls.",
  path: "/admin/live-newsroom/news-intelligence"
});

export default async function AdminNewsIntelligencePage() {
  await requireAdminPage();
  return <AdminDashboard activeSection="live-newsroom" />;
}
