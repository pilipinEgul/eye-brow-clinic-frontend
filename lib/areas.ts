import { site } from "./site";

/**
 * Local SEO landing pages — one per Cavite town we serve. Each entry has
 * unique copy (no duplicated boilerplate) so Google treats every page as
 * distinct, location-specific content. This is the main on-page lever for
 * ranking across the whole province rather than just "Imus".
 *
 * Add or edit towns here; routes, the /areas index, and the sitemap all read
 * from this list automatically.
 */
export type Area = {
  slug: string;
  /** City/municipality name as people search it. */
  name: string;
  /** Short proximity line shown under the H1. */
  proximity: string;
  /** Unique intro paragraph — keep each one genuinely different. */
  intro: string;
  /** Why-local-clients-choose-us paragraph — also unique per town. */
  why: string;
  /** Recognisable barangays / landmarks woven in for natural local relevance. */
  landmarks: string[];
  /** Honest travel note from this town to the Imus studio. */
  travel: string;
};

export const areas: Area[] = [
  {
    slug: "imus",
    name: "Imus",
    proximity: "Our home studio · Anabu-1D, Aguinaldo Highway",
    intro:
      "Emcey Brows Aesthetics is right here in Imus, on the 2nd floor of the Brigitte Optical Center along Aguinaldo Highway in Anabu-1D. As the city's home for ombre microshading, nano hair-stroke brows and luxury aesthetic treatments, we've become a trusted name for Imuseños who want natural-looking, lasting results.",
    why:
      "Being based in Imus means easy walk-in consultations, flexible scheduling around your day, and a studio your neighbours already know and review. Most of our regular clients are from right around Aguinaldo Highway, Bayan, and the surrounding subdivisions.",
    landmarks: ["Anabu", "Bayan / Poblacion", "Bucandala", "Pag-asa", "Aguinaldo Highway"],
    travel:
      "You're already in our city — find us on the 2nd floor of Brigitte Optical Center, Piazza Bellissima, Anabu-1D.",
  },
  {
    slug: "bacoor",
    name: "Bacoor",
    proximity: "≈ 15–25 min from Bacoor via Aguinaldo Highway / Daang Hari",
    intro:
      "Looking for premium brows and aesthetic treatments near Bacoor? Emcey Brows Aesthetics is a short drive down Aguinaldo Highway in neighbouring Imus — close enough for Bacoor clients to pop over for ombre brows, lip blushing, Korean lashliner or a hydra facial without the Manila traffic.",
    why:
      "Bacoor clients choose us because we deliver Metro-Manila-level artistry minutes from home, at Cavite prices. Whether you're coming from Molino, Salinas or Talaba, the trip is quick and the results last.",
    landmarks: ["Molino", "Salinas", "Talaba", "Daang Hari", "SM Bacoor"],
    travel:
      "From Bacoor, take Aguinaldo Highway or Daang Hari toward Imus — we're in Anabu-1D, roughly 15–25 minutes depending on which barangay you start from.",
  },
  {
    slug: "dasmarinas",
    name: "Dasmariñas",
    proximity: "≈ 20–30 min from Dasmariñas via Aguinaldo Highway",
    intro:
      "Dasmariñas clients don't need to travel far for expert brow embroidery and skin treatments. Emcey Brows Aesthetics sits just up Aguinaldo Highway in Imus, offering digital combination brows, lip tinting, facials and laser treatments in a calm, hygienic studio.",
    why:
      "From Dasma — whether Salawag, Burol or the Pala-pala area — we're an easy, traffic-light ride. Clients come to us for the natural finish on brows and the medical-grade hygiene standards they can't always find closer to home.",
    landmarks: ["Salawag", "Burol", "Pala-pala", "Paliparan", "Aguinaldo Highway"],
    travel:
      "From Dasmariñas, head north on Aguinaldo Highway toward Imus — the studio is in Anabu-1D, about 20–30 minutes away.",
  },
  {
    slug: "general-trias",
    name: "General Trias",
    proximity: "≈ 25–35 min from General Trias",
    intro:
      "For General Trias residents wanting standout brows or glowing skin, Emcey Brows Aesthetics in Imus is well worth the short trip. We specialise in ombre microshading, nano hair strokes, Korean lashliner and a full menu of facials and laser treatments.",
    why:
      "GenTri clients tell us the drive is easy and the results speak for themselves — defined, natural brows and skin treatments performed with single-use needles and sterilised tools every time.",
    landmarks: ["Manggahan", "Tejero", "Pinagtipunan", "Governor's Drive", "Arnaldo Highway"],
    travel:
      "From General Trias, follow Governor's Drive then Aguinaldo Highway toward Imus (Anabu-1D) — usually 25–35 minutes.",
  },
  {
    slug: "kawit",
    name: "Kawit",
    proximity: "≈ 15–25 min from Kawit",
    intro:
      "Kawit clients are just minutes from Emcey Brows Aesthetics in Imus. From historic Kawit, it's a quick drive to our Anabu-1D studio for semi-permanent brows, lip blushing, lashliner, and rejuvenating facial and laser treatments.",
    why:
      "Clients from Kawit, Binakayan and Tabon appreciate how close we are and how natural the brow work looks — no harsh, blocky shading, just soft, lasting definition tailored to your face.",
    landmarks: ["Binakayan", "Tabon", "Poblacion", "Centennial Road"],
    travel:
      "From Kawit, take Centennial Road / Aguinaldo Highway toward Imus — the studio in Anabu-1D is about 15–25 minutes away.",
  },
  {
    slug: "cavite-city",
    name: "Cavite City",
    proximity: "≈ 30–40 min from Cavite City",
    intro:
      "Cavite City clients looking for trusted brow artistry and aesthetic care will find it at Emcey Brows Aesthetics in Imus. We offer ombre and combination brows, lip tinting, Korean lashliner, hydra facials and laser services in one luxury studio.",
    why:
      "It's a scenic ride down from the peninsula, and Cavite City clients make it part of a treat-yourself day. They keep coming back for the artistry, the cleanliness, and brows that still look great months later.",
    landmarks: ["San Roque", "Caridad", "Dalahican", "Coastal Road"],
    travel:
      "From Cavite City, follow the Coastal Road / Aguinaldo Highway toward Imus (Anabu-1D) — typically 30–40 minutes.",
  },
];

export function getArea(slug: string) {
  return areas.find((a) => a.slug === slug);
}

/** Absolute URL for an area page. */
export function areaUrl(slug: string) {
  return `${site.url}/areas/${slug}`;
}
