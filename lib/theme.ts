/**
 * Dynamic theme engine. The admin picks 4 base colors per mode (page background,
 * header, primary/accent, text); from each we derive the full ramp of
 * `--color-*` tokens the whole site + admin already consume (Tailwind v4 maps
 * `bg-cream-100` → `var(--color-cream-100)`, etc.). We emit a `:root { … }` block
 * for light and a `:root[data-theme="dark"] { … }` block for dark.
 */

export type ThemeColors = { bg: string; header: string; primary: string; text: string };
export type ThemeMode = "light" | "dark";
/** The admin default can also be "system" — follow the visitor's device setting. */
export type DefaultMode = ThemeMode | "system";
export type Theme = {
  default_mode: DefaultMode;
  light: ThemeColors;
  dark: ThemeColors;
};

// Current warm defaults (light) + a matching cosy dark. Used when nothing saved.
export const DEFAULT_THEME: Theme = {
  default_mode: "light",
  light: { bg: "#f8d8b6", header: "#fae4cd", primary: "#a94c2e", text: "#29190f" },
  dark: { bg: "#1c140d", header: "#241a11", primary: "#e0965a", text: "#f6ead9" },
};

/* ---------- color math (hex ⇄ hsl, lighten/darken/mix) ---------- */

function clamp(n: number, lo = 0, hi = 100) {
  return Math.min(hi, Math.max(lo, n));
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function hexToHsl(hex: string): [number, number, number] {
  let [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

/** Shift lightness by delta percentage points (positive = lighter). */
function shade(hex: string, deltaL: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, clamp(l + deltaL));
}

/** Mix `hex` toward `toward` by amount (0..1) — used to derive text tints. */
function mix(hex: string, toward: string, amount: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(toward);
  return rgbToHex(
    a[0] + (b[0] - a[0]) * amount,
    a[1] + (b[1] - a[1]) * amount,
    a[2] + (b[2] - a[2]) * amount,
  );
}

/* ---------- token derivation ---------- */

function tokensFor(c: ThemeColors, mode: ThemeMode): Record<string, string> {
  const dark = mode === "dark";
  const surface = dark ? shade(c.bg, 7) : "#ffffff";
  const surfaceBorder = dark ? shade(c.bg, 14) : shade(c.bg, -8);

  return {
    "--color-background": c.bg,
    "--color-foreground": c.text,

    // Page surfaces (cream ramp) — derived from the background
    "--color-cream-50": shade(c.bg, dark ? 5 : 5),
    "--color-cream-100": c.bg,
    "--color-cream-200": shade(c.bg, dark ? 8 : -6),

    // Header background (used via color-mix in globals.css)
    "--color-header": c.header,

    // Cards / white surfaces
    "--surface": surface,
    "--color-nude-50": dark ? shade(c.bg, 10) : shade(c.bg, 6),
    "--color-nude-100": surfaceBorder,
    "--color-nude-200": dark ? shade(c.bg, 18) : shade(c.bg, -14),
    "--color-nude-300": dark ? shade(c.bg, 26) : shade(c.bg, -24),

    // Blush accents (soft) — from primary, low chroma
    "--color-blush-50": dark ? shade(c.bg, 6) : shade(c.primary, 46),
    "--color-blush-100": dark ? shade(c.bg, 12) : shade(c.primary, 38),
    "--color-blush-200": shade(c.primary, 24),
    "--color-blush-300": shade(c.primary, 12),

    // Primary / accent ramp (terracotta + gold unified to primary)
    "--color-terracotta-300": shade(c.primary, 14),
    "--color-terracotta-400": shade(c.primary, 6),
    "--color-terracotta-500": c.primary,
    "--color-terracotta-600": shade(c.primary, -10),
    "--color-gold-400": shade(c.primary, 12),
    "--color-gold-500": shade(c.primary, -2),
    "--color-gold-600": shade(c.primary, -14),

    // Text (ink) ramp — from text toward background for muted tones
    "--color-ink-900": c.text,
    "--color-ink-700": mix(c.text, c.bg, 0.18),
    "--color-ink-500": mix(c.text, c.bg, 0.4),
    "--color-ink-300": mix(c.text, c.bg, 0.6),
  };
}

function block(selector: string, tokens: Record<string, string>): string {
  // !important so the runtime theme wins over Tailwind's @theme :root defaults
  // regardless of stylesheet source order.
  const body = Object.entries(tokens)
    .map(([k, v]) => `  ${k}: ${v} !important;`)
    .join("\n");
  return `${selector} {\n${body}\n}`;
}

/** Full CSS to inject: light tokens on :root, dark tokens under [data-theme="dark"]. */
export function themeCss(theme: Theme): string {
  return [
    block(":root", tokensFor(theme.light, "light")),
    block(':root[data-theme="dark"]', tokensFor(theme.dark, "dark")),
  ].join("\n");
}

/** Merge a stored (possibly partial) theme over the defaults. */
export function normalizeTheme(raw: unknown): Theme {
  const t = (raw ?? {}) as Partial<Theme>;
  const pick = (m?: Partial<ThemeColors>, d?: ThemeColors): ThemeColors => ({
    bg: m?.bg || d!.bg,
    header: m?.header || d!.header,
    primary: m?.primary || d!.primary,
    text: m?.text || d!.text,
  });
  const dm: DefaultMode =
    t.default_mode === "dark" ? "dark" : t.default_mode === "system" ? "system" : "light";
  return {
    default_mode: dm,
    light: pick(t.light, DEFAULT_THEME.light),
    dark: pick(t.dark, DEFAULT_THEME.dark),
  };
}
