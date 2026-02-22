import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimitAdmin } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const { ok } = await checkRateLimitAdmin(request);
  if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "60" } });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = createAdminClient();
  const { data: admins } = await admin
    .from("profiles")
    .select("id, email, role, created_at")
    .eq("role", "admin")
    .order("created_at", { ascending: false });

  return NextResponse.json({ admins: admins ?? [] });
}

export async function POST(request: NextRequest) {
  const { ok } = await checkRateLimitAdmin(request);
  if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "60" } });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  const admin = createAdminClient();
  const { data: target } = await admin.from("profiles").select("id, email, role").eq("email", email).single();
  if (!target) return NextResponse.json({ error: "User not found with that email" }, { status: 404 });
  if (target.role === "admin") return NextResponse.json({ error: "User is already an admin" }, { status: 400 });

  const { error } = await admin.from("profiles").update({ role: "admin", updated_at: new Date().toISOString() }).eq("id", target.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: target.id });
}
