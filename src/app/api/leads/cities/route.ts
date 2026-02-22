import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const province = request.nextUrl.searchParams.get("province");
  let query = supabase.from("leads").select("city").not("city", "is", null);
  if (province) query = query.eq("province", province);
  const { data, error } = await query;
  if (error) return NextResponse.json([], { status: 200 });

  const cities = Array.from(new Set((data ?? []).map((r) => r.city).filter(Boolean))) as string[];
  cities.sort();
  return NextResponse.json(cities);
}
