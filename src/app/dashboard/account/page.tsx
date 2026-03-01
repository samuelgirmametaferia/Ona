import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { claimPendingSubscriptions } from "@/lib/claim-pending-subscription";
import { SubscriptionSection } from "@/components/dashboard/SubscriptionSection";
import { AccountSuccessBanner } from "@/components/dashboard/AccountSuccessBanner";
import { ExportUsageCard } from "@/components/dashboard/ExportUsageCard";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; plan?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Link any pay-first subscription (same email) to this account
  if (user.email) await claimPendingSubscriptions(user.email);

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan, subscription_status")
    .eq("id", user.id)
    .single();

  const plan = profile?.subscription_plan ?? "free";
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const { count: exportsThisMonth } = await supabase
    .from("exports")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("exported_at", monthStart);

  const params = await searchParams;
  const showSuccess = params.success === "1";
  const planParam = params.plan?.toLowerCase();
  const pendingPlan =
    (plan === "free" && planParam === "agency") ? "agency"
    : (plan === "free" && planParam === "pro") ? "pro"
    : null;

  return (
    <div className="max-w-2xl space-y-8">
      {showSuccess && <AccountSuccessBanner />}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Account</h1>
        <p className="mt-2 text-[var(--text-muted)]">Manage your subscription</p>
      </div>
      <SubscriptionSection
        plan={plan}
        status={profile?.subscription_status}
        pendingPlan={pendingPlan}
      />

      {(plan === "pro" || plan === "agency") && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Export usage</h2>
          <ExportUsageCard plan={plan} exportsThisMonth={exportsThisMonth ?? 0} />
          {exportsThisMonth === 0 && (
            <p className="text-sm text-[var(--text-muted)]">
              Your first export will appear here once you export leads from the dashboard.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
