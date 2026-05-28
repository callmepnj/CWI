"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, inputClass } from "@/components/ui/input";

const categories = [
  "Media inquiry",
  "Creator credit",
  "Takedown request",
  "Correction",
  "Public issue lead",
  "Collaboration",
  "Volunteer / Watcher role",
  "Other"
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Unable to send message. Please email CWI directly.");
      }

      form.reset();
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Unable to send message. Please email CWI directly.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-[2rem] border border-line bg-white p-5 shadow-soft sm:p-6">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="font-mono text-xs font-black uppercase tracking-[0.14em] text-ink/62">Name or public handle</span>
          <Input name="name" required placeholder="Name or @handle" />
        </label>
        <label className="grid gap-2">
          <span className="font-mono text-xs font-black uppercase tracking-[0.14em] text-ink/62">Email or WhatsApp</span>
          <Input name="contact" required placeholder="your@email.com or +91XXXXXXXXXX" />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="font-mono text-xs font-black uppercase tracking-[0.14em] text-ink/62">Category</span>
          <select name="category" required className={inputClass} defaultValue="">
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="font-mono text-xs font-black uppercase tracking-[0.14em] text-ink/62">Subject</span>
          <Input name="subject" required placeholder="Short subject" />
        </label>
      </div>
      <label className="grid gap-2">
        <span className="font-mono text-xs font-black uppercase tracking-[0.14em] text-ink/62">Message</span>
        <Textarea name="message" required placeholder="Explain the request, article URL, correction, source, or contact reason." />
      </label>
      <label className="flex gap-3 rounded-2xl border border-line bg-paper p-4 text-sm font-bold leading-6 text-ink/72">
        <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 accent-royal" />
        <span>I understand CWI may review this message before responding and may decline requests that are unsafe, abusive, or unsupported.</span>
      </label>
      <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-fit">
        <Send className="h-4 w-4" />
        {status === "submitting" ? "Sending..." : "Send message"}
      </Button>
      {status === "success" ? (
        <p className="rounded-2xl border border-leaf/25 bg-leaf/10 p-4 font-bold leading-6 text-[#047766]">
          Message received. CWI will review it before responding.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="rounded-2xl border border-urgent/25 bg-urgent/10 p-4 font-bold leading-6 text-urgent">{error}</p>
      ) : null}
    </form>
  );
}
