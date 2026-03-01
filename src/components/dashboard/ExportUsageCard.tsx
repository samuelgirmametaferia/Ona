import { Download } from "lucide-react";
import { PLAN_LIMITS } from "@/lib/supabase/types";

type Plan = keyof typeof PLAN_LIMITS;

export function ExportUsageCard({
  plan,
  exportsThisMonth,
}: {
  plan: string;
  exportsThisMonth: number;
}) {
  const limit = PLAN_LIMITS[plan as Plan]?.exportLimit;
  if (limit === 0) return null; // Free has no exports
  if (limit === Infinity) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-amber-500/20 p-3">
            <Download className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-[var(--text-muted)]">Exports this month</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{exportsThisMonth.toLocaleString()}</p>
            <p className="text-xs text-[var(--text-muted)]">Unlimited on Agency</p>
          </div>
        </div>
      </div>
    );
  }
  const percent = Math.min(100, (exportsThisMonth / limit) * 100);
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-amber-500/20 p-3">
          <Download className="h-6 w-6 text-amber-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-[var(--text-muted)]">Exports used this month</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {exportsThisMonth.toLocaleString()} / {limit.toLocaleString()}
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
