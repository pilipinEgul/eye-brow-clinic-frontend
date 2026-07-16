"use client";

import { ResourceManager, type Field, type Column } from "@/components/admin/ResourceManager";
import { useOptions } from "@/components/admin/useOptions";
import { Bool } from "@/components/admin/Bool";

const columns: Column[] = [
  {
    key: "question",
    label: "Question",
    render: (r) => <span className="line-clamp-2 max-w-md">{String(r.question ?? "")}</span>,
  },
  { key: "category", label: "Category" },
  { key: "is_active", label: "Active", render: (r) => <Bool value={r.is_active} /> },
];

export default function Page() {
  const services = useOptions("services");

  const fields: Field[] = [
    { key: "question", label: "Question", type: "text", required: true },
    { key: "answer", label: "Answer", type: "textarea", required: true },
    { key: "category", label: "Category", type: "text", help: "e.g. General, Aftercare" },
    { key: "service_id", label: "Related service", type: "select", options: services },
    { key: "sort_order", label: "Sort order", type: "number" },
    { key: "is_active", label: "Active", type: "checkbox" },
  ];

  return (
    <ResourceManager
      resource="faqs"
      title="FAQs"
      subtitle="Questions shown on the site and service pages."
      columns={columns}
      fields={fields}
    />
  );
}
