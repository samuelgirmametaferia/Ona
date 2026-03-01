import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { logActivity } from "@/lib/activity";
import type { ActivityEventType } from "@/lib/activity";
import { checkRateLimitActivity } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ok } = await checkRateLimitActivity(user.id);
  if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "60" } });

  let body: { eventType?: string; metadata?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const allowed: ActivityEventType[] = ["page_view", "dashboard_view"];
  const eventType = allowed.includes(body.eventType as ActivityEventType) ? (body.eventType as ActivityEventType) : "page_view";
  const metadata = typeof body.metadata === "object" && body.metadata !== null ? body.metadata : {};

  await logActivity({ userId: user.id, eventType, metadata });
  return NextResponse.json({ ok: true });
}
