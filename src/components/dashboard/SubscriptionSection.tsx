"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { Loader2, CreditCard, Shield } from "lucide-react";

export function SubscriptionSection({
  plan,
  status,
  pendingPlan,
}: {
  plan: string;
  status: string | null;
  /** When user landed from signup?plan=pro|agency, show CTA to complete checkout */
  pendingPlan?: "pro" | "agency" | null;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  async function checkout(pricePlan: "pro" | "agency") {
    track("Upgrade Click", { plan: pricePlan });
    setLoading(pricePlan);
    try {
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: pricePlan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Checkout failed");
    } finally {
      setLoading(null);
    }
  }

  const isPaid = plan === "pro" || plan === "agency";

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)] transition-colors">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Current plan</h2>
      <p className="mt-1 text-2xl font-bold capitalize text-forge-500">{plan}</p>
      {status && <p className="mt-1 text-sm text-[var(--text-muted)]">Status: {status}</p>}

      {isPaid ? (
        <div className="mt-6">
          <a
            href="https://app.lemonsqueezy.com/my-orders"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-scale inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
          >
            <CreditCard className="h-4 w-4" />
            Manage billing at Lemon Squeezy
          </a>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {pendingPlan && (
            <p className="rounded-xl border border-forge-500/30 bg-forge-500/10 px-4 py-3 text-sm font-medium text-[var(--text-primary)]">
              Complete your {pendingPlan === "agency" ? "Agency" : "Pro"} subscription below to unlock full access and exports.
            </p>
          )}
          <p className="text-sm text-[var(--text-muted)]">Upgrade for full access and CSV export.</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => checkout("pro")}
              disabled={!!loading}
              className="btn-scale inline-flex items-center gap-2 rounded-xl bg-forge-500 px-5 py-3 text-sm font-medium text-white shadow-md shadow-forge-500/25 hover:bg-forge-600 disabled:opacity-50"
            >
              {loading === "pro" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Pro — $49/mo
            </button>
            <button
              onClick={() => checkout("agency")}
              disabled={!!loading}
              className="btn-scale inline-flex items-center gap-2 rounded-xl border-2 border-[var(--border)] px-5 py-3 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50"
            >
              {loading === "agency" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Agency — $99/mo
            </button>
          </div>
          <p className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Shield className="h-3.5 w-3.5 shrink-0" />
            Secure payment via Lemon Squeezy
          </p>
        </div>
      )}
    </div>
  );
}
