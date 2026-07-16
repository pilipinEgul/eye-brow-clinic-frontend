"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api, ApiError, type TrackedBooking } from "@/lib/api";
import { useToast } from "@/lib/toast";

const STATUS_STYLE: Record<TrackedBooking["status"], { label: string; className: string }> = {
  pending: { label: "Pending confirmation", className: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Confirmed", className: "bg-green-100 text-green-800" },
  completed: { label: "Completed", className: "bg-blue-100 text-blue-800" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TrackBookingPage() {
  const toast = useToast();
  const [reference, setReference] = useState("");
  const [booking, setBooking] = useState<TrackedBooking | null>(null);
  const [looking, setLooking] = useState(false);

  const [showCancel, setShowCancel] = useState(false);
  const [reason, setReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const lookup = useCallback(
    async (ref: string, { silent = false }: { silent?: boolean } = {}) => {
      const trimmed = ref.trim();
      if (!trimmed) return;
      setLooking(true);
      setBooking(null);
      setShowCancel(false);
      try {
        const res = await api.trackAppointment(trimmed);
        setBooking(res.data);
      } catch (err) {
        if (silent && err instanceof ApiError && err.status === 404) {
          // Arrived via a stale/typo'd link — let them retry manually.
        } else if (err instanceof ApiError && err.status === 404) {
          toast("No booking found with that reference. Please double-check it.", "error");
        } else {
          toast(err instanceof Error ? err.message : "Could not look up that booking.", "error");
        }
      } finally {
        setLooking(false);
      }
    },
    [toast],
  );

  // Prefill + auto-lookup when arriving from a confirmation link (/track?ref=…).
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) {
      setReference(ref.toUpperCase());
      lookup(ref, { silent: true });
    }
  }, [lookup]);

  function track(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    lookup(reference);
  }

  async function cancel() {
    if (!booking) return;
    if (reason.trim().length < 3) {
      toast("Please tell us the reason for cancelling.", "error");
      return;
    }
    setCancelling(true);
    try {
      const res = await api.cancelAppointment(booking.reference, reason.trim());
      setBooking(res.data);
      setShowCancel(false);
      setReason("");
      toast("Your booking has been cancelled.");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        toast(err.message, "error");
      } else {
        toast(err instanceof Error ? err.message : "Could not cancel your booking.", "error");
      }
    } finally {
      setCancelling(false);
    }
  }

  const canCancel = booking && booking.status !== "cancelled" && booking.status !== "completed";

  return (
    <section className="mx-auto max-w-2xl px-5 py-16 sm:py-20">
      <h1 className="font-display text-4xl text-ink-900">Track your booking</h1>
      <p className="mt-2 text-sm text-ink-500">
        Enter the reference number from your confirmation (e.g. <span className="font-mono">EM-XXXXXXXX</span>)
        to check your status or cancel.
      </p>

      <form onSubmit={track} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={reference}
          onChange={(e) => setReference(e.target.value.toUpperCase())}
          placeholder="EM-XXXXXXXX"
          className="w-full rounded-2xl border border-nude-200 bg-white px-4 py-3 text-sm font-mono uppercase tracking-wide text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
        />
        <button
          type="submit"
          disabled={looking || !reference.trim()}
          className="btn btn-primary whitespace-nowrap disabled:opacity-60"
        >
          {looking ? "Looking…" : "Track booking"}
        </button>
      </form>

      {booking ? (
        <div className="mt-8 rounded-3xl border border-nude-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-mono text-xs text-ink-400">{booking.reference}</div>
              <div className="mt-1 font-display text-2xl text-ink-900">
                {booking.service?.name ?? "Appointment"}
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[booking.status].className}`}
            >
              {STATUS_STYLE[booking.status].label}
            </span>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-ink-400">Name</dt>
              <dd className="mt-1 text-ink-800">{booking.customer_name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-ink-400">When</dt>
              <dd className="mt-1 text-ink-800">{formatWhen(booking.scheduled_at)}</dd>
            </div>
          </dl>

          {booking.status === "cancelled" && booking.cancellation_reason ? (
            <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <span className="font-medium">Cancellation reason:</span> {booking.cancellation_reason}
            </p>
          ) : null}

          {canCancel ? (
            <div className="mt-6 border-t border-nude-100 pt-6">
              {showCancel ? (
                <div>
                  <label className="block text-sm">
                    <span className="text-xs uppercase tracking-[0.2em] text-ink-500">
                      Reason for cancelling *
                    </span>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder="Let us know why you're cancelling…"
                      className="mt-2 w-full rounded-2xl border border-nude-200 bg-blush-50/40 px-4 py-3 text-sm text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />
                  </label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={cancel}
                      disabled={cancelling}
                      className="btn btn-primary !bg-red-600 hover:!bg-red-700 disabled:opacity-60"
                    >
                      {cancelling ? "Cancelling…" : "Confirm cancellation"}
                    </button>
                    <button
                      onClick={() => {
                        setShowCancel(false);
                        setReason("");
                      }}
                      className="btn btn-secondary"
                    >
                      Keep my booking
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCancel(true)}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Cancel this booking
                </button>
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
