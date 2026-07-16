import Image from "next/image";
import Link from "next/link";
import { nav } from "@/lib/site";
import { areas } from "@/lib/areas";
import type { SiteSettings } from "@/lib/site-settings";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-nude-100 bg-gradient-to-b from-cream-50 to-blush-50">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-blush-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-nude-200/50 blur-3xl"
      />

      <div className="container-x relative grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
              alt={`${settings.name} logo`}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover shadow-soft"
            />
            <span className="font-display text-3xl text-ink-900">{settings.name}</span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-500">
            {settings.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-primary">
              Book Appointment
            </Link>
            <a
              href={settings.socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              Message on Facebook
            </a>
          </div>
        </div>

        <div>
          <div className="eyebrow">Explore</div>
          <ul className="mt-4 space-y-2.5 text-sm">
            {nav.primary.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="text-ink-700 transition-colors hover:text-terracotta-500"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow">Visit Us</div>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-700">
            <li>{settings.address.street}</li>
            <li>
              {settings.address.city}, {settings.address.region} {settings.address.postalCode}
            </li>
            <li>{settings.address.country}</li>
            <li>
              <a
                href={`tel:${settings.contact.landlineTel}`}
                className="inline-flex items-center gap-2 hover:text-terracotta-500"
              >
                <i className="pi pi-phone text-xs" aria-hidden />
                {settings.contact.landline}
              </a>
            </li>
            <li>
              <a
                href={`tel:${settings.contact.phoneTel}`}
                className="inline-flex items-center gap-2 hover:text-terracotta-500"
              >
                <i className="pi pi-mobile text-xs" aria-hidden />
                {settings.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${settings.contact.email}`}
                className="hover:text-terracotta-500"
              >
                {settings.contact.email}
              </a>
            </li>
            <li className="text-ink-500">{settings.contact.bookingHours}</li>
            <li>
              <a
                href={settings.socials.googleMaps}
                target="_blank"
                rel="noreferrer"
                className="hover:text-terracotta-500"
              >
                Find us on Google Maps
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-nude-100 py-6">
        <div className="container-x">
          <div className="eyebrow">Areas we serve</div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link
              href="/areas"
              className="font-medium text-ink-700 transition-colors hover:text-terracotta-500"
            >
              All of Cavite
            </Link>
            {areas.map((a) => (
              <Link
                key={a.slug}
                href={`/areas/${a.slug}`}
                className="text-ink-500 transition-colors hover:text-terracotta-500"
              >
                {a.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-nude-100 py-6">
        <div className="container-x flex flex-col items-center justify-between gap-2 text-xs text-ink-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
          <p>Designed with love in {settings.address.region}.</p>
        </div>
      </div>
    </footer>
  );
}
