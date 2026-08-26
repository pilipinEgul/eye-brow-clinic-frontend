import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { ReviewLinks } from "@/components/ReviewLinks";
import { GoogleReviews } from "@/components/GoogleReviews";
import { getPageContent } from "@/lib/page-content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Testimonials — Trusted Brow Studio in Imus, Cavite",
  description:
    "Real reviews and five-star Google ratings from clients of Emcey Brows Aesthetics across Cavite.",
};

export default async function TestimonialsPage() {
  const c = await getPageContent();
  const happyClientStrip = [
    c["testimonials.image1"],
    c["testimonials.image2"],
    c["testimonials.image3"],
    c["testimonials.image4"],
  ];

  return (
    <>
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow={c["testimonials.eyebrow"]}
            title={c["testimonials.title"]}
            description={c["testimonials.description"]}
          />

          {/* Happy client strip */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {happyClientStrip.map((src, i) => (
              <div
                key={i}
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

          <GoogleReviews className="mt-16" />

          <ReviewLinks className="mt-16" />
        </div>
      </section>
    </>
  );
}
