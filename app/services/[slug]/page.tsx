import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { SectionHeading } from "@/components/SectionHeading";
import { FaqList } from "@/components/FaqList";
import { TestimonialCard } from "@/components/TestimonialCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schemas";
import { site } from "@/lib/site";

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: service } = await api.service(slug);
  if (!service) return { title: "Service not found" };

  const title = service.meta.title ?? `${service.name} — Emcey Brows`;
  const description = service.meta.description ?? service.short_description ?? "";

  return {
    title,
    description,
    keywords: service.meta.keywords ?? undefined,
    alternates: { canonical: `${site.url}/services/${service.slug}` },
    openGraph: {
      title,
      description,
      url: `${site.url}/services/${service.slug}`,
    },
  };
}

function peso(value: string | null) {
  if (!value) return null;
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: service } = await api.service(slug);
  if (!service) notFound();

  const price = peso(service.promo_price ?? service.price);
  const originalPrice = service.promo_price ? peso(service.price) : null;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: site.url },
        { name: "Services", url: `${site.url}/services` },
        { name: service.name, url: `${site.url}/services/${service.slug}` },
      ])} />
      <JsonLd data={serviceSchema({
        name: service.name,
        description: service.description,
        slug: service.slug,
        price: service.promo_price ?? service.price,
      })} />
      {service.faqs && service.faqs.length > 0 ? (
        <JsonLd data={faqSchema(service.faqs.map((f) => ({ question: f.question, answer: f.answer })))} />
      ) : null}

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <div className="eyebrow">{service.category?.name ?? "Treatment"}</div>
            <h1 className="mt-3 font-display text-5xl text-ink-900 sm:text-6xl">
              {service.name}
            </h1>
            {service.short_description ? (
              <p className="mt-5 text-lg leading-relaxed text-ink-500">
                {service.short_description}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-end gap-6">
              {price ? (
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-ink-300">
                    Starting at
                  </div>
                  <div className="mt-1 flex items-baseline gap-3">
                    <span className="font-display text-4xl text-ink-900">{price}</span>
                    {originalPrice ? (
                      <span className="text-base text-ink-300 line-through">
                        {originalPrice}
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : null}
              {service.duration_minutes ? (
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-ink-300">
                    Duration
                  </div>
                  <div className="mt-1 font-display text-2xl text-ink-900">
                    {service.duration_minutes} min
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/book?service=${service.slug}`} className="btn btn-primary">
                Book this treatment
              </Link>
              <Link href="/services" className="btn btn-secondary">
                ← Back to services
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-blush-200 to-blush-300 shimmer" />
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-nude-200 to-nude-300 shimmer mt-12" />
          </div>
        </div>
      </section>

      {service.description ? (
        <section className="section bg-white">
          <div className="container-x grid gap-10 lg:grid-cols-[1fr_2fr]">
            <SectionHeading align="left" eyebrow="The treatment" title="What to expect" />
            <p className="text-base leading-relaxed text-ink-700">{service.description}</p>
          </div>
        </section>
      ) : null}

      {(service.benefits && service.benefits.length > 0) ||
      (service.process_steps && service.process_steps.length > 0) ||
      (service.aftercare && service.aftercare.length > 0) ? (
        <section className="section">
          <div className="container-x grid gap-6 md:grid-cols-3">
            {service.benefits && service.benefits.length > 0 ? (
              <div className="rounded-3xl border border-nude-100 bg-white p-6 shadow-sm">
                <div className="eyebrow">Benefits</div>
                <ul className="mt-4 space-y-2 text-sm text-ink-700">
                  {service.benefits.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-gold-500">✦</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {service.process_steps && service.process_steps.length > 0 ? (
              <div className="rounded-3xl border border-nude-100 bg-white p-6 shadow-sm">
                <div className="eyebrow">The process</div>
                <ol className="mt-4 space-y-2 text-sm text-ink-700">
                  {service.process_steps.map((s, i) => (
                    <li key={s} className="flex gap-2">
                      <span className="font-display text-gold-600">{i + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {service.aftercare && service.aftercare.length > 0 ? (
              <div className="rounded-3xl border border-nude-100 bg-white p-6 shadow-sm">
                <div className="eyebrow">Aftercare</div>
                <ul className="mt-4 space-y-2 text-sm text-ink-700">
                  {service.aftercare.map((a) => (
                    <li key={a} className="flex gap-2">
                      <span className="text-gold-500">·</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {service.faqs && service.faqs.length > 0 ? (
        <section className="section bg-white">
          <div className="container-x">
            <SectionHeading eyebrow={`About ${service.name}`} title="Frequently asked" />
            <div className="mt-10">
              <FaqList faqs={service.faqs} />
            </div>
          </div>
        </section>
      ) : null}

      {service.testimonials && service.testimonials.length > 0 ? (
        <section className="section">
          <div className="container-x">
            <SectionHeading eyebrow="Real client stories" title="What clients say" />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {service.testimonials.slice(0, 6).map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
