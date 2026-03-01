"use client";

import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";

const STORAGE_KEY = "loadforge-dashboard-welcome-dismissed";

export function DashboardWelcome() {
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

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="relative rounded-2xl border border-forge-500/30 bg-forge-500/10 px-5 py-4 pr-12">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-forge-500/20 p-2">
          <Sparkles className="h-5 w-5 text-forge-500" />
        </div>
        <div>
          <p className="font-medium text-[var(--text-primary)]">Getting started</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Search below, filter by province or city, and export when you’re ready. Your first export will count toward your monthly usage on Pro.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-3 rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
