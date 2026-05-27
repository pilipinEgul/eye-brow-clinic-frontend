"use client";

import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");
    setErrorMessage(null);

    const formData = new FormData(form);
    const body = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? "") || undefined,
      subject: String(formData.get("subject") ?? "") || undefined,
      message: String(formData.get("message") ?? ""),
      source: "website",
    };

    try {
      await api.createInquiry(body);
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-nude-100 bg-white p-8 shadow-sm"
    >
      <div className="font-display text-2xl text-ink-900">Send us a message</div>
      <p className="mt-2 text-sm text-ink-500">
        Tell us a little about you and the look you’re hoping for.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" />
        <Field label="Subject" name="subject" />
      </div>

      <div className="mt-4">
        <label className="block text-xs uppercase tracking-[0.25em] text-ink-500">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="mt-2 w-full rounded-2xl border border-nude-200 bg-blush-50/40 px-4 py-3 text-sm text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn btn-primary mt-6 w-full sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>

      {status === "success" ? (
        <p className="mt-4 rounded-2xl bg-blush-100 px-4 py-3 text-sm text-ink-700">
          Thank you — we’ve received your message and will reply soon.
        </p>
      ) : null}

      {status === "error" ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage ?? "Could not send your message. Please try again or message us on Facebook."}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.25em] text-ink-500">
        {label}
        {required ? <span className="text-gold-600"> *</span> : null}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="mt-2 w-full rounded-2xl border border-nude-200 bg-blush-50/40 px-4 py-3 text-sm text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
      />
    </label>
  );
}
