import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/lib/site";

export function Footer() {
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
              alt={`${site.name} logo`}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover shadow-soft"
            />
            <span className="font-display text-3xl text-ink-900">{site.name}</span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-500">
            {site.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-primary">
              Book Appointment
            </Link>
            <a
              href={site.socials.facebook}
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
            <li>{site.address.street}</li>
            <li>
              {site.address.city}, {site.address.region} {site.address.postalCode}
            </li>
            <li>{site.address.country}</li>
            <li>
              <a
                href={`tel:${site.contact.landlineTel}`}
                className="hover:text-terracotta-500"
              >
                ☎ {site.contact.landline}
              </a>
            </li>
            <li>
              <a
                href={`tel:${site.contact.phoneTel}`}
                className="hover:text-terracotta-500"
              >
                📱 {site.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="hover:text-terracotta-500"
              >
                {site.contact.email}
              </a>
            </li>
            <li className="text-ink-500">{site.contact.bookingHours}</li>
            <li>
              <a
                href={site.socials.googleMaps}
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
        <div className="container-x flex flex-col items-center justify-between gap-2 text-xs text-ink-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Designed with love in {site.address.region}.</p>
        </div>
      </div>
    </footer>
  );
}
