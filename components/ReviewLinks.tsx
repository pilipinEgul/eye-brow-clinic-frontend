import { site } from "@/lib/site";

/**
 * "Connect your reviews" block — link-out buttons to the public Google Maps
 * and Facebook review pages. No API keys or external calls; the URLs come from
 * lib/site.ts (`socials.googleMaps`, `socials.googleReview`,
 * `socials.facebook`, `socials.facebookReviews`).
 *
 * To later replace the Google card with *live* pulled reviews, see
 * docs/REVIEWS-INTEGRATION.md.
 */
export function ReviewLinks({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Google */}
        <div className="card flex flex-col p-7">
          <div className="eyebrow">Google</div>
          <h3 className="mt-2 font-display text-2xl text-ink-900">
            Reviews on Google Maps
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
            See what clients are saying on our Google Business listing, or share
            your own experience in a few taps.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={site.socials.googleMaps}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              ★ Read Google reviews
            </a>
            <a
              href={site.socials.googleReview}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Write a Google review
            </a>
          </div>
        </div>

        {/* Facebook */}
        <div className="card flex flex-col p-7">
          <div className="eyebrow">Facebook</div>
          <h3 className="mt-2 font-display text-2xl text-ink-900">
            Recommendations on Facebook
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
            Browse recommendations from our community on Facebook, or recommend
            Emcey Brows to your friends.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={site.socials.facebookReviews}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              Read Facebook reviews
            </a>
            <a
              href={site.socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Recommend us on Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
