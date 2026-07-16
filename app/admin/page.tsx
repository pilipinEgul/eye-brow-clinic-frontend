"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, type DashboardStats } from "@/lib/admin-api";

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
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-500">Overview of your studio.</p>

      {error ? (
        <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      {stats ? (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Pending bookings" value={stats.appointments.pending} highlight />
            <Stat label="Confirmed" value={stats.appointments.confirmed} />
            <Stat label="Upcoming" value={stats.appointments.upcoming} />
            <Stat label="Services" value={stats.services} />
          </div>

          <div className="mt-8 rounded-3xl border border-nude-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Recent bookings</h2>
              <Link href="/admin/appointments" className="inline-flex items-center gap-1 text-sm text-gold-600 hover:text-gold-700">
                View all
                <i className="pi pi-arrow-right text-xs" aria-hidden />
              </Link>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-ink-400">
                    <th className="pb-2 pr-4">Reference</th>
                    <th className="pb-2 pr-4">Client</th>
                    <th className="pb-2 pr-4">Service</th>
                    <th className="pb-2 pr-4">When</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nude-100">
                  {stats.recent_appointments.map((a) => (
                    <tr key={a.id}>
                      <td className="py-2 pr-4 font-mono text-xs">{a.reference}</td>
                      <td className="py-2 pr-4">{a.customer_name}</td>
                      <td className="py-2 pr-4">{a.service?.name ?? "—"}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {new Date(a.scheduled_at).toLocaleString("en-PH", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-2">
                        <StatusPill status={a.status} />
                      </td>
                    </tr>
                  ))}
                  {stats.recent_appointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-ink-400">
                        No bookings yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : !error ? (
        <p className="mt-6 text-sm text-ink-400">Loading…</p>
      ) : null}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div
      className={`rounded-3xl border p-5 shadow-sm ${
        highlight ? "border-gold-500/30 bg-gold-500/5" : "border-nude-100 bg-white"
      }`}
    >
      <div className="text-xs uppercase tracking-wider text-ink-400">{label}</div>
      <div className="mt-2 font-display text-4xl">{value}</div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-ink-100 text-ink-700",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
        styles[status] ?? "bg-nude-100 text-ink-600"
      }`}
    >
      {status}
    </span>
  );
}
