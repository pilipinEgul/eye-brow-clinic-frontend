import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getServices, getServiceCategories } from "@/lib/content";
import { ServiceCard } from "@/components/ServiceCard";
import { SectionHeading } from "@/components/SectionHeading";
import { CategoryPills } from "@/components/CategoryPills";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Services — Brows, Lips, Lashes & Facials in Imus",
  description:
    "Explore ombre microshading, digital nano hair-stroke brows, lip tinting, Korean lashliner, facials and laser treatments at Emcey Brows Aesthetics in Imus, Cavite.",
};

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([
    getServices(),
    getServiceCategories(),
  ]);

  // Group services by category, preserving each category's admin sort order.
  const groups = [...categories]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      services: services.filter((s) => s.category?.id === c.id),
    }))
    .filter((g) => g.services.length > 0);

  const uncategorized = services.filter((s) => !s.category);
  if (uncategorized.length > 0) {
    groups.push({ slug: "other", name: "Other", services: uncategorized });
  }

  const navItems = groups.map((g) => ({ slug: g.slug, name: g.name }));

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
            description="Tap a category to jump to it — then tap any card for the full breakdown: process, aftercare and FAQs."
          />

          {services.length === 0 ? (
            <div className="mx-auto mt-12 max-w-md rounded-3xl border border-nude-100 bg-white/70 p-8 text-center shadow-sm">
              <i className="pi pi-sparkles text-3xl text-gold-500" aria-hidden />
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
            <>
              {navItems.length > 1 ? <CategoryPills items={navItems} /> : null}

              <div className="mt-12 space-y-16">
                {groups.map((g) => (
                  <section
                    key={g.slug}
                    id={`cat-${g.slug}`}
                    className="scroll-mt-[150px]"
                  >
                    <div className="flex items-center gap-4">
                      <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">
                        {g.name}
                      </h2>
                      <span className="rounded-full bg-blush-50 px-3 py-1 text-xs font-semibold text-terracotta-500">
                        {g.services.length}
                      </span>
                      <span className="h-px flex-1 bg-nude-100" aria-hidden />
                    </div>
                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {g.services.map((s) => (
                        <ServiceCard key={s.id} service={s} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
