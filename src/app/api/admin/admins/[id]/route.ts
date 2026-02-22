import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimitAdmin } from "@/lib/rate-limit";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { ok } = await checkRateLimitAdmin(request);
  if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "60" } });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const admin = createAdminClient();
  const { data: target } = await admin.from("profiles").select("id, role").eq("id", id).single();
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (target.role !== "admin") return NextResponse.json({ error: "User is not an admin" }, { status: 400 });

  const { count } = await admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin");
  if ((count ?? 0) <= 1) return NextResponse.json({ error: "Cannot remove the last admin" }, { status: 400 });

  if (target.id === user.id) return NextResponse.json({ error: "Cannot remove yourself; use another admin" }, { status: 400 });

  const { error } = await admin.from("profiles").update({ role: "user", updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
