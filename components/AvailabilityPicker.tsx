"use client";

import { useEffect, useMemo, useState } from "react";
import { api, type AvailabilityDay } from "@/lib/api";

type Props = {
  serviceId: number | undefined;
  onChange: (selection: { date: string; time: string } | null) => void;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isoDay(date: Date) {
  // toISOString() converts to UTC, which rolls back one day for any TZ east of
  // UTC (e.g. Asia/Manila is UTC+8 — local midnight is previous-day 16:00 UTC).
  // Build the date string from local components instead so the picker and the
  // API stay in the same calendar day.
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfWeek(date: Date) {
  // Sunday-first calendar grid.
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function monthLabel(date: Date) {
  return date.toLocaleDateString("en-PH", { month: "long", year: "numeric" });
}

export function AvailabilityPicker({ serviceId, onChange }: Props) {
  const [cursor, setCursor] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [days, setDays] = useState<AvailabilityDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) {
      setDays([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const from = monthStart < today ? today : monthStart;
    const days = Math.max(
      1,
      Math.round((monthEnd.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    );

    api
      .availabilityRange({ service_id: serviceId, from: isoDay(from), days })
      .then((res) => {
        if (cancelled) return;
        setDays(res.data.days);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Could not load availability.");
        setDays([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [serviceId, cursor]);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      onChange({ date: selectedDate, time: selectedTime });
    } else {
      onChange(null);
    }
  }, [selectedDate, selectedTime, onChange]);

  const dayMap = useMemo(() => {
    const map = new Map<string, AvailabilityDay>();
    for (const d of days) map.set(d.date, d);
    return map;
  }, [days]);

  const calendarCells = useMemo(() => {
    const firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const lastOfMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const gridStart = startOfWeek(firstOfMonth);

    const cells: { date: Date; inMonth: boolean }[] = [];
    let pointer = new Date(gridStart);
    while (pointer <= lastOfMonth || cells.length % 7 !== 0) {
      cells.push({
        date: new Date(pointer),
        inMonth: pointer.getMonth() === cursor.getMonth(),
      });
      pointer.setDate(pointer.getDate() + 1);
      if (cells.length > 42) break;
    }
    return cells;
  }, [cursor]);

  const selectedDay = selectedDate ? dayMap.get(selectedDate) ?? null : null;

  function goPrev() {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  }
  function goNext() {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  }

  if (!serviceId) {
    return (
      <div className="rounded-2xl border border-nude-100 bg-blush-50/40 p-6 text-sm text-ink-500">
        Choose a service above to see available dates and times.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-nude-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          className="rounded-full border border-nude-200 px-3 py-1 text-sm text-ink-700 hover:border-gold-400 hover:text-gold-600"
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="font-display text-lg text-ink-900">{monthLabel(cursor)}</div>
        <button
          type="button"
          onClick={goNext}
          className="rounded-full border border-nude-200 px-3 py-1 text-sm text-ink-700 hover:border-gold-400 hover:text-gold-600"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-[0.25em] text-ink-300">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {calendarCells.map(({ date, inMonth }) => {
          const iso = isoDay(date);
          const info = dayMap.get(iso);
          const isSelected = selectedDate === iso;
          const isPast = info?.is_past ?? false;
          const isClosed = info?.is_closed ?? false;
          const isFull = !!info && !isPast && !isClosed && info.available_count === 0;
          const isAvailable = !!info && !isPast && !isClosed && info.available_count > 0;
          const disabled = !info || isPast || isClosed || isFull || !inMonth;

          let label = "Unavailable";
          if (!inMonth) label = "Outside month";
          else if (isPast) label = "Past";
          else if (isClosed) label = "Studio closed";
          else if (isFull) label = "Fully booked";
          else if (isAvailable) label = `${info.available_count} of ${info.total_slots} slots open`;

          return (
            <button
              type="button"
              key={iso + (inMonth ? "" : "-out")}
              disabled={disabled}
              onClick={() => {
                setSelectedDate(iso);
                setSelectedTime(null);
              }}
              title={label}
              aria-label={`${iso} — ${label}`}
              className={[
                "relative aspect-square rounded-xl border text-sm transition",
                inMonth ? "" : "opacity-30",
                isSelected
                  ? "border-gold-500 bg-gold-500 text-white shadow"
                  : isAvailable
                    ? "border-blush-200 bg-blush-50 text-ink-900 hover:border-gold-400"
                    : isFull
                      ? "border-red-200 bg-red-50/60 text-red-500"
                      : isClosed
                        ? "border-nude-100 bg-nude-50 text-ink-300"
                        : "border-nude-100 bg-white text-ink-300",
                disabled ? "cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
            >
              <span className="font-display text-base">{date.getDate()}</span>
              {isAvailable ? (
                <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold-500" />
              ) : isFull ? (
                <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-red-400" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.25em] text-ink-500">
        <Legend dotClass="bg-gold-500" label="Available" />
        <Legend dotClass="bg-red-400" label="Fully booked" />
        <Legend dotClass="bg-nude-200" label="Closed / past" />
      </div>

      {loading ? (
        <p className="mt-4 text-xs text-ink-500">Loading availability…</p>
      ) : null}
      {error ? <p className="mt-4 text-xs text-red-600">{error}</p> : null}

      {selectedDay ? (
        <div className="mt-6">
          <div className="font-display text-base text-ink-900">
            Slots for{" "}
            {new Date(`${selectedDay.date}T00:00:00`).toLocaleDateString("en-PH", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>

          {selectedDay.slots.length === 0 ? (
            <p className="mt-3 text-sm text-ink-500">No slots offered on this date.</p>
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {selectedDay.slots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    type="button"
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={[
                      "rounded-full border px-3 py-2 text-sm transition",
                      isSelected
                        ? "border-gold-500 bg-gold-500 text-white"
                        : slot.available
                          ? "border-nude-200 bg-white text-ink-900 hover:border-gold-400 hover:text-gold-600"
                          : "border-nude-100 bg-nude-50 text-ink-300 line-through cursor-not-allowed",
                    ].join(" ")}
                    aria-label={
                      slot.available
                        ? `${slot.time} available`
                        : `${slot.time} unavailable`
                    }
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function Legend({ dotClass, label }: { dotClass: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}
