export const site = {
  name: "Emcey Brows Aesthetics",
  shortName: "Emcey Brows",
  tagline: "Luxury Brows & Aesthetic Services in Imus, Cavite",
  description:
    "Emcey Brows Aesthetics is a luxury beauty studio in Imus, Cavite, specialising in ombre microshading, digital nano hair-stroke brows, lip tinting, Korean lashliner, hydra facials and laser treatments.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "en_PH",
  address: {
    street:
      "2nd Floor Brigitte Optical Center Commercial Building, Block 2 Lot 14 Piazza Bellissima, Anabu-1D Aguinaldo Highway",
    city: "Imus",
    region: "Cavite",
    country: "Philippines",
    postalCode: "4102",
  },
  contact: {
    phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "09215083422",
    phoneTel: "+639215083422",
    landline: process.env.NEXT_PUBLIC_LANDLINE_NUMBER || "(046) 436 6941",
    landlineTel: "+63464366941",
    email: "hello@emceybrows.com",
    bookingHours: "Mon – Sat · 9:00 AM – 6:00 PM",
  },
  socials: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/",
    // Public "Reviews" / "Recommendations" tab of the Facebook Page.
    facebookReviews:
      process.env.NEXT_PUBLIC_FACEBOOK_REVIEWS_URL ||
      `${process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com"}/reviews`,
    instagram:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/",
    // Public Google Maps listing (read existing reviews here).
    googleMaps:
      "https://www.google.com/maps/place/Emcey+Brows+Aesthetics+-+Imus/@14.3884412,120.9393859,17z/data=!4m7!3m6!1s0x3397d30071611fff:0xdaef502707019be4!8m2!3d14.3884412!4d120.9393859!16s%2Fg%2F11mzt2ws4m",
    // Deep link that opens the "write a review" dialog on Google. Overridable
    // for testing: NEXT_PUBLIC_GOOGLE_REVIEW_URL (full URL) wins; otherwise it
    // is built from NEXT_PUBLIC_GOOGLE_PLACE_ID; otherwise the real Emcey listing.
    googleReview:
      process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ||
      (process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID
        ? `https://search.google.com/local/writereview?placeid=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID}`
        : "https://search.google.com/local/writereview?placeid=ChIJ_x9hcQDTlzMR5JsBBydQ79o"),
  },
  // The env var is only honored if it's a *complete* embed URL. An incomplete
  // value (e.g. the placeholder "https://...maps/embed?pb=" from .env.example)
  // collapses Google's embed to a world view, so we fall through to the working
  // hard-coded fallback whenever the env value looks truncated.
  mapEmbed:
    (() => {
      const fromEnv = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED?.trim() ?? "";
      const looksComplete = fromEnv.includes("pb=!") || fromEnv.includes("output=embed");
      return looksComplete
        ? fromEnv
        : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61875.0!2d120.93938!3d14.38844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d30071611fff:0xdaef502707019be4!2sEmcey+Brows+Aesthetics+-+Imus!5e0!3m2!1sen!2sph!4v0";
    })(),
  geo: { lat: 14.3884412, lng: 120.9393859 },
  placeId: "ChIJ_x9hcQDTlzMR5JsBBydQ79o",
  areasServed: ["Imus", "Bacoor", "Dasmariñas", "General Trias", "Cavite"],
} as const;

export const nav = {
  primary: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
    { label: "Track booking", href: "/track" },
  ],
} as const;
