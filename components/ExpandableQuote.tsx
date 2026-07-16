"use client";

import { useState } from "react";

/**
 * Review text with a graceful "Read more / Show less" toggle. Collapsed, it
 * clamps to a few lines with a fade; only shows the toggle when the text is
 * actually long enough to be clipped.
 */
export function ExpandableQuote({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 200;
  const clamp = isLong && !expanded;

  return (
    <blockquote className="mt-4 flex-1 font-display text-lg leading-relaxed text-ink-700">
      <span className="relative block">
        <span className={clamp ? "line-clamp-5" : "block"}>{text}</span>
        {clamp ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent"
          />
        ) : null}
      </span>
      {isLong ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-gold-600 transition hover:text-gold-700"
        >
          {expanded ? "Show less" : "Read more"}
          <span aria-hidden className={`transition ${expanded ? "rotate-180" : ""}`}>
            ⌄
          </span>
        </button>
      ) : null}
    </blockquote>
  );
}
