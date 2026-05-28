import { SubmitForm } from "@/components/SubmitForm";
import { CwiMasthead, CwiPageShell, CwiTrustStrip } from "@/components/CwiDesignSystem";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Submit Source or Correction - Cockroach Watch India",
  description: "Send CWI a source link, correction, creator credit request, public issue, or missing context for review.",
  path: "/submit"
});

export default function SubmitPage() {
  return (
    <CwiPageShell>
      <CwiMasthead
        label="CWI intake desk"
        title="Submit source or correction"
        subtitle="Send CWI a source link, correction, creator credit request, public issue, or missing context."
        body="Do not submit private data, threats, hate, or unverified allegations as fact. Add dates and source links where possible."
        meta={["Privacy-respecting", "Human reviewed", "Approval required", "Correction open"]}
      />
      <div className="mt-6">
        <CwiTrustStrip items={["No Aadhaar or PAN", "No political preference", "Source links preferred", "Tracking ID after submit"]} />
      </div>
      <div className="mt-10">
        <SubmitForm />
      </div>
    </CwiPageShell>
  );
}