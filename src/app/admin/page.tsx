import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { Database, Users, DollarSign, Download } from "lucide-react";

export default async function AdminStatsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const admin = createAdminClient();

  const [
    { count: totalLeads },
    { count: totalUsers },
    { data: paidUsers },
    { data: exportsThisMonth },
  ] = await Promise.all([
    admin.from("leads").select("*", { count: "exact", head: true }),
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin.from("profiles").select("subscription_plan").in("subscription_plan", ["pro", "agency"]),
    admin.from("exports").select("id").gte("exported_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
  ]);

  const proCount = paidUsers?.filter((p) => p.subscription_plan === "pro").length ?? 0;
  const agencyCount = paidUsers?.filter((p) => p.subscription_plan === "agency").length ?? 0;
  const mrr = proCount * 49 + agencyCount * 99;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Admin dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-stone-700 bg-stone-900/50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-forge-500/20 p-2">
              <Database className="h-5 w-5 text-forge-500" />
            </div>
            <div>
              <p className="text-sm text-stone-400">Total leads</p>
              <p className="text-2xl font-bold text-white">{(totalLeads ?? 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-stone-700 bg-stone-900/50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/20 p-2">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-stone-400">Total users</p>
              <p className="text-2xl font-bold text-white">{(totalUsers ?? 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-stone-700 bg-stone-900/50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/20 p-2">
              <DollarSign className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-stone-400">MRR</p>
              <p className="text-2xl font-bold text-white">${mrr}</p>
              <p className="text-xs text-stone-500">Pro: {proCount} × $49, Agency: {agencyCount} × $99</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-stone-700 bg-stone-900/50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/20 p-2">
              <Download className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-stone-400">Exports this month</p>
              <p className="text-2xl font-bold text-white">{(exportsThisMonth?.length ?? 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
