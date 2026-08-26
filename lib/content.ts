import {
  api,
  type Announcement,
  type Faq,
  type GalleryImage,
  type Promo,
  type Service,
  type ServiceCategory,
} from "@/lib/api";

/**
 * Content reads for the public site — fully driven by the live backend/admin.
 * If the API is unreachable, `api.*` already resolves to an empty collection
 * (see `safe()` in lib/api.ts), so callers get [] and render an empty state.
 * There is intentionally no static/hardcoded fallback catalog.
 */

export async function getServices(): Promise<Service[]> {
  const { data } = await api.services({ per_page: 48 });
  return data;
}

export async function getFeaturedServices(limit = 6): Promise<Service[]> {
  const services = await getServices();
  const featured = services.filter((s) => s.is_featured);
  return (featured.length > 0 ? featured : services).slice(0, limit);
}

export async function getService(slug: string): Promise<Service | null> {
  const { data } = await api.service(slug);
  return data ?? null;
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const { data } = await api.serviceCategories();
  return data;
}

export async function getFaqs(
  params: { service_id?: number; general?: boolean } = {},
): Promise<Faq[]> {
  const { data } = await api.faqs(params);
  return data;
}

export async function getGallery(): Promise<GalleryImage[]> {
  const { data } = await api.gallery({ per_page: 60 });
  return data;
}

/**
 * Images for the home hero collage — pulled from the Gallery (featured first),
 * so admins control them. Falls back to the built-in hero photos per slot so the
 * hero is never blank before any gallery images are uploaded.
 */
const HERO_FALLBACK = [
  "/images/hero/signature-2.jpg",
  "/images/hero/tile-1.jpg",
  "/images/hero/tile-healed.jpg",
];

/** next/image needs a root-relative ("/…") or absolute (http…) src — skip anything else. */
function usableSrc(p: string | null): p is string {
  return !!p && (p.startsWith("/") || /^https?:\/\//i.test(p));
}

export async function getHeroImages(count = 3): Promise<string[]> {
  const gallery = await getGallery();
  const featured = gallery.filter((g) => g.is_featured).map((g) => g.image_path).filter(usableSrc);
  const others = gallery.filter((g) => !g.is_featured).map((g) => g.image_path).filter(usableSrc);
  const pool = [...featured, ...others];
  return Array.from({ length: count }, (_, i) => pool[i] ?? HERO_FALLBACK[i] ?? HERO_FALLBACK[0]);
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const { data } = await api.announcements();
  return data;
}

export async function getPromos(): Promise<Promo[]> {
  const { data } = await api.promos();
  return data;
}
