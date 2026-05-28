import Link from "next/link";
import { Section } from "@/components/Section";
import { Card, CardLabel } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Editorial Policy - Cockroach Watch India",
  description:
    "Read the Cockroach Watch India editorial policy for source attribution, verification labels, corrections, creator credit, takedown review, privacy, satire labels, and responsible handling of public claims.",
  path: "/editorial-policy",
  keywords: ["Cockroach Watch India editorial policy", "CWI verification", "CWI corrections", "creator credit policy", "satire labelling"]
});

const labels = [
  {
    title: "Verified",
    body: "Used when CWI can point readers to a reliable source trail, official record, court record, direct statement, or multiple consistent sources. Verified does not mean CWI has made a legal finding."
  },
  {
    title: "Source-backed",
    body: "Used when the article is supported by named public sources but some details remain dependent on those sources, publication dates, or later updates."
  },
  {
    title: "Reported",
    body: "Used when a claim is being reported by named sources but has not been independently established by CWI. The source and limits must stay visible."
  },
  {
    title: "Developing",
    body: "Used for fast-moving situations where timelines, numbers, official responses, or platform actions can change. CWI avoids final language in these cases."
  },
  {
    title: "Opinion/Analysis",
    body: "Used for interpretation, commentary, or civic analysis. It must not be presented as straight reporting."
  },
  {
    title: "Satire/Context",
    body: "Used when a piece discusses satire, meme language, public reaction, or cultural meaning. Satire labels must be clear so readers do not mistake commentary for official news."
  }
];

const standards = [
  {
    title: "Verification process",
    body:
      "Before publishing a public-interest update, CWI checks whether the article separates direct evidence, media reporting, public reaction, official statements, court records, and opinion. Source links should be visible wherever practical. If an article depends on screenshots, viral posts, or claims from social media, the wording should make clear whether CWI has verified the original source, only seen public circulation, or still needs confirmation. CWI does not turn a viral claim into a confirmed fact simply because many people are sharing it."
  },
  {
    title: "Source attribution",
    body:
      "CWI identifies sources by name, outlet, URL, and purpose wherever possible. Source cards should explain what the source supports and what it does not prove. Official statements, legal documents, established media, user submissions, public posts, and creator statements are not treated as identical evidence. If a source is time-sensitive, such as follower counts, platform actions, or breaking claims, the article should mention the date or last-checked context."
  },
  {
    title: "Corrections timeline",
    body:
      "Correction requests are reviewed based on article impact and evidence quality. Urgent factual errors, safety risks, identity errors, legal-risk wording, and creator-credit mistakes receive priority. When a correction is accepted, CWI updates the article and adds a public note on the Corrections page when the change is material. Minor typo fixes may be corrected silently, but factual changes should not be hidden. Correction requests can be sent through the Submit page or email."
  },
  {
    title: "Creator credit and takedown review",
    body:
      "CWI does not remove watermarks or claim ownership of user-created work. If a creator asks for credit, correction, removal, or context, CWI reviews the request against public-interest value, safety, ownership, consent, and source integrity. A takedown request should include the content link, proof of authorship or affected status, and the specific requested change. CWI may remove, blur, re-caption, credit, or retain content depending on the review."
  },
  {
    title: "Satire versus news",
    body:
      "CWI covers satire and digital culture, but satire coverage still needs clean labels. A joke, meme, slogan, or symbolic identity can be important civic language without becoming a verified political claim. Articles about satire should explain what is official, what is public reaction, what is commentary, and what remains uncertain. CWI must not use satire as a shield for misinformation, harassment, doxxing, or unsupported allegations."
  },
  {
    title: "Privacy in submissions",
    body:
      "Readers may submit source links, images, documents, and public-interest leads. CWI asks contributors not to submit private personal data, threats, medical details, addresses, phone numbers, or unverified allegations as confirmed facts. If a submission contains sensitive information, CWI may use it only for internal review, redact it, decline it, or ask for safer public evidence. Consent and safety checks are required on submission forms."
  },
  {
    title: "Independence and conflicts",
    body:
      "Cockroach Watch India is independent from political parties and organizations unless officially declared. Supporters, volunteers, submitters, creators, and readers do not receive editorial control. If CWI has a relevant relationship, sponsorship, partnership, or conflict around a subject, that relationship should be disclosed near the article or on an appropriate policy page."
  },
  {
    title: "Human approval",
    body:
      `CWI may use tools for research assistance, formatting, source organization, metadata, or draft preparation, but public articles require human review. The listed editorial lead is ${site.editorialLead}. The editor checks labels, source limits, legal-risk wording, creator credit, and correction paths before publication. AI-generated shells, mock drafts, or unreviewed internal notes must never be public indexable pages.`
  }
];

export default function EditorialPolicyPage() {
  return (
    <Section
      eyebrow="Editorial Trust"
      title="Editorial Policy"
      titleAs="h1"
      subtitle="CWI preserves public memory with source attribution, cautious labels, visible corrections, and clear separation between reporting, analysis, satire, and official claims."
    >
      <Card>
        <CardLabel>Editorial standard</CardLabel>
        <div className="space-y-5 text-lg leading-8 text-ink/72">
          <p>
            Cockroach Watch India exists to document civic conversation without manufacturing certainty. The platform covers public issues, youth voice, digital culture, creator credit, India Unanswered Files, and fast-moving claims. The editorial standard is simple in practice: show the source trail, label uncertainty, avoid unsafe claims, and keep correction paths visible.
          </p>
          <p>
            CWI is not a court, police agency, political party, or official spokesperson for any movement. It can explain public reaction and collect source-backed context, but it must not present unverified allegations as confirmed facts. When a public claim is incomplete, the safer language is reported, alleged, publicly circulating, developing, or requires verification.
          </p>
          <p>
            For corrections, creator credit, takedown review, or additional sources, contact{" "}
            <Link href={`mailto:${site.email}`} className="font-bold text-royal underline-offset-4 hover:underline">
              {site.email}
            </Link>{" "}
            or use the{" "}
            <Link href="/submit" className="font-bold text-royal underline-offset-4 hover:underline">
              Submit Report
            </Link>{" "}
            form.
          </p>
        </div>
      </Card>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {standards.map((policy) => (
          <Card key={policy.title}>
            <CardLabel>Editorial policy</CardLabel>
            <h2 className="font-display text-3xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">
              {policy.title}
            </h2>
            <p className="mt-4 leading-8 text-ink/70">{policy.body}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardLabel>Labels and what they mean</CardLabel>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {labels.map((label) => (
            <div key={label.title} className="rounded-2xl border border-line bg-paper p-4">
              <h2 className="font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">{label.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-ink/68">{label.body}</p>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
}
