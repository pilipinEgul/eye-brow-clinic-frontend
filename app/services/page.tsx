import type { Metadata } from "next";
import { api } from "@/lib/api";
import { ServiceCard } from "@/components/ServiceCard";
import { SectionHeading } from "@/components/SectionHeading";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Services — Brows, Lips, Lashes & Facials in Imus",
  description:
    "Explore microblading, ombre brows, lip blush, lash extensions, facial treatments and permanent makeup at Emcey Brows Aesthetics in Imus, Cavite.",
};

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([
    api.services({ per_page: 24 }),
    api.serviceCategories(),
  ]);

  return (
    <>
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Catalogue"
            title="A treatment for every kind of glow"
            description="Pricing, duration and benefits at a glance. Tap any card for the full breakdown."
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
            <p className="mt-12 text-center text-sm text-ink-500">
              Once the API is connected and the database is seeded, services
              will appear here.
            </p>
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
