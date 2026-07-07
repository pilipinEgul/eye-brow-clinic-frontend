# SEO Setup

How search-engine optimisation works on the Emcey Brows site — what's already
built, what the owner needs to do once, and the few developer to-dos remaining.

The companion **owner PDF** is `Emcey-Brows-SEO-Setup-Guide.pdf` (generated from
`seo-setup-guide.html`).

---

## 1. What's already built into the site ✅

| Area | Where | Notes |
|------|-------|-------|
| Page titles + templates | `app/layout.tsx` (`metadata.title`) | `%s | Emcey Brows` template; each page sets its own title |
| Meta descriptions | per-page `export const metadata` | About, Services, Contact, Testimonials, etc. |
| Keywords | `app/layout.tsx` | Imus / Cavite brow + aesthetic terms |
| Open Graph + Twitter cards | `app/layout.tsx` | Controls link previews on FB/IG/X |
| Canonical URL | `app/layout.tsx` `alternates.canonical` | Uses `NEXT_PUBLIC_SITE_URL` |
| `robots.txt` | `app/robots.ts` | Allows all, blocks `/api/` + `/admin/`, points to sitemap |
| `sitemap.xml` | `app/sitemap.ts` | All static pages + every service page |
| Structured data (JSON-LD) | `lib/schemas.ts` + `components/JsonLd.tsx` | `BeautySalon` (name, address, geo, hours, phone), `Service`, `FAQPage`, `BreadcrumbList` |
| Verification hook | `app/layout.tsx` `metadata.verification` | Reads `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` from `.env` |

The single most important config value is **`NEXT_PUBLIC_SITE_URL`** — it feeds
the canonical URL, sitemap, robots, and all schema URLs. It must be the real
public domain in production (currently an ngrok URL in `.env.example`).

```env
NEXT_PUBLIC_SITE_URL=https://www.emceybrows.com   # set to the real domain
```

---

## 2. Owner one-time tasks (no code)

These are detailed step-by-step in the PDF. Summary:

1. **Google Search Console** — verify ownership, submit `sitemap.xml`.
   - Verify via the **HTML tag** method → paste the token into `.env` as
     `GOOGLE_SITE_VERIFICATION` (the site renders the meta tag automatically),
     **or** verify via DNS.
2. **Google Business Profile** — claim/optimise the Maps listing (this drives
   local "near me" results far more than anything on-site). Keep the name,
   address, phone, hours, and category consistent with the website.
3. **Bing Webmaster Tools** — optional; verify with `BING_SITE_VERIFICATION`
   or import from Search Console.
4. **Analytics** — decide on Google Analytics 4 (see dev to-do #3 below).

---

## 3. Developer to-dos (recommended, not yet done)

These gaps are worth closing for full SEO/social coverage:

1. **OG image.** `lib/schemas.ts` and OG tags reference an image, but
   `public/og-image.jpg` does **not exist** yet. Add a 1200×630 branded image at
   `public/og-image.jpg`, and add `openGraph.images` / `twitter.images` in
   `app/layout.tsx`. Without it, social shares show no preview image.
2. **Favicon + icons.** No `app/icon.png` / `app/apple-icon.png` /
   `manifest.webmanifest` yet. Add a favicon and a web manifest for a proper
   browser tab icon and "Add to Home Screen" behaviour.
3. **Analytics.** No GA4 / tag manager installed. If desired, add GA4 via
   `@next/third-parties` (`<GoogleAnalytics gaId=... />` in `layout.tsx`) gated
   behind an env var, and disclose it in a privacy note.
4. **Per-page OG titles/descriptions** are inherited from the layout on some
   pages — consider unique `openGraph` blocks on key pages (Services, individual
   service pages) for richer link previews.
5. **`aggregateRating` caution.** Do **not** inject Google-sourced star ratings
   into `BeautySalon` schema — against Google's self-serving review policy
   (already noted in `REVIEWS-INTEGRATION.md`).

---

## 4. How to verify SEO is working

- **Rich Results Test** — <https://search.google.com/test/rich-results> → paste a
  live URL → confirm `BeautySalon` / `Service` / `FAQ` schema is detected.
- **Search Console → Pages** — watch indexed-page count grow after submitting
  the sitemap.
- **Sitemap** — visit `https://<domain>/sitemap.xml` and `…/robots.txt` to
  confirm they render with the correct domain (not localhost/ngrok).
- **Social preview** — paste a URL into the Facebook Sharing Debugger to confirm
  the OG image/title (after to-do #1).

---

## Summary of changes made for SEO setup

| File | Change |
|------|--------|
| `app/layout.tsx` | Added `metadata.verification` (Google + Bing) driven by env vars |
| `.env.example` | Added `GOOGLE_SITE_VERIFICATION` + `BING_SITE_VERIFICATION` |
| `docs/SEO-SETUP.md` | This document |
| `docs/seo-setup-guide.html` + `…SEO-Setup-Guide.pdf` | Owner-facing guide |
