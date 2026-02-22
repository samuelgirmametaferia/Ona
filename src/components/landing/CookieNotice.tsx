"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "loadforge-cookie-consent";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-[var(--shadow-lg)]"
      role="banner"
      aria-label="Cookie notice"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--text-secondary)]">
          We use cookies to run the site and improve your experience. By continuing you agree to our{" "}
          <Link href="/privacy" className="text-forge-500 hover:underline">Privacy Policy</Link>.
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-xl bg-forge-500 px-4 py-2 text-sm font-medium text-white hover:bg-forge-600 transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
