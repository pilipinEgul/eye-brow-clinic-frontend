import type { Metadata } from "next";
import { api } from "@/lib/api";
import { TestimonialCard } from "@/components/TestimonialCard";
import { SectionHeading } from "@/components/SectionHeading";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Testimonials — Trusted Brow Studio in Imus, Cavite",
  description:
    "Real reviews and five-star Google ratings from clients of Emcey Brows Aesthetics across Cavite.",
};

export default async function TestimonialsPage() {
  const { data: testimonials } = await api.testimonials({ per_page: 30 });

  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Client Love"
          title="Five-star reviews & stories"
          description="From first-time brow clients to long-time aesthetic regulars — here is what they say."
        />

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
      </div>
    </section>
  );
}
