import type { Metadata } from "next";
import Link from "next/link";
import { areas } from "@/lib/areas";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Areas We Serve — Brow & Aesthetic Clinic Across Cavite",
  description:
    "Emcey Brows Aesthetics serves Imus, Bacoor, Dasmariñas, General Trias, Kawit and Cavite City. Ombre brows, lip blushing, lashliner, facials and laser treatments across Cavite.",
  alternates: { canonical: `${site.url}/areas` },
};

export default function AreasPage() {
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Across Cavite"
          title="Areas we serve"
          description="From our studio in Imus we welcome clients from across Cavite. Find your town for directions and the treatments we're known for."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((a) => (
            <Link
              key={a.slug}
              href={`/areas/${a.slug}`}
              className="card card-hover group flex flex-col p-7"
            >
              <div className="text-[11px] uppercase tracking-[0.3em] text-terracotta-500">
                Cavite
              </div>
              <h2 className="mt-2 font-display text-2xl text-ink-900 transition-colors group-hover:text-terracotta-500">
                {a.name}
              </h2>
              <p className="mt-1 text-xs text-ink-500">{a.proximity}</p>
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-500">
                {a.intro}
              </p>
              <span className="mt-5 flex items-center gap-1 text-sm font-medium text-terracotta-500 transition group-hover:gap-2">
                View {a.name}
                <i className="pi pi-arrow-right text-xs" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
