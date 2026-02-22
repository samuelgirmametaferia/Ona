import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getRecipientsByConditions } from "@/lib/campaigns";
import type { CampaignConditions } from "@/lib/campaigns";
import { checkRateLimitAdmin } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const { ok } = await checkRateLimitAdmin(request);
  if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "60" } });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const conditions: CampaignConditions = {};
  const url = request.nextUrl;
  const inactive = url.searchParams.get("inactive_days_min");
  const scoreMax = url.searchParams.get("engagement_score_max");
  const plan = url.searchParams.get("plan");
  if (inactive != null) conditions.inactive_days_min = Math.max(0, parseInt(inactive, 10) || 0);
  if (scoreMax != null) conditions.engagement_score_max = Math.max(0, parseInt(scoreMax, 10) ?? 100);
  if (plan === "free" || plan === "pro" || plan === "agency") conditions.plan = plan;

  const recipients = await getRecipientsByConditions(conditions);
  return NextResponse.json({ recipients });
}
