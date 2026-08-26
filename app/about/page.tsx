import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { getPageContent } from "@/lib/page-content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About — Best Aesthetic Clinic in Imus, Cavite",
  description:
    "Meet the artists behind Emcey Brows Aesthetics. Learn about our certifications, hygiene standards and why brow lovers across Cavite trust our studio.",
};

export default async function AboutPage() {
  const c = await getPageContent();

  const mvp = [
    { title: c["about.mvp.mission_title"], body: c["about.mvp.mission_body"] },
    { title: c["about.mvp.vision_title"], body: c["about.mvp.vision_body"] },
    { title: c["about.mvp.promise_title"], body: c["about.mvp.promise_body"] },
  ];
  const safety = [
    c["about.safety.item1"],
    c["about.safety.item2"],
    c["about.safety.item3"],
    c["about.safety.item4"],
  ];
  const studioGallery = [
    c["about.studio.image1"],
    c["about.studio.image2"],
    c["about.studio.image3"],
    c["about.studio.image4"],
  ];

  return (
    <>
      {/* Story */}
      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="eyebrow">{c["about.story.eyebrow"]}</div>
            <h1 className="mt-3 font-display text-5xl text-ink-900 sm:text-6xl">
              {c["about.story.title"]}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-500">{c["about.story.p1"]}</p>
            <p className="mt-4 text-base text-ink-500">{c["about.story.p2"]}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-warm">
              <Image
                src={c["about.story.image1"]}
                alt="Emcey Brows client work — Imus, Cavite"
                fill
                priority
                sizes="(max-width: 1024px) 50vw, 320px"
                className="object-cover"
              />
            </div>
            <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-3xl shadow-soft">
              <Image
                src={c["about.story.image2"]}
                alt="Emcey Brows client portrait — Imus, Cavite"
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
          {mvp.map((b) => (
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
            <div className="eyebrow">{c["about.video.eyebrow"]}</div>
            <h2 className="mt-3 font-display text-4xl text-ink-900 sm:text-5xl">
              {c["about.video.title"]}
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-ink-500">{c["about.video.body"]}</p>
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-warm">
            <video
              src={c["about.video.src"]}
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
            eyebrow={c["about.safety.eyebrow"]}
            title={c["about.safety.title"]}
            description={c["about.safety.description"]}
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {safety.map((s) => (
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
            eyebrow={c["about.studio.eyebrow"]}
            title={c["about.studio.title"]}
            description={c["about.studio.description"]}
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {studioGallery.map((src, i) => (
              <div
                key={i}
                className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-nude-100 shadow-soft"
              >
                <Image
                  src={src}
                  alt="Inside Emcey Brows — Imus, Cavite"
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
