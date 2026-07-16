"use client";

import { ResourceManager, type Field, type Column } from "@/components/admin/ResourceManager";
import { useOptions } from "@/components/admin/useOptions";
import { Bool } from "@/components/admin/Bool";

const columns: Column[] = [
  {
    key: "image_path",
    label: "Image",
    render: (r) =>
      r.image_path ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={String(r.image_path)} alt="" className="h-12 w-12 rounded-lg object-cover" />
      ) : (
        "—"
      ),
  },
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "is_active", label: "Active", render: (r) => <Bool value={r.is_active} /> },
];

export default function Page() {
  const services = useOptions("services");

  const fields: Field[] = [
    { key: "image_path", label: "Image", type: "image", required: true },
    { key: "title", label: "Title", type: "text" },
    { key: "alt_text", label: "Alt text (SEO/accessibility)", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "service_id", label: "Related service", type: "select", options: services },
    { key: "before_image_path", label: "Before image", type: "image" },
    { key: "after_image_path", label: "After image", type: "image" },
    { key: "is_featured", label: "Featured", type: "checkbox" },
    { key: "is_active", label: "Active", type: "checkbox" },
    { key: "sort_order", label: "Sort order", type: "number" },
  ];

  return (
    <ResourceManager
      resource="gallery"
      title="Gallery"
      subtitle="Photos shown in the gallery."
      columns={columns}
      fields={fields}
    />
  );
}
