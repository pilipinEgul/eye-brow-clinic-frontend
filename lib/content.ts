import { api, type Service, type ServiceCategory } from "@/lib/api";
import { staticServices, staticCategories } from "@/lib/static-content";

/**
 * Service/category reads for the public site. These pull from the live backend
 * (so the admin dashboard can manage them) and fall back to the built-in static
 * catalog if the API is unreachable or returns nothing — the site never renders
 * an empty services section.
 */

export async function getServices(): Promise<Service[]> {
  const { data } = await api.services({ per_page: 48 });
  return data.length > 0 ? data : staticServices;
}

export async function getFeaturedServices(limit = 6): Promise<Service[]> {
  const services = await getServices();
  const featured = services.filter((s) => s.is_featured);
  return (featured.length > 0 ? featured : services).slice(0, limit);
}

export async function getService(slug: string): Promise<Service | null> {
  const { data } = await api.service(slug);
  if (data) return data;
  return staticServices.find((s) => s.slug === slug) ?? null;
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const { data } = await api.serviceCategories();
  return data.length > 0 ? data : staticCategories;
}
