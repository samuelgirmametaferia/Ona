"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { track } from "@vercel/analytics";
import { CheckCircle } from "lucide-react";

export function AccountSuccessBanner() {
  const router = useRouter();

  useEffect(() => {
    track("Subscription Started");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/dashboard/account", { scroll: false });
    }, 5000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="animate-fade-in rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4">
      <div className="flex items-center gap-3">
        <CheckCircle className="h-6 w-6 shrink-0 text-emerald-500" />
        <div>
          <p className="font-medium text-[var(--text-primary)]">Payment successful</p>
          <p className="text-sm text-[var(--text-muted)]">
            Your subscription is active. You now have full access and exports.
          </p>
        </div>
      </div>
    </div>
  );
}
