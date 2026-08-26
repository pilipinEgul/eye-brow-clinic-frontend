"use client";

import { useEffect, useState } from "react";
import { adminApi, revalidateSite, uploadImage, uploadVideo } from "@/lib/admin-api";
import { useToast } from "@/lib/toast";
import { PAGE_CONTENT_SCHEMA, PAGE_DEFAULTS, type PCField } from "@/lib/page-content";

export default function AdminPageContentPage() {
  const toast = useToast();
  const [values, setValues] = useState<Record<string, string>>(PAGE_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .getPageContent()
      .then((res) => {
        const stored = res.data || {};
        setValues({ ...PAGE_DEFAULTS, ...stored });
      })
      .catch(() => toast("Could not load page content.", "error"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set(key: string, v: string) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function save() {
    setSaving(true);
    try {
      await adminApi.updatePageContent(values);
      await revalidateSite();
      toast("Page content saved.");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save.", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-ink-400">Loading…</p>;

  return (
    <div className="max-w-3xl pb-24">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Page Content</h1>
          <p className="mt-1 text-sm text-ink-500">
            Edit the text and images across the site. Blank fields fall back to the built-in default.
          </p>
        </div>
        <button onClick={save} disabled={saving} className="btn btn-primary whitespace-nowrap disabled:opacity-60">
          {saving ? "Saving…" : "Save all"}
        </button>
      </div>

      <div className="mt-6 space-y-6">
        {PAGE_CONTENT_SCHEMA.map((section) => (
          <div key={section.title} className="rounded-3xl border border-nude-100 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg">{section.title}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {section.fields.map((f) => (
                <FieldInput
                  key={f.key}
                  field={f}
                  value={values[f.key] ?? ""}
                  onChange={(v) => set(f.key, v)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button onClick={save} disabled={saving} className="btn btn-primary disabled:opacity-60">
          {saving ? "Saving…" : "Save all"}
        </button>
      </div>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: PCField;
  value: string;
  onChange: (v: string) => void;
}) {
  const base =
    "mt-1 w-full rounded-2xl border border-nude-200 bg-blush-50/40 px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none";
  const wide = field.type === "textarea" || field.type === "image" || field.type === "video";

  return (
    <label className={`block text-sm ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-xs uppercase tracking-[0.2em] text-ink-500">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={base} />
      ) : field.type === "image" ? (
        <ImageField value={value} onChange={onChange} />
      ) : field.type === "video" ? (
        <VideoField value={value} onChange={onChange} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={base} />
      )}
    </label>
  );
}

function VideoField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { path } = await uploadVideo(file);
      onChange(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mt-1">
      {value ? (
        <video
          src={value}
          className="mb-2 aspect-video w-full max-w-xs rounded-xl border border-nude-200 object-cover"
          muted
          loop
          playsInline
          controls
        />
      ) : null}
      <input
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="block w-full text-xs text-ink-600 file:mr-3 file:rounded-full file:border-0 file:bg-nude-100 file:px-3 file:py-1.5 file:text-xs file:text-ink-700 hover:file:bg-nude-200"
      />
      {uploading ? <p className="mt-1 text-xs text-gold-600">Uploading…</p> : null}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
      <p className="mt-1 text-xs text-ink-400">MP4/WebM/MOV, up to 50 MB.</p>
    </div>
  );
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
    <div className="mt-1 flex items-center gap-4">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="preview" className="h-16 w-16 shrink-0 rounded-xl border border-nude-200 object-cover" />
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
        {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
