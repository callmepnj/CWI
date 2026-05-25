"use client";

import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLoginForm({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    }).catch(() => null);

    setPending(false);

    if (!response) {
      setError("Admin login could not be reached.");
      return;
    }

    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.ok) {
      setError(data?.error ?? "Invalid admin login.");
      return;
    }

    setMessage("Admin login approved. Opening CWI AI OS...");
    window.location.href = "/admin";
  }

  return (
    <form onSubmit={submit} className="mt-8 grid gap-5">
      {!configured ? (
        <div className="rounded-2xl border border-urgent/20 bg-urgent/10 p-4 text-sm font-bold leading-6 text-urgent">
          Admin access is disabled until `CWI_ADMIN_PASSWORD` or `ADMIN_PASSWORD` is set in the deployment environment. Use at least 12 characters.
        </div>
      ) : null}

      <label className="grid gap-2 text-sm font-black uppercase tracking-[0.1em] text-ink/64">
        Admin password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={!configured || pending}
          className="rounded-2xl border border-line bg-paper px-4 py-3 normal-case tracking-normal outline-none focus:border-royal"
          autoComplete="current-password"
          required
        />
      </label>

      <Button type="submit" disabled={!configured || pending} className="w-fit">
        <LockKeyhole className="h-4 w-4" />
        {pending ? "Checking..." : "Open Admin OS"}
      </Button>

      {message ? <p className="rounded-2xl bg-leaf/10 p-3 text-sm font-bold text-[#047766]">{message}</p> : null}
      {error ? <p className="rounded-2xl bg-urgent/10 p-3 text-sm font-bold text-urgent">{error}</p> : null}
    </form>
  );
}
