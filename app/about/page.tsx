import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About — Best Aesthetic Clinic in Imus, Cavite",
  description:
    "Meet the artists behind Emcey Brows Aesthetics. Learn about our certifications, hygiene standards and why brow lovers across Cavite trust our studio.",
};

export default function AboutPage() {
  return (
    <>
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
            <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-blush-200 to-blush-300 shimmer" />
            <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-nude-200 to-nude-300 shimmer mt-10" />
          </div>
        </div>
      </section>

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
    </>
  );
}
