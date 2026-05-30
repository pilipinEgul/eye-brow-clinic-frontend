import { site } from "@/lib/site";

/**
 * Live Google reviews via the Places API (New).
 *
 * - Server-only: requires GOOGLE_PLACES_API_KEY (no NEXT_PUBLIC_ prefix), so the
 *   key never reaches the browser.
 * - Cached for 24h through Next's fetch cache to stay well within Google quotas
 *   and to satisfy Google's "refresh at least every 30 days" policy.
 * - The API returns at most 5 reviews and chooses the ordering; this is a
 *   Google limitation, not a bug.
 *
 * See docs/REVIEWS-INTEGRATION.md for setup.
 */

export type GoogleReview = {
  author: string;
  authorUrl?: string;
  profilePhoto?: string;
  rating: number;
  text: string;
  relativeTime: string;
};

export type GoogleReviewsResult = {
  /** True when a key is configured and the fetch succeeded. */
  available: boolean;
  rating: number | null;
  total: number | null;
  mapsUri: string;
  reviews: GoogleReview[];
};

/** Shape of the subset of the Places API (New) response we request. */
type PlacesResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: Array<{
    rating?: number;
    text?: { text?: string };
    relativePublishTimeDescription?: string;
    authorAttribution?: {
      displayName?: string;
      photoUri?: string;
      uri?: string;
    };
  }>;
};

const EMPTY: GoogleReviewsResult = {
  available: false,
  rating: null,
  total: null,
  mapsUri: site.socials.googleMaps,
  reviews: [],
};

export async function getGoogleReviews(): Promise<GoogleReviewsResult> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key || !site.placeId) return EMPTY;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${site.placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": [
            "rating",
            "userRatingCount",
            "googleMapsUri",
            "reviews.rating",
            "reviews.text",
            "reviews.relativePublishTimeDescription",
            "reviews.authorAttribution.displayName",
            "reviews.authorAttribution.photoUri",
            "reviews.authorAttribution.uri",
          ].join(","),
          // Localise relative times + review text to English (PH).
          "Accept-Language": "en",
        },
        // Refresh once a day. ISR-style caching at the data layer.
        next: { revalidate: 60 * 60 * 24 },
      },
    );

    if (!res.ok) return EMPTY;
    const data: PlacesResponse = await res.json();

    const reviews: GoogleReview[] = (data.reviews ?? []).map((r) => ({
      author: r.authorAttribution?.displayName ?? "Google user",
      authorUrl: r.authorAttribution?.uri,
      profilePhoto: r.authorAttribution?.photoUri,
      rating: typeof r.rating === "number" ? r.rating : 5,
      text: r.text?.text ?? "",
      relativeTime: r.relativePublishTimeDescription ?? "",
    }));

    return {
      available: true,
      rating: typeof data.rating === "number" ? data.rating : null,
      total: typeof data.userRatingCount === "number" ? data.userRatingCount : null,
      mapsUri: data.googleMapsUri || site.socials.googleMaps,
      reviews: reviews.filter((r) => r.text.trim().length > 0),
    };
  } catch {
    // Network/quota error — fall back to link-out only.
    return EMPTY;
  }
}
