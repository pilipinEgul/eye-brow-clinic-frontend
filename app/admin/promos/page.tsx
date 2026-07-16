"use client";

import { ResourceManager, type Field, type Column } from "@/components/admin/ResourceManager";
import { Bool } from "@/components/admin/Bool";

const fields: Field[] = [
  { key: "code", label: "Code", type: "text", required: true },
  { key: "title", label: "Title", type: "text", required: true },
  { key: "description", label: "Description", type: "textarea" },
  {
    key: "type",
    label: "Discount type",
    type: "select",
    options: [
      { value: "percentage", label: "Percentage (%)" },
      { value: "fixed", label: "Fixed (₱)" },
    ],
  },
  { key: "value", label: "Value", type: "number" },
  { key: "minimum_amount", label: "Minimum spend (₱)", type: "number" },
  { key: "usage_limit", label: "Usage limit", type: "number" },
  { key: "cover_image", label: "Cover image", type: "image" },
  { key: "starts_at", label: "Starts", type: "date" },
  { key: "ends_at", label: "Ends", type: "date" },
  { key: "is_active", label: "Active", type: "checkbox" },
  { key: "is_featured", label: "Featured", type: "checkbox" },
];

const columns: Column[] = [
  { key: "code", label: "Code" },
  { key: "title", label: "Title" },
  {
    key: "value",
    label: "Discount",
    render: (r) => (r.type === "percentage" ? `${r.value}%` : `₱${r.value}`),
  },
  { key: "is_active", label: "Active", render: (r) => <Bool value={r.is_active} /> },
];

export default function Page() {
  return (
    <ResourceManager
      resource="promos"
      title="Promos"
      subtitle="Promo codes and featured offers."
      columns={columns}
      fields={fields}
    />
  );
}
