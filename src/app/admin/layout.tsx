import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Shield, LayoutDashboard, Users, Database, ClipboardList, UserCog, BarChart3, Mail } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-stone-800 bg-stone-900/30">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold text-amber-400">
              <Shield className="h-5 w-5" />
              Loadforge Admin
            </Link>
            <nav className="flex flex-wrap gap-4">
              <Link href="/admin" className="flex items-center gap-2 text-sm text-stone-400 hover:text-white">
                <LayoutDashboard className="h-4 w-4" />
                Stats
              </Link>
              <Link href="/admin/leads" className="flex items-center gap-2 text-sm text-stone-400 hover:text-white">
                <Database className="h-4 w-4" />
                Leads
              </Link>
              <Link href="/admin/users" className="flex items-center gap-2 text-sm text-stone-400 hover:text-white">
                <Users className="h-4 w-4" />
                Users
              </Link>
              <Link href="/admin/engagement" className="flex items-center gap-2 text-sm text-stone-400 hover:text-white">
                <BarChart3 className="h-4 w-4" />
                Engagement
              </Link>
              <Link href="/admin/campaigns" className="flex items-center gap-2 text-sm text-stone-400 hover:text-white">
                <Mail className="h-4 w-4" />
                Email campaigns
              </Link>
              <Link href="/admin/audit" className="flex items-center gap-2 text-sm text-stone-400 hover:text-white">
                <ClipboardList className="h-4 w-4" />
                Audit
              </Link>
              <Link href="/admin/admins" className="flex items-center gap-2 text-sm text-stone-400 hover:text-white">
                <UserCog className="h-4 w-4" />
                Admins
              </Link>
            </nav>
          </div>
          <Link href="/dashboard" className="text-sm text-stone-500 hover:text-white">Back to Dashboard</Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
