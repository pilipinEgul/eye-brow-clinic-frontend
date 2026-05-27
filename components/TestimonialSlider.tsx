import type { Testimonial } from "@/lib/api";

function Stars({ rating }: { rating: number }) {
  return (
    <div
      aria-label={`${rating} of 5 stars`}
      className="flex gap-0.5 text-gold-500"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden>
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Card({ t, hidden }: { t: Testimonial; hidden?: boolean }) {
  return (
    <figure
      aria-hidden={hidden || undefined}
      className="card relative mr-6 flex h-full w-[320px] shrink-0 flex-col p-6 sm:w-[360px] sm:p-7"
    >
      <span
        aria-hidden
        className="absolute right-5 top-4 font-display text-6xl leading-none text-blush-200/80 select-none"
      >
        “
      </span>
      <Stars rating={t.rating} />
      <blockquote className="mt-4 line-clamp-5 flex-1 font-display text-lg leading-relaxed text-ink-700">
        {t.quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-nude-100 pt-4 text-sm">
        <span
          aria-hidden
          className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blush-200 to-nude-200 text-[12px] font-semibold text-terracotta-600"
        >
          {initials(t.client_name)}
        </span>
        <div className="min-w-0">
          <div className="truncate font-medium text-ink-900">
            {t.client_name}
          </div>
          {t.client_title ? (
            <div className="truncate text-xs text-ink-500">
              {t.client_title}
            </div>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}

export function TestimonialSlider({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) {
    return (
      <p className="mt-10 text-center text-sm text-ink-500">
        Testimonials will appear here once the database is seeded.
      </p>
    );
  }

  const durationSec = Math.max(20, testimonials.length * 7);

  return (
    <div className="marquee-wrap marquee-mask mt-12 overflow-hidden">
      <div
        className="marquee-track"
        style={{ ["--marquee-duration" as string]: `${durationSec}s` }}
      >
        {testimonials.map((t) => (
          <Card key={`a-${t.id}`} t={t} />
        ))}
        {testimonials.map((t) => (
          <Card key={`b-${t.id}`} t={t} hidden />
        ))}
      </div>
    </div>
  );
}
