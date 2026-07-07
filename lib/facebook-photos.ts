import type { GalleryImage } from "@/lib/api";

/**
 * Live Facebook Page photos via the Graph API.
 *
 * - Server-only: requires FACEBOOK_PAGE_ACCESS_TOKEN (no NEXT_PUBLIC_ prefix),
 *   so the token never reaches the browser.
 * - Pulls photos *uploaded by the Page* (type=uploaded), not tagged ones.
 * - Cached 12h through Next's fetch cache to stay light on the Graph API.
 * - Fails safe to an empty array: with no token, a bad token, or any error,
 *   the gallery simply shows the built-in static photos and nothing breaks.
 *
 * Facebook reviews are NOT fetchable (Meta removed public access) — reviews are
 * featured manually as testimonials. This module is photos only.
 *
 * See docs/REVIEWS-INTEGRATION.md for setup.
 */

const GRAPH_VERSION = "v21.0";

/** Graph API /{page-id}/photos response subset we request. */
type PhotosResponse = {
  data?: Array<{
    id?: string;
    name?: string;
    images?: Array<{ height?: number; width?: number; source?: string }>;
  }>;
};

/** Pick the largest available rendition for crisp display. */
function largest(images?: Array<{ width?: number; source?: string }>): string | null {
  if (!images?.length) return null;
  const best = [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0];
  return best?.source ?? null;
}

export async function getFacebookPhotos(limit = 24): Promise<GalleryImage[]> {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;
  if (!token || !pageId) return [];

  try {
    const url =
      `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/photos` +
      `?type=uploaded&fields=id,name,images&limit=${limit}` +
      `&access_token=${encodeURIComponent(token)}`;

    const res = await fetch(url, { next: { revalidate: 60 * 60 * 12 } });
    if (!res.ok) return [];

    const data: PhotosResponse = await res.json();

    return (data.data ?? [])
      .map((photo, i): GalleryImage | null => {
        const src = largest(photo.images);
        if (!src) return null;
        const caption = photo.name?.trim();
        return {
          // Offset well past the static gallery ids to guarantee uniqueness.
          id: 900000 + i,
          category: "From Facebook",
          title: caption ? caption.split("\n")[0].slice(0, 80) : null,
          alt_text: caption?.slice(0, 160) ?? "Emcey Brows photo from Facebook",
          image_path: src,
          before_image_path: null,
          after_image_path: null,
          is_featured: false,
          service: null,
        };
      })
      .filter((x): x is GalleryImage => x !== null);
  } catch {
    // Network / token / quota error — fall back to static gallery only.
    return [];
  }
}
