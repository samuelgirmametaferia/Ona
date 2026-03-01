import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const admin = createAdminClient();
  const { data: users } = await admin
    .from("profiles")
    .select("id, email, role, subscription_plan, subscription_status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Users</h1>
      <div className="overflow-x-auto rounded-xl border border-stone-700">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-700 bg-stone-800/50">
            <tr>
              <th className="px-4 py-3 font-medium text-stone-300">Email</th>
              <th className="px-4 py-3 font-medium text-stone-300">Role</th>
              <th className="px-4 py-3 font-medium text-stone-300">Plan</th>
              <th className="px-4 py-3 font-medium text-stone-300">Status</th>
              <th className="px-4 py-3 font-medium text-stone-300">Joined</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => (
              <tr key={u.id} className="border-b border-stone-800 last:border-0">
                <td className="px-4 py-3 text-white">{u.email}</td>
                <td className="px-4 py-3 text-stone-400">{u.role}</td>
                <td className="px-4 py-3 text-stone-400">{u.subscription_plan}</td>
                <td className="px-4 py-3 text-stone-400">{u.subscription_status ?? "—"}</td>
                <td className="px-4 py-3 text-stone-500">{formatDate(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
