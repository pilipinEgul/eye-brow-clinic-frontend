import type { Metadata } from "next";
import Image from "next/image";
import { staticGallery } from "@/lib/static-content";
import { getFacebookPhotos } from "@/lib/facebook-photos";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Gallery — Brows, Lips & Lashes Transformations",
  description:
    "Real before-and-after transformations from clients of Emcey Brows Aesthetics in Imus, Cavite.",
};

export default async function GalleryPage() {
  // Live Facebook Page photos (empty unless FACEBOOK_PAGE_ACCESS_TOKEN is set),
  // shown alongside the built-in studio photos.
  const facebookPhotos = await getFacebookPhotos();
  const images = [...staticGallery, ...facebookPhotos];

  const categories = Array.from(
    new Set(images.map((i) => i.category).filter((c): c is string => Boolean(c))),
  );

  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Gallery"
          title="Real transformations"
          description="A glimpse of recent brows, lips, lashes and facial work from our studio."
        />

        {categories.length > 0 ? (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["All", ...categories].map((c) => (
              <span
                key={c}
                className="rounded-full border border-nude-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.25em] text-ink-700"
              >
                {c}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {images.map((img) => (
            <figure
              key={img.id}
              className="mb-4 break-inside-avoid overflow-hidden rounded-3xl border border-nude-100 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/5] bg-nude-100">
                <Image
                  src={img.image_path}
                  alt={img.alt_text ?? img.title ?? "Emcey Brows transformation"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="p-4">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold-600">
                  {img.category}
                </div>
                <div className="mt-1 font-display text-lg text-ink-900">
                  {img.title ?? img.service?.name ?? "Studio work"}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
