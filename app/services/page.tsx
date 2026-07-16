import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getServices, getServiceCategories } from "@/lib/content";
import { ServiceCard } from "@/components/ServiceCard";
import { SectionHeading } from "@/components/SectionHeading";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Services — Brows, Lips, Lashes & Facials in Imus",
  description:
    "Explore ombre microshading, digital nano hair-stroke brows, lip tinting, Korean lashliner, facials and laser treatments at Emcey Brows Aesthetics in Imus, Cavite.",
};

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([
    getServices().then((data) => ({ data })),
    getServiceCategories().then((data) => ({ data })),
  ]);

  return (
    <>
      {/* Banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-[36vh] min-h-[280px] w-full sm:h-[44vh]">
          <Image
            src="/images/652319019_790683164107444_7349255575650557644_n.jpg"
            alt="Emcey Brows defined brow close-up — Imus, Cavite"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/30 via-ink-900/10 to-cream-50" />
          <div className="absolute inset-x-0 bottom-6 text-center">
            <div className="eyebrow text-white/90">Catalogue</div>
            <h1 className="mt-2 font-display text-4xl text-white drop-shadow sm:text-5xl">
              A treatment for every kind of glow
            </h1>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Browse all treatments"
            title="Pricing, duration and benefits at a glance"
            description="Tap any card for the full breakdown — process, aftercare and FAQs."
          />

          {categories.data.length > 0 ? (
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {categories.data.map((c) => (
                <span
                  key={c.id}
                  className="rounded-full border border-nude-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.25em] text-ink-700"
                >
                  {c.name}
                </span>
              ))}
            </div>
          ) : null}

          {services.data.length === 0 ? (
            <div className="mx-auto mt-12 max-w-md rounded-3xl border border-nude-100 bg-white/70 p-8 text-center shadow-sm">
              <div className="text-3xl" aria-hidden>✨</div>
              <p className="mt-3 font-display text-xl text-ink-900">
                Our treatment menu is being updated
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                We&apos;re refreshing our services — please check back soon. In the
                meantime, message us and we&apos;ll gladly help you book.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link href="/contact" className="btn btn-primary">
                  Message us
                </Link>
                <Link href="/book" className="btn btn-secondary">
                  Book an appointment
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.data.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
