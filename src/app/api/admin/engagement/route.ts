import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getUsersWithEngagement } from "@/lib/engagement";
import { checkRateLimitAdmin } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const { ok } = await checkRateLimitAdmin(request);
  if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "60" } });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await getUsersWithEngagement();
  return NextResponse.json({ users });
}
