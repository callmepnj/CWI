"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Card, CardLabel } from "@/components/ui/card";

type ArticleRatingProps = {
  articleType: "archive" | "unanswered-files";
  articleSlug: string;
};

type RatingState = {
  averageRating: number | null;
  ratingCount: number;
  userRating: number | null;
};

const emptyRating: RatingState = {
  averageRating: null,
  ratingCount: 0,
  userRating: null
};

export function ArticleRating({ articleType, articleSlug }: ArticleRatingProps) {
  const [rating, setRating] = useState<RatingState>(emptyRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setLoading(true);
    fetch(`/api/article-ratings?type=${encodeURIComponent(articleType)}&slug=${encodeURIComponent(articleSlug)}`)
      .then((response) => response.json())
      .then((data) => {
        if (active && data.ok) {
          setRating({
            averageRating: data.averageRating ?? null,
            ratingCount: data.ratingCount ?? 0,
            userRating: data.userRating ?? null
          });
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [articleSlug, articleType]);

  async function submitRating(nextRating: number) {
    setPending(true);
    setMessage("");
    setError("");

    const previousRating = rating;
    setRating((value) => ({ ...value, userRating: nextRating }));

    const response = await fetch("/api/article-ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: articleType,
        slug: articleSlug,
        rating: nextRating
      })
    }).catch(() => null);

    setPending(false);

    if (!response) {
      setRating(previousRating);
      setError("Rating could not be saved right now.");
      return;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.ok) {
      setRating(previousRating);
      setError(data?.error ?? "Rating could not be saved right now.");
      return;
    }

    setRating({
      averageRating: data.averageRating ?? null,
      ratingCount: data.ratingCount ?? 0,
      userRating: data.userRating ?? nextRating
    });
    setMessage(data.message ?? "Rating saved.");
  }

  const visibleRating = hoveredRating || rating.userRating || Math.round(rating.averageRating ?? 0);

  return (
    <Card>
      <CardLabel>Real reader rating</CardLabel>
      <h2 className="font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">Rate this article</h2>
      <p className="mt-3 text-sm leading-6 text-ink/68">
        Ratings are submitted by real visitors only. CWI does not seed fake stars or artificial reviews.
      </p>

      <div className="mt-5 flex min-h-12 flex-wrap items-center gap-3">
        <div className="flex gap-1" onMouseLeave={() => setHoveredRating(0)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              disabled={pending}
              aria-label={`Rate article ${value} out of 5`}
              onClick={() => submitRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              className="rounded-full p-1 text-saffron transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Star className={`h-6 w-6 ${value <= visibleRating ? "fill-current" : ""}`} />
            </button>
          ))}
        </div>
        <div className="text-sm font-bold text-ink/68">
          {loading ? (
            <span className="inline-flex h-5 w-64 max-w-full animate-pulse rounded-full bg-paper" aria-label="Loading reader rating" />
          ) : rating.ratingCount > 0 && rating.averageRating ? (
            <span>{rating.averageRating.toFixed(1)} / 5 from {rating.ratingCount.toLocaleString("en-IN")} reader rating{rating.ratingCount === 1 ? "" : "s"}</span>
          ) : (
            <span>No ratings yet. Be the first real reader to rate it.</span>
          )}
        </div>
      </div>

      {rating.userRating ? (
        <p className="mt-3 rounded-2xl bg-skywash p-3 text-sm font-bold text-royal">
          Your rating: {rating.userRating} / 5. You can update it anytime.
        </p>
      ) : null}
      {message ? <p className="mt-3 rounded-2xl bg-leaf/10 p-3 text-sm font-bold text-[#047766]">{message}</p> : null}
      {error ? <p className="mt-3 rounded-2xl bg-urgent/10 p-3 text-sm font-bold text-urgent">{error}</p> : null}
    </Card>
  );
}
