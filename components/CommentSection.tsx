"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";

type Comment = {
  id: string;
  name: string;
  comment: string;
  created_at: string;
};

export function CommentSection({ articleSlug }: { articleSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(articleSlug)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          setComments(data.comments ?? []);
        }
      })
      .catch(() => undefined);
  }, [articleSlug]);

  async function submitComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        articleSlug,
        name: formData.get("name"),
        email: formData.get("email"),
        comment: formData.get("comment"),
        website: formData.get("website")
      })
    }).catch(() => null);

    setPending(false);

    if (!response) {
      setError("Comment could not be submitted right now.");
      return;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.ok) {
      setError(data?.error ?? "Comment could not be submitted right now.");
      return;
    }

    form.reset();
    setMessage(data.message ?? "Comment received for moderation.");
  }

  return (
    <Card className="mt-8">
      <CardLabel>Join the discussion</CardLabel>
      <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">Comments</h2>
      <p className="mt-3 leading-7 text-ink/70">
        Comments are moderated. No hate, threats, doxxing, harassment, or unverified allegations presented as fact.
      </p>

      <form onSubmit={submitComment} className="mt-6 grid gap-4">
        <input name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-ink/65">
            Name
            <input name="name" required maxLength={80} className="rounded-2xl border border-line bg-paper px-4 py-3 normal-case tracking-normal outline-none focus:border-royal" />
          </label>
          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-ink/65">
            Email optional
            <input name="email" type="email" maxLength={120} className="rounded-2xl border border-line bg-paper px-4 py-3 normal-case tracking-normal outline-none focus:border-royal" />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-ink/65">
          Comment
          <textarea
            name="comment"
            required
            minLength={10}
            maxLength={1200}
            rows={5}
            className="rounded-2xl border border-line bg-paper px-4 py-3 normal-case tracking-normal outline-none focus:border-royal"
          />
        </label>
        <Button type="submit" disabled={pending} className="w-fit">
          <Send className="h-4 w-4" />
          {pending ? "Submitting..." : "Submit comment"}
        </Button>
        {message ? <p className="rounded-2xl bg-leaf/10 p-3 text-sm font-bold text-[#047766]">{message}</p> : null}
        {error ? <p className="rounded-2xl bg-urgent/10 p-3 text-sm font-bold text-urgent">{error}</p> : null}
      </form>

      <div className="mt-8 border-t border-line pt-6">
        {comments.length === 0 ? (
          <p className="rounded-2xl bg-paper p-4 font-bold text-ink/62">No comments yet. Be the first to add context.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-2xl border border-line bg-paper p-4">
                <p className="font-black uppercase tracking-[0.08em] text-ink">{comment.name}</p>
                <p className="mt-2 text-sm leading-6 text-ink/70">{comment.comment}</p>
                <p className="mt-3 font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-ink/45">
                  {new Date(comment.created_at).toLocaleDateString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
