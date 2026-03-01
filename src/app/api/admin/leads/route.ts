import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const company_name = body.company_name as string;
  if (!company_name?.trim()) return NextResponse.json({ error: "company_name required" }, { status: 400 });

  const lead: Record<string, unknown> = {
    company_name: company_name.trim(),
    owner_name: (body.owner_name as string) || null,
    email: (body.email as string) || null,
    phone: (body.phone as string) || null,
    website: (body.website as string) || null,
    city: (body.city as string) || null,
    province: (body.province as string) || null,
    employee_count: typeof body.employee_count === "number" ? body.employee_count : null,
    revenue_estimate: (body.revenue_estimate as string) || null,
    linkedin: (body.linkedin as string) || null,
    verified_at: (body.verified_at as string) || new Date().toISOString(),
  };

  const admin = createAdminClient();
  const { data, error } = await admin.from("leads").insert(lead).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await import("@/lib/audit").then(({ logAudit }) =>
    logAudit(admin, { actorId: user.id, action: "lead_created", entityType: "lead", entityId: data.id })
  ).catch(() => {});
  return NextResponse.json(data);
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const page = Math.max(1, parseInt(request.nextUrl.searchParams.get("page") || "1", 10));
  const pageSize = Math.min(50, Math.max(10, parseInt(request.nextUrl.searchParams.get("pageSize") || "20", 10)));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const admin = createAdminClient();
  const { data, error, count } = await admin
    .from("leads")
    .select("id, company_name, city, province, email, verified_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ leads: data, total: count ?? 0 });
}
