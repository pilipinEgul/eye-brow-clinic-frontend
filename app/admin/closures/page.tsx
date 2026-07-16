"use client";

import { useEffect, useState, type FormEvent } from "react";
import { adminApi, revalidateSite } from "@/lib/admin-api";
import { useToast } from "@/lib/admin-toast";

type Closure = {
  id: number;
  date: string | null;
  weekday: number | null;
  reason: string | null;
};

const WEEKDAYS = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AdminClosuresPage() {
  const [items, setItems] = useState<Closure[]>([]);
  const [mode, setMode] = useState<"weekday" | "date">("date");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  function load() {
    adminApi
      .list<Closure>("closures")
      .then((res) => setItems(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."));
  }

  useEffect(load, []);

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const reason = String(fd.get("reason") ?? "") || undefined;
    const payload =
      mode === "weekday"
        ? { weekday: Number(fd.get("weekday")), reason }
        : { date: String(fd.get("date") ?? ""), reason };

    setSaving(true);
    setError(null);
    try {
      await adminApi.create("closures", payload);
      await revalidateSite();
      form.reset();
      load();
      toast(mode === "weekday" ? "Weekly day off added." : "Holiday added.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not add closure.";
      setError(message);
      toast(message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    try {
      await adminApi.remove("closures", id);
      setItems((prev) => prev.filter((c) => c.id !== id));
      await revalidateSite();
      toast("Closure removed.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed.";
      setError(message);
      toast(message, "error");
    }
  }

  const recurring = items.filter((c) => c.weekday);
  const holidays = items.filter((c) => c.date);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl">Closures &amp; Holidays</h1>
      <p className="mt-1 text-sm text-ink-500">
        Days the booking calendar marks as closed. Google Calendar events also block times automatically.
      </p>

      {error ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <form onSubmit={add} className="mt-6 rounded-3xl border border-nude-100 bg-white p-6 shadow-sm">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("date")}
            className={`rounded-full px-4 py-1.5 text-sm ${mode === "date" ? "bg-ink-900 text-white" : "bg-nude-100 text-ink-600"}`}
          >
            Holiday (one date)
          </button>
          <button
            type="button"
            onClick={() => setMode("weekday")}
            className={`rounded-full px-4 py-1.5 text-sm ${mode === "weekday" ? "bg-ink-900 text-white" : "bg-nude-100 text-ink-600"}`}
          >
            Weekly day off
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          {mode === "date" ? (
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-[0.2em] text-ink-500">Date</span>
              <input
                name="date"
                type="date"
                required
                className="mt-1 block rounded-2xl border border-nude-200 bg-blush-50/40 px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
              />
            </label>
          ) : (
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-[0.2em] text-ink-500">Weekday</span>
              <select
                name="weekday"
                defaultValue="1"
                className="mt-1 block rounded-2xl border border-nude-200 bg-blush-50/40 px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <option key={d} value={d}>
                    {WEEKDAYS[d]}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="block flex-1 text-sm">
            <span className="text-xs uppercase tracking-[0.2em] text-ink-500">Reason (optional)</span>
            <input
              name="reason"
              type="text"
              maxLength={160}
              placeholder="e.g. Christmas, Weekly day off"
              className="mt-1 block w-full rounded-2xl border border-nude-200 bg-blush-50/40 px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
            />
          </label>

          <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
            {saving ? "Adding…" : "Add"}
          </button>
        </div>
      </form>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <ClosureList
          title="Weekly days off"
          empty="Open every day."
          rows={recurring.map((c) => ({ id: c.id, label: WEEKDAYS[c.weekday ?? 0], reason: c.reason }))}
          onRemove={remove}
        />
        <ClosureList
          title="Holidays"
          empty="No holidays set."
          rows={holidays.map((c) => ({
            id: c.id,
            label: new Date(`${c.date}T00:00:00`).toLocaleDateString("en-PH", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            reason: c.reason,
          }))}
          onRemove={remove}
        />
      </div>
    </div>
  );
}

function ClosureList({
  title,
  empty,
  rows,
  onRemove,
}: {
  title: string;
  empty: string;
  rows: Array<{ id: number; label: string; reason: string | null }>;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-nude-100 bg-white p-6 shadow-sm">
      <h2 className="font-display text-lg">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-ink-400">{empty}</p>
      ) : (
        <ul className="mt-3 divide-y divide-nude-100">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between py-2.5">
              <div>
                <div className="text-sm font-medium">{r.label}</div>
                {r.reason ? <div className="text-xs text-ink-400">{r.reason}</div> : null}
              </div>
              <button
                onClick={() => onRemove(r.id)}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
