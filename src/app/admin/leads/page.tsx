import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLeadsTable } from "@/components/admin/AdminLeadsTable";
import Link from "next/link";
import { Plus, Upload } from "lucide-react";

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Leads</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/leads/new"
            className="flex items-center gap-2 rounded-lg bg-forge-500 px-4 py-2 text-sm font-medium text-white hover:bg-forge-600"
          >
            <Plus className="h-4 w-4" />
            Add lead
          </Link>
          <Link
            href="/admin/leads/upload"
            className="flex items-center gap-2 rounded-lg border border-stone-600 px-4 py-2 text-sm font-medium text-stone-300 hover:bg-stone-800"
          >
            <Upload className="h-4 w-4" />
            Bulk upload
          </Link>
        </div>
      </div>
      <AdminLeadsTable />
    </div>
  );
}
