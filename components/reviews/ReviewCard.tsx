import { Star } from "lucide-react";
import type { Review } from "@/content/reviews";
import { formatDisplayDate, cn } from "@/lib/utils";

type ReviewCardProps = {
  review: Review;
  className?: string;
};

export function ReviewCard({ review, className }: ReviewCardProps) {
  const formattedDate = formatDisplayDate(review.date);

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-soft",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-navy">{review.name}</h3>
          {review.tripRoute ? (
            <p className="mt-1 text-sm text-text-muted">{review.tripRoute}</p>
          ) : null}
        </div>
        {review.isDemo ? (
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            Sample
          </span>
        ) : null}
      </div>

      <div
        className="mb-3 flex items-center gap-1"
        aria-label={`${review.rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              "h-4 w-4",
              index < review.rating
                ? "fill-gold text-gold"
                : "fill-slate-200 text-slate-200",
            )}
            aria-hidden="true"
          />
        ))}
      </div>

      <blockquote className="flex-1 text-sm leading-relaxed text-text-main">
        “{review.text}”
      </blockquote>

      {formattedDate ? (
        <p className="mt-4 text-xs text-text-muted">{formattedDate}</p>
      ) : null}
    </article>
  );
}
