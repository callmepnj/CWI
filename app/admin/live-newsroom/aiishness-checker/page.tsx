import { AdminDashboard } from "@/components/AdminDashboard";
import { requireAdminPage } from "@/lib/admin-auth";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "CWI AI-ishness Checker - Cockroach Watch India",
  description: "Private CWI Live Newsroom repetition and public trust checker.",
  path: "/admin/live-newsroom/aiishness-checker"
});

export default async function AdminAiishnessCheckerPage() {
  await requireAdminPage();
  return <AdminDashboard activeSection="live-newsroom" />;
}
