"use client";

import { ResourceManager, type Field, type Column } from "@/components/admin/ResourceManager";
import { useOptions } from "@/components/admin/useOptions";
import { Bool } from "@/components/admin/Bool";

const columns: Column[] = [
  { key: "client_name", label: "Client" },
  {
    key: "rating",
    label: "Rating",
    render: (r) => (
      <span className="inline-flex gap-0.5 text-gold-500">
        {Array.from({ length: Number(r.rating) || 0 }).map((_, i) => (
          <i key={i} className="pi pi-star-fill text-xs" aria-hidden />
        ))}
      </span>
    ),
  },
  {
    key: "quote",
    label: "Quote",
    render: (r) => <span className="line-clamp-2 max-w-xs">{String(r.quote ?? "")}</span>,
  },
  { key: "is_published", label: "Published", render: (r) => <Bool value={r.is_published} /> },
];

export default function Page() {
  const services = useOptions("services");

  const fields: Field[] = [
    { key: "client_name", label: "Client name", type: "text", required: true },
    { key: "client_title", label: "Client title / location", type: "text" },
    { key: "quote", label: "Quote", type: "textarea", required: true },
    { key: "rating", label: "Rating (1–5)", type: "number" },
    { key: "service_id", label: "Related service", type: "select", options: services },
    { key: "source", label: "Source", type: "text", help: "e.g. Google, Facebook" },
    { key: "video_url", label: "Video URL", type: "text" },
    { key: "is_published", label: "Published (visible on site)", type: "checkbox" },
    { key: "is_featured", label: "Featured", type: "checkbox" },
    { key: "sort_order", label: "Sort order", type: "number" },
  ];

  return (
    <ResourceManager
      resource="testimonials"
      title="Testimonials"
      subtitle="Curated quotes shown on the site."
      columns={columns}
      fields={fields}
    />
  );
}
