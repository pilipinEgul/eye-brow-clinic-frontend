"use client";

import { useState } from "react";
import type { Faq } from "@/lib/api";

export function FaqList({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(faqs[0]?.id ?? null);

  if (faqs.length === 0) {
    return (
      <p className="text-sm text-ink-500">No FAQs yet — check back soon.</p>
    );
  }

  return (
    <ul className="divide-y divide-nude-100 overflow-hidden rounded-[2rem] border border-nude-100 bg-white shadow-soft">
      {faqs.map((faq) => {
        const isOpen = open === faq.id;
        return (
          <li key={faq.id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : faq.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-cream-50 sm:px-6"
              aria-expanded={isOpen}
            >
              <span className="font-display text-base text-ink-900 sm:text-lg">
                {faq.question}
              </span>
              <span
                aria-hidden
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-nude-200 text-terracotta-500 transition-transform duration-300 ${
                  isOpen ? "rotate-45 bg-blush-50" : ""
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-6 text-sm leading-relaxed text-ink-500 sm:px-6">
                  {faq.answer}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
