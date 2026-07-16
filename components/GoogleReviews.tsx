import { getGoogleReviews, type GoogleReview } from "@/lib/google-reviews";
import { ExpandableQuote } from "@/components/ExpandableQuote";
import { ReviewsGrid } from "@/components/ReviewsGrid";

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div
      aria-label={`${rating} of 5 stars`}
      className="flex gap-0.5 text-gold-500"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden>
          {i < rounded ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.29 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function ReviewCard({ r }: { r: GoogleReview }) {
  return (
    <figure className="card card-hover relative flex h-full flex-col p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <Stars rating={r.rating} />
        <span className="text-gold-500" title="Posted on Google">
          <GoogleGlyph />
        </span>
      </div>
      <ExpandableQuote text={r.text} />
      <figcaption className="mt-6 flex items-center gap-3 border-t border-nude-100 pt-4 text-sm">
        {r.profilePhoto ? (
          // eslint-disable-next-line @next/next/no-img-element -- Google avatar URLs are short-lived and must not be optimized/cached.
          <img
            src={r.profilePhoto}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blush-200 to-nude-200 text-[12px] font-semibold text-terracotta-600"
          >
            {r.author.slice(0, 1).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <div className="truncate font-medium text-ink-900">{r.author}</div>
          {r.relativeTime ? (
            <div className="truncate text-xs text-ink-500">{r.relativeTime}</div>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * Live Google reviews pulled from the Places API (New). Renders nothing if no
 * API key is configured or the fetch fails — the link-out buttons in
 * <ReviewLinks /> remain the fallback. See docs/REVIEWS-INTEGRATION.md.
 */
export async function GoogleReviews({ className = "" }: { className?: string }) {
  const data = await getGoogleReviews();
  if (!data.available || data.reviews.length === 0) return null;

  return (
    <section className={className} aria-label="Google reviews">
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-ink-700">
          <GoogleGlyph />
          Verified Google reviews
        </span>
        {data.rating != null ? (
          <div className="mt-2 flex items-center gap-3">
            <span className="font-display text-4xl text-ink-900">
              {data.rating.toFixed(1)}
            </span>
            <span className="flex flex-col items-start">
              <Stars rating={data.rating} />
              {data.total != null ? (
                <span className="text-xs text-ink-500">
                  {data.total.toLocaleString()} review
                  {data.total === 1 ? "" : "s"}
                </span>
              ) : null}
            </span>
          </div>
        ) : null}
      </div>

      <ReviewsGrid
        cards={data.reviews.map((r, i) => (
          <ReviewCard key={`${r.author}-${i}`} r={r} />
        ))}
      />
    </section>
  );
}
