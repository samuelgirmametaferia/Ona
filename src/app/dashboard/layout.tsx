import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { claimPendingSubscriptions } from "@/lib/claim-pending-subscription";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ActivityLogger } from "@/components/dashboard/ActivityLogger";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (user.email) await claimPendingSubscriptions(user.email);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <ActivityLogger />
      <DashboardNav email={user.email ?? ""} isAdmin={profile?.role === "admin"} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
