"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { useToast } from "@/lib/admin-toast";

type Appointment = {
  id: number;
  reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  scheduled_at: string;
  duration_minutes: number | null;
  status: string;
  google_event_link?: string | null;
  notes?: string | null;
  service?: { name: string } | null;
};

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];
const FILTERS = ["all", ...STATUSES];

type PendingChange = { appointment: Appointment; nextStatus: string };

export default function AdminAppointmentsPage() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toast = useToast();
  const [pending, setPending] = useState<PendingChange | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const query = filter === "all" ? "?per_page=100" : `?status=${filter}&per_page=100`;
    adminApi
      .list<Appointment>("appointments", query)
      .then((res) => setItems(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(load, [load]);

  // Ask before applying a status change (it may sync to Google Calendar).
  function requestStatusChange(appointment: Appointment, nextStatus: string) {
    if (nextStatus === appointment.status) return;
    setPending({ appointment, nextStatus });
  }

  async function confirmChange() {
    if (!pending) return;
    const { appointment, nextStatus } = pending;
    setBusy(true);
    try {
      const res = await adminApi.update<Appointment>("appointments", appointment.id, {
        status: nextStatus,
      });
      // Fill the row from the server response so the Calendar ↗ link appears
      // as soon as the booking is confirmed and synced.
      const updated = res?.data;
      setItems((prev) =>
        prev.map((a) => (a.id === appointment.id ? { ...a, ...(updated ?? { status: nextStatus }) } : a)),
      );
      toast(
        nextStatus === "confirmed"
          ? `Confirmed — ${appointment.customer_name}'s booking was added to the calendar.`
          : `Booking marked as ${nextStatus}.`,
      );
    } catch (err) {
      toast(err instanceof Error ? err.message : "Update failed. Please try again.", "error");
    } finally {
      setBusy(false);
      setPending(null);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this appointment? This cannot be undone.")) return;
    try {
      await adminApi.remove("appointments", id);
      setItems((prev) => prev.filter((a) => a.id !== id));
      toast("Appointment deleted.");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Delete failed.", "error");
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Appointments</h1>
      <p className="mt-1 text-sm text-ink-500">Confirm, complete, or cancel bookings.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm capitalize transition ${
              filter === f ? "bg-ink-900 text-white" : "bg-white text-ink-600 hover:bg-nude-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-3xl border border-nude-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-nude-100 text-left text-xs uppercase tracking-wider text-ink-400">
              <th className="p-4">Client</th>
              <th className="p-4">Service</th>
              <th className="p-4">When</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nude-100">
            {items.map((a) => (
              <tr key={a.id} className="align-top">
                <td className="p-4">
                  <div className="font-medium">{a.customer_name}</div>
                  <div className="text-xs text-ink-400">{a.customer_phone}</div>
                  <div className="text-xs text-ink-400">{a.customer_email}</div>
                  <div className="mt-1 font-mono text-[11px] text-ink-400">{a.reference}</div>
                </td>
                <td className="p-4">{a.service?.name ?? "—"}</td>
                <td className="p-4 whitespace-nowrap">
                  {new Date(a.scheduled_at).toLocaleString("en-PH", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {a.google_event_link ? (
                    <a
                      href={a.google_event_link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-gold-600 hover:text-gold-700"
                    >
                      Calendar
                      <i className="pi pi-external-link text-[0.65rem]" aria-hidden />
                    </a>
                  ) : null}
                </td>
                <td className="p-4">
                  <Select
                    value={a.status}
                    options={STATUSES}
                    onChange={(v) => requestStatusChange(a, v)}
                  />
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => remove(a.id)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink-400">
                  No appointments.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {loading ? <p className="mt-4 text-sm text-ink-400">Loading…</p> : null}

      {pending ? (
        <ConfirmDialog
          busy={busy}
          title={`Set status to “${pending.nextStatus}”?`}
          body={
            pending.nextStatus === "confirmed"
              ? `This will confirm ${pending.appointment.customer_name}'s booking and add it to the Google Calendar.`
              : `${pending.appointment.customer_name}'s booking will be marked as ${pending.nextStatus}.`
          }
          onConfirm={confirmChange}
          onCancel={() => setPending(null)}
        />
      ) : null}
    </div>
  );
}

function ConfirmDialog({
  title,
  body,
  busy,
  onConfirm,
  onCancel,
}: {
  title: string;
  body: string;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="font-display text-xl text-ink-900">{title}</h2>
        <p className="mt-2 text-sm text-ink-600">{body}</p>

        {busy ? (
          <div className="mt-6 flex items-center gap-3 text-sm text-ink-500">
            <Spinner />
            Updating…
          </div>
        ) : (
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="rounded-xl px-4 py-2 text-sm text-ink-600 hover:bg-nude-100"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="rounded-xl bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-800"
            >
              Yes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-nude-200 border-t-gold-600" />
  );
}

function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-nude-200 bg-white px-2 py-1.5 text-sm capitalize focus:border-gold-500 focus:outline-none"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
