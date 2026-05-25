"use client";

import { useEffect, useState } from "react";
import type React from "react";
import { MessageSquare, Reply, Send, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";

type Comment = {
  id: string;
  parent_id: string | null;
  name: string;
  comment_text: string;
  likes_count: number;
  created_at: string;
};

export function UnansweredComments({ articleSlug }: { articleSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  useEffect(() => {
    fetch(`/api/unanswered-files/comments?slug=${encodeURIComponent(articleSlug)}`)
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

    const response = await fetch("/api/unanswered-files/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        articleSlug,
        parentId: replyTo?.id ?? "",
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
    setReplyTo(null);
    setMessage(data.message ?? "Comment received for moderation.");
  }

  const topLevelComments = comments.filter((comment) => !comment.parent_id);
  const replies = comments.filter((comment) => comment.parent_id);

  async function likeComment(commentId: string) {
    setComments((items) =>
      items.map((item) => (item.id === commentId ? { ...item, likes_count: item.likes_count + 1 } : item))
    );
    const response = await fetch("/api/unanswered-files/comment-likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId })
    }).catch(() => null);
    const data = await response?.json().catch(() => null);
    if (data?.ok) {
      setComments((items) =>
        items.map((item) => (item.id === commentId ? { ...item, likes_count: data.likesCount } : item))
      );
    }
  }

  return (
    <Card id="comments" className="mt-8">
      <CardLabel>Join the discussion</CardLabel>
      <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">
        Comments and public context
      </h2>
      <p className="mt-3 leading-7 text-ink/70">
        Comments are moderated and only approved real submissions appear publicly. No hate, threats, doxxing, personal information, harassment, or unverified allegations presented as fact.
      </p>

      <form onSubmit={submitComment} className="mt-6 grid gap-4">
        <input name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        {replyTo ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-skywash p-4">
            <p className="text-sm font-bold text-ink/72">Replying to {replyTo.name}</p>
            <button type="button" onClick={() => setReplyTo(null)} className="text-xs font-black uppercase tracking-[0.12em] text-royal">
              Cancel reply
            </button>
          </div>
        ) : null}
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
            {topLevelComments.map((comment) => (
              <div key={comment.id} className="rounded-2xl border border-line bg-paper p-4">
                <CommentBody comment={comment} onReply={() => setReplyTo(comment)} onLike={() => likeComment(comment.id)} />
                {replies.some((replyItem) => replyItem.parent_id === comment.id) ? (
                  <div className="mt-4 space-y-3 border-l-2 border-royal/20 pl-4">
                    {replies
                      .filter((replyItem) => replyItem.parent_id === comment.id)
                      .map((replyItem) => (
                        <div key={replyItem.id} className="rounded-2xl bg-white p-4">
                          <CommentBody comment={replyItem} onReply={() => setReplyTo(comment)} onLike={() => likeComment(replyItem.id)} />
                        </div>
                      ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

function CommentBody({ comment, onReply, onLike }: { comment: Comment; onReply: () => void; onLike: () => void }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 font-black uppercase tracking-[0.08em] text-ink">
          <MessageSquare className="h-4 w-4 text-royal" />
          {comment.name}
        </p>
        <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-ink/45">
          {new Date(comment.created_at).toLocaleDateString("en-IN")}
        </p>
      </div>
      <p className="mt-2 text-sm leading-6 text-ink/70">{comment.comment_text}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onLike}
          className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-ink/58 ring-1 ring-line transition hover:bg-skywash hover:text-royal"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          {comment.likes_count}
        </button>
        <button
          type="button"
          onClick={onReply}
          className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-royal ring-1 ring-line"
        >
          <Reply className="h-3.5 w-3.5" />
          Reply
        </button>
      </div>
    </>
  );
}
