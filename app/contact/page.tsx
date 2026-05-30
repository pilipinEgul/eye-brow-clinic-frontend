import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — Emcey Brows Aesthetics in Imus, Cavite",
  description:
    "Reach Emcey Brows Aesthetics by phone, email or Facebook Messenger. Visit our studio in Imus, Cavite.",
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container-x grid gap-12 lg:grid-cols-2">
        <div>
          <div className="eyebrow">Say Hello</div>
          <h1 className="mt-3 font-display text-5xl text-ink-900 sm:text-6xl">
            Let’s plan your glow-up.
          </h1>
          <p className="mt-4 max-w-md text-ink-500">
            Drop us a message for inquiries, custom packages, group bookings or
            partnership requests. We typically reply within a few hours during
            studio hours.
          </p>

          <dl className="mt-10 space-y-5 text-sm">
            <div>
              <dt className="eyebrow">Address</dt>
              <dd className="mt-1 text-ink-700">
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region} {site.address.postalCode}
                <br />
                {site.address.country}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Phone</dt>
              <dd className="mt-1 space-y-1">
                <a className="block text-ink-700 hover:text-gold-600" href={`tel:${site.contact.landlineTel}`}>
                  ☎ {site.contact.landline}
                </a>
                <a className="block text-ink-700 hover:text-gold-600" href={`tel:${site.contact.phoneTel}`}>
                  📱 {site.contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Email</dt>
              <dd className="mt-1">
                <a className="text-ink-700 hover:text-gold-600" href={`mailto:${site.contact.email}`}>
                  {site.contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Studio Hours</dt>
              <dd className="mt-1 text-ink-700">{site.contact.bookingHours}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={site.socials.facebook} target="_blank" rel="noreferrer" className="btn btn-secondary">
              Message on Facebook
            </a>
            <a
              href={site.socials.googleMaps}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              View on Google Maps
            </a>
            <a
              href={site.socials.googleReview}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              Leave a Google review
            </a>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-nude-100 shadow-xl">
            <iframe
              src={site.mapEmbed}
              width="100%"
              height="320"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Emcey Brows on Google Maps"
            />
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
