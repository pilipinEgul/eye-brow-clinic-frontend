import {
  api,
  type Faq,
  type GalleryImage,
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
