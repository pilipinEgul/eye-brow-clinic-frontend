import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About — Best Aesthetic Clinic in Imus, Cavite",
  description:
    "Meet the artists behind Emcey Brows Aesthetics. Learn about our certifications, hygiene standards and why brow lovers across Cavite trust our studio.",
};

const studioGallery = [
  {
    src: "/images/hero/tile-1.jpg",
    alt: "Emcey Brows reception area with neon sign — Imus, Cavite",
  },
  {
    src: "/images/706703575_4480213738924616_3954472543166964580_n.jpg",
    alt: "Inside the studio — Emcey Brows Aesthetics signage and lounge",
  },
  {
    src: "/images/707012275_1039838768610469_977160467361222562_n.jpg",
    alt: "Treatment room with ring light and beds — Emcey Brows Imus, Cavite",
  },
  {
    src: "/images/hero/storefront-map.jpg",
    alt: "Emcey Brows storefront — 2nd Floor Brigitte Optical Center, Imus, Cavite",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Story */}
      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="eyebrow">Our Story</div>
            <h1 className="mt-3 font-display text-5xl text-ink-900 sm:text-6xl">
              Brows that frame the way you feel.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-500">
              {site.name} is a luxury beauty studio in Imus, Cavite. We blend
              meticulous artistry with a calm, spa-like experience — so every
              visit feels less like a salon, and more like a moment for you.
            </p>
            <p className="mt-4 text-base text-ink-500">
              From the very first consultation to your final glow-up, every
              detail is intentional — from premium pigments and sterile tools
              to the playlist softly humming in the background.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-warm">
              <Image
                src="/images/563602481_24850911971228775_5510725808804128950_n.jpg"
                alt="Emcey Brows client microshading before and after — Imus, Cavite"
                fill
                priority
                sizes="(max-width: 1024px) 50vw, 320px"
                className="object-cover"
              />
            </div>
            <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-3xl shadow-soft">
              <Image
                src="/images/566523801_783450497839231_2722606673627068179_n.jpg"
                alt="Emcey Brows client portrait — defined brows, Imus Cavite"
                fill
                sizes="(max-width: 1024px) 50vw, 320px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission · Vision · Promise */}
      <section className="section bg-white">
        <div className="container-x grid gap-12 md:grid-cols-3">
          {[
            {
              title: "Mission",
              body: "To help every client walk out feeling more confident, more cared for and more themselves than when they walked in.",
            },
            {
              title: "Vision",
              body: "To be the most trusted brow and aesthetic studio in the Cavite region — known for our craft and our calm.",
            },
            {
              title: "Promise",
              body: "Honest pricing, premium products, single-use tools and a result-first approach. Always.",
            },
          ].map((b) => (
            <div key={b.title} className="rounded-3xl border border-nude-100 bg-blush-50/60 p-6">
              <div className="eyebrow">{b.title}</div>
              <p className="mt-3 text-ink-700">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Video showcase */}
      <section className="section bg-gradient-to-b from-white to-cream-50">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <div className="eyebrow">Inside the studio</div>
            <h2 className="mt-3 font-display text-4xl text-ink-900 sm:text-5xl">
              A craft you can watch unfold.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-ink-500">
              Every brow, lip and lash session is handled with the same calm
              focus — from shape mapping to final stroke. Press play for a peek
              behind the curtain.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-warm">
            <video
              src="/images/hero/studio-loop-1.mp4"
              className="block h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              aria-label="Behind the scenes at Emcey Brows Aesthetics studio"
            />
          </div>
        </div>
      </section>

      {/* Safety & hygiene */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Why clients trust us"
            title="Safety & hygiene standards"
            description="Medical-grade hygiene is the floor, not the ceiling."
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Single-use sterile needles",
              "Hospital-grade barriers",
              "Certified pigment safety",
              "Transparent aftercare plan",
            ].map((s) => (
              <li key={s} className="rounded-3xl border border-nude-100 bg-white p-5 text-center shadow-sm">
                <span className="block font-display text-lg text-ink-900">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Studio media strip */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeading
            eyebrow="A look around"
            title="Inside Emcey Brows"
            description="Reception, treatment rooms and storefront — everything where you'll spend your visit."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {studioGallery.map((img) => (
              <div
                key={img.src}
                className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-nude-100 shadow-soft"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
