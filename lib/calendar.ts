import { site } from "@/lib/site";

/**
 * Add-to-calendar helpers for a confirmed booking.
 *
 * These need NO Google account, no API key, and no Google Business Profile.
 * - `googleCalendarUrl` builds a calendar.google.com "add event" link. Opening
 *   it drops the event into whichever personal Google account the browser is
 *   signed into — great for testing the flow end-to-end with your own Gmail.
 * - `icsDataUri` builds a downloadable .ics file that works with Google
 *   Calendar, Apple Calendar, Outlook, etc.
 */

export type CalendarEvent = {
  serviceName: string;
  /** ISO-8601 start, e.g. the appointment's `scheduled_at`. */
  startIso: string;
  durationMinutes: number;
  reference?: string | null;
};

const fullAddress = () => {
  const a = site.address;
  return `${site.name}, ${a.street}, ${a.city}, ${a.region}, ${a.country} ${a.postalCode}`;
};

/** UTC timestamp in the `YYYYMMDDTHHMMSSZ` form both Google and ICS expect. */
function toCalStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function bounds(event: CalendarEvent): { start: Date; end: Date } {
  const start = new Date(event.startIso);
  const end = new Date(start.getTime() + event.durationMinutes * 60_000);
  return { start, end };
}

function title(event: CalendarEvent): string {
  return `${event.serviceName} — ${site.shortName}`;
}

function description(event: CalendarEvent): string {
  const lines = [
    `Appointment for ${event.serviceName} at ${site.name}.`,
    event.reference ? `Booking reference: ${event.reference}` : null,
    `Questions? Call ${site.contact.phone}.`,
  ].filter(Boolean);
  return lines.join("\n");
}

export function googleCalendarUrl(event: CalendarEvent): string {
  const { start, end } = bounds(event);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title(event),
    dates: `${toCalStamp(start)}/${toCalStamp(end)}`,
    details: description(event),
    location: fullAddress(),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Escape per RFC 5545 (commas, semicolons, backslashes, newlines). */
function icsEscape(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export function icsContent(event: CalendarEvent): string {
  const { start, end } = bounds(event);
  // Stable UID from the reference (falls back to the start time) so re-importing
  // updates the same event instead of duplicating it.
  const uid = `${event.reference || toCalStamp(start)}@emceybrows`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Emcey Brows//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART:${toCalStamp(start)}`,
    `DTEND:${toCalStamp(end)}`,
    `SUMMARY:${icsEscape(title(event))}`,
    `DESCRIPTION:${icsEscape(description(event))}`,
    `LOCATION:${icsEscape(fullAddress())}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function icsDataUri(event: CalendarEvent): string {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent(event))}`;
}
