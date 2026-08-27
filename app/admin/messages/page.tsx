"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { useToast } from "@/lib/toast";

type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  source: string | null;
  status: "new" | "in_progress" | "closed";
  created_at: string | null;
};

const STATUSES: Inquiry["status"][] = ["new", "in_progress", "closed"];
const STATUS_STYLE: Record<Inquiry["status"], string> = {
  new: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  closed: "bg-emerald-100 text-emerald-800",
};

export default function AdminMessagesPage() {
  const toast = useToast();
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .list<Inquiry>("contact-inquiries")
      .then((res) => setItems(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  async function setStatus(id: number, status: Inquiry["status"]) {
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    try {
      await adminApi.update("contact-inquiries", id, { status });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Update failed.", "error");
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    try {
      await adminApi.remove("contact-inquiries", id);
      setItems((prev) => prev.filter((m) => m.id !== id));
      toast("Message deleted.");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Delete failed.", "error");
    }
  }

  const unread = items.filter((m) => m.status === "new").length;

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Messages</h1>
          <p className="mt-1 text-sm text-ink-500">
            Inquiries from the website contact form.
            {unread > 0 ? (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                {unread} new
              </span>
            ) : null}
          </p>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl bg-nude-50" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="mt-6 rounded-3xl border border-nude-100 bg-white py-12 text-center text-sm text-ink-400 shadow-sm">
          No messages yet.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((m) => (
            <article
              key={m.id}
              className={`rounded-3xl border bg-white p-5 shadow-sm transition ${
                m.status === "new" ? "border-amber-200" : "border-nude-100"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg text-ink-900">{m.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${STATUS_STYLE[m.status]}`}>
                      {m.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-ink-400">
                    <a href={`mailto:${m.email}`} className="hover:text-terracotta-500">
                      {m.email}
                    </a>
                    {m.phone ? <span>{m.phone}</span> : null}
                    {m.created_at ? (
                      <span>
                        {new Date(m.created_at).toLocaleString("en-PH", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    ) : null}
                  </div>
                </div>
                <select
                  value={m.status}
                  onChange={(e) => setStatus(m.id, e.target.value as Inquiry["status"])}
                  className="rounded-xl border border-nude-200 bg-white px-2 py-1.5 text-sm capitalize focus:border-gold-500 focus:outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              {m.subject ? (
                <div className="mt-3 text-sm font-medium text-ink-800">{m.subject}</div>
              ) : null}
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-ink-600">{m.message}</p>

              <div className="mt-4 flex items-center gap-4 border-t border-nude-100 pt-3">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "Your inquiry"} — Emcey Brows`)}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-700"
                >
                  <i className="pi pi-envelope text-xs" aria-hidden />
                  Reply by email
                </a>
                <button
                  onClick={() => remove(m.id)}
                  className="ml-auto text-xs text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
