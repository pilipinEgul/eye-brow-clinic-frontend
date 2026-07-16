import { site } from "@/lib/site";
import type { CalendarEvent } from "@/lib/calendar";

/**
 * Builds a downloadable booking-confirmation PDF for a confirmed appointment.
 *
 * Deliberately dependency-free: it hand-assembles a minimal (PDF 1.4) document
 * so the confirmation card can offer a "Download PDF" the same way it offers a
 * `data:` .ics — no libraries, no server round-trip. Everything is emitted as
 * single-byte ASCII so the xref byte offsets equal string indices.
 */

/** Fold non-ASCII (em dashes, curly quotes, ñ…) down to ASCII so byte offsets stay exact. */
function toAscii(value: string): string {
  return value
    .replace(/[‒-―]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/ñ/g, "n")
    .replace(/Ñ/g, "N")
    .replace(/[^\x20-\x7e]/g, "");
}

/** Escape the three characters that are special inside a PDF literal string. */
function pdfEscape(value: string): string {
  return toAscii(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

const fullAddress = () => {
  const a = site.address;
  return `${a.street}, ${a.city}, ${a.region}, ${a.country} ${a.postalCode}`;
};

function formatWhen(event: CalendarEvent): { date: string; time: string } {
  const start = new Date(event.startIso);
  const end = new Date(start.getTime() + event.durationMinutes * 60_000);
  const date = start.toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const opts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  const time = `${start.toLocaleTimeString("en-PH", opts)} - ${end.toLocaleTimeString("en-PH", opts)}`;
  return { date, time };
}

type Line = { text: string; size: number; bold?: boolean; gap?: number };

function contentStream(event: CalendarEvent): string {
  const { date, time } = formatWhen(event);
  const lines: Line[] = [
    { text: site.name, size: 20, bold: true, gap: 8 },
    { text: "Booking Confirmation", size: 13, gap: 28 },
    { text: "Reference", size: 9, bold: true, gap: 2 },
    { text: event.reference || "—", size: 14, gap: 22 },
    { text: "Service", size: 9, bold: true, gap: 2 },
    { text: event.serviceName, size: 12, gap: 18 },
    { text: "Date", size: 9, bold: true, gap: 2 },
    { text: date, size: 12, gap: 18 },
    { text: "Time", size: 9, bold: true, gap: 2 },
    { text: time, size: 12, gap: 26 },
    { text: "Location", size: 9, bold: true, gap: 2 },
    { text: fullAddress(), size: 11, gap: 26 },
    { text: `Questions? Call ${site.contact.phone} or email ${site.contact.email}.`, size: 10, gap: 16 },
    { text: "Please arrive 5-10 minutes early. We'll confirm shortly via email.", size: 10, gap: 0 },
  ];

  const marginX = 64;
  let y = 780;
  let out = "BT\n";
  for (const ln of lines) {
    const font = ln.bold ? "/F2" : "/F1";
    out += `${font} ${ln.size} Tf\n`;
    out += `1 0 0 1 ${marginX} ${y} Tm\n`;
    out += `(${pdfEscape(ln.text)}) Tj\n`;
    y -= ln.size + (ln.gap ?? 6);
  }
  out += "ET";
  return out;
}

function base64(ascii: string): string {
  if (typeof btoa === "function") return btoa(ascii);
  // Node fallback (e.g. if ever called during SSR).
  return Buffer.from(ascii, "binary").toString("base64");
}

export function bookingPdfDataUri(event: CalendarEvent): string {
  const stream = contentStream(event);
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return `data:application/pdf;base64,${base64(pdf)}`;
}
