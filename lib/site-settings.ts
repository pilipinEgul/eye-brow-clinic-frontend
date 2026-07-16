import { api } from "@/lib/api";
import { site } from "@/lib/site";

/**
 * Resolved business info shown across the site (header, footer, contact page).
 * Values come from the admin "Business Info" editor when set, otherwise from the
 * built-in defaults in lib/site.ts. Static-only fields (map embed, review link)
 * stay in lib/site.ts.
 */
export type SiteSettings = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  address: { street: string; city: string; region: string; country: string; postalCode: string };
  contact: {
    phone: string;
    phoneTel: string;
    landline: string;
    landlineTel: string;
    email: string;
    bookingHours: string;
  };
  socials: { facebook: string; instagram: string; googleMaps: string };
};

export const siteDefaults: SiteSettings = {
  name: site.name,
  shortName: site.shortName,
  tagline: site.tagline,
  description: site.description,
  address: {
    street: site.address.street,
    city: site.address.city,
    region: site.address.region,
    country: site.address.country,
    postalCode: site.address.postalCode,
  },
  contact: {
    phone: site.contact.phone,
    phoneTel: site.contact.phoneTel,
    landline: site.contact.landline,
    landlineTel: site.contact.landlineTel,
    email: site.contact.email,
    bookingHours: site.contact.bookingHours,
  },
  socials: {
    facebook: site.socials.facebook,
    instagram: site.socials.instagram,
    googleMaps: site.socials.googleMaps,
  },
};

/** Drop null/undefined/blank values so overrides never blank out a default. */
function clean<T extends Record<string, unknown>>(obj: T | null | undefined): Partial<T> {
  const out: Partial<T> = {};
  if (!obj) return out;
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined && String(v).trim() !== "") {
      out[k as keyof T] = v as T[keyof T];
    }
  }
  return out;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data } = await api.siteSettings();
  if (!data) return siteDefaults;

  return {
    name: data.name?.trim() || siteDefaults.name,
    shortName: data.shortName?.trim() || siteDefaults.shortName,
    tagline: data.tagline?.trim() || siteDefaults.tagline,
    description: data.description?.trim() || siteDefaults.description,
    address: { ...siteDefaults.address, ...clean(data.address) },
    contact: { ...siteDefaults.contact, ...clean(data.contact) },
    socials: { ...siteDefaults.socials, ...clean(data.socials) },
  };
}
