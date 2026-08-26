"use client";

import { useEffect, useState } from "react";
import { adminApi, type BookingReport } from "@/lib/admin-api";

// Fixed categorical order — validated with the dataviz skill (CVD ΔE 24 on the
// worst adjacent pair). Series map to these colors by index; a legend supplies
// the label relief for the lighter hues.
const COLORS = ["#2a78d6", "#1baf7a", "#eda100", "#008300"];

const VW = 680;
const VH = 280;
const PAD = { top: 12, right: 16, bottom: 48, left: 44 };
const PLOT_W = VW - PAD.left - PAD.right;
const PLOT_H = VH - PAD.top - PAD.bottom;

const MUTED = "#898781";
const GRID = "#ece2d4";

function niceMax(max: number) {
  const step = max <= 50 ? 10 : max <= 100 ? 20 : 50;
  return Math.max(10, Math.ceil(max / step) * step);
}

export function ReportsChart() {
  const [report, setReport] = useState<BookingReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    adminApi
      .bookingReport()
      .then((res) => setReport(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load report."));
  }, []);

  return (
    <div className="rounded-3xl border border-nude-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-ink-900">Bookings by status</h2>
          <p className="mt-1 text-sm text-ink-500">Last 6 months</p>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : !report ? (
        <div className="mt-6 h-52 animate-pulse rounded-2xl bg-nude-50" />
      ) : (
        <Chart report={report} active={active} setActive={setActive} />
      )}
    </div>
  );
}

function Chart({
  report,
  active,
  setActive,
}: {
  report: BookingReport;
  active: number | null;
  setActive: (i: number | null) => void;
}) {
  const months = report.months;
  const series = report.series.map((s, i) => ({ ...s, color: COLORS[i % COLORS.length] }));
  const n = months.length;
  const allValues = series.flatMap((s) => s.values);
  const totalAll = allValues.reduce((a, b) => a + b, 0);

  const yMax = niceMax(Math.max(0, ...allValues));
  const x = (i: number) => PAD.left + (n <= 1 ? PLOT_W / 2 : (i / (n - 1)) * PLOT_W);
  const y = (v: number) => PAD.top + PLOT_H - (v / yMax) * PLOT_H;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(yMax * t));

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    setActive(Math.min(n - 1, Math.max(0, Math.round(frac * (n - 1)))));
  }

  return (
    <>
      <div className="relative mt-4">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="h-auto w-full"
          role="img"
          aria-label="Line graph of bookings by status over the last six months"
          onMouseMove={onMove}
          onMouseLeave={() => setActive(null)}
        >
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={VW - PAD.right} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth="1" />
              <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill={MUTED}>
                {t}
              </text>
            </g>
          ))}

          <text
            transform={`translate(14 ${PAD.top + PLOT_H / 2}) rotate(-90)`}
            textAnchor="middle"
            fontSize="11"
            fill={MUTED}
          >
            Bookings
          </text>

          {months.map((m, i) => (
            <text
              key={m + i}
              x={x(i)}
              y={PAD.top + PLOT_H + 20}
              textAnchor="middle"
              fontSize="11"
              fontWeight={active === i ? 700 : 400}
              fill={active === i ? "#2a1c13" : MUTED}
            >
              {m}
            </text>
          ))}
          <text x={PAD.left + PLOT_W / 2} y={VH - 6} textAnchor="middle" fontSize="11" fill={MUTED}>
            Month
          </text>

          {active !== null ? (
            <line
              x1={x(active)}
              x2={x(active)}
              y1={PAD.top}
              y2={PAD.top + PLOT_H}
              stroke="#c9beb0"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
          ) : null}

          {series.map((s) => (
            <polyline
              key={s.name}
              points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
              fill="none"
              stroke={s.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {active !== null
            ? series.map((s) => (
                <circle
                  key={s.name}
                  cx={x(active)}
                  cy={y(s.values[active])}
                  r="4.5"
                  fill="#fff"
                  stroke={s.color}
                  strokeWidth="2.5"
                />
              ))
            : null}
        </svg>

        {active !== null ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-2xl bg-ink-900 px-3 py-2 text-xs text-white shadow-xl"
            style={{ left: `${(x(active) / VW) * 100}%`, top: "4px" }}
          >
            <div className="mb-1 font-semibold">{months[active]}</div>
            {series.map((s) => (
              <div key={s.name} className="flex items-center gap-2 whitespace-nowrap">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                <span className="text-nude-200">{s.name}</span>
                <span className="ml-auto font-semibold">{s.values[active]}</span>
              </div>
            ))}
          </div>
        ) : null}

        {totalAll === 0 ? (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm text-ink-400">
            No bookings in the last 6 months yet.
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {series.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-2 text-xs text-ink-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </>
  );
}
