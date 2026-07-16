import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { areas, getArea, areaUrl } from "@/lib/areas";
import { getFeaturedServices } from "@/lib/content";
import { ServiceCard } from "@/components/ServiceCard";
import { SectionHeading } from "@/components/SectionHeading";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schemas";
import { site } from "@/lib/site";

export const revalidate = 300;

type PageProps = { params: Promise<{ city: string }> };

export function generateStaticParams() {
  return areas.map((a) => ({ city: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const area = getArea(city);
  if (!area) return { title: "Area not found" };

  const title = `Brow & Aesthetic Clinic in ${area.name}, Cavite | ${site.shortName}`;
  const description = `Ombre brows, nano hair strokes, lip blushing, lashliner, facials & laser treatments for ${area.name} clients. ${site.name} — trusted brow studio serving ${area.name} from nearby Imus, Cavite.`;

  return {
    title,
    description,
    keywords: [
      `brows ${area.name}`,
      `eyebrow clinic ${area.name}`,
      `ombre brows ${area.name}`,
      `aesthetic clinic ${area.name} Cavite`,
      `lip blush ${area.name}`,
      `facial ${area.name}`,
      `brow embroidery ${area.name}`,
    ],
    alternates: { canonical: areaUrl(area.slug) },
    openGraph: {
      title,
      description,
      url: areaUrl(area.slug),
    },
  };
}

export default async function AreaPage({ params }: PageProps) {
  const { city } = await params;
  const area = getArea(city);
  if (!area) notFound();

  const featured = await getFeaturedServices(6);

  const cityFaqs = [
    {
      id: 1,
      category: area.name,
      question: `Do you serve clients from ${area.name}?`,
      answer: `Yes — we welcome ${area.name} clients every day. ${area.travel} Many of our regulars travel in from ${area.name} for our brow and aesthetic services.`,
      sort_order: 1,
      service_id: null,
    },
    {
      id: 2,
      category: area.name,
      question: `How far is ${site.name} from ${area.name}?`,
      answer: `${area.travel} We're at ${site.address.street}, ${site.address.city}, ${site.address.region}.`,
      sort_order: 2,
      service_id: null,
    },
    {
      id: 3,
      category: area.name,
      question: `What treatments can ${area.name} clients book?`,
      answer:
        "Ombre microshading, digital nano hair strokes, combination brows, lip tinting/blushing, Korean lashliner, cleansing, diamond peel, acne and hydra facials, plus diode laser, pico laser, radio frequency and tattoo removal.",
      sort_order: 3,
      service_id: null,
    },
    {
      id: 4,
      category: area.name,
      question: `How do I book from ${area.name}?`,
      answer: `Tap "Book Appointment", message us on Facebook, or call ${site.contact.landline} / ${site.contact.phone}. We'll confirm a slot that fits your trip from ${area.name}.`,
      sort_order: 4,
      service_id: null,
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Areas We Serve", url: `${site.url}/areas` },
          { name: area.name, url: areaUrl(area.slug) },
        ])}
      />
      <JsonLd
        data={faqSchema(
          cityFaqs.map((f) => ({ question: f.question, answer: f.answer })),
        )}
      />

      {/* Hero */}
      <section className="section">
        <div className="container-x max-w-3xl">
          <div className="eyebrow">{area.proximity}</div>
          <h1 className="mt-3 font-display text-4xl leading-tight text-ink-900 sm:text-5xl lg:text-6xl">
            Brows & Aesthetics for {area.name}, Cavite
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-500">{area.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-primary">
              Book Appointment
            </Link>
            <a
              href={site.socials.googleMaps}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              Get directions
            </a>
          </div>
          {area.landmarks.length > 0 ? (
            <p className="mt-6 text-sm text-ink-500">
              Popular with clients from{" "}
              {area.landmarks.map((l, i) => (
                <span key={l}>
                  <span className="text-ink-700">{l}</span>
                  {i < area.landmarks.length - 1 ? ", " : ""}
                </span>
              ))}
              .
            </p>
          ) : null}
        </div>
      </section>

      {/* Why us */}
      <section className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_2fr]">
          <SectionHeading
            align="left"
            eyebrow={`Serving ${area.name}`}
            title={`Why ${area.name} clients choose us`}
          />
          <p className="text-base leading-relaxed text-ink-700">{area.why}</p>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Most-booked treatments"
            title={`Popular with ${area.name} clients`}
            description="Tap any treatment for full pricing, process and aftercare."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/services" className="btn btn-secondary">
              View all services
            </Link>
          </div>
        </div>
      </section>

      {/* Location / travel */}
      <section className="section bg-gradient-to-b from-white to-cream-50">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="eyebrow">Getting here from {area.name}</div>
            <h2 className="mt-3 font-display text-3xl text-ink-900 sm:text-4xl">
              Easy to reach in Imus
            </h2>
            <p className="mt-4 leading-relaxed text-ink-500">{area.travel}</p>
            <p className="mt-4 text-sm text-ink-700">
              {site.address.street}
              <br />
              {site.address.city}, {site.address.region} {site.address.postalCode}
            </p>
            <p className="mt-2 text-sm text-ink-500">{site.contact.bookingHours}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-secondary">
                Contact us
              </Link>
              <a
                href={site.socials.googleReview}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                Read our reviews
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-nude-100 shadow-warm">
            <iframe
              src={site.mapEmbed}
              title={`Map to ${site.name} from ${area.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[320px] w-full"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow={`${area.name} FAQs`}
            title={`Booking from ${area.name}`}
          />
          <div className="mt-10">
            <FaqList faqs={cityFaqs} />
          </div>
        </div>
      </section>

      {/* Nearby areas — internal linking */}
      <section className="section bg-white">
        <div className="container-x text-center">
          <div className="eyebrow">Also serving nearby</div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {areas
              .filter((a) => a.slug !== area.slug)
              .map((a) => (
                <Link
                  key={a.slug}
                  href={`/areas/${a.slug}`}
                  className="rounded-full border border-nude-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink-700 transition hover:border-terracotta-300 hover:text-terracotta-500"
                >
                  {a.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
