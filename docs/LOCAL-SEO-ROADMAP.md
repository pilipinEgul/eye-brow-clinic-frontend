# Road to #1 in Imus & Cavite — Local SEO Roadmap

Goal: rank #1 for brow/aesthetic searches across Imus and the wider Cavite area
("brows in Imus", "eyebrow clinic Bacoor", "aesthetic clinic Cavite", etc.).

The owner-facing version is `Emcey-Brows-Road-to-No1-Cavite.pdf`.

---

## Honest reality check

"#1" has two different battlegrounds, and you want both:

1. **The Map Pack** (the top-3 map listings) — driven by your **Google Business
   Profile**, reviews, proximity, and citations. This is where most local
   clicks go and is **mostly owner-driven**, not code.
2. **Organic blue links** — driven by the **website** (content, location pages,
   schema, speed, backlinks). This is where the code work pays off.

Google ranks local results on three things: **Relevance** (does the site/profile
match the search), **Distance** (how near the searcher is), **Prominence** (how
well-known/reviewed you are). We can max out Relevance with the site; Distance is
fixed by geography (so we target each town explicitly); Prominence is earned over
time through reviews and links.

**Timeframe:** local SEO moves in **weeks-to-months**, not days. A realistic path
to top-3 in Imus is ~1–3 months; province-wide dominance for competitive terms is
a 6–12 month effort of consistent reviews + content.

---

## What's now built into the site ✅

| Lever | Status |
|-------|--------|
| Town landing pages: Imus, Bacoor, Dasmariñas, General Trias, Kawit, Cavite City (`/areas/*`) | ✅ Built |
| `/areas` index + footer links from every page (internal linking) | ✅ Built |
| Unique per-town copy, H1, title, meta, keywords, FAQ schema, breadcrumb | ✅ Built |
| Town pages in `sitemap.xml` | ✅ Built |
| `BeautySalon` LocalBusiness schema (address, geo, hours, phone) | ✅ Built (site-wide) |
| Service / FAQ / Breadcrumb structured data | ✅ Built |
| Search Console verification hook (`GOOGLE_SITE_VERIFICATION`) | ✅ Built |
| Google reviews auto-pull + review CTAs | ✅ Built |

To add another town later: add an entry to `lib/areas.ts` — the route, index,
footer, and sitemap pick it up automatically.

---

## The 90-day plan

### Phase 0 — Foundations (Week 1)
- [ ] **Owner:** Set `NEXT_PUBLIC_SITE_URL` to the real production domain (not ngrok).
- [ ] **Owner:** Claim/verify **Google Business Profile**; complete every field.
- [ ] **Owner:** Verify site in **Google Search Console**, submit `sitemap.xml`.
- [ ] **Dev:** Add `og-image.jpg`, favicon, GA4 (see `SEO-SETUP.md`).

### Phase 1 — Relevance & profile (Weeks 2–4)
- [ ] **Owner:** GBP — pick the right **primary category** ("Eyebrow bar" /
      "Beauty salon") + secondary categories (Facial spa, Skin care clinic, Laser
      hair removal service). Categories are a top-3 ranking factor.
- [ ] **Owner:** GBP — add **services** matching the website, **photos** (20+),
      and **service area** = Imus, Bacoor, Dasmariñas, General Trias, Kawit, Cavite City.
- [ ] **Owner:** Turn on **GBP Posts** — post weekly (promos, before/afters).
- [ ] **Owner:** Ensure **NAP** (Name, Address, Phone) is identical on the site,
      GBP, and Facebook.

### Phase 2 — Reviews engine (Weeks 2–12, ongoing)
- [ ] **Owner:** Ask **every** happy client for a Google review (the site has a
      "Write a Google review" button — share that link).
- [ ] Aim for a **steady drip** (e.g. 4–8/month) rather than a one-time burst —
      recency and velocity matter.
- [ ] **Owner:** **Reply** to every review (keywords + town names in replies help).
- [ ] Encourage reviewers to mention the **treatment and town**
      ("ombre brows, from Bacoor").

### Phase 3 — Citations & directories (Weeks 4–8)
- [ ] **Owner:** List the business (identical NAP) on: Facebook, Instagram,
      Waze, Apple Maps, Foursquare, and PH directories (e.g. Yellow Pages PH,
      BeautyHub PH, booking platforms). Each consistent citation builds Prominence.

### Phase 4 — Content & links (Weeks 6–12+)
- [ ] **Dev/Owner:** Add a simple **blog/journal** with local + treatment posts
      ("How long do ombre brows last?", "Best brow shape for…", "Aftercare in humid
      Cavite weather"). Each targets long-tail searches and feeds the town pages.
- [ ] **Owner:** Earn **local backlinks** — partner salons, local bloggers,
      barangay/town pages, supplier "where to find us" listings, press features.
- [ ] **Owner:** Collaborate with **local influencers** in Cavite for mentions/links.

---

## Target keywords by town

| Town | Primary terms to win |
|------|----------------------|
| Imus | brows Imus, eyebrow clinic Imus, ombre brows Imus, aesthetic clinic Imus, facial Imus |
| Bacoor | brows Bacoor, eyebrow embroidery Bacoor, lip blush Bacoor, aesthetic clinic Bacoor |
| Dasmariñas | brows Dasmariñas, microshading Dasmariñas, facial Dasmariñas, lashliner Dasma |
| General Trias | brows General Trias, eyebrow clinic GenTri, aesthetic clinic General Trias |
| Kawit | brows Kawit, eyebrow embroidery Kawit, facial near Kawit |
| Cavite City | brows Cavite City, aesthetic clinic Cavite City |
| Province-wide | best brows Cavite, eyebrow clinic Cavite, aesthetic clinic Cavite |

The `/areas/*` pages already target these. Strengthen them over time with real
client photos and town-specific reviews.

---

## Developer to-dos that further help ranking

1. **OG image + favicon** (social CTR + polish) — `SEO-SETUP.md` #3.
2. **GA4 + Search Console** linked, so you can see which town pages rank/convert.
3. **Add client before/after photos** to each `/areas/*` page (unique media per
   page strengthens relevance).
4. **Embed town-specific Google reviews** on each area page once enough reviews
   mention that town.
5. **Page speed**: keep images optimised (already using `next/image`); avoid
   heavy third-party scripts.
6. **Blog/journal route** for ongoing content (biggest long-term organic lever).

---

## How to measure progress

- **Google Search Console → Performance** — track impressions/clicks/position
  per query and per town page.
- **Map Pack rank** — search "brows in <town>" from that town (or use a
  rank-tracker / Google Business Profile insights) to see your map position.
- **GBP Insights** — calls, direction requests, and searches that found you.
- **Reviews** — count + average rating trend (leading indicator of Map Pack rank).

Set a monthly check-in: review Search Console positions, new reviews, and which
town pages are gaining — then double down on what's moving.

---

## Summary of changes made for this roadmap

| File | Change |
|------|--------|
| `lib/areas.ts` | **New** — 6 Cavite towns with unique local content |
| `app/areas/[city]/page.tsx` | **New** — per-town landing page (SEO metadata, schema, FAQ) |
| `app/areas/page.tsx` | **New** — "Areas we serve" index |
| `app/sitemap.ts` | Town pages added to the sitemap |
| `components/Footer.tsx` | "Areas we serve" links on every page |
| `docs/LOCAL-SEO-ROADMAP.md` + `…Road-to-No1-Cavite.pdf` | This roadmap |
