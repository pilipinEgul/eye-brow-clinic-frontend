import Image from "next/image";
import Link from "next/link";
import { getFeaturedServices, getFaqs } from "@/lib/content";
import { ServiceCard } from "@/components/ServiceCard";
import { GoogleReviews } from "@/components/GoogleReviews";
import { ReviewLinks } from "@/components/ReviewLinks";
import { SectionHeading } from "@/components/SectionHeading";
import { FaqList } from "@/components/FaqList";
import { site } from "@/lib/site";

export const revalidate = 300;

const trustBadges = [
  { icon: "★", label: "5.0 Google reviews" },
  { icon: "✦", label: "Medical-grade hygiene" },
  { icon: "♡", label: "Vegan pigments" },
];

const whyPoints = [
  {
    icon: "✎",
    title: "Certified artistry",
    body: "Trained in semi-permanent makeup, laser and aesthetic facials.",
  },
  {
    icon: "✦",
    title: "Premium pigments",
    body: "Vegan, hypoallergenic, ophthalmologist tested.",
  },
  {
    icon: "✚",
    title: "Medical-grade hygiene",
    body: "Single-use needles and full sterilisation.",
  },
  {
    icon: "₱",
    title: "Honest pricing",
    body: "Transparent rates, GCash, Maya, Visa, Mastercard, & QRPh friendly.",
  },
];

