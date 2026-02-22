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
  const { data: campaigns } = await admin
    .from("email_campaigns")
    .select("id, name, subject, conditions, created_at")
    .order("created_at", { ascending: false });

  return NextResponse.json({ campaigns: campaigns ?? [] });
}

export async function POST(request: NextRequest) {
  const { ok } = await checkRateLimitAdmin(request);
  if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "60" } });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: { name?: string; subject?: string; body_html?: string; conditions?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const body_html = typeof body.body_html === "string" ? body.body_html : "";
  if (!name || !subject || !body_html) return NextResponse.json({ error: "name, subject, body_html required" }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin.from("email_campaigns").insert({
    name,
    subject,
    body_html,
    conditions: body.conditions ?? {},
    created_by: user.id,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
