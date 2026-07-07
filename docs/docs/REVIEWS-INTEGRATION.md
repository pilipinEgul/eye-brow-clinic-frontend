# Connecting Reviews to Google Maps & Facebook

This guide explains how client reviews work on the Emcey Brows site and how to
connect them to your **Google Maps** listing and **Facebook** page.

There are three layers, from simplest to most advanced:

| Layer | What it does | Effort | Cost |
|-------|--------------|--------|------|
| 1. Link-out buttons ✅ *(done)* | Buttons that open your Google/Facebook review pages | None — just set 3 URLs | Free |
| 2. Manual testimonials | Curated quotes shown on the site, entered in the admin | Copy/paste per review | Free |
| 3. Live Google pull ✅ *(built)* | Auto-displays real Google reviews on the page | Just add a Google API key | Google billing (small) |

> **TL;DR for the owner:** Layers 1 and 3 are **both built and in the code**.
> To switch Layer 3 **on**, you only need to (a) create a Google API key and
> (b) paste it into `.env` as `GOOGLE_PLACES_API_KEY` — see Section 4. Until a
> key is present, the page automatically falls back to the link-out buttons.
> Facebook **cannot** be auto-pulled (Section 5) — use the link-out button for it.

---

## 1. Link-out buttons (already live)

On the **Testimonials** page there is now a "reviews" block with four buttons:

- ★ **Read Google reviews** → opens your Google Maps listing
- **Write a Google review** → opens Google's "write a review" dialog
- **Read Facebook reviews** → opens your Facebook page's Reviews tab
- **Recommend us on Facebook** → opens your Facebook page

These are plain links — no API keys, no external calls, nothing to maintain.
They are driven by four values in [`lib/site.ts`](../lib/site.ts) under
`socials`:

```ts
socials: {
  facebook:        "...",        // your Facebook page
  facebookReviews: ".../reviews", // Reviews/Recommendations tab
  googleMaps:      "...",        // Google Maps listing (read reviews)
  googleReview:    "...",        // Google "write a review" deep link
}
```

The same buttons/links are also reused on the Home, Contact, Booking, and
Floating-CTA components, so updating `site.ts` updates them everywhere.

### Implementation files
- `components/ReviewLinks.tsx` — the two-card block (Google + Facebook)
- `app/testimonials/page.tsx` — renders `<ReviewLinks />` below the testimonials
- `lib/site.ts` — the four URLs above

### Overriding the URLs without editing code
Set these in `.env` (see `.env.example`). They fall back to the values baked
into `site.ts` if left blank:

```env
NEXT_PUBLIC_FACEBOOK_URL=https://www.facebook.com/YourPageName
NEXT_PUBLIC_FACEBOOK_REVIEWS_URL=https://www.facebook.com/YourPageName/reviews
```

---

## 2. Where the URLs come from (do this once)

### 2a. Google — find your Place ID, Maps link, and review link

1. Go to <https://developers.google.com/maps/documentation/places/web-service/place-id>
   and search for **"Emcey Brows Aesthetics – Imus"**. Copy the **Place ID**
   (looks like `ChIJ_x9hcQDTlzMR5JsBByxQ79o` — this one is already in `site.ts`).
2. **Maps listing link** (`googleMaps`): on Google Maps, open your business →
   **Share** → **Copy link**.
3. **Write-a-review link** (`googleReview`): use this exact pattern with your
   Place ID:
   ```
   https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID
   ```

> ✅ The current `site.ts` already has the correct Place ID for Emcey Brows. You
> only need to redo this if the business listing changes.

### 2b. Facebook — find your Reviews URL

1. Open your Facebook **Page** (not a personal profile).
2. The reviews live at `https://www.facebook.com/<YourPageName>/reviews`.
3. Make sure reviews are **turned on**: Page → **Settings** → **Privacy** →
   **Page and tagging** (or **Templates and tabs** → enable the **Reviews** tab).

⚠️ The default Facebook URL in this project is the placeholder
`https://www.facebook.com/`. **Replace it** with your real page via
`NEXT_PUBLIC_FACEBOOK_URL` (and `NEXT_PUBLIC_FACEBOOK_REVIEWS_URL` if your
reviews tab uses a custom path).

---

## 3. Manual testimonials (curated quotes)

The grid of quote cards on the Testimonials page comes from your **backend
API** (`api.testimonials()` → Laravel backend), not from Google/Facebook. This
is the recommended way to feature your *best* reviews with full control over
wording and which service each is tagged to.

