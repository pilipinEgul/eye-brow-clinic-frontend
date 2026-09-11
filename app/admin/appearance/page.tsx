"use client";

import { useEffect, useMemo, useState } from "react";
import { adminApi, revalidateSite } from "@/lib/admin-api";
import { useToast } from "@/lib/toast";
import {
  DEFAULT_THEME,
  normalizeTheme,
  themeCss,
  type DefaultMode,
  type Theme,
  type ThemeColors,
  type ThemeMode,
} from "@/lib/theme";

const FIELDS: { key: keyof ThemeColors; label: string; hint: string }[] = [
  { key: "bg", label: "Page background", hint: "Main surface behind content" },
  { key: "header", label: "Header / nav", hint: "Top navigation bar" },
  { key: "primary", label: "Primary & accent", hint: "Buttons, links, highlights" },
  { key: "text", label: "Text", hint: "Headings & body text" },
];

export default function AdminAppearancePage() {
  const toast = useToast();
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<ThemeMode>("light");

  useEffect(() => {
    adminApi
      .getTheme()
      .then((res) => setTheme(normalizeTheme(res.data)))
      .catch(() => toast("Could not load theme.", "error"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const previewColors = theme[previewMode];
  // Scoped preview CSS so the sample updates live without touching the real page.
  const previewCss = useMemo(() => {
    const css = themeCss(theme);
    // Extract the block for the mode being previewed, scope it to .theme-preview.
    return css;
  }, [theme]);

  function setColor(mode: ThemeMode, key: keyof ThemeColors, value: string) {
    setTheme((t) => ({ ...t, [mode]: { ...t[mode], [key]: value } }));
  }

  async function save() {
    setSaving(true);
    try {
      await adminApi.updateTheme(theme);
      await revalidateSite();
      // Apply immediately in this browser too.
      const style = document.getElementById("emcey-theme");
      if (style) style.innerHTML = themeCss(theme);
      toast("Theme saved. Refreshing the site colors…");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save.", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-ink-400">Loading…</p>;

  return (
    <div className="max-w-4xl pb-16">
      <style dangerouslySetInnerHTML={{ __html: previewCss }} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Appearance</h1>
          <p className="mt-1 text-sm text-ink-500">
            Pick your site colors and dark-mode default. Applies to the whole site and this dashboard.
          </p>
        </div>
        <button onClick={save} disabled={saving} className="btn btn-primary disabled:opacity-60">
          {saving ? "Saving…" : "Save theme"}
        </button>
      </div>

      {/* Default mode */}
      <div className="mt-6 rounded-3xl border border-nude-100 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg">Default mode</h2>
        <p className="mt-1 text-xs text-ink-400">
          What first-time visitors see (they can still toggle). <b>System</b> follows each visitor&apos;s
          device light/dark setting.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              { m: "light", icon: "pi-sun", label: "Light" },
              { m: "dark", icon: "pi-moon", label: "Dark" },
              { m: "system", icon: "pi-desktop", label: "System" },
            ] as { m: DefaultMode; icon: string; label: string }[]
          ).map(({ m, icon, label }) => (
            <button
              key={m}
              onClick={() => setTheme((t) => ({ ...t, default_mode: m }))}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                theme.default_mode === m ? "bg-ink-900 text-white" : "bg-nude-100 text-ink-600"
              }`}
            >
              <i className={`pi ${icon} text-xs`} aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Color editors — light & dark */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {(["light", "dark"] as ThemeMode[]).map((mode) => (
          <div key={mode} className="rounded-3xl border border-nude-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <i className={`pi ${mode === "dark" ? "pi-moon" : "pi-sun"} text-terracotta-500`} aria-hidden />
              <h2 className="font-display text-lg capitalize">{mode} mode</h2>
            </div>
            <div className="mt-4 space-y-3">
              {FIELDS.map((f) => (
                <div key={f.key} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme[mode][f.key]}
                    onChange={(e) => setColor(mode, f.key, e.target.value)}
                    className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-nude-200 bg-transparent"
                    aria-label={`${mode} ${f.label}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-ink-800">{f.label}</div>
                    <div className="text-xs text-ink-400">{f.hint}</div>
                  </div>
                  <input
                    type="text"
                    value={theme[mode][f.key]}
                    onChange={(e) => setColor(mode, f.key, e.target.value)}
                    className="w-24 rounded-lg border border-nude-200 bg-blush-50/40 px-2 py-1.5 text-xs font-mono uppercase focus:border-gold-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setTheme((t) => ({ ...t, [mode]: DEFAULT_THEME[mode] }))}
              className="mt-4 text-xs text-ink-400 hover:text-terracotta-500"
            >
              Reset {mode} to default
            </button>
          </div>
        ))}
      </div>

      {/* Live preview */}
      <div className="mt-6 rounded-3xl border border-nude-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">Preview</h2>
          <div className="flex gap-1 rounded-full bg-nude-100 p-1">
            {(["light", "dark"] as ThemeMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setPreviewMode(m)}
                className={`rounded-full px-3 py-1 text-xs capitalize transition ${
                  previewMode === m ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div
          className="theme-preview mt-4 overflow-hidden rounded-2xl border"
          style={{ background: previewColors.bg, borderColor: "rgba(0,0,0,.08)" }}
        >
          {/* Mock header */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ background: previewColors.header }}
          >
            <span className="font-display text-lg" style={{ color: previewColors.text }}>
              Emcey Brows
            </span>
            <span
              className="rounded-full px-3 py-1.5 text-xs font-medium text-white"
              style={{ background: previewColors.primary }}
            >
              Book Appointment
            </span>
          </div>
          {/* Mock body */}
          <div className="px-5 py-6">
            <div className="font-display text-2xl" style={{ color: previewColors.text }}>
              Beauty, refined.
            </div>
            <p className="mt-1 text-sm" style={{ color: previewColors.text, opacity: 0.7 }}>
              From nano brows to hydra facials — artistry and calm.
            </p>
            <div className="mt-4 flex gap-2">
              <span
                className="rounded-full px-4 py-2 text-xs font-medium text-white"
                style={{ background: previewColors.primary }}
              >
                Primary button
              </span>
              <span
                className="rounded-full border px-4 py-2 text-xs font-medium"
                style={{
                  background: previewMode === "dark" ? "rgba(255,255,255,.06)" : "#fff",
                  color: previewColors.text,
                  borderColor: previewColors.primary,
                }}
              >
                Secondary
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
