import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { Card, CardLabel } from "@/components/ui/card";
import { isAdminConfigured, isAdminSession } from "@/lib/admin-auth";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "CWI Admin Login - Cockroach Watch India",
  description: "Private admin login for the Cockroach Watch India AI operating system.",
  path: "/admin/login"
});

export default async function AdminLoginPage() {
  if (await isAdminSession()) {
    redirect("/admin");
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Card className="p-8 sm:p-10">
        <CardLabel>Private admin</CardLabel>
        <h1 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-ink sm:text-6xl">
          CWI AI Operating System
        </h1>
        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-ink/70">
          Protected dashboard for Cockroach Watch India agents, approval queue, manual links, reports, SEO packs, social packs, and system health. Nothing publishes without human approval.
        </p>
        <AdminLoginForm configured={isAdminConfigured()} />
      </Card>
    </section>
  );
}