**Workflow:** when a client leaves a great Google/Facebook review, copy the
text into the admin as a new testimonial (name, rating, quote, optional
service). It then appears in the homepage slider and the testimonials grid.

This keeps you compliant — you're manually curating, not scraping — and avoids
the API limits described below.

---

## 4. Live Google reviews on the page (BUILT — just add a key)

The site **already auto-pulls** real Google reviews using the **Places API
(New)** and renders them on the Testimonials page (rating summary + review
cards with author photos, star ratings, and the Google logo). It is **dormant
until you provide an API key** — with no key, the component renders nothing and
the link-out buttons (Section 1) stay as the fallback.

**Implementation files (already in the repo):**
- `lib/google-reviews.ts` — server-side fetch, typed, cached 24h, fails safe to empty
- `components/GoogleReviews.tsx` — async server component that renders the reviews
- `app/testimonials/page.tsx` — renders `<GoogleReviews />` above the link-out block
- `site.placeId` in `lib/site.ts` — the Emcey Brows Place ID, already set

### How to turn it ON (one-time, ~10 min)
1. **Google Cloud Console** → create/select a project → **Enable APIs &
   Services** → enable **"Places API (New)"** → enable **Billing** on the
   project (a card is required even though small usage is free).
2. **APIs & Services → Credentials → Create credentials → API key.**
   - Click **Edit** on the key → **API restrictions** → restrict to
     **Places API (New)**.
   - Optionally restrict by your server's IP. (The key is used **server-side
     only** and never sent to the browser, because the env var has **no**
     `NEXT_PUBLIC_` prefix.)
3. Add the key to `.env` (and your hosting provider's env settings):
   ```env
   GOOGLE_PLACES_API_KEY=AIza...
   ```
4. Restart / redeploy. Done — live reviews appear automatically.

### How to turn it OFF
Delete or blank out `GOOGLE_PLACES_API_KEY`. The page reverts to link-out
buttons only. No code change needed.

### Limits & rules to know
- The API returns at most **5 reviews**, and **Google chooses which 5** and
  their order — you can't display "all" reviews or pick favourites. (Use Layer 2
  manual testimonials to feature specific ones.)
- Reviews must be shown **unmodified, with attribution and the Google logo** —
  the built component already does this. Don't edit review text.
- We **cache for 24h** (`next: { revalidate: 86400 }` in `lib/google-reviews.ts`)
  to respect quotas and Google's "refresh at least every 30 days" rule. Adjust
  that number if you want fresher/cheaper.
- Do **not** copy the Google star rating into the page's structured-data
  (`lib/schemas.ts`) `aggregateRating` — Google's rich-results policy forbids
  self-serving aggregate ratings sourced from Google itself.

### How to verify it's working
- With the key set, load `/testimonials` — you should see a "Verified Google
  reviews" header with your star average and review cards.
- If nothing shows: check the server logs for a non-200 from
  `places.googleapis.com` (usually billing not enabled, API not enabled, or the
  key restricted too tightly), and confirm `site.placeId` matches your listing.

---

## 5. Why we don't auto-pull Facebook reviews

Facebook (Meta) **locked down** programmatic access to page reviews /
recommendations:

- The old `/ratings` Graph API edge was **deprecated**.
- Any remaining access requires a **Facebook App**, **Business Verification**,
  the **Page Public Content Access** feature (subject to App Review), and a
  long-lived Page access token.
- This is heavy, frequently rejected, and breaks when tokens expire.

**Recommendation:** for Facebook, use the **link-out button** (Layer 1) and
**manually feature** standout recommendations as testimonials (Layer 3). That's
the realistic, durable approach.

---

## Summary of what was changed for this feature

| File | Change |
|------|--------|
| `lib/site.ts` | Added `socials.facebookReviews`; documented `googleMaps`/`googleReview` |
| `components/ReviewLinks.tsx` | **New** — Google + Facebook review CTA (link-out) block |
| `lib/google-reviews.ts` | **New** — server-side Places API (New) fetcher, cached 24h |
| `components/GoogleReviews.tsx` | **New** — renders live, auto-pulled Google reviews |
| `app/testimonials/page.tsx` | Renders `<GoogleReviews />` + `<ReviewLinks />` |
| `.env.example` | Added `NEXT_PUBLIC_FACEBOOK_REVIEWS_URL` + `GOOGLE_PLACES_API_KEY` |

**To finish setup:**
1. **Google auto-pull:** add `GOOGLE_PLACES_API_KEY` to `.env` (Section 4) — that
   alone switches live reviews on.
2. **Facebook:** already pointed at your real page; it stays link-out only
   (Section 5).
