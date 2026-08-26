"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, type DashboardStats } from "@/lib/admin-api";
import { ReportsChart } from "@/components/admin/ReportsChart";

const QUICK_ACTIONS = [
  { href: "/admin/appointments", label: "Manage bookings", icon: "pi-calendar" },
  { href: "/admin/announcements", label: "Post announcement", icon: "pi-megaphone" },
  { href: "/admin/promos", label: "Add a promo", icon: "pi-percentage" },
  { href: "/admin/page-content", label: "Edit page content", icon: "pi-file-edit" },
  { href: "/admin/gallery", label: "Upload photos", icon: "pi-images" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .dashboard()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink-900">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-500">A quick look at how your studio is doing.</p>
        </div>
        <Link href="/admin/appointments" className="btn btn-primary !min-h-0 !px-4 !py-2 !text-sm">
          <i className="pi pi-calendar text-xs" aria-hidden />
          View bookings
        </Link>
      </div>

      {error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats ? (
          <>
            <StatCard label="Pending" value={stats.appointments.pending} icon="pi-clock" tint="amber" />
            <StatCard label="Confirmed" value={stats.appointments.confirmed} icon="pi-check-circle" tint="emerald" />
            <StatCard label="Upcoming" value={stats.appointments.upcoming} icon="pi-calendar" tint="blue" />
            <StatCard label="Services" value={stats.services} icon="pi-sparkles" tint="terracotta" />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl bg-nude-50" />
          ))
        )}
      </div>

      {/* Chart + quick actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReportsChart />
        </div>
        <div className="rounded-3xl border border-nude-100 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl text-ink-900">Quick actions</h2>
          <div className="mt-4 flex flex-col gap-1.5">
            {QUICK_ACTIONS.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group flex items-center gap-3 rounded-2xl border border-nude-100 px-4 py-3 text-sm text-ink-700 transition hover:border-gold-500/40 hover:bg-blush-50"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-blush-100 text-terracotta-500 transition group-hover:scale-105">
                  <i className={`pi ${a.icon}`} aria-hidden />
                </span>
                <span className="flex-1 font-medium">{a.label}</span>
                <i className="pi pi-angle-right text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-terracotta-500" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="rounded-3xl border border-nude-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-ink-900">Recent bookings</h2>
          <Link
            href="/admin/appointments"
            className="inline-flex items-center gap-1 text-sm text-gold-600 hover:text-gold-700"
          >
            View all
            <i className="pi pi-arrow-right text-xs" aria-hidden />
          </Link>
        </div>

        {stats ? (
          stats.recent_appointments.length > 0 ? (
            <ul className="mt-4 divide-y divide-nude-100">
              {stats.recent_appointments.map((a) => (
                <li key={a.id} className="flex items-center gap-4 py-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blush-100 to-nude-100 font-display text-sm text-terracotta-600">
                    {initials(a.customer_name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-ink-900">{a.customer_name}</div>
                    <div className="truncate text-xs text-ink-400">
                      {a.service?.name ?? "—"} · <span className="font-mono">{a.reference}</span>
                    </div>
                  </div>
                  <div className="hidden whitespace-nowrap text-sm text-ink-500 sm:block">
                    {new Date(a.scheduled_at).toLocaleString("en-PH", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <StatusPill status={a.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 rounded-2xl bg-nude-50 py-8 text-center text-sm text-ink-400">
              No bookings yet.
            </p>
          )
        ) : (
          <div className="mt-4 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-2xl bg-nude-50" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

const TINTS: Record<string, { bg: string; ring: string }> = {
  amber: { bg: "bg-amber-500/10 text-amber-600", ring: "ring-amber-500/15" },
  emerald: { bg: "bg-emerald-500/10 text-emerald-600", ring: "ring-emerald-500/15" },
  blue: { bg: "bg-blue-500/10 text-blue-600", ring: "ring-blue-500/15" },
  terracotta: { bg: "bg-terracotta-500/10 text-terracotta-500", ring: "ring-terracotta-500/15" },
};

function StatCard({
  label,
  value,
  icon,
  tint,
}: {
  label: string;
  value: number;
  icon: string;
  tint: keyof typeof TINTS;
}) {
  const t = TINTS[tint];
  return (
    <div className="group rounded-3xl border border-nude-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-warm">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-ink-400">{label}</span>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ring-1 ${t.bg} ${t.ring}`}>
          <i className={`pi ${icon}`} aria-hidden />
        </span>
      </div>
      <div className="mt-3 font-display text-4xl text-ink-900">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-800",
  };
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
        styles[status] ?? "bg-nude-100 text-ink-600"
      }`}
    >
      {status}
    </span>
  );
}
