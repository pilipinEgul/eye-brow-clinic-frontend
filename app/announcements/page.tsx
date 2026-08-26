import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAnnouncements, getPromos } from "@/lib/content";
import { SectionHeading } from "@/components/SectionHeading";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Announcements & Offers",
  description: "Latest news, updates and promos from Emcey Brows Aesthetics in Imus, Cavite.",
};

function peso(value: string) {
  const n = Number(value);
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

export default async function AnnouncementsPage() {
  const [announcements, promos] = await Promise.all([getAnnouncements(), getPromos()]);

  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="What's new"
          title="Announcements & Offers"
          description="The latest studio updates and current promos."
        />

        {announcements.length === 0 && promos.length === 0 ? (
          <div className="mx-auto mt-12 max-w-md rounded-3xl border border-nude-100 bg-white/70 p-8 text-center shadow-sm">
            <i className="pi pi-megaphone text-3xl text-gold-500" aria-hidden />
            <p className="mt-3 font-display text-xl text-ink-900">Nothing new right now</p>
            <p className="mt-2 text-sm text-ink-500">
              Check back soon — or follow us on Facebook for the latest updates.
            </p>
            <Link href="/book" className="btn btn-primary mt-5">
              Book an appointment
            </Link>
          </div>
        ) : null}

        {announcements.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {announcements.map((a) => (
              <article
                key={a.id}
                className="overflow-hidden rounded-3xl border border-nude-100 bg-white shadow-soft"
              >
                {a.image_path ? (
                  <div className="relative aspect-[4/3] w-full bg-nude-100">
                    <Image
                      src={a.image_path}
                      alt={a.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-2xl bg-blush-100 text-terracotta-500">
                      <i className="pi pi-megaphone" aria-hidden />
                    </span>
                    {a.tag ? (
                      <span className="rounded-full bg-gold-500/15 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-gold-700">
                        {a.tag}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-4 font-display text-xl text-ink-900">{a.title}</h3>
                  {a.body ? (
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">{a.body}</p>
                  ) : null}
                  {a.link_url ? (
                    <Link
                      href={a.link_url}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-terracotta-500 hover:text-terracotta-600"
                    >
                      {a.link_label || "Learn more"}
                      <i className="pi pi-arrow-right text-xs" aria-hidden />
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {promos.length > 0 ? (
          <>
            <h2 className="mt-16 text-center font-display text-2xl text-ink-900">Current offers</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {promos.map((p) => (
                <article
                  key={p.id}
                  className="overflow-hidden rounded-3xl border border-gold-500/25 bg-white shadow-soft"
                >
                  {p.cover_image ? (
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={p.cover_image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-terracotta-500 px-3 py-1 text-xs font-semibold text-white">
                        {p.type === "percentage" ? `${Number(p.value)}% OFF` : `${peso(p.value)} OFF`}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-wider text-ink-400">{p.code}</span>
                    </div>
                    <h3 className="mt-4 font-display text-xl text-ink-900">{p.title}</h3>
                    {p.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.description}</p>
                    ) : null}
                    <Link href="/book" className="btn btn-primary mt-5 !min-h-0 !px-4 !py-2 !text-xs">
                      Book with this promo
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
