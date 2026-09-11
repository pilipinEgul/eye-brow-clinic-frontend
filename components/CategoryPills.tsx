"use client";

import { useEffect, useState } from "react";

/**
 * Sticky pill bar for the Services page. Each pill jumps (smooth-scroll) to its
 * category section (`#cat-<slug>`) and the active pill highlights as you scroll.
 */
export function CategoryPills({ items }: { items: { slug: string; name: string }[] }) {
  const [active, setActive] = useState(items[0]?.slug ?? "");

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(`cat-${i.slug}`))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace("cat-", ""));
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [items]);

  function jump(e: React.MouseEvent, slug: string) {
    e.preventDefault();
    const el = document.getElementById(`cat-${slug}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(slug);
    history.replaceState(null, "", `#cat-${slug}`);
  }

  return (
    <div className="sticky top-[72px] z-30 -mx-4 mt-10 border-y border-nude-100 bg-[color:var(--color-header)]/95 px-4 py-3 backdrop-blur md:top-20">
      <div className="no-scrollbar flex gap-2 overflow-x-auto sm:flex-wrap sm:justify-center">
        {items.map((c) => (
          <a
            key={c.slug}
            href={`#cat-${c.slug}`}
            onClick={(e) => jump(e, c.slug)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
              active === c.slug
                ? "border-terracotta-400 bg-terracotta-500 text-white shadow-soft"
                : "border-nude-200 bg-white text-ink-700 hover:border-terracotta-400 hover:text-terracotta-500"
            }`}
          >
            {c.name}
          </a>
        ))}
      </div>
    </div>
  );
}
