"use client";

import type React from "react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, inputClass } from "@/components/ui/input";

const submissionTypes = [
  "Source",
  "Correction",
  "Creator credit",
  "Takedown request",
  "Public issue",
  "News tip",
  "India Unanswered File suggestion",
  "Other"
];

const maxEvidenceFiles = 3;
const maxEvidenceBytes = 4 * 1024 * 1024;

export function SubmitForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");
    setError("");
    setTrackingId("");

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const validationError = validateSubmission(payload);
    const fileValidationError = validateEvidenceFiles(selectedFiles);

    if (validationError) {
      setStatus("error");
      setError(validationError);
      return;
    }

    if (fileValidationError) {
      setStatus("error");
      setError(fileValidationError);
      return;
    }

    try {
      const response = await fetch("/api/submit-report", {
        method: "POST",
        body: formData
      });

      const data = (await response.json()) as { ok?: boolean; error?: string; id?: number; trackingId?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong while submitting. Please try again or contact cockroachwatchindia@gmail.com.");
      }

      form.reset();
      setSelectedFiles([]);
      setTrackingId(data.trackingId ?? (data.id ? `CWI-${String(data.id).padStart(6, "0")}` : "CWI-REVIEW"));
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while submitting. Please try again or contact cockroachwatchindia@gmail.com."
      );
    }
  }

  function onEvidenceChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFiles(Array.from(event.currentTarget.files ?? []));
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-7 rounded-lg border border-cwi-brown/18 bg-white/78 p-5 shadow-[0_16px_44px_rgba(29,18,10,0.08)] sm:p-8">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div id="what-to-submit" className="grid gap-4 rounded-lg border border-cwi-saffron/30 bg-cwi-saffron/10 p-5">
        <p className="text-base leading-7 text-cwi-ink/72">
          Use this form to send source links, corrections, creator credit requests, takedown requests, public issues, news tips, or missing context. CWI reviews submissions before publishing or amplifying them.
        </p>
        <p className="rounded-lg border border-cwi-brown/18 bg-white/80 p-4 text-sm font-bold leading-6 text-cwi-ink/78">
          Do not submit private data, threats, hate, or unverified allegations as fact. Add dates and source links where possible.
        </p>
      </div>

      <FormGroup title="Your Details" description="Name and contact are optional. Share only what CWI needs for clarification.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Name or public handle" helper="Optional. Use a public handle if preferred.">
            <Input name="name" placeholder="@yourhandle or name" />
          </Field>
          <Field label="Email" helper="Optional. Used only if CWI needs clarification.">
            <Input name="contact" type="email" placeholder="you@example.com" />
          </Field>
        </div>
      </FormGroup>

      <FormGroup title="Source or Correction Details" description="Send links, dates, evidence, screenshots, documents, or context that help CWI verify the record.">
        <div className="grid gap-5">
          <Field label="Submission type">
            <select name="type" required className={inputClass} defaultValue="">
              <option value="" disabled>Select a submission type</option>
              {submissionTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Link or source URL" helper="Add the original post, article, document, or source link if available.">
              <Input name="sourceUrl" type="url" placeholder="https://..." />
            </Field>
            <Field label="Date of source/event" helper="Optional. Add the date if known.">
              <Input name="sourceDate" type="date" />
            </Field>
          </div>

          <Field label="Upload evidence" helper="Optional. Add up to 3 files, total under 4 MB. For larger videos, paste the source link above.">
            <div className="grid gap-4 rounded-lg border border-dashed border-cwi-green/30 bg-cwi-green/5 p-5">
              <p className="font-bold text-cwi-ink">Screenshots, images, documents, or supporting files</p>
              <input
                name="evidenceFiles"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf,.mp4,.webm,.mov,.doc,.docx,image/jpeg,image/png,application/pdf,video/mp4,video/webm,video/quicktime,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={onEvidenceChange}
                className="w-full rounded-lg border border-cwi-brown/18 bg-white px-4 py-3 text-sm font-bold text-cwi-ink file:mr-4 file:rounded-full file:border-0 file:bg-cwi-ink file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:tracking-[0.12em] file:text-white"
              />
              {selectedFiles.length > 0 ? (
                <ul className="grid gap-2 text-xs font-bold leading-5 text-cwi-ink/62">
                  {selectedFiles.map((file) => (
                    <li key={`${file.name}-${file.size}`} className="rounded-lg bg-white px-3 py-2">
                      {file.name} - {formatBytes(file.size)}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Field>

          <Field label="Message" helper='Use words like "reported," "claimed," or "requires verification" where proof is incomplete.'>
            <Textarea name="message" required placeholder="Explain what changed, what needs correction, what the source shows, and what remains unclear." />
          </Field>

          <Field label="Public credit preference">
            <select name="creditPreference" className={inputClass} defaultValue="Use internally only">
              <option>Use internally only</option>
              <option>Credit my name/handle if published</option>
              <option>Credit anonymously if published</option>
            </select>
          </Field>
        </div>
      </FormGroup>

      <FormGroup title="Consent and Safety" description="These confirmations are required before CWI reviews a submission.">
        <div id="how-to-contribute" className="grid gap-3">
          <label className="flex gap-3 rounded-lg border border-cwi-brown/18 bg-cwi-cream p-4 text-sm font-bold leading-6">
            <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 accent-cwi-green" />
            <span>I confirm I have permission to share this material with CWI for review.</span>
          </label>
          <label className="flex gap-3 rounded-lg border border-cwi-brown/18 bg-cwi-cream p-4 text-sm font-bold leading-6">
            <input name="safety" type="checkbox" required className="mt-1 h-4 w-4 accent-cwi-green" />
            <span>I understand CWI does not publish private data, threats, hate, or unsupported allegations as facts.</span>
          </label>
          <label className="flex gap-3 rounded-lg border border-cwi-brown/18 bg-cwi-cream p-4 text-sm font-bold leading-6">
            <input name="editorialPolicy" type="checkbox" required className="mt-1 h-4 w-4 accent-cwi-green" />
            <span>I understand submissions may be reviewed, edited for clarity, declined, or held until more sources are available.</span>
          </label>
        </div>
      </FormGroup>

      <div id="youth-voice" className="grid gap-4">
        <p className="text-sm leading-6 text-cwi-ink/66">Student and youth public-interest tips are welcome when they include dates, context, and verifiable source trails.</p>
        <p className="text-sm leading-6 text-cwi-ink/66">
          Urgent corrections or creator credit requests can also be emailed to {" "}
          <a className="font-bold text-cwi-green underline-offset-4 hover:underline" href="mailto:cockroachwatchindia@gmail.com">cockroachwatchindia@gmail.com</a>.
        </p>
        <Button type="submit" disabled={status === "submitting"} className="min-h-12 w-full px-6 sm:w-fit">
          <Send className="h-4 w-4" />
          {status === "submitting" ? "Sending..." : "Send source or correction"}
        </Button>
      </div>

      {status === "success" ? (
        <div className="rounded-lg border border-cwi-green/25 bg-cwi-green/10 p-4 font-bold leading-6 text-cwi-green">
          <p>Submission received. CWI will review it before taking further action.</p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em]">Tracking ID: {trackingId}</p>
        </div>
      ) : null}
      {status === "error" ? <p className="rounded-lg border border-urgent/25 bg-urgent/10 p-4 font-bold text-urgent">{error}</p> : null}
    </form>
  );
}

function validateSubmission(payload: Record<string, FormDataEntryValue>) {
  if (typeof payload.type !== "string" || payload.type.trim().length < 1) {
    return "Please select a submission type.";
  }

  if (typeof payload.sourceUrl === "string" && payload.sourceUrl.trim().length > 0 && !isHttpUrl(payload.sourceUrl)) {
    return "Please enter a valid link.";
  }

  if (typeof payload.message !== "string" || payload.message.trim().length < 10) {
    return "Please describe the source, correction, or issue.";
  }

  if (payload.consent !== "on" || payload.safety !== "on" || payload.editorialPolicy !== "on") {
    return "Consent is required before submitting.";
  }

  return "";
}

function validateEvidenceFiles(files: File[]) {
  const allowedTypes = new Set([
    "image/jpeg",
    "image/png",
    "application/pdf",
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ]);

  if (files.length > maxEvidenceFiles) {
    return `Please upload no more than ${maxEvidenceFiles} evidence files.`;
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > maxEvidenceBytes) {
    return "Evidence files must be under 4 MB total. For larger videos, paste the source link instead.";
  }

  const unsupportedFile = files.find((file) => file.size > 0 && !allowedTypes.has(file.type));
  if (unsupportedFile) {
    return "Please upload JPG, PNG, PDF, MP4, WebM, MOV, DOC, or DOCX files only.";
  }

  return "";
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
    <fieldset className="grid gap-5 rounded-lg border border-cwi-brown/18 bg-white/70 p-5">
      <div>
        <legend className="font-display text-2xl font-black uppercase leading-tight text-cwi-ink">{title}</legend>
        <p className="mt-2 text-sm leading-6 text-cwi-ink/62">{description}</p>
      </div>
      {children}
    </fieldset>
  );
}

function Field({ label, helper, children }: { label: string; helper?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-xs font-black uppercase tracking-[0.14em] text-cwi-brown/70">{label}</span>
      {children}
      {helper ? <span className="text-xs leading-5 text-cwi-ink/55">{helper}</span> : null}
    </label>
  );
}