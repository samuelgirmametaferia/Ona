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
    company_name: String(company_name).trim(),
    owner_name: body.owner_name ? String(body.owner_name) : null,
    email: body.email ? String(body.email) : null,
    phone: body.phone ? String(body.phone) : null,
    website: body.website ? String(body.website) : null,
    city: body.city ? String(body.city) : null,
    province: body.province ? String(body.province) : null,
    employee_count: typeof body.employee_count === "number" ? body.employee_count : (body.employee_count ? parseInt(String(body.employee_count), 10) : null),
    revenue_estimate: body.revenue_estimate ? String(body.revenue_estimate) : null,
    linkedin: body.linkedin ? String(body.linkedin) : null,
    verified_at: new Date().toISOString(),
  };

  const admin = createAdminClient();
  const { data, error } = await admin.from("leads").insert(lead).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await import("@/lib/audit").then(({ logAudit }) =>
    logAudit(admin, { actorId: user.id, action: "lead_created", entityType: "lead", entityId: data.id, details: { source: "bulk" } })
  ).catch(() => {});
  return NextResponse.json(data);
}
