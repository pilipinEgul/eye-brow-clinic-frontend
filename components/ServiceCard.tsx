import Link from "next/link";
import type { Service } from "@/lib/api";

function peso(value: string | null) {
  if (!value) return null;
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function ServiceCard({ service }: { service: Service }) {
  const price = peso(service.promo_price ?? service.price);
  const original = service.promo_price ? peso(service.price) : null;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="card card-hover group relative flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-blush-100 via-nude-100 to-blush-200">
        <div className="absolute inset-0 shimmer" />
        <div
          aria-hidden
          className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-terracotta-300/30 blur-2xl"
        />
        {service.is_featured ? (
          <span className="chip absolute left-4 top-4 bg-white/90 shadow-soft">
            Signature
          </span>
        ) : null}
        {service.promo_price ? (
          <span className="absolute right-4 top-4 rounded-full bg-terracotta-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white shadow-soft">
            Promo
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="text-[11px] uppercase tracking-[0.3em] text-terracotta-500">
          {service.category?.name ?? "Treatment"}
        </div>
        <h3 className="mt-2 font-display text-2xl text-ink-900 transition-colors group-hover:text-terracotta-500">
          {service.name}
        </h3>
        {service.short_description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">
            {service.short_description}
          </p>
        ) : null}

        <div className="mt-6 flex items-end justify-between border-t border-nude-100 pt-5">
          <div>
            {price ? (
              <div className="flex items-baseline gap-2">
                <div className="font-display text-2xl text-ink-900">{price}</div>
                {original ? (
                  <div className="text-xs text-ink-300 line-through">{original}</div>
                ) : null}
              </div>
            ) : (
              <div className="text-sm text-ink-500">Inquire for pricing</div>
            )}
            {service.duration_minutes ? (
              <div className="mt-1 text-xs text-ink-500">
                {service.duration_minutes} min · per session
              </div>
            ) : null}
          </div>

          <span className="flex items-center gap-1 text-sm font-medium text-terracotta-500 transition group-hover:gap-2">
            View
            <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
