import type { Metadata } from "next";
import Image from "next/image";
import { getServices } from "@/lib/content";
import { BookingForm } from "@/components/BookingForm";
import { SectionHeading } from "@/components/SectionHeading";

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
  const services = await getServices();

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
            <li className="flex items-start gap-3">
              <i className="pi pi-check mt-0.5 text-gold-500" aria-hidden />
              Confirmation via email and SMS within studio hours.
            </li>
            <li className="flex items-start gap-3">
              <i className="pi pi-check mt-0.5 text-gold-500" aria-hidden />
              Reschedule or cancel up to 24 hours before your appointment.
            </li>
            <li className="flex items-start gap-3">
              <i className="pi pi-check mt-0.5 text-gold-500" aria-hidden />
              GCash, Maya, PayMongo and cash all accepted in-studio.
            </li>
          </ul>

          {/* Studio preview */}
          <div className="mt-10 grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-soft">
              <Image
                src="/images/hero/tile-1.jpg"
                alt="Emcey Brows reception area — Imus, Cavite"
                fill
                sizes="(max-width: 1024px) 50vw, 240px"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-soft">
              <Image
                src="/images/706703575_4480213738924616_3954472543166964580_n.jpg"
                alt="Inside the Emcey Brows studio — Imus, Cavite"
                fill
                sizes="(max-width: 1024px) 50vw, 240px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <BookingForm services={services} initialServiceSlug={service} />
      </div>
    </section>
  );
}