export default async function Home() {
  const services = { data: await getFeaturedServices(6) };
  const faqs = { data: await getFaqs({ general: true }) };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream-grain">
        {/* Decorative warm blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-blush-200/50 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-32 h-[32rem] w-[32rem] rounded-full bg-nude-200/60 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-terracotta-300/30 blur-3xl"
        />

        <div className="container-x relative grid items-center gap-12 pt-14 pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-24 lg:pb-28">
          <div className="fade-up">
            <div className="eyebrow">Imus · Cavite · Philippines</div>
            <h1 className="mt-4 font-display text-[2.75rem] leading-[1.05] text-ink-900 sm:text-6xl lg:text-[4.5rem]">
              Beauty,{" "}
              <span className="relative inline-block">
                <span className="relative z-10 italic text-terracotta-500">refined.</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded-full bg-blush-200/70"
                />
              </span>
              <br />
              <span className="text-ink-700">brows that feel like you.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500">
              From digital nano hair-stroke brows to glow-restoring hydra
              facials — Emcey Brows blends artistry, premium pigments and a
              calming studio experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="btn btn-primary">
                Book Appointment
                <span aria-hidden>→</span>
              </Link>
              <Link href="/services" className="btn btn-secondary">
                View Services
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.28em] text-ink-500">
              {trustBadges.map((b) => (
                <span key={b.label} className="flex items-center gap-2">
                  <span className="text-terracotta-500" aria-hidden>
                    {b.icon}
                  </span>
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Hero collage */}
          <div className="relative fade-up-delay-2">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-gradient-to-br from-blush-200 via-blush-300 to-terracotta-400 shadow-warm">
                <Image
                  src="/images/hero/signature-2.jpg"
                  alt="Microblading before and after by Emcey Brows — Imus, Cavite client"
                  fill
                  priority
                  sizes="(max-width: 1024px) 50vw, 400px"
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 chip bg-white/85 z-10">Signature</span>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gradient-to-br from-nude-200 to-gold-400/60 shadow-soft float-slow">
                  <Image
                    src="/images/hero/tile-1.jpg"
                    alt="Emcey Brows studio — Imus, Cavite"
                    fill
                    sizes="(max-width: 1024px) 25vw, 200px"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gradient-to-br from-blush-100 to-blush-200 shadow-soft">
                  <Image
                    src="/images/hero/tile-healed.jpg"
                    alt="Ombre brows healed result — Emcey Brows, Imus Cavite"
                    fill
                    sizes="(max-width: 1024px) 25vw, 200px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating stat card */}
            <div className="glass absolute -bottom-8 left-4 right-4 rounded-3xl p-5 shadow-warm sm:left-8 sm:right-8">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["#f5c8a8", "#e4cba9", "#eaa37a"].map((c) => (
                    <span
                      key={c}
                      aria-hidden
                      className="h-9 w-9 rounded-full border-2 border-white"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <div className="h-10 w-px bg-nude-200" />
                <div>
                  <div className="font-display text-2xl text-ink-900">1,200+</div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-ink-500">
                    Happy clients
                  </div>
                </div>
                <div className="h-10 w-px bg-nude-200" />
                <div>
                  <div className="font-display text-2xl text-ink-900">5.0★</div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-ink-500">
                    Avg rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Signature Treatments"
            title="Luxury Brow & Beauty Services"
            description="Crafted treatments designed around your features, skin and lifestyle."
          />

          {services.data.length === 0 ? (
            <div className="mx-auto mt-12 max-w-md rounded-3xl border border-nude-100 bg-white/70 p-8 text-center shadow-sm">
              <div className="text-3xl" aria-hidden>✨</div>
              <p className="mt-3 font-display text-xl text-ink-900">
                Our treatment menu is being updated
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                We&apos;re refreshing our services — please check back soon, or
                message us and we&apos;ll gladly help you book.
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
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.data.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/services" className="btn btn-secondary">
              See all services
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section bg-gradient-to-b from-white to-cream-50">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <SectionHeading
            align="left"
            eyebrow="Why Emcey Brows"
            title="Quietly luxurious. Obsessively detailed."
            description="Tiny details make every treatment exceptional — from custom shape mapping to premium pigments and a calming studio atmosphere."
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {whyPoints.map((f) => (
              <li
                key={f.title}
                className="group rounded-3xl border border-nude-100 bg-white/80 p-6 shadow-soft transition hover:-translate-y-1 hover:border-terracotta-400/40 hover:shadow-warm"
              >
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blush-100 to-nude-100 text-terracotta-500 transition group-hover:scale-110">
                  <span className="text-lg" aria-hidden>{f.icon}</span>
                </div>
                <div className="mt-4 font-display text-xl text-ink-900">{f.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Real client transformation */}
      <section className="section bg-white">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] shadow-warm">
              <Image
                src="/images/hero/transformation.jpg"
                alt="Microblading before and after by Emcey Brows — Imus, Cavite client"
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
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
          <div>
            <div className="eyebrow">Real results</div>
            <h2 className="mt-3 font-display text-4xl text-ink-900 sm:text-5xl">
              A natural shape, made for your face.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-500">
              Every brow is mapped to your features — never copied, never
              forced. The result: defined, balanced brows that look like they
              grew that way.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/gallery" className="btn btn-secondary">
                See more transformations
                <span aria-hidden>→</span>
              </Link>
              <Link href="/book" className="btn btn-primary">
                Book your shape mapping
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Watch the craft */}
      <section className="section bg-gradient-to-b from-white to-cream-50">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-warm">
            <video
              src="/images/hero/studio-loop-2.mp4"
              className="block aspect-video h-full w-full object-cover sm:aspect-[4/3]"
              autoPlay
              muted
              loop
              playsInline
              aria-label="Brow treatment in progress at Emcey Brows Aesthetics"
            />
          </div>
          <div>
            <div className="eyebrow">Watch the craft</div>
            <h2 className="mt-3 font-display text-4xl text-ink-900 sm:text-5xl">
              Quiet focus. Precise hands.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-500">
              Every session is a calm, deliberate ritual — from shape mapping
              to the final pigment stroke. Press play and see how we work.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/about" className="btn btn-secondary">
                Meet the studio
                <span aria-hidden>→</span>
              </Link>
              <Link href="/book" className="btn btn-primary">
                Book a session
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeading
            eyebrow="Loved by our clients"
            title="Five-star Google reviews"
            description="Real words from real clients across Cavite."
          />
          <GoogleReviews className="mt-12" />
          <ReviewLinks className="mt-12" />
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-gradient-to-b from-cream-50 to-white">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading
            align="left"
            eyebrow="Quick answers"
            title="Frequently asked questions"
          />
          <FaqList faqs={faqs.data} />
        </div>
      </section>

      {/* Map + CTA */}
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="eyebrow">Visit the studio</div>
            <h2 className="mt-3 font-display text-4xl text-ink-900 sm:text-5xl">
              Find us in {site.address.city}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-500">
              {site.address.street}
              <br />
              {site.address.city}, {site.address.region} {site.address.postalCode}, {site.address.country}
            </p>
            <p className="mt-2 text-sm text-ink-500">{site.contact.bookingHours}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/book" className="btn btn-primary">
                Book Appointment
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                Contact us
              </Link>
              <a
                href={site.socials.googleReview}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                Leave a review
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-nude-100 shadow-warm">
            <iframe
              src={site.mapEmbed}
              width="100%"
              height="380"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Emcey Brows on Google Maps"
            />
          </div>
        </div>
      </section>
    </>
  );
}
