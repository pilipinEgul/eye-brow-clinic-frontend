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

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="card card-hover relative flex h-full flex-col p-6 sm:p-7">
      <span
        aria-hidden
        className="absolute right-5 top-4 font-display text-6xl leading-none text-blush-200/80 select-none"
      >
        “
      </span>
      <Stars rating={testimonial.rating} />
      <blockquote className="mt-4 flex-1 font-display text-lg leading-relaxed text-ink-700">
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center justify-between border-t border-nude-100 pt-4 text-sm">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blush-200 to-nude-200 text-[12px] font-semibold text-terracotta-600"
          >
            {initials(testimonial.client_name)}
          </span>
          <div>
            <div className="font-medium text-ink-900">
              {testimonial.client_name}
            </div>
            {testimonial.client_title ? (
              <div className="text-xs text-ink-500">
                {testimonial.client_title}
              </div>
            ) : null}
          </div>
        </div>
        {testimonial.service ? (
          <div className="chip">{testimonial.service.name}</div>
        ) : null}
      </figcaption>
    </figure>
  );
}
