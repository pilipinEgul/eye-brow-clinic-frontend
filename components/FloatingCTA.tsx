"use client";

import Link from "next/link";
import { site } from "@/lib/site";

function IconPhone() {
  return <i className="pi pi-phone text-base" aria-hidden />;
}

function IconChat() {
  return <i className="pi pi-facebook text-base" aria-hidden />;
}

function IconStar() {
  return <i className="pi pi-star-fill text-base" aria-hidden />;
}

function IconCal() {
  return <i className="pi pi-calendar text-base" aria-hidden />;
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
            href={`tel:${site.contact.phoneTel}`}
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
