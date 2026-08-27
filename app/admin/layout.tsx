"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminApi, clearToken, getToken } from "@/lib/admin-api";
import { ToastProvider } from "@/lib/admin-toast";

const COLLAPSE_KEY = "emcey_admin_sidebar_collapsed";

type NavItem = { href: string; label: string; icon: string };
type NavGroup = { title: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: "pi-th-large" },
      { href: "/admin/messages", label: "Messages", icon: "pi-inbox" },
    ],
  },
  {
    title: "Bookings",
    items: [
      { href: "/admin/appointments", label: "Appointments", icon: "pi-calendar" },
      { href: "/admin/schedule", label: "Schedule", icon: "pi-clock" },
      { href: "/admin/closures", label: "Closures & Holidays", icon: "pi-calendar-times" },
    ],
  },
  {
    title: "Catalog",
    items: [
      { href: "/admin/services", label: "Services", icon: "pi-list" },
      { href: "/admin/service-categories", label: "Categories", icon: "pi-tags" },
      { href: "/admin/promos", label: "Promos", icon: "pi-percentage" },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/page-content", label: "Page Content", icon: "pi-file-edit" },
      { href: "/admin/announcements", label: "Announcements", icon: "pi-megaphone" },
      { href: "/admin/gallery", label: "Gallery", icon: "pi-images" },
      { href: "/admin/testimonials", label: "Testimonials", icon: "pi-comments" },
      { href: "/admin/faqs", label: "FAQs", icon: "pi-question-circle" },
    ],
  },
  {
    title: "Settings",
    items: [{ href: "/admin/site-settings", label: "Business Info", icon: "pi-building" }],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [isLogin, pathname, router]);

  useEffect(() => {
    setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
  }, []);

  // "Needs attention" badges (unread messages, pending appointments).
  const [badges, setBadges] = useState({ messages: 0, appointments: 0 });
  const fetchBadges = useCallback(() => {
    if (!getToken()) return;
    adminApi
      .badges()
      .then((r) => setBadges(r.data))
      .catch(() => {});
  }, []);

  // Refetch on navigation…
  useEffect(() => {
    if (!isLogin) fetchBadges();
  }, [isLogin, pathname, fetchBadges]);

  // …plus poll, and update instantly when a page changes something.
  useEffect(() => {
    if (isLogin) return;
    const id = setInterval(fetchBadges, 60_000);
    const onChange = () => fetchBadges();
    window.addEventListener("emcey:badges-changed", onChange);
    return () => {
      clearInterval(id);
      window.removeEventListener("emcey:badges-changed", onChange);
    };
  }, [isLogin, fetchBadges]);

  const badgeFor = (href: string) =>
    href === "/admin/messages" ? badges.messages : href === "/admin/appointments" ? badges.appointments : 0;

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }

  if (isLogin) return <>{children}</>;

  if (!ready) {
    return <div className="grid min-h-screen place-items-center text-sm text-ink-500">Loading…</div>;
  }

  async function logout() {
    try {
      await adminApi.logout();
    } catch {
      // ignore — clear locally regardless
    }
    clearToken();
    router.replace("/admin/login");
  }

  // Exact for the dashboard root; boundary-aware elsewhere so "/services" does
  // not also light up "/service-categories".
  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || (pathname?.startsWith(href + "/") ?? false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-cream-100 text-ink-900 md:flex">
        <aside
          className={`border-b border-nude-100 bg-white transition-[width] md:sticky md:top-0 md:flex md:h-screen md:shrink-0 md:flex-col md:border-b-0 md:border-r ${
            collapsed ? "md:w-[76px]" : "md:w-64"
          }`}
        >
          {/* Brand */}
          <div className="px-3 py-4 md:border-b md:border-nude-100">
            <div className={`flex items-center ${collapsed ? "md:flex-col md:gap-3" : "justify-between gap-2 px-2"}`}>
              <Link href="/admin" className="flex min-w-0 items-center gap-2">
                <Image
                  src="/images/logo.jpg"
                  alt="Emcey Brows"
                  width={36}
                  height={36}
                  className="h-9 w-9 shrink-0 rounded-lg object-cover shadow-soft"
                />
                <span className={`font-display text-lg leading-none ${collapsed ? "md:hidden" : ""}`}>
                  Emcey Admin
                </span>
              </Link>
              <button
                onClick={logout}
                className="text-xs uppercase tracking-[0.2em] text-ink-500 hover:text-ink-900 md:hidden"
              >
                Log out
              </button>
              <button
                onClick={toggleCollapsed}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="hidden h-7 w-7 place-items-center rounded-lg text-ink-400 transition hover:bg-nude-100 hover:text-ink-900 md:grid"
              >
                <i className={`pi ${collapsed ? "pi-angle-right" : "pi-angle-left"} text-sm`} aria-hidden />
              </button>
            </div>
          </div>

          {/* Mobile — horizontal chip scroller */}
          <nav className="flex gap-1.5 overflow-x-auto px-3 pb-3 md:hidden">
            {ALL_ITEMS.map((item) => {
              const active = isActive(item.href);
              const badge = badgeFor(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition ${
                    active
                      ? "bg-gold-500/15 font-medium text-gold-700"
                      : "text-ink-600 hover:bg-nude-100"
                  }`}
                >
                  <i className={`pi ${item.icon} text-[0.7rem]`} aria-hidden />
                  {item.label}
                  {badge > 0 ? (
                    <span className="rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                      {badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* Desktop — grouped vertical nav */}
          <nav className="hidden px-2 py-4 md:flex md:flex-1 md:flex-col md:gap-4 md:overflow-y-auto">
            {NAV_GROUPS.map((group) => (
              <div key={group.title}>
                {collapsed ? (
                  <div className="mx-2 mb-1 border-t border-nude-100/70" />
                ) : (
                  <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-300">
                    {group.title}
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    const badge = badgeFor(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={`group flex items-center rounded-xl text-sm transition ${
                          collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2"
                        } ${
                          active
                            ? "bg-gold-500/15 font-medium text-gold-700"
                            : "text-ink-600 hover:bg-nude-100 hover:text-ink-900"
                        }`}
                      >
                        <span className="relative">
                          <i
                            className={`pi ${item.icon} text-[0.95rem] ${
                              active ? "text-gold-600" : "text-ink-300 group-hover:text-terracotta-500"
                            }`}
                            aria-hidden
                          />
                          {collapsed && badge > 0 ? (
                            <span className="absolute -right-1.5 -top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                          ) : null}
                        </span>
                        {!collapsed ? (
                          <>
                            <span className="whitespace-nowrap">{item.label}</span>
                            {badge > 0 ? (
                              <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                                {badge}
                              </span>
                            ) : null}
                          </>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Desktop — logout */}
          <button
            onClick={logout}
            title={collapsed ? "Log out" : undefined}
            className={`hidden items-center border-t border-nude-100 py-4 text-sm text-ink-500 transition hover:text-terracotta-500 md:flex ${
              collapsed ? "md:justify-center" : "gap-2 px-5"
            }`}
          >
            <i className="pi pi-sign-out" aria-hidden />
            {!collapsed && "Log out"}
          </button>
        </aside>

        <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
      </div>
    </ToastProvider>
  );
}
