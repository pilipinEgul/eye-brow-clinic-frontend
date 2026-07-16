const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

const TOKEN_KEY = "emcey_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

export class AdminApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.body = body;
  }
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/admin${path}`, {
    ...opts,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });

  // Session expired / not authenticated → bounce to login (except on login).
  if (res.status === 401 && !path.startsWith("/login")) {
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/admin/login";
    throw new AdminApiError("Session expired.", 401, null);
  }

  const text = await res.text();
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    // keep raw text
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    if (body && typeof body === "object") {
      const obj = body as { message?: string; errors?: Record<string, string[]> };
      if (obj.errors) {
        const first = Object.values(obj.errors)[0]?.[0];
        if (first) message = first;
      } else if (obj.message) {
        message = obj.message;
      }
    }
    throw new AdminApiError(message, res.status, body);
  }

  return body as T;
}

/** Uploads an image file and returns its site-relative path (e.g. /storage/uploads/x.jpg). */
export async function uploadImage(file: File): Promise<{ path: string }> {
  const token = getToken();
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API_BASE}/admin/uploads`, {
    method: "POST",
    // No Content-Type — the browser sets the multipart boundary itself.
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: fd,
  });

  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/admin/login";
    throw new AdminApiError("Session expired.", 401, null);
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (body && typeof body === "object" && (body as { message?: string }).message) ||
      "Upload failed.";
    throw new AdminApiError(message, res.status, body);
  }
  return body as { path: string };
}

/**
 * Tells the public site to refresh its cached content after an admin change,
 * so edits show up immediately instead of after the ISR window. Same-origin,
 * fire-and-forget.
 */
export async function revalidateSite(): Promise<void> {
  try {
    const secret = process.env.NEXT_PUBLIC_REVALIDATE_SECRET;
    await fetch(`/api/revalidate${secret ? `?secret=${encodeURIComponent(secret)}` : ""}`, {
      method: "POST",
    });
  } catch {
    // best-effort — a stale cache will still refresh on its own timer
  }
}

export type AdminUser = { id: number; name: string; email: string };

export const adminApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: AdminUser }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<{ user: AdminUser }>("/me"),
  logout: () => request<{ message: string }>("/logout", { method: "POST" }),
  dashboard: () => request<{ data: DashboardStats }>("/dashboard"),

  // Booking schedule (studio hours + slot interval)
  getSettings: () => request<{ data: BookingSettings }>("/settings"),
  updateSettings: (data: BookingSettings) =>
    request<{ data: BookingSettings }>("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Generic CRUD (resource = "services", "testimonials", …)
  list: <T>(resource: string, query = "") => request<{ data: T[] }>(`/${resource}${query}`),
  create: <T>(resource: string, data: unknown) =>
    request<{ data: T }>(`/${resource}`, { method: "POST", body: JSON.stringify(data) }),
  update: <T>(resource: string, id: number | string, data: unknown) =>
    request<{ data: T }>(`/${resource}/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (resource: string, id: number | string) =>
    request<{ message: string }>(`/${resource}/${id}`, { method: "DELETE" }),
};

export type BookingSettings = {
  open_hour: number;
  close_hour: number;
  slot_interval_minutes: number;
};

export type DashboardStats = {
  appointments: { pending: number; confirmed: number; upcoming: number; total: number };
  services: number;
  testimonials: { published: number; pending: number };
  recent_appointments: Array<{
    id: number;
    reference: string;
    customer_name: string;
    scheduled_at: string;
    status: string;
    service?: { name: string } | null;
  }>;
};
