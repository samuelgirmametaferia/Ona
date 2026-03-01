import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { PLAN_LIMITS } from "@/lib/supabase/types";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { logActivity } from "@/lib/activity";

export async function GET(request: NextRequest) {
  const key = getRateLimitKey(request);
  const { ok, remaining } = rateLimit(`leads-list:${key}`);
  if (!ok) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan")
    .eq("id", user.id)
    .single();

  const plan = (profile?.subscription_plan as keyof typeof PLAN_LIMITS) || "free";
  const viewLimit = PLAN_LIMITS[plan]?.viewLimit ?? 50;

  const searchParams = request.nextUrl.searchParams;
  const rawQ = searchParams.get("q")?.trim() || "";
  const q = rawQ.slice(0, 200).replace(/%/g, "\\%").replace(/_/g, "\\_");
  const province = searchParams.get("province")?.trim() || "";
  const city = searchParams.get("city")?.trim() || "";
  const sort = searchParams.get("sort") || "verified_at";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.min(50, Math.max(10, parseInt(searchParams.get("pageSize") || "20", 10)));

  let query = supabase
    .from("leads")
    .select("id, company_name, owner_name, email, phone, website, city, province, verified_at, created_at", { count: "exact" });

  if (q) {
    query = query.or(`company_name.ilike.%${q}%,owner_name.ilike.%${q}%`);
  }
  if (province) query = query.eq("province", province);
  if (city) query = query.eq("city", city);

  const sortColumn = ["company_name", "city", "province", "verified_at", "created_at"].includes(sort) ? sort : "verified_at";
  query = query.order(sortColumn, { ascending: order === "asc" });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  if (plan === "free") {
    query = query.range(0, viewLimit - 1);
  } else {
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (rawQ) await logActivity({ userId: user.id, eventType: "search", metadata: { q: rawQ.slice(0, 100) } });

  const rawTotal = count ?? 0;
  const total = plan === "free" ? Math.min(rawTotal, viewLimit) : rawTotal;
  const totalPages = plan === "free" ? 1 : Math.ceil(rawTotal / pageSize);

  return NextResponse.json({
    leads: data,
    total,
    totalPages,
    page,
    pageSize,
    viewLimit: plan === "free" ? viewLimit : null,
  });
}
