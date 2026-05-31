import { Card, CardLabel } from "@/components/ui/card";
import { joinConfig } from "@/lib/config/join";
import { requireAdminPage } from "@/lib/admin-auth";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Join Now Settings - CWI Admin",
  description: "Read-only config-backed Join Now settings for Cockroach Watch India.",
  path: "/admin/settings/join",
  index: false
});

export default async function AdminJoinSettingsPage() {
  await requireAdminPage();

  const settings = [
    ["Floating button", joinConfig.enabled ? "Enabled" : "Disabled"],
    ["Button label", joinConfig.buttonLabel],
    ["QR image path", joinConfig.qrPath],
    ["Support email", joinConfig.supportEmail],
    ["Website", joinConfig.websiteLink],
    ["Default position", joinConfig.defaultPosition],
    ["Glow intensity", joinConfig.glowIntensity],
    ["Show on mobile", joinConfig.showOnMobile ? "true" : "false"]
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardLabel>Join Now settings</CardLabel>
        <h1 className="font-display text-4xl font-black uppercase tracking-[-0.03em] text-ink">Config-backed join system</h1>
        <p className="mt-3 max-w-3xl font-semibold leading-7 text-ink/70">
          V1 uses <code>lib/config/join.ts</code> so the public Join Now modal is stable and approval-safe. DB-backed editing and QR uploads can be added later without changing the public component contract.
        </p>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {settings.map(([label, value]) => (
          <Card key={label} className="rounded-2xl">
            <CardLabel>{label}</CardLabel>
            <p className="break-words text-sm font-bold leading-6 text-ink/72">{value}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 rounded-2xl">
        <CardLabel>Community links</CardLabel>
        <div className="grid gap-3 md:grid-cols-2">
          {joinConfig.socialLinks.map((link) => (
            <a key={link.label} href={link.href} className="rounded-2xl border border-line bg-paper p-4 text-sm font-bold text-royal" target="_blank" rel="noreferrer">
              {link.label}: {link.href}
            </a>
          ))}
        </div>
      </Card>
    </section>
  );
}
