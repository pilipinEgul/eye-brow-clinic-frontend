"use client";

import { ResourceManager, type Field, type Column } from "@/components/admin/ResourceManager";
import { Bool } from "@/components/admin/Bool";

const fields: Field[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "slug", label: "Slug", type: "text", help: "Leave blank to auto-generate" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "icon", label: "Icon name", type: "text" },
  { key: "sort_order", label: "Sort order", type: "number" },
  { key: "is_active", label: "Active", type: "checkbox" },
];

const columns: Column[] = [
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "sort_order", label: "Order" },
  { key: "is_active", label: "Active", render: (r) => <Bool value={r.is_active} /> },
];

export default function Page() {
  return (
    <ResourceManager
      resource="service-categories"
      title="Categories"
      subtitle="Groups your services into sections."
      columns={columns}
      fields={fields}
    />
  );
}
