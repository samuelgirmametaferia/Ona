"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ActivityLogger() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "page_view", metadata: { path: pathname } }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
