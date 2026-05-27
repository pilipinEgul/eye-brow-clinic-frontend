import type { Metadata } from "next";
import { api } from "@/lib/api";
import { BookingForm } from "@/components/BookingForm";
import { SectionHeading } from "@/components/SectionHeading";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Book an Appointment — Emcey Brows Aesthetics",
  description:
    "Reserve your brow, lip, lash or facial treatment at Emcey Brows Aesthetics in Imus, Cavite.",
};

type PageProps = {
  searchParams: Promise<{ service?: string }>;
};

export default async function BookPage({ searchParams }: PageProps) {
  const { service } = await searchParams;
  const { data: services } = await api.services({ per_page: 50 });

  return (
    <section className="section">
      <div className="container-x grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Schedule a visit"
            title="Book your glow-up"
            description="Pick a treatment and we’ll confirm your time slot within the day. A small reservation fee may apply for premium treatments."
          />

          <ul className="mt-8 space-y-3 text-sm text-ink-700">
            <li className="flex gap-3">
              <span className="text-gold-500">✦</span>
              Confirmation via email and SMS within studio hours.
            </li>
            <li className="flex gap-3">
              <span className="text-gold-500">✦</span>
              Reschedule or cancel up to 24 hours before your appointment.
            </li>
            <li className="flex gap-3">
              <span className="text-gold-500">✦</span>
              GCash, Maya, PayMongo and cash all accepted in-studio.
            </li>
          </ul>
        </div>

        <BookingForm services={services} initialServiceSlug={service} />
      </div>
    </section>
  );
}
