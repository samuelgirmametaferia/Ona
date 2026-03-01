import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { LeadTable } from "@/components/dashboard/LeadTable";
import { DashboardWelcome } from "@/components/dashboard/DashboardWelcome";
import { ExportUsageCard } from "@/components/dashboard/ExportUsageCard";
import { Database, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan, subscription_status")
    .eq("id", user.id)
    .single();

  const plan = (profile?.subscription_plan as string) || "free";

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const [{ count: totalLeads }, { count: leadsThisMonth }, { data: lastLead }, { count: exportsThisMonth }] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", monthStart),
    supabase.from("leads").select("verified_at").order("verified_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("exports").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("exported_at", monthStart),
  ]);

  const lastUpdated = lastLead?.verified_at ?? null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        <p className="mt-2 text-[var(--text-muted)]">Search and filter the lead database</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
        <div className="card-lift rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-forge-500/20 p-3">
              <Database className="h-6 w-6 text-forge-500" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Total leads</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{(totalLeads ?? 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card-lift rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-emerald-500/20 p-3">
              <TrendingUp className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Added this month</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{(leadsThisMonth ?? 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card-lift rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-500/20 p-3">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Last updated</p>
              <p className="text-xl font-semibold text-[var(--text-primary)]">
                {lastUpdated ? formatDate(lastUpdated) : "—"}
              </p>
            </div>
          </div>
        </div>
        {(plan === "pro" || plan === "agency") && (
          <ExportUsageCard plan={plan} exportsThisMonth={exportsThisMonth ?? 0} />
        )}
      </div>

      {exportsThisMonth === 0 && (
        <DashboardWelcome />
      )}

      {plan === "free" && (
        <div className="rounded-2xl border border-forge-500/50 bg-forge-500/10 p-5">
          <p className="text-sm text-[var(--text-secondary)]">
            You’re on the <strong>Free</strong> plan: first 50 leads visible, no export.{" "}
            <Link href="/dashboard/account" className="text-forge-500 hover:underline">
              Upgrade to Pro or Agency
            </Link>{" "}
            for full access and CSV export.
          </p>
        </div>
      )}

      <LeadTable plan={plan} />
    </div>
  );
}
