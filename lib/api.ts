const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export type ApiCollection<T> = {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type ApiResource<T> = { data: T };

export type ServiceCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
};

export type Service = {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: string | null;
  promo_price: string | null;
  duration_minutes: number | null;
  cover_image: string | null;
  gallery: string[] | null;
  benefits: string[] | null;
  process_steps: string[] | null;
  aftercare: string[] | null;
  meta: { title: string | null; description: string | null; keywords: string | null };
  is_featured: boolean;
  category?: ServiceCategory | null;
  faqs?: Faq[];
  testimonials?: Testimonial[];
  gallery_images?: GalleryImage[];
};

export type Testimonial = {
  id: number;
  client_name: string;
  client_title: string | null;
  client_avatar: string | null;
  quote: string;
  rating: number;
  source: string | null;
  video_url: string | null;
  is_featured: boolean;
  service?: { id: number; name: string; slug: string } | null;
};

export type Faq = {
  id: number;
  category: string | null;
  question: string;
  answer: string;
  sort_order: number;
  service_id: number | null;
};

export type GalleryImage = {
  id: number;
  category: string | null;
  title: string | null;
  alt_text: string | null;
  image_path: string;
  before_image_path: string | null;
  after_image_path: string | null;
  is_featured: boolean;
  service?: { id: number; name: string; slug: string } | null;
};

export type AvailabilitySlot = {
  time: string;
  available: boolean;
};

export type AvailabilityDay = {
  date: string;
  weekday: string;
  is_closed: boolean;
  is_past: boolean;
  available_count: number;
  total_slots: number;
  slots: AvailabilitySlot[];
};

export type Promo = {
  id: number;
  code: string;
  title: string;
  description: string | null;
  type: "percentage" | "fixed";
  value: string;
  minimum_amount: string | null;
  cover_image: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_featured: boolean;
};

type FetchOptions = RequestInit & { revalidate?: number };

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
    this.name = "ApiError";
  }
}

async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { revalidate = 60, ...init } = opts;
  const url = `${API_BASE}${path}`;

  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
      next: { revalidate },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let body: unknown = text;
      let message = `Request failed (${res.status})`;
      try {
        const parsed = JSON.parse(text);
        body = parsed;
        if (parsed && typeof parsed === "object") {
          const obj = parsed as { message?: string; errors?: Record<string, string[]> };
          if (obj.message) message = obj.message;
          if (obj.errors) {
            const first = Object.values(obj.errors)[0]?.[0];
            if (first) message = first;
          }
        }
      } catch {
        // not JSON — keep generic message
      }
      throw new ApiError(message, res.status, body);
    }

    return (await res.json()) as T;
  } catch (err) {
    console.error(`[api] ${url}`, err);
    throw err;
  }
}

function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  return promise.catch(() => fallback);
}

const EMPTY_COLLECTION = <T,>(): ApiCollection<T> => ({ data: [] });

export const api = {
  serviceCategories: () =>
    safe(apiFetch<ApiCollection<ServiceCategory>>("/service-categories"), EMPTY_COLLECTION()),

  services: (params: { featured?: boolean; category?: string; per_page?: number } = {}) => {
    const search = new URLSearchParams();
    if (params.featured) search.set("featured", "1");
    if (params.category) search.set("category", params.category);
    if (params.per_page) search.set("per_page", String(params.per_page));
    const q = search.toString();
    return safe(
      apiFetch<ApiCollection<Service>>(`/services${q ? `?${q}` : ""}`),
      EMPTY_COLLECTION(),
    );
  },

  service: (slug: string) =>
    safe(apiFetch<ApiResource<Service>>(`/services/${slug}`), { data: null as unknown as Service }),

  testimonials: (params: { featured?: boolean; per_page?: number } = {}) => {
    const search = new URLSearchParams();
    if (params.featured) search.set("featured", "1");
    if (params.per_page) search.set("per_page", String(params.per_page));
    const q = search.toString();
    return safe(
      apiFetch<ApiCollection<Testimonial>>(`/testimonials${q ? `?${q}` : ""}`),
      EMPTY_COLLECTION(),
    );
  },

  faqs: (params: { service_id?: number; general?: boolean } = {}) => {
    const search = new URLSearchParams();
    if (params.service_id) search.set("service_id", String(params.service_id));
    if (params.general) search.set("general", "1");
    const q = search.toString();
    return safe(apiFetch<ApiCollection<Faq>>(`/faqs${q ? `?${q}` : ""}`), EMPTY_COLLECTION());
  },

  gallery: (params: { category?: string; service?: string; per_page?: number } = {}) => {
    const search = new URLSearchParams();
    if (params.category) search.set("category", params.category);
    if (params.service) search.set("service", params.service);
    if (params.per_page) search.set("per_page", String(params.per_page));
    const q = search.toString();
    return safe(
      apiFetch<ApiCollection<GalleryImage>>(`/gallery${q ? `?${q}` : ""}`),
      EMPTY_COLLECTION(),
    );
  },

  promos: (params: { featured?: boolean } = {}) => {
    const search = new URLSearchParams();
    if (params.featured) search.set("featured", "1");
    const q = search.toString();
    return safe(apiFetch<ApiCollection<Promo>>(`/promos${q ? `?${q}` : ""}`), EMPTY_COLLECTION());
  },

  availabilityRange: (params: { service_id: number; from?: string; days?: number }) => {
    const search = new URLSearchParams();
    search.set("service_id", String(params.service_id));
    if (params.from) search.set("from", params.from);
    if (params.days) search.set("days", String(params.days));
    return apiFetch<{
      data: {
        service_id: number;
        duration_minutes: number | null;
        open_hour: number;
        close_hour: number;
        closed_weekdays: number[];
        days: AvailabilityDay[];
      };
    }>(`/appointments/availability/range?${search.toString()}`, { revalidate: 30 });
  },

  createAppointment: (body: {
    service_id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    scheduled_at: string;
    notes?: string;
    promo_code?: string;
  }) =>
    apiFetch<ApiResource<unknown>>("/appointments", {
      method: "POST",
      body: JSON.stringify(body),
      revalidate: 0,
    }),

  createInquiry: (body: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    source?: string;
  }) =>
    apiFetch<{ data: { id: number; message: string } }>("/contact", {
      method: "POST",
      body: JSON.stringify(body),
      revalidate: 0,
    }),
};
