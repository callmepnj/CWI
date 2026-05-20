"use client";

import type React from "react";
import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, inputClass } from "@/components/ui/input";

const submissionTypes = [
  "Public Issue",
  "Viral Video",
  "Meme / Creative",
  "Fact-check request",
  "Correction",
  "Creator credit request",
  "Collaboration",
  "Youth story",
  "Local civic issue"
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

    try {
      const response = await fetch("/api/submit-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to submit report.");
      }

      form.reset();
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Unable to submit report.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 rounded-[2rem] border border-line bg-white p-5 shadow-soft sm:p-8">
      <FormGroup title="Reporter context" description="Use a public handle if you do not want to share your full name. Contact details are optional.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Name or handle">
            <Input name="name" placeholder="@yourhandle or name" />
          </Field>
          <Field label="Email or WhatsApp optional">
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
      <FormGroup title="Report details" description="Send source links, proof notes, and careful context. Do not submit private personal data.">
        <div className="grid gap-5">
          <Field label="Submission type">
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
          <Field label="Link to post/video/source">
            <Input name="sourceUrl" type="url" placeholder="https://..." />
          </Field>
          <Field label="Upload proof placeholder">
            <Input name="proofNote" placeholder="Backend upload can connect to Supabase, Firebase, Formspree, or custom storage." />
          </Field>
          <Field label="Describe the issue">
            <Textarea name="message" required placeholder="Use reported, claimed, alleged, or requires verification where proof is incomplete." />
          </Field>
          <Field label="Should we credit you publicly?">
            <select name="creditPreference" className={inputClass} defaultValue="Yes, with my name/handle">
              <option>Yes, with my name/handle</option>
              <option>Yes, but anonymous</option>
              <option>No, internal only</option>
            </select>
          </Field>
        </div>
      </FormGroup>
      <FormGroup title="Consent and safety" description="These confirmations are required before the Watch Desk reviews a report.">
        <div className="grid gap-3">
          <label className="flex gap-3 rounded-2xl border border-line bg-paper p-4 text-sm font-bold leading-6">
            <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 accent-royal" />
            <span>I confirm this submission is truthful to the best of my knowledge and I have permission to share any content submitted.</span>
          </label>
          <label className="flex gap-3 rounded-2xl border border-line bg-paper p-4 text-sm font-bold leading-6">
            <input name="safety" type="checkbox" required className="mt-1 h-4 w-4 accent-royal" />
            <span>I understand CWI does not publish private personal data, threats, hate speech, or unverified allegations as fact.</span>
          </label>
        </div>
      </FormGroup>
      <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-fit">
        <Send className="h-4 w-4" />
        {status === "submitting" ? "Sending to Watch Desk" : "Submit Report"}
      </Button>
      {status === "success" ? (
        <p className="rounded-2xl border border-leaf/25 bg-leaf/10 p-4 font-black uppercase tracking-[0.1em] text-[#047766]">
          Report received. The Watch Desk will review it.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="rounded-2xl border border-urgent/25 bg-urgent/10 p-4 font-bold text-urgent">{error}</p>
      ) : null}
    </form>
  );
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-xs font-black uppercase tracking-[0.14em] text-ink/62">{label}</span>
      {children}
    </label>
  );
}
