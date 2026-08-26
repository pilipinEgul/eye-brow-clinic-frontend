"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api, type Announcement, type Promo } from "@/lib/api";

/**
 * Site-entry announcement pop-up — a picture slideshow of the latest active
 * announcements AND promos. Auto-advances when there's more than one. Shows once
 * per browser session (keyed by the current set, so new content re-pops).
 * Clicking a slide goes to its link (announcement link → /announcements,
 * promo → /book). Never mounted on /admin.
 */

type Slide = {
  key: string;
  image: string | null;
  tag: string | null;
  title: string;
  text: string | null;
  href: string;
  cta: string;
};

function peso(value: string) {
  const n = Number(value);
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

function toSlides(announcements: Announcement[], promos: Promo[]): Slide[] {
  const a: Slide[] = announcements.map((x) => ({
    key: `a${x.id}`,
    image: x.image_path,
    tag: x.tag,
    title: x.title,
    text: x.body,
    href: x.link_url || "/announcements",
    cta: x.link_label || "See announcement",
  }));
  const p: Slide[] = promos.map((x) => ({
    key: `p${x.id}`,
    image: x.cover_image,
    tag: x.type === "percentage" ? `${Number(x.value)}% OFF` : `${peso(x.value)} OFF`,
    title: x.title,
    text: x.description,
    href: "/book",
    cta: "Book with this promo",
  }));
  return [...a, ...p];
}

export function AnnouncementPopup() {
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    Promise.all([api.announcements(), api.promos()])
      .then(([ann, pro]) => {
        if (cancelled) return;
        // Only pop up when there's at least one announcement — promos alone
        // don't trigger the modal.
        if (ann.data.length === 0) return;
        const s = toSlides(ann.data, pro.data);
        if (s.length === 0) return;
        const seenKey = s.map((x) => x.key).join(",");
        if (sessionStorage.getItem("emcey_popup_seen") === seenKey) return;
        setSlides(s);
        timer = setTimeout(() => setOpen(true), 700);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // Auto-advance while open and more than one slide.
  useEffect(() => {
    if (!open || slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, [open, slides.length]);

  const markSeen = useCallback(() => {
    if (slides.length) {
      sessionStorage.setItem("emcey_popup_seen", slides.map((x) => x.key).join(","));
    }
  }, [slides]);

  const dismiss = useCallback(() => {
    markSeen();
    setOpen(false);
  }, [markSeen]);

  const current = useMemo(() => slides[index], [slides, index]);

  function go() {
    if (!current) return;
    markSeen();
    setOpen(false);
    if (/^https?:\/\//i.test(current.href)) {
      window.open(current.href, "_blank", "noopener");
    } else {
      router.push(current.href);
    }
  }

  if (!open || !current) return null;

  const multi = slides.length > 1;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-900/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Announcements"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink-700 shadow-soft transition hover:text-terracotta-500"
        >
          <i className="pi pi-times" aria-hidden />
        </button>

        <button onClick={go} className="block w-full cursor-pointer text-left">
          {current.image ? (
            <div className="relative aspect-[4/5] w-full bg-nude-100">
              <Image
                key={current.key}
                src={current.image}
                alt={current.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 448px"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="p-6">
            {current.tag ? (
              <span className="rounded-full bg-gold-500/15 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-gold-700">
                {current.tag}
              </span>
            ) : null}
            <h3 className="mt-3 font-display text-2xl text-ink-900">{current.title}</h3>
            {current.text ? (
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-500">{current.text}</p>
            ) : null}
            <span className="btn btn-primary mt-5 inline-flex w-full items-center justify-center gap-2">
              {current.cta}
              <i className="pi pi-arrow-right text-xs" aria-hidden />
            </span>
          </div>
        </button>

        {multi ? (
          <>
            {/* Prev / next */}
            <button
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              aria-label="Previous"
              className="absolute left-3 top-[38%] z-20 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-ink-700 shadow-soft transition hover:text-terracotta-500"
            >
              <i className="pi pi-chevron-left" aria-hidden />
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              aria-label="Next"
              className="absolute right-3 top-[38%] z-20 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-ink-700 shadow-soft transition hover:text-terracotta-500"
            >
              <i className="pi pi-chevron-right" aria-hidden />
            </button>

            {/* Dots */}
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`pointer-events-auto h-2 w-2 rounded-full transition ${
                    i === index ? "bg-terracotta-500" : "bg-white/70 ring-1 ring-ink-900/10"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
