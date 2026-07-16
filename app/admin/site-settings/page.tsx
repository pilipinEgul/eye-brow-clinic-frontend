"use client";

import { useEffect, useState, type FormEvent } from "react";
import { adminApi, revalidateSite } from "@/lib/admin-api";
import { useToast } from "@/lib/toast";
import { siteDefaults, type SiteSettings } from "@/lib/site-settings";

export default function AdminSiteSettingsPage() {
  const toast = useToast();
  const [form, setForm] = useState<SiteSettings>(siteDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .getSiteSettings()
      .then((res) => {
        const d = res.data;
        if (!d) return; // never customised — keep defaults
        setForm({
          name: d.name ?? siteDefaults.name,
          shortName: d.shortName ?? siteDefaults.shortName,
          tagline: d.tagline ?? siteDefaults.tagline,
          description: d.description ?? siteDefaults.description,
          address: { ...siteDefaults.address, ...(d.address ?? {}) },
          contact: { ...siteDefaults.contact, ...(d.contact ?? {}) },
          socials: { ...siteDefaults.socials, ...(d.socials ?? {}) },
        });
      })
      .catch(() => toast("Could not load business info.", "error"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateSiteSettings(form);
      await revalidateSite();
      toast("Business info saved.");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save.", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-ink-400">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl">Business Info</h1>
      <p className="mt-1 text-sm text-ink-500">
        Name, address, contact details and social links shown in the site header, footer and contact page.
      </p>

      <form onSubmit={save} className="mt-6 space-y-6">
        <Section title="Brand">
          <Field label="Business name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Short name" value={form.shortName} onChange={(v) => setForm({ ...form, shortName: v })} />
          <Field label="Tagline" value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} span2 />
          <Field
            label="Description"
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
            textarea
            span2
          />
        </Section>

        <Section title="Address">
          <Field
            label="Street"
            value={form.address.street}
            onChange={(v) => setForm({ ...form, address: { ...form.address, street: v } })}
            span2
          />
          <Field
            label="City"
            value={form.address.city}
            onChange={(v) => setForm({ ...form, address: { ...form.address, city: v } })}
          />
          <Field
            label="Region / Province"
            value={form.address.region}
            onChange={(v) => setForm({ ...form, address: { ...form.address, region: v } })}
          />
          <Field
            label="Country"
            value={form.address.country}
            onChange={(v) => setForm({ ...form, address: { ...form.address, country: v } })}
          />
          <Field
            label="Postal code"
            value={form.address.postalCode}
            onChange={(v) => setForm({ ...form, address: { ...form.address, postalCode: v } })}
          />
        </Section>

        <Section title="Contact">
          <Field
            label="Mobile (display)"
            value={form.contact.phone}
            onChange={(v) => setForm({ ...form, contact: { ...form.contact, phone: v } })}
          />
          <Field
            label="Mobile (dial, +63…)"
            value={form.contact.phoneTel}
            onChange={(v) => setForm({ ...form, contact: { ...form.contact, phoneTel: v } })}
          />
          <Field
            label="Landline (display)"
            value={form.contact.landline}
            onChange={(v) => setForm({ ...form, contact: { ...form.contact, landline: v } })}
          />
          <Field
            label="Landline (dial, +63…)"
            value={form.contact.landlineTel}
            onChange={(v) => setForm({ ...form, contact: { ...form.contact, landlineTel: v } })}
          />
          <Field
            label="Email"
            type="email"
            value={form.contact.email}
            onChange={(v) => setForm({ ...form, contact: { ...form.contact, email: v } })}
          />
          <Field
            label="Booking hours"
            value={form.contact.bookingHours}
            onChange={(v) => setForm({ ...form, contact: { ...form.contact, bookingHours: v } })}
          />
        </Section>

        <Section title="Links">
          <Field
            label="Facebook URL"
            value={form.socials.facebook}
            onChange={(v) => setForm({ ...form, socials: { ...form.socials, facebook: v } })}
            span2
          />
          <Field
            label="Instagram URL"
            value={form.socials.instagram}
            onChange={(v) => setForm({ ...form, socials: { ...form.socials, instagram: v } })}
            span2
          />
          <Field
            label="Google Maps URL"
            value={form.socials.googleMaps}
            onChange={(v) => setForm({ ...form, socials: { ...form.socials, googleMaps: v } })}
            span2
          />
        </Section>

        <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
          {saving ? "Saving…" : "Save business info"}
        </button>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-nude-100 bg-white p-6 shadow-sm">
      <h2 className="font-display text-lg">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
  span2 = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  span2?: boolean;
}) {
  const base =
    "mt-1 w-full rounded-2xl border border-nude-200 bg-blush-50/40 px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none";
  return (
    <label className={`block text-sm ${span2 ? "sm:col-span-2" : ""}`}>
      <span className="text-xs uppercase tracking-[0.2em] text-ink-500">{label}</span>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={base} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={base} />
      )}
    </label>
  );
}
