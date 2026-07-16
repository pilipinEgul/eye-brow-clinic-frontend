"use client";

import { useEffect, useState, type FormEvent } from "react";
import { adminApi, revalidateSite, type BookingSettings } from "@/lib/admin-api";
import { useToast } from "@/lib/admin-toast";

const INTERVALS = [
  { value: 0, label: "Use each service's duration" },
  { value: 15, label: "Every 15 minutes" },
  { value: 30, label: "Every 30 minutes" },
  { value: 45, label: "Every 45 minutes" },
  { value: 60, label: "Every hour" },
  { value: 90, label: "Every 90 minutes" },
  { value: 120, label: "Every 2 hours" },
];

function hourLabel(h: number) {
  const period = h >= 12 && h < 24 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:00 ${period}`;
}

function previewTimes(open: number, close: number, interval: number): string[] {
  if (interval <= 0 || close <= open) return [];
  const out: string[] = [];
  for (let m = open * 60; m + interval <= close * 60 && out.length < 40; m += interval) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return out;
}

export default function AdminSchedulePage() {
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    adminApi
      .getSettings()
      .then((res) => setSettings(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings) return;
    if (settings.close_hour <= settings.open_hour) {
      setError("Closing time must be after the opening time.");
      toast("Closing time must be after the opening time.", "error");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await adminApi.updateSettings(settings);
      setSettings(res.data);
      await revalidateSite();
      toast("Booking hours saved.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save.";
      setError(message);
      toast(message, "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) {
    return <p className="text-sm text-ink-400">Loading…</p>;
  }

  const preview = previewTimes(settings.open_hour, settings.close_hour, settings.slot_interval_minutes);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl">Schedule</h1>
      <p className="mt-1 text-sm text-ink-500">
        Set the studio&apos;s daily booking hours and how often time slots appear. These apply to every
        open day; use Closures &amp; Holidays for days off.
      </p>

      {error ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <form onSubmit={save} className="mt-6 rounded-3xl border border-nude-100 bg-white p-6 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-[0.2em] text-ink-500">Opens at</span>
            <select
              value={settings.open_hour}
              onChange={(e) => setSettings({ ...settings, open_hour: Number(e.target.value) })}
              className="mt-1 block w-full rounded-2xl border border-nude-200 bg-blush-50/40 px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
            >
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={h}>
                  {hourLabel(h)}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-xs uppercase tracking-[0.2em] text-ink-500">Closes at</span>
            <select
              value={settings.close_hour}
              onChange={(e) => setSettings({ ...settings, close_hour: Number(e.target.value) })}
              className="mt-1 block w-full rounded-2xl border border-nude-200 bg-blush-50/40 px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
            >
              {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>
                  {hourLabel(h)}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="text-xs uppercase tracking-[0.2em] text-ink-500">Slot interval</span>
            <select
              value={settings.slot_interval_minutes}
              onChange={(e) =>
                setSettings({ ...settings, slot_interval_minutes: Number(e.target.value) })
              }
              className="mt-1 block w-full rounded-2xl border border-nude-200 bg-blush-50/40 px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
            >
              {INTERVALS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 rounded-2xl bg-blush-50/50 px-4 py-3 text-sm text-ink-600">
          <span className="text-xs uppercase tracking-[0.2em] text-ink-500">Preview</span>
          {preview.length > 0 ? (
            <p className="mt-2 leading-relaxed">
              {preview.join(", ")}
              {preview.length >= 40 ? " …" : ""}
            </p>
          ) : (
            <p className="mt-2">
              Slots run from {hourLabel(settings.open_hour)} to {hourLabel(settings.close_hour)}, spaced
              by each service&apos;s duration.
            </p>
          )}
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary mt-6 disabled:opacity-60">
          {saving ? "Saving…" : "Save hours"}
        </button>
      </form>
    </div>
  );
}
