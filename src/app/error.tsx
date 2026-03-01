"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="rounded-full bg-red-500/20 p-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-[var(--text-primary)]">
          Something went wrong
        </h1>
        <p className="mt-3 text-[var(--text-muted)]">
          We’ve been notified and are looking into it. You can try again or head back home.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] shadow-[var(--shadow)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-forge-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-forge-600 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
