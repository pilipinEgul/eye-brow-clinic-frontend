import type { Metadata } from "next";
import Image from "next/image";
import { api } from "@/lib/api";
import { TestimonialCard } from "@/components/TestimonialCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ReviewLinks } from "@/components/ReviewLinks";
import { GoogleReviews } from "@/components/GoogleReviews";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Testimonials — Trusted Brow Studio in Imus, Cavite",
  description:
    "Real reviews and five-star Google ratings from clients of Emcey Brows Aesthetics across Cavite.",
};

const happyClientStrip = [
  "/images/563379944_1559363695053661_1254350415973776143_n.jpg",
  "/images/617573516_900360955780444_8416221202445316314_n.jpg",
  "/images/566511023_1146226867043391_5455139529089946125_n.jpg",
  "/images/563602481_1526465715026962_3442888535669137838_n.jpg",
];

export default async function TestimonialsPage() {
  const { data: testimonials } = await api.testimonials({ per_page: 30 });

  return (
    <>
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Client Love"
            title="Five-star reviews & stories"
            description="From first-time brow clients to long-time aesthetic regulars — here is what they say."
          />

          {/* Happy client strip */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {happyClientStrip.map((src) => (
              <div
                key={src}
                className="relative aspect-square overflow-hidden rounded-2xl border border-nude-100 shadow-soft"
              >
                <Image
                  src={src}
                  alt="Emcey Brows client transformation — Imus, Cavite"
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {testimonials.length === 0 ? (
            <p className="mt-12 text-center text-sm text-ink-500">
              Once the database is seeded, testimonials will appear here.
            </p>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          )}

          <GoogleReviews className="mt-16" />

          <ReviewLinks className="mt-16" />
        </div>
      </section>
    </>
  );
}
