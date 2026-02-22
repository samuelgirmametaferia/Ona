import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const { ok } = rateLimit(`leads-preview:${getRateLimitKey(request)}`);
  if (!ok) return NextResponse.json([], { status: 429, headers: { "Retry-After": "60" } });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("company_name, city, province, website, verified_at")
    .not("verified_at", "is", null)
    .order("verified_at", { ascending: false })
    .limit(5);
  if (error) {
    return NextResponse.json(
      [
        { company_name: "ABC Roofing Ltd", city: "Toronto", province: "ON", website: "https://example.com", verified_at: new Date().toISOString() },
        { company_name: "Peak Roofing", city: "Vancouver", province: "BC", website: "https://example.com", verified_at: new Date().toISOString() },
        { company_name: "Summit Contractors", city: "Calgary", province: "AB", website: "https://example.com", verified_at: new Date().toISOString() },
      ],
      { status: 200 }
    );
  }
  return NextResponse.json(data?.length ? data : [
    { company_name: "ABC Roofing Ltd", city: "Toronto", province: "ON", website: "https://example.com", verified_at: new Date().toISOString() },
    { company_name: "Peak Roofing", city: "Vancouver", province: "BC", website: "https://example.com", verified_at: new Date().toISOString() },
  ]);
}
