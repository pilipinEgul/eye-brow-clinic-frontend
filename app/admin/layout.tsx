"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminApi, clearToken, getToken } from "@/lib/admin-api";
import { ToastProvider } from "@/lib/admin-toast";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/schedule", label: "Schedule" },
  { href: "/admin/site-settings", label: "Business Info" },
  { href: "/admin/closures", label: "Closures & Holidays" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/service-categories", label: "Categories" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/promos", label: "Promos" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/gallery", label: "Gallery" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const [ready, setReady] = useState(false);

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

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);

  return (
    <ToastProvider>
    <div className="min-h-screen bg-cream-50 text-ink-900 md:flex">
      <aside className="border-b border-nude-100 bg-white md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-b-0 md:border-r md:sticky md:top-0">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="font-display text-lg">Emcey Admin</span>
          <button
            onClick={logout}
            className="text-xs uppercase tracking-[0.2em] text-ink-500 hover:text-ink-900 md:hidden"
          >
            Log out
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:gap-0.5 md:overflow-visible md:px-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm transition ${
                isActive(item.href)
                  ? "bg-gold-500/15 font-medium text-gold-700"
                  : "text-ink-600 hover:bg-nude-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className="hidden px-5 py-4 text-left text-xs uppercase tracking-[0.2em] text-ink-500 hover:text-ink-900 md:block"
        >
          Log out
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
    </div>
    </ToastProvider>
  );
}
