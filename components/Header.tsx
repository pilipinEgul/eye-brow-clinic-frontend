"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-nude-100/70 bg-cream-50/90 shadow-[0_8px_30px_-20px_rgba(135,65,40,0.25)] backdrop-blur-xl"
          : "border-b border-transparent bg-cream-50/60 backdrop-blur-md"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo.jpg"
            alt={`${site.name} logo`}
            width={40}
            height={40}
            priority
            className="h-10 w-10 rounded-full object-cover shadow-soft"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-xl tracking-tight text-ink-900 sm:text-2xl">
              {site.shortName}
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.32em] text-terracotta-500 sm:inline">
              Aesthetics · Imus
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm lg:flex">
          {nav.primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-ink-700 transition-colors hover:text-terracotta-500"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link href="/book" className="btn btn-primary">
            Book Appointment
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-full border border-nude-200 bg-white/70 text-ink-900 transition hover:border-terracotta-400 hover:text-terracotta-500 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 top-0 block h-[2px] w-5 rounded-full bg-current transition-transform duration-300 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[6px] block h-[2px] w-5 rounded-full bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-[12px] block h-[2px] w-5 rounded-full bg-current transition-transform duration-300 ${
                open ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`fixed inset-0 z-30 bg-ink-900/30 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`fixed inset-x-0 top-[72px] z-40 origin-top rounded-b-[2rem] border-b border-nude-100 bg-cream-50 shadow-warm transition-all duration-300 ${
            open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="container-x flex flex-col gap-1 py-6">
            {nav.primary.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${i * 30}ms` : "0ms" }}
                className="group flex items-center justify-between rounded-2xl px-4 py-3 text-base text-ink-900 transition hover:bg-blush-50"
              >
                <span>{item.label}</span>
                <span className="text-terracotta-400 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">
                  →
                </span>
              </Link>
            ))}
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-3 w-full"
            >
              Book Appointment
            </Link>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-nude-100 pt-4 text-xs text-ink-500">
              <a href={`tel:${site.contact.landlineTel}`} className="hover:text-terracotta-500">
                ☎ {site.contact.landline}
              </a>
              <span aria-hidden>·</span>
              <a href={`tel:${site.contact.phoneTel}`} className="hover:text-terracotta-500">
                📱 {site.contact.phone}
              </a>
              <span aria-hidden>·</span>
              <span>{site.contact.bookingHours}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
