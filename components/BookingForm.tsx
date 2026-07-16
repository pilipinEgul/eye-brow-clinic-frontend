"use client";

import { useCallback, useState, type FormEvent } from "react";
import Link from "next/link";
import { api, ApiError, type Service } from "@/lib/api";
import { site } from "@/lib/site";
import { googleCalendarUrl, type CalendarEvent } from "@/lib/calendar";
import { bookingPdfDataUri } from "@/lib/pdf";
import { useToast } from "@/lib/toast";
import { AvailabilityPicker } from "./AvailabilityPicker";

type Props = {
  services: Service[];
  initialServiceSlug?: string;
};

export function BookingForm({ services, initialServiceSlug }: Props) {
  const initial = services.find((s) => s.slug === initialServiceSlug) ?? services[0];
  const [serviceId, setServiceId] = useState<number | undefined>(initial?.id);
  const [slot, setSlot] = useState<{ date: string; time: string } | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [calendarEvent, setCalendarEvent] = useState<CalendarEvent | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const toast = useToast();

  const handleSlot = useCallback((next: { date: string; time: string } | null) => {
    setSlot(next);
  }, []);

  if (services.length === 0) {
    return (
      <div className="rounded-3xl border border-nude-100 bg-white p-8 text-sm text-ink-500 shadow-sm">
        Booking is currently unavailable. Please contact us on Facebook to
        schedule your appointment.
      </div>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!serviceId) return;
    if (!slot) {
      setStatus("error");
      setErrorMessage("Please pick a date and time from the calendar.");
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    const fd = new FormData(form);
    const scheduled = `${slot.date}T${slot.time}:00`;

    try {
      const result = (await api.createAppointment({
        service_id: serviceId,
        customer_name: String(fd.get("customer_name") ?? ""),
        customer_email: String(fd.get("customer_email") ?? ""),
        customer_phone: String(fd.get("customer_phone") ?? ""),
        scheduled_at: scheduled,
        notes: String(fd.get("notes") ?? "") || undefined,
        promo_code: String(fd.get("promo_code") ?? "") || undefined,
      })) as {
        data: {
          reference?: string;
          scheduled_at?: string;
          duration_minutes?: number | null;
          service?: { name?: string } | null;
        };
      };

      const booking = result?.data;
      setReference(booking?.reference ?? null);

      const selectedService = services.find((s) => s.id === serviceId);
      if (booking?.scheduled_at) {
        setCalendarEvent({
          serviceName: booking.service?.name ?? selectedService?.name ?? "Appointment",
          startIso: booking.scheduled_at,
          durationMinutes:
            booking.duration_minutes ?? selectedService?.duration_minutes ?? 60,
          reference: booking.reference ?? null,
        });
      } else {
        setCalendarEvent(null);
      }

      setStatus("success");
      setSlot(null);
      form.reset();
      toast(
        booking?.reference
          ? `Booking received — reference ${booking.reference}.`
          : "Booking received.",
      );
    } catch (err) {
      setStatus("error");
      const message =
        err instanceof ApiError && err.status === 429
          ? "You’ve sent a few booking requests in a short time. Please wait a few minutes and try again."
          : err instanceof Error
            ? err.message
            : "Could not submit your booking.";
      setErrorMessage(message);
      toast(message, "error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-nude-100 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2 font-display text-2xl text-ink-900">
          You’re booked in
          <i className="pi pi-sparkles text-gold-500 text-xl" aria-hidden />
        </div>
        <p className="mt-3 text-sm text-ink-700">
          Booking received{reference ? ` — your reference is ${reference}.` : "."} We’ll confirm shortly via email.
        </p>
        <p className="mt-2 text-sm text-ink-700">
          You can{" "}
          <Link
            href={reference ? `/track?ref=${encodeURIComponent(reference)}` : "/track"}
            className="font-medium text-gold-600 underline hover:text-gold-700"
          >
            track or cancel your booking
          </Link>{" "}
          anytime using your reference.
        </p>

        {calendarEvent ? (
          <>
            <p className="mt-5 text-sm text-ink-700">Add it to your calendar so you don’t forget:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={googleCalendarUrl(calendarEvent)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary !min-h-0 !px-4 !py-2 !text-xs"
              >
                Add to Google Calendar
              </a>
              <a
                href={bookingPdfDataUri(calendarEvent)}
                download={`emcey-brows-booking${reference ? `-${reference}` : ""}.pdf`}
                className="btn btn-secondary !min-h-0 !px-4 !py-2 !text-xs"
              >
                Download PDF
              </a>
            </div>
          </>
        ) : null}

        <p className="mt-5 text-sm text-ink-700">
          Already a returning client? Share your experience and help others find us:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={site.socials.googleReview}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary !min-h-0 !px-4 !py-2 !text-xs"
          >
            Leave a Google review
          </a>
          <a
            href={site.socials.googleMaps}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary !min-h-0 !px-4 !py-2 !text-xs"
          >
            See us on Google Maps
          </a>
        </div>

        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setReference(null);
            setCalendarEvent(null);
          }}
          className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-gold-600 hover:text-gold-700"
        >
          <i className="pi pi-arrow-left text-[0.7rem]" aria-hidden />
          Book another appointment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-nude-100 bg-white p-8 shadow-sm">
      <div className="font-display text-2xl text-ink-900">Book your appointment</div>
      <p className="mt-2 text-sm text-ink-500">
        Pick a service, then choose an open day and slot. We confirm via email
        and SMS within the day.
      </p>

      <label className="mt-6 block">
        <span className="block text-xs uppercase tracking-[0.25em] text-ink-500">Service *</span>
        <select
          required
          value={serviceId}
          onChange={(e) => {
            setServiceId(Number(e.target.value));
            setSlot(null);
          }}
          className="mt-2 w-full rounded-2xl border border-nude-200 bg-blush-50/40 px-4 py-3 text-sm text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
        >
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
              {s.duration_minutes ? ` — ${s.duration_minutes} min` : ""}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-5">
        <span className="block text-xs uppercase tracking-[0.25em] text-ink-500">
          Pick a date and time *
        </span>
        <div className="mt-2">
          <AvailabilityPicker serviceId={serviceId} onChange={handleSlot} />
        </div>
        {slot ? (
          <p className="mt-3 text-sm text-ink-700">
            Selected:{" "}
            <span className="font-medium text-gold-600">
              {new Date(`${slot.date}T${slot.time}:00`).toLocaleString("en-PH", {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="customer_name" required />
        <Field label="Email" name="customer_email" type="email" required />
        <Field label="Phone" name="customer_phone" type="tel" required />
        <Field label="Promo code" name="promo_code" />
      </div>

      <label className="mt-4 block">
        <span className="block text-xs uppercase tracking-[0.25em] text-ink-500">Notes</span>
        <textarea
          name="notes"
          rows={3}
          className="mt-2 w-full rounded-2xl border border-nude-200 bg-blush-50/40 px-4 py-3 text-sm text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
        />
      </label>

      <button
        type="submit"
        disabled={status === "submitting" || !slot}
        className="btn btn-primary mt-6 w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Submitting…" : "Request appointment"}
      </button>

      {status === "error" ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage ?? "Could not submit your booking. Please try a different time slot."}
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
