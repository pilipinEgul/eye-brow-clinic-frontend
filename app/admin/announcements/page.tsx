"use client";

import { ResourceManager, type Field, type Column } from "@/components/admin/ResourceManager";
import { Bool } from "@/components/admin/Bool";

const fields: Field[] = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "tag", label: "Tag / label", type: "text", help: "Small chip, e.g. Update, Holiday, Sale" },
  { key: "image_path", label: "Photo", type: "image", help: "Upload the announcement image (e.g. saved from your Facebook post)" },
  { key: "body", label: "Message", type: "textarea" },
  { key: "link_url", label: "Link URL", type: "text", help: "Optional — e.g. /services or a full URL" },
  { key: "link_label", label: "Link text", type: "text", help: "Optional — e.g. Learn more" },
  { key: "starts_at", label: "Show from", type: "date", help: "Optional — leave blank to show now" },
  { key: "ends_at", label: "Show until", type: "date", help: "Optional — leave blank to show forever" },
  { key: "is_active", label: "Active (visible on site)", type: "checkbox" },
  { key: "sort_order", label: "Sort order", type: "number" },
];

const columns: Column[] = [
  {
    key: "image_path",
    label: "Photo",
    render: (r) =>
      r.image_path ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={String(r.image_path)} alt="" className="h-12 w-12 rounded-lg object-cover" />
      ) : (
        "—"
      ),
  },
  { key: "title", label: "Title" },
  { key: "tag", label: "Tag" },
  { key: "is_active", label: "Active", render: (r) => <Bool value={r.is_active} /> },
];

export default function Page() {
  return (
    <ResourceManager
      resource="announcements"
      title="Announcements"
      subtitle="Posts shown in the “Announcements & Offers” section on the home page."
      columns={columns}
      fields={fields}
    />
  );
}
