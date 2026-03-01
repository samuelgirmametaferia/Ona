import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { PLAN_LIMITS } from "@/lib/supabase/types";
import { logActivity } from "@/lib/activity";

const EXPORT_RATE_LIMIT = 10; // max exports per minute per user

function escapeCsvCell(val: string | null | number): string {
  if (val == null) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan")
    .eq("id", user.id)
    .single();

  const plan = (profile?.subscription_plan as keyof typeof PLAN_LIMITS) || "free";
  const exportLimit = PLAN_LIMITS[plan]?.exportLimit ?? 0;
  if (exportLimit === 0) return NextResponse.json({ error: "Export not available on your plan" }, { status: 403 });

  let body: { leadIds?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const leadIds = Array.isArray(body.leadIds) ? body.leadIds : [];
  if (leadIds.length === 0) return NextResponse.json({ error: "No leads selected" }, { status: 400 });

  const since = new Date(Date.now() - 60_000).toISOString();
  const { count: recentCount } = await supabase
    .from("exports")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("exported_at", since);
  if ((recentCount ?? 0) >= EXPORT_RATE_LIMIT) {
    return NextResponse.json({ error: "Too many exports. Try again in a minute." }, { status: 429 });
  }

  if (plan !== "agency" && exportLimit !== Infinity) {
    const { count: monthCount } = await supabase
      .from("exports")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("exported_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
    if ((monthCount ?? 0) >= exportLimit) {
      return NextResponse.json({ error: `Export limit reached (${exportLimit}/month). Upgrade for more.` }, { status: 403 });
    }
  }

  const { data: leads, error: fetchError } = await supabase
    .from("leads")
    .select("*")
    .in("id", leadIds);

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
  if (!leads?.length) return NextResponse.json({ error: "No leads found" }, { status: 404 });

  await supabase.from("exports").insert({
    user_id: user.id,
    lead_ids: leadIds,
    exported_at: new Date().toISOString(),
  });
  await logActivity({ userId: user.id, eventType: "export", metadata: { count: leadIds.length } });

  const headers = [
    "company_name",
    "owner_name",
    "email",
    "phone",
    "website",
    "city",
    "province",
    "employee_count",
    "revenue_estimate",
    "linkedin",
    "verified_at",
  ];
  const rows = leads.map((l) =>
    headers.map((h) => escapeCsvCell((l as Record<string, unknown>)[h] as string | null))
  );
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const bom = "\uFEFF";
  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="loadforge-export-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
