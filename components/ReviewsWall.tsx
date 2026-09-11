"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Testimonial } from "@/lib/api";
import { ExpandableQuote } from "@/components/ExpandableQuote";

type SortKey = "high" | "low" | "recent";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "high", label: "Highest rating" },
  { key: "low", label: "Lowest rating" },
  { key: "recent", label: "Newest" },
];

function Stars({ rating }: { rating: number }) {
  const r = Math.round(rating);
  return (
    <div className="flex gap-0.5 text-gold-500" aria-label={`${r} of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={`pi ${i < r ? "pi-star-fill" : "pi-star"} text-xs`} aria-hidden />
      ))}
    </div>
  );
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

export function ReviewsWall({ reviews }: { reviews: Testimonial[] }) {
  const [rating, setRating] = useState<number | null>(null); // null = all
  const [sort, setSort] = useState<SortKey>("high");

  // Count per star for the filter chips.
  const counts = useMemo(() => {
    const c: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of reviews) {
      const k = Math.round(r.rating);
      if (c[k] !== undefined) c[k] += 1;
    }
    return c;
  }, [reviews]);

  const list = useMemo(() => {
    let out = rating === null ? reviews : reviews.filter((r) => Math.round(r.rating) === rating);
    out = [...out];
    if (sort === "high") out.sort((a, b) => b.rating - a.rating || b.id - a.id);
    else if (sort === "low") out.sort((a, b) => a.rating - b.rating || b.id - a.id);
    else out.sort((a, b) => b.id - a.id);
    return out;
  }, [reviews, rating, sort]);

  if (reviews.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-nude-100 bg-white/70 p-8 text-center shadow-sm">
        <i className="pi pi-star-fill text-3xl text-gold-500" aria-hidden />
        <p className="mt-3 font-display text-xl text-ink-900">Reviews coming soon</p>
        <p className="mt-2 text-sm text-ink-500">
          We&apos;re gathering our client reviews here. In the meantime, see them on Google.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter + sort bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Chip active={rating === null} onClick={() => setRating(null)}>
            All ({reviews.length})
          </Chip>
          {[5, 4, 3, 2, 1].map((s) => (
            <Chip key={s} active={rating === s} onClick={() => setRating(s)} disabled={counts[s] === 0}>
              {s}★ ({counts[s]})
            </Chip>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-ink-500">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-nude-200 bg-white px-3 py-1.5 text-xs text-ink-700 focus:border-gold-500 focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Cards */}
      {list.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink-400">No {rating}★ reviews yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <article key={r.id} className="flex flex-col rounded-3xl border border-nude-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <Stars rating={r.rating} />
                {r.source ? (
                  <span className="text-[10px] uppercase tracking-wider text-ink-300">via {r.source}</span>
                ) : null}
              </div>
              <ExpandableQuote text={r.quote} />
              <div className="mt-5 flex items-center gap-3 border-t border-nude-100 pt-4">
                {r.client_avatar ? (
                  <Image
                    src={r.client_avatar}
                    alt={r.client_name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-blush-100 font-display text-sm text-terracotta-600">
                    {initials(r.client_name)}
                  </span>
                )}
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-ink-900">{r.client_name}</div>
                  {r.client_title ? (
                    <div className="truncate text-xs text-ink-400">{r.client_title}</div>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-ink-900 text-white"
          : disabled
            ? "cursor-not-allowed bg-nude-50 text-ink-300"
            : "bg-white text-ink-600 ring-1 ring-nude-200 hover:bg-nude-100"
      }`}
    >
      {children}
    </button>
  );
}
