"use client";

import Link from "next/link";
import { site } from "@/lib/site";

function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 4c0-.6.4-1 1-1h2.5c.5 0 .9.3 1 .8l1 4c.1.5-.1.9-.5 1.2L8.5 10c1 2.4 2.6 4 5 5l1-1.5c.3-.4.7-.6 1.2-.5l4 1c.5.1.8.5.8 1V18c0 .6-.4 1-1 1-9 0-15-6-15-15Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChat() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8c-1.2 0-2.4-.3-3.4-.7L4 20l1.2-3.6C4.4 15 4 13.6 4 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="m12 2.5 2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.55l-5.9 3.12 1.13-6.57L2.45 9.44l6.6-.96L12 2.5Z" />
    </svg>
  );
}

function IconCal() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M3.5 10h17M8 3.5v4M16 3.5v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function FloatingCTA() {
  return (
    <>
      {/* Desktop — bottom-right stack */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-30 hidden flex-col items-end gap-3 md:flex">
        <a
          href={site.socials.facebook}
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-medium text-ink-900 shadow-soft ring-1 ring-nude-200 transition hover:-translate-y-0.5 hover:text-terracotta-500 hover:shadow-warm"
        >
          <span className="text-terracotta-500">
            <IconChat />
          </span>
          Messenger
        </a>
        <a
          href={site.socials.googleReview}
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-medium text-ink-900 shadow-soft ring-1 ring-nude-200 transition hover:-translate-y-0.5 hover:text-terracotta-500 hover:shadow-warm"
        >
          <span className="text-gold-500">
            <IconStar />
          </span>
          Leave a review
        </a>
        <Link href="/book" className="btn btn-primary pointer-events-auto shadow-warm">
          <IconCal />
          Book Now
        </Link>
      </div>

      {/* Mobile — sticky bottom bar */}
      <div className="fixed inset-x-3 bottom-3 z-30 md:hidden">
        <div className="glass flex items-center gap-2 rounded-full p-1.5 shadow-warm">
          <a
            href={`tel:${site.contact.phone}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2.5 text-xs font-medium text-ink-900 ring-1 ring-nude-100 transition active:scale-95"
            aria-label="Call us"
          >
            <span className="text-terracotta-500">
              <IconPhone />
            </span>
            Call
          </a>
          <a
            href={site.socials.facebook}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2.5 text-xs font-medium text-ink-900 ring-1 ring-nude-100 transition active:scale-95"
            aria-label="Message on Facebook"
          >
            <span className="text-terracotta-500">
              <IconChat />
            </span>
            Message
          </a>
          <a
            href={site.socials.googleReview}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2.5 text-xs font-medium text-ink-900 ring-1 ring-nude-100 transition active:scale-95"
            aria-label="Leave a Google review"
          >
            <span className="text-gold-500">
              <IconStar />
            </span>
            Review
          </a>
          <Link
            href="/book"
            className="btn btn-primary !min-h-0 !px-4 !py-2.5 !text-xs flex-1"
          >
            <IconCal />
            Book
          </Link>
        </div>
      </div>

    </>
  );
}
