import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { AuditLogTable } from "@/components/admin/AuditLogTable";

export default async function AdminAuditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const admin = createAdminClient();
  const { data: rows, error } = await admin
    .from("audit_log")
    .select("id, actor_id, action, entity_type, entity_id, details, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-red-400">
        Failed to load audit log. Run the audit_log migration in Supabase if you haven’t.
      </div>
    );
  }

  const actorIds = Array.from(new Set((rows ?? []).map((r) => r.actor_id)));
  const { data: profiles } = await admin.from("profiles").select("id, email").in("id", actorIds);
  const emailById = new Map((profiles ?? []).map((p) => [p.id, p.email]));

  const entries = (rows ?? []).map((r) => ({
    id: r.id,
    actorEmail: emailById.get(r.actor_id) ?? "—",
    action: r.action,
    entityType: r.entity_type,
    entityId: r.entity_id,
    details: r.details,
    createdAt: r.created_at,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-amber-500/20 p-3">
          <ClipboardList className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Audit log</h1>
          <p className="text-sm text-[var(--text-muted)]">Recent admin actions on leads</p>
        </div>
      </div>
      <AuditLogTable entries={entries} />
    </div>
  );
}
