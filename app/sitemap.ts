import type { MetadataRoute } from "next";
import { staticServices } from "@/lib/static-content";
import { areas } from "@/lib/areas";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/about",
    "/services",
    "/gallery",
    "/testimonials",
    "/contact",
    "/book",
    "/areas",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const serviceEntries: MetadataRoute.Sitemap = staticServices.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const areaEntries: MetadataRoute.Sitemap = areas.map((a) => ({
    url: `${base}/areas/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceEntries, ...areaEntries];
}
