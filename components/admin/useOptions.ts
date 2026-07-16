"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";

/** Loads {value,label} options from an admin resource that has id + name. */
export function useOptions(resource: string) {
  const [options, setOptions] = useState<{ value: number; label: string }[]>([]);

  useEffect(() => {
    adminApi
      .list<{ id: number; name: string }>(resource)
      .then((res) => setOptions(res.data.map((x) => ({ value: x.id, label: x.name }))))
      .catch(() => setOptions([]));
  }, [resource]);

  return options;
}
