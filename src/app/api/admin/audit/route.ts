import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const limit = Math.min(100, Math.max(10, parseInt(request.nextUrl.searchParams.get("limit") || "50", 10)));
  const admin = createAdminClient();
  const { data: rows, error } = await admin
    .from("audit_log")
    .select("id, actor_id, action, entity_type, entity_id, details, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const actorIds = Array.from(new Set((rows ?? []).map((r) => r.actor_id)));
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email")
    .in("id", actorIds);
  const emailById = new Map((profiles ?? []).map((p) => [p.id, p.email]));

  const list = (rows ?? []).map((r) => ({
    id: r.id,
    actorId: r.actor_id,
    actorEmail: emailById.get(r.actor_id) ?? "—",
    action: r.action,
    entityType: r.entity_type,
    entityId: r.entity_id,
    details: r.details,
    createdAt: r.created_at,
  }));

  return NextResponse.json({ entries: list });
}
