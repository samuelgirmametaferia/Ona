import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const { ok } = rateLimit(`leads-count:${getRateLimitKey(request)}`);
  if (!ok) return NextResponse.json({ count: 0 }, { status: 429, headers: { "Retry-After": "60" } });

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true });
  if (error) return NextResponse.json({ count: 3482 }, { status: 200 });
  return NextResponse.json({ count: count ?? 3482 });
}
