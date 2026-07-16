"use client";

import { ResourceManager, type Field, type Column } from "@/components/admin/ResourceManager";
import { useOptions } from "@/components/admin/useOptions";
import { Bool } from "@/components/admin/Bool";

const columns: Column[] = [
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  {
    key: "price",
    label: "Price",
    render: (r) => (r.promo_price ? `₱${r.promo_price} (was ₱${r.price})` : r.price ? `₱${r.price}` : "—"),
  },
  { key: "is_featured", label: "Featured", render: (r) => <Bool value={r.is_featured} /> },
  { key: "is_active", label: "Active", render: (r) => <Bool value={r.is_active} /> },
];

export default function Page() {
  const categories = useOptions("service-categories");

  const fields: Field[] = [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "slug", label: "Slug", type: "text", help: "Leave blank to auto-generate" },
    { key: "service_category_id", label: "Category", type: "select", options: categories },
    { key: "short_description", label: "Short description", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "price", label: "Price (₱)", type: "number" },
    { key: "promo_price", label: "Promo price (₱)", type: "number" },
    { key: "sr_artist_first_session", label: "Sr artist — 1st session", type: "number" },
    { key: "master_artist_first_session", label: "Master artist — 1st session", type: "number" },
    { key: "sr_artist_second_session", label: "Sr artist — 2nd session", type: "number" },
    { key: "master_artist_second_session", label: "Master artist — 2nd session", type: "number" },
    { key: "duration_minutes", label: "Duration (minutes)", type: "number" },
    { key: "cover_image", label: "Cover image", type: "image" },
    { key: "benefits", label: "Benefits", type: "tags" },
    { key: "process_steps", label: "Process steps", type: "tags" },
    { key: "aftercare", label: "Aftercare", type: "tags" },
    { key: "meta_title", label: "SEO title", type: "text" },
    { key: "meta_description", label: "SEO description", type: "textarea" },
    { key: "is_featured", label: "Featured", type: "checkbox" },
    { key: "is_active", label: "Active (visible on site)", type: "checkbox" },
    { key: "sort_order", label: "Sort order", type: "number" },
  ];

  return (
    <ResourceManager
      resource="services"
      title="Services"
      subtitle="Everything on your site and booking form reads from here."
      columns={columns}
      fields={fields}
    />
  );
}
