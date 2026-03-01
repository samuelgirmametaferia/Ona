import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("leads")
    .select("province")
    .not("province", "is", null);
  if (error) return NextResponse.json([], { status: 200 });

  const provinces = Array.from(new Set((data ?? []).map((r) => r.province).filter(Boolean))) as string[];
  provinces.sort();
  return NextResponse.json(provinces);
}
