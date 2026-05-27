import type { MetadataRoute } from "next";
import { api } from "@/lib/api";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/about",
    "/services",
    "/gallery",
    "/testimonials",
    "/contact",
    "/book",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  let serviceEntries: MetadataRoute.Sitemap = [];

  try {
    const { data: services } = await api.services({ per_page: 100 });

    serviceEntries = services.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch {
    // API may be offline during build — fall back to static routes only.
  }

  return [...staticRoutes, ...serviceEntries];
}
