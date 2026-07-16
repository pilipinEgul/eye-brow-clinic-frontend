import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { staticFaqs, staticServices } from "@/lib/static-content";
import { getService } from "@/lib/content";
import { SectionHeading } from "@/components/SectionHeading";
import { FaqList } from "@/components/FaqList";
import { ReviewLinks } from "@/components/ReviewLinks";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schemas";
import { site } from "@/lib/site";

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return staticServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
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
  const service = await getService(slug);
  if (!service) notFound();

  const serviceFaqs = staticFaqs.filter((f) => f.service_id === service.id);

  const price = peso(service.promo_price ?? service.price);
  const originalPrice = service.promo_price ? peso(service.price) : null;
  const hasTierPricing = Boolean(
    service.sr_artist_first_session ||
      service.master_artist_first_session ||
      service.sr_artist_second_session ||
      service.master_artist_second_session,
  );

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
      {serviceFaqs.length > 0 ? (
        <JsonLd data={faqSchema(serviceFaqs.map((f) => ({ question: f.question, answer: f.answer })))} />
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

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-warm">
              {service.cover_image ? (
                <Image
                  src={service.cover_image}
                  alt={`${service.name} by Emcey Brows — Imus, Cavite`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blush-200 to-nude-300" />
              )}
            </div>
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-6 -left-6 -z-10 h-40 w-40 rounded-full bg-blush-200/60 blur-2xl"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -top-6 -right-6 -z-10 h-40 w-40 rounded-full bg-nude-200/60 blur-2xl"
            />
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

      {hasTierPricing ? (
        <section className="section bg-gradient-to-b from-white to-cream-50">
          <div className="container-x">
            <SectionHeading
              eyebrow="Session pricing"
              title="Sr Artist & Master Artist rates"
              description={
                originalPrice
                  ? `Original price ${originalPrice} — current promo pricing below.`
                  : "Two-session protocol — choose Sr Artist or Master Artist tier."
              }
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-nude-100 bg-white p-8 shadow-soft">
                <div className="eyebrow text-terracotta-500">1st Session</div>
                <dl className="mt-6 space-y-5">
                  {service.sr_artist_first_session ? (
                    <div className="flex items-baseline justify-between gap-4 border-b border-nude-100 pb-4">
                      <dt className="text-sm text-ink-500">Sr Artist Rate</dt>
                      <dd className="font-display text-3xl text-ink-900">
                        {peso(service.sr_artist_first_session)}
                      </dd>
                    </div>
                  ) : null}
                  {service.master_artist_first_session ? (
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-sm text-ink-500">Master Artist Rate</dt>
                      <dd className="font-display text-3xl text-ink-900">
                        {peso(service.master_artist_first_session)}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>

              <div className="rounded-3xl border border-nude-100 bg-white p-8 shadow-soft">
                <div className="eyebrow text-terracotta-500">2nd Session</div>
                <dl className="mt-6 space-y-5">
                  {service.sr_artist_second_session ? (
                    <div className="flex items-baseline justify-between gap-4 border-b border-nude-100 pb-4">
                      <dt className="text-sm text-ink-500">Sr Artist Rate</dt>
                      <dd className="font-display text-3xl text-ink-900">
                        {peso(service.sr_artist_second_session)}
                      </dd>
                    </div>
                  ) : null}
                  {service.master_artist_second_session ? (
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-sm text-ink-500">Master Artist Rate</dt>
                      <dd className="font-display text-3xl text-ink-900">
                        {peso(service.master_artist_second_session)}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </div>
            <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-ink-500">
              Master Artist tier adds ₱1,500 (1st) / ₱1,000 (2nd) over Sr Artist
            </p>
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

      {serviceFaqs.length > 0 ? (
        <section className="section bg-white">
          <div className="container-x">
            <SectionHeading eyebrow={`About ${service.name}`} title="Frequently asked" />
            <div className="mt-10">
              <FaqList faqs={serviceFaqs} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Real client stories" title="What clients say" />
          <ReviewLinks className="mt-12" />
        </div>
      </section>
    </>
  );
}
