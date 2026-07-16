"use client";

import { useEffect, useState, type ReactNode } from "react";
import { adminApi, revalidateSite, uploadImage } from "@/lib/admin-api";
import { useToast } from "@/lib/admin-toast";

export type Field = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "select" | "tags" | "date" | "image";
  options?: { value: string | number; label: string }[];
  required?: boolean;
  placeholder?: string;
  help?: string;
  colSpan?: 1 | 2;
};

export type Column = {
  key: string;
  label: string;
  render?: (row: Record<string, unknown>) => ReactNode;
};

type Props = {
  resource: string;
  title: string;
  subtitle?: string;
  columns: Column[];
  fields: Field[];
};

type Row = Record<string, unknown> & { id: number };

function toFormValue(field: Field, row: Row | null): string | boolean {
  if (!row) return field.type === "checkbox" ? true : "";
  const v = row[field.key];
  if (field.type === "checkbox") return Boolean(v);
  if (field.type === "tags") return Array.isArray(v) ? v.join("\n") : "";
  return v == null ? "" : String(v);
}

export function ResourceManager({ resource, title, subtitle, columns, fields }: Props) {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const singular = title.replace(/s$/, "");

  function load() {
    setLoading(true);
    adminApi
      .list<Row>(resource)
      .then((res) => setItems(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }

  useEffect(load, [resource]);

  function open(row: Row | "new") {
    const source = row === "new" ? null : row;
    const initial: Record<string, string | boolean> = {};
    for (const f of fields) initial[f.key] = toFormValue(f, source);
    setForm(initial);
    setEditing(row);
    setError(null);
  }

  function buildPayload(): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = form[f.key];
      if (f.type === "checkbox") {
        payload[f.key] = Boolean(raw);
      } else if (f.type === "tags") {
        const arr = String(raw)
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        payload[f.key] = arr;
      } else if (f.type === "number") {
        // Omit empty numbers entirely — sending null would violate NOT NULL
        // columns like sort_order (which have DB defaults instead).
        if (raw === "" || raw === null || raw === undefined) continue;
        payload[f.key] = Number(raw);
      } else {
        payload[f.key] = raw === "" ? null : raw;
      }
    }
    return payload;
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const payload = buildPayload();
      const isNew = editing === "new";
      if (isNew) {
        await adminApi.create(resource, payload);
      } else if (editing) {
        await adminApi.update(resource, editing.id, payload);
      }
      await revalidateSite();
      setEditing(null);
      load();
      toast(`${singular} ${isNew ? "created" : "updated"}.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed.";
      setError(message);
      toast(message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(row: Row) {
    if (!confirm(`Delete this ${singular.toLowerCase()}?`)) return;
    try {
      await adminApi.remove(resource, row.id);
      setItems((prev) => prev.filter((r) => r.id !== row.id));
      await revalidateSite();
      toast(`${singular} deleted.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed.";
      setError(message);
      toast(message, "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-ink-500">{subtitle}</p> : null}
        </div>
        <button onClick={() => open("new")} className="btn btn-primary whitespace-nowrap">
          + New
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      {editing !== null ? (
        <div className="mt-6 rounded-3xl border border-gold-500/30 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl">{editing === "new" ? `New ${title.replace(/s$/, "")}` : "Edit"}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.colSpan === 2 || f.type === "textarea" || f.type === "tags" ? "sm:col-span-2" : ""}>
                <label className="block text-sm">
                  <span className="text-xs uppercase tracking-[0.2em] text-ink-500">
                    {f.label}
                    {f.required ? <span className="text-gold-600"> *</span> : null}
                  </span>
                  <FieldInput field={f} value={form[f.key]} onChange={(v) => setForm((p) => ({ ...p, [f.key]: v }))} />
                </label>
                {f.help ? <p className="mt-1 text-xs text-ink-400">{f.help}</p> : null}
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <button onClick={save} disabled={saving} className="btn btn-primary disabled:opacity-60">
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setEditing(null)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-3xl border border-nude-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-nude-100 text-left text-xs uppercase tracking-wider text-ink-400">
              {columns.map((c) => (
                <th key={c.key} className="p-4">
                  {c.label}
                </th>
              ))}
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nude-100">
            {items.map((row) => (
              <tr key={row.id}>
                {columns.map((c) => (
                  <td key={c.key} className="p-4 align-top">
                    {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                  </td>
                ))}
                <td className="p-4 text-right whitespace-nowrap">
                  <button onClick={() => open(row)} className="text-xs text-gold-600 hover:text-gold-700">
                    Edit
                  </button>
                  <button onClick={() => remove(row)} className="ml-3 text-xs text-red-600 hover:text-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-ink-400">
                  Nothing here yet. Click “New” to add one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {loading ? <p className="mt-4 text-sm text-ink-400">Loading…</p> : null}
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string | boolean;
  onChange: (v: string | boolean) => void;
}) {
  const base =
    "mt-1 w-full rounded-2xl border border-nude-200 bg-blush-50/40 px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none";

  if (field.type === "checkbox") {
    return (
      <span className="mt-2 flex items-center gap-2">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
        <span className="text-sm text-ink-600">Yes</span>
      </span>
    );
  }
  if (field.type === "textarea" || field.type === "tags") {
    return (
      <textarea
        rows={field.type === "tags" ? 4 : 3}
        value={String(value)}
        placeholder={field.placeholder ?? (field.type === "tags" ? "One item per line" : "")}
        onChange={(e) => onChange(e.target.value)}
        className={base}
      />
    );
  }
  if (field.type === "select") {
    return (
      <select value={String(value)} onChange={(e) => onChange(e.target.value)} className={base}>
        <option value="">—</option>
        {field.options?.map((o) => (
          <option key={o.value} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === "image") {
    return <ImageInput value={String(value)} onChange={(v) => onChange(v)} />;
  }
  return (
    <input
      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
      value={String(value)}
      placeholder={field.placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={base}
    />
  );
}

function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { path } = await uploadImage(file);
      onChange(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mt-1">
      <div className="flex items-center gap-4">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="preview"
            className="h-16 w-16 shrink-0 rounded-xl border border-nude-200 object-cover"
          />
        ) : (
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border border-dashed border-nude-200 text-[10px] text-ink-400">
            No image
          </div>
        )}
        <div className="min-w-0 flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="block w-full text-xs text-ink-600 file:mr-3 file:rounded-full file:border-0 file:bg-nude-100 file:px-3 file:py-1.5 file:text-xs file:text-ink-700 hover:file:bg-nude-200"
          />
          {uploading ? <p className="mt-1 text-xs text-gold-600">Uploading…</p> : null}
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="mt-1 text-xs text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
