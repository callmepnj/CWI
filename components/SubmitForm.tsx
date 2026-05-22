"use client";

import type React from "react";
import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, inputClass } from "@/components/ui/input";

const submissionTypes = [
  "Public Issue",
  "Student / Youth Concern",
  "Viral Claim",
  "Civic Issue",
  "Creator Credit Request",
  "Correction Request",
  "Fact-check Request",
  "Local News Tip",
  "Collaboration",
  "Other"
];

export function SubmitForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");
    setError("");

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const validationError = validateSubmission(payload);

    if (validationError) {
      setStatus("error");
      setError(validationError);
      return;
    }

    try {
      const response = await fetch("/api/submit-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(
          data.error || "Something went wrong while submitting your report. Please try again or contact cockroachwatchindia@gmail.com."
        );
      }

      form.reset();
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while submitting your report. Please try again or contact cockroachwatchindia@gmail.com."
      );
    }
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="grid gap-7 rounded-[2rem] border border-line bg-white p-5 shadow-soft sm:p-8"
    >
      <div className="grid gap-4 rounded-3xl border border-amber/35 bg-amber/10 p-5">
        <p className="text-base leading-7 text-ink/72">
          Use this form to submit public issues, civic concerns, viral posts, creator credit requests, corrections, or
          youth stories. CWI reviews submissions before publishing or amplifying them.
        </p>
        <p className="rounded-2xl border border-warning/25 bg-white p-4 text-sm font-bold leading-6 text-ink/78">
          Please do not submit private personal data, threats, hate speech, or unverified allegations as confirmed facts.
          Share evidence, links, and context wherever possible.
        </p>
      </div>

      <FormGroup title="Your Details" description="Tell us how to identify or contact you if clarification is needed.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Name or Public Handle" helper="Use a public handle if you do not want to share your full name.">
            <Input name="name" required placeholder="@yourhandle or name" />
          </Field>
          <Field
            label="Email or WhatsApp"
            helper="This is optional and will only be used if we need clarification."
          >
            <Input name="contact" placeholder="Optional contact for follow-up" />
          </Field>
          <Field label="City / District">
            <Input name="city" placeholder="City or district" />
          </Field>
          <Field label="State / UT">
            <Input name="state" placeholder="State or Union Territory" />
          </Field>
        </div>
      </FormGroup>

      <FormGroup
        title="Report Details"
        description="Send links, evidence, screenshots, documents, or context that help us verify the report."
      >
        <div className="grid gap-5">
          <Field label="Submission Type">
            <select name="type" required className={inputClass} defaultValue="">
              <option value="" disabled>
                Select a submission type
              </option>
              {submissionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Link to Post, Video, or Source"
            helper="Add the original post, video, article, document, or source link if available."
          >
            <Input name="sourceUrl" type="url" placeholder="https://..." />
          </Field>

          <Field
            label="Upload Evidence"
            helper="Accepted formats: JPG, PNG, PDF, MP4, or document files. Avoid uploading private personal data."
          >
            <div className="rounded-2xl border border-dashed border-royal/30 bg-royal/5 p-5">
              <p className="font-bold text-ink">Upload screenshots, images, documents, or supporting files</p>
              <p className="mt-2 text-sm leading-6 text-ink/62">
                File upload will be available soon. For now, paste the source link or describe the evidence below.
              </p>
            </div>
          </Field>

          <Field
            label="Describe the Issue"
            helper='Use words like "reported," "claimed," "alleged," or "requires verification" where proof is incomplete.'
          >
            <Textarea
              name="message"
              required
              placeholder="Explain what happened, where it happened, when it happened, and why it matters."
            />
          </Field>
          <Field label="Should we credit you publicly?">
            <select name="creditPreference" className={inputClass} defaultValue="Yes, with my name/handle">
              <option>Yes, with my name/handle</option>
              <option>Yes, but keep me anonymous</option>
              <option>No, use internally only</option>
            </select>
          </Field>
        </div>
      </FormGroup>

      <FormGroup title="Consent and Safety" description="These confirmations are required before the Watch Desk reviews a report.">
        <div className="grid gap-3">
          <label className="flex gap-3 rounded-2xl border border-line bg-paper p-4 text-sm font-bold leading-6">
            <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 accent-royal" />
            <span>I confirm this submission is truthful to the best of my knowledge and I have permission to share any content submitted.</span>
          </label>
          <label className="flex gap-3 rounded-2xl border border-line bg-paper p-4 text-sm font-bold leading-6">
            <input name="safety" type="checkbox" required className="mt-1 h-4 w-4 accent-royal" />
            <span>I understand CWI does not publish private personal data, threats, hate speech, or unverified allegations as confirmed facts.</span>
          </label>
          <label className="flex gap-3 rounded-2xl border border-line bg-paper p-4 text-sm font-bold leading-6">
            <input name="editorialPolicy" type="checkbox" required className="mt-1 h-4 w-4 accent-royal" />
            <span>I understand comments, reports, and submitted materials may be reviewed, edited for clarity, or declined based on CWI&apos;s editorial policy.</span>
          </label>
        </div>
      </FormGroup>

      <div className="grid gap-4">
        <p className="text-sm leading-6 text-ink/66">Have feedback, corrections, or ideas for CWI? You can submit them here too.</p>
        <p className="text-sm leading-6 text-ink/66">
          For urgent corrections or creator credit requests, email:{" "}
          <a className="font-bold text-royal underline-offset-4 hover:underline" href="mailto:cockroachwatchindia@gmail.com">
            cockroachwatchindia@gmail.com
          </a>
        </p>
        <Button type="submit" disabled={status === "submitting"} className="min-h-12 w-full px-6 sm:w-fit">
          <Send className="h-4 w-4" />
          {status === "submitting" ? "Submitting Report..." : "Submit Report to CWI"}
        </Button>
      </div>

      {status === "success" ? (
        <p className="rounded-2xl border border-leaf/25 bg-leaf/10 p-4 font-bold leading-6 text-[#047766]">
          Report submitted successfully. The Watch Desk will review it before taking further action.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="rounded-2xl border border-urgent/25 bg-urgent/10 p-4 font-bold text-urgent">{error}</p>
      ) : null}
    </form>
  );
}

function validateSubmission(payload: Record<string, FormDataEntryValue>) {
  if (typeof payload.name !== "string" || payload.name.trim().length < 1) {
    return "Name or handle is required.";
  }

  if (typeof payload.type !== "string" || payload.type.trim().length < 1) {
    return "Please select a submission type.";
  }

  if (typeof payload.sourceUrl === "string" && payload.sourceUrl.trim().length > 0 && !isHttpUrl(payload.sourceUrl)) {
    return "Please enter a valid link.";
  }

  if (typeof payload.message !== "string" || payload.message.trim().length < 10) {
    return "Please describe the issue.";
  }

  if (payload.consent !== "on" || payload.safety !== "on" || payload.editorialPolicy !== "on") {
    return "Consent is required before submitting.";
  }

  return "";
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function FormGroup({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-5 rounded-3xl border border-line bg-white p-5">
      <div>
        <legend className="font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-ink">
          {title}
        </legend>
        <p className="mt-2 text-sm leading-6 text-ink/62">{description}</p>
      </div>
      {children}
    </fieldset>
  );
}

function Field({ label, helper, children }: { label: string; helper?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-xs font-black uppercase tracking-[0.14em] text-ink/62">{label}</span>
      {children}
      {helper ? <span className="text-xs leading-5 text-ink/55">{helper}</span> : null}
    </label>
  );
}
