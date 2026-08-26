import { api } from "@/lib/api";

/**
 * Generic editable page content (About, Home extras, Testimonials copy…).
 * A flat key → value map stored in the backend `settings` table and edited from
 * Admin → Page Content. The SCHEMA below drives both the admin editor and the
 * built-in defaults, so any un-edited field keeps its current value.
 */

export type PCFieldType = "text" | "textarea" | "image" | "video";
export type PCField = { key: string; label: string; type: PCFieldType; default: string };
export type PCSection = { title: string; fields: PCField[] };

export const PAGE_CONTENT_SCHEMA: PCSection[] = [
  {
    title: "Home — Hero",
    fields: [
      { key: "home.hero.eyebrow", label: "Eyebrow", type: "text", default: "Imus · Cavite · Philippines" },
      { key: "home.hero.word1", label: "Heading (line 1)", type: "text", default: "Beauty," },
      { key: "home.hero.accent", label: "Heading accent word", type: "text", default: "refined." },
      { key: "home.hero.line2", label: "Heading (line 2)", type: "text", default: "brows that feel like you." },
      {
        key: "home.hero.subtext",
        label: "Sub-text",
        type: "textarea",
        default:
          "From digital nano hair-stroke brows to glow-restoring hydra facials — Emcey Brows blends artistry, premium pigments and a calming studio experience.",
      },
    ],
  },
  {
    title: "Home — Stat card",
    fields: [
      { key: "home.stats.clients", label: "Clients number", type: "text", default: "1,200+" },
      { key: "home.stats.clients_label", label: "Clients label", type: "text", default: "Happy clients" },
      { key: "home.stats.rating", label: "Rating number", type: "text", default: "5.0" },
      { key: "home.stats.rating_label", label: "Rating label", type: "text", default: "Avg rating" },
    ],
  },
  {
    title: "Home — Why Emcey Brows",
    fields: [
      { key: "home.why.title", label: "Title", type: "text", default: "Quietly luxurious. Obsessively detailed." },
      {
        key: "home.why.description",
        label: "Description",
        type: "textarea",
        default:
          "Tiny details make every treatment exceptional — from custom shape mapping to premium pigments and a calming studio atmosphere.",
      },
      { key: "home.why.p1_title", label: "Point 1 title", type: "text", default: "Certified artistry" },
      { key: "home.why.p1_body", label: "Point 1 body", type: "text", default: "Trained in semi-permanent makeup, laser and aesthetic facials." },
      { key: "home.why.p2_title", label: "Point 2 title", type: "text", default: "Premium pigments" },
      { key: "home.why.p2_body", label: "Point 2 body", type: "text", default: "Vegan, hypoallergenic, ophthalmologist tested." },
      { key: "home.why.p3_title", label: "Point 3 title", type: "text", default: "Medical-grade hygiene" },
      { key: "home.why.p3_body", label: "Point 3 body", type: "text", default: "Single-use needles and full sterilisation." },
      { key: "home.why.p4_title", label: "Point 4 title", type: "text", default: "Honest pricing" },
      { key: "home.why.p4_body", label: "Point 4 body", type: "text", default: "Transparent rates, GCash, Maya, Visa, Mastercard, & QRPh friendly." },
    ],
  },
  {
    title: "Home — Real results",
    fields: [
      { key: "home.results.eyebrow", label: "Eyebrow", type: "text", default: "Real results" },
      { key: "home.results.title", label: "Title", type: "text", default: "A natural shape, made for your face." },
      {
        key: "home.results.body",
        label: "Body",
        type: "textarea",
        default:
          "Every brow is mapped to your features — never copied, never forced. The result: defined, balanced brows that look like they grew that way.",
      },
      { key: "home.results.image", label: "Image", type: "image", default: "/images/hero/transformation.jpg" },
    ],
  },
  {
    title: "About — Story",
    fields: [
      { key: "about.story.eyebrow", label: "Eyebrow", type: "text", default: "Our Story" },
      { key: "about.story.title", label: "Title", type: "text", default: "Brows that frame the way you feel." },
      {
        key: "about.story.p1",
        label: "Paragraph 1",
        type: "textarea",
        default:
          "Emcey Brows Aesthetics is a luxury beauty studio in Imus, Cavite. We blend meticulous artistry with a calm, spa-like experience — so every visit feels less like a salon, and more like a moment for you.",
      },
      {
        key: "about.story.p2",
        label: "Paragraph 2",
        type: "textarea",
        default:
          "From the very first consultation to your final glow-up, every detail is intentional — from premium pigments and sterile tools to the playlist softly humming in the background.",
      },
      { key: "about.story.image1", label: "Image 1", type: "image", default: "/images/563602481_24850911971228775_5510725808804128950_n.jpg" },
      { key: "about.story.image2", label: "Image 2", type: "image", default: "/images/566523801_783450497839231_2722606673627068179_n.jpg" },
    ],
  },
  {
    title: "About — Mission / Vision / Promise",
    fields: [
      { key: "about.mvp.mission_title", label: "Mission title", type: "text", default: "Mission" },
      { key: "about.mvp.mission_body", label: "Mission body", type: "textarea", default: "To help every client walk out feeling more confident, more cared for and more themselves than when they walked in." },
      { key: "about.mvp.vision_title", label: "Vision title", type: "text", default: "Vision" },
      { key: "about.mvp.vision_body", label: "Vision body", type: "textarea", default: "To be the most trusted brow and aesthetic studio in the Cavite region — known for our craft and our calm." },
      { key: "about.mvp.promise_title", label: "Promise title", type: "text", default: "Promise" },
      { key: "about.mvp.promise_body", label: "Promise body", type: "textarea", default: "Honest pricing, premium products, single-use tools and a result-first approach. Always." },
    ],
  },
  {
    title: "About — Video",
    fields: [
      { key: "about.video.eyebrow", label: "Eyebrow", type: "text", default: "Inside the studio" },
      { key: "about.video.title", label: "Title", type: "text", default: "A craft you can watch unfold." },
      {
        key: "about.video.body",
        label: "Body",
        type: "textarea",
        default:
          "Every brow, lip and lash session is handled with the same calm focus — from shape mapping to final stroke. Press play for a peek behind the curtain.",
      },
      { key: "about.video.src", label: "Video (mp4/webm/mov)", type: "video", default: "/images/hero/studio-loop-1.mp4" },
    ],
  },
  {
    title: "About — Safety & hygiene",
    fields: [
      { key: "about.safety.eyebrow", label: "Eyebrow", type: "text", default: "Why clients trust us" },
      { key: "about.safety.title", label: "Title", type: "text", default: "Safety & hygiene standards" },
      { key: "about.safety.description", label: "Description", type: "text", default: "Medical-grade hygiene is the floor, not the ceiling." },
      { key: "about.safety.item1", label: "Item 1", type: "text", default: "Single-use sterile needles" },
      { key: "about.safety.item2", label: "Item 2", type: "text", default: "Hospital-grade barriers" },
      { key: "about.safety.item3", label: "Item 3", type: "text", default: "Certified pigment safety" },
      { key: "about.safety.item4", label: "Item 4", type: "text", default: "Transparent aftercare plan" },
    ],
  },
  {
    title: "About — Studio look",
    fields: [
      { key: "about.studio.eyebrow", label: "Eyebrow", type: "text", default: "A look around" },
      { key: "about.studio.title", label: "Title", type: "text", default: "Inside Emcey Brows" },
      { key: "about.studio.description", label: "Description", type: "text", default: "Reception, treatment rooms and storefront — everything where you'll spend your visit." },
      { key: "about.studio.image1", label: "Image 1", type: "image", default: "/images/hero/tile-1.jpg" },
      { key: "about.studio.image2", label: "Image 2", type: "image", default: "/images/706703575_4480213738924616_3954472543166964580_n.jpg" },
      { key: "about.studio.image3", label: "Image 3", type: "image", default: "/images/707012275_1039838768610469_977160467361222562_n.jpg" },
      { key: "about.studio.image4", label: "Image 4", type: "image", default: "/images/hero/storefront-map.jpg" },
    ],
  },
  {
    title: "Testimonials",
    fields: [
      { key: "testimonials.eyebrow", label: "Eyebrow", type: "text", default: "Client Love" },
      { key: "testimonials.title", label: "Title", type: "text", default: "Five-star reviews & stories" },
      { key: "testimonials.description", label: "Description", type: "textarea", default: "From first-time brow clients to long-time aesthetic regulars — here is what they say." },
      { key: "testimonials.image1", label: "Photo 1", type: "image", default: "/images/563379944_1559363695053661_1254350415973776143_n.jpg" },
      { key: "testimonials.image2", label: "Photo 2", type: "image", default: "/images/617573516_900360955780444_8416221202445316314_n.jpg" },
      { key: "testimonials.image3", label: "Photo 3", type: "image", default: "/images/566511023_1146226867043391_5455139529089946125_n.jpg" },
      { key: "testimonials.image4", label: "Photo 4", type: "image", default: "/images/563602481_1526465715026962_3442888535669137838_n.jpg" },
    ],
  },
];

/** Flat key → default value, derived from the schema. */
export const PAGE_DEFAULTS: Record<string, string> = Object.fromEntries(
  PAGE_CONTENT_SCHEMA.flatMap((s) => s.fields.map((f) => [f.key, f.default])),
);

export type PageContent = Record<string, string>;

/** Merge saved overrides over the defaults (blank/missing values keep the default). */
export async function getPageContent(): Promise<PageContent> {
  const { data } = await api.pageContent();
  const merged: PageContent = { ...PAGE_DEFAULTS };
  if (data && typeof data === "object") {
    for (const [k, v] of Object.entries(data)) {
      if (typeof v === "string" && v.trim() !== "") merged[k] = v;
    }
  }
  return merged;
}
