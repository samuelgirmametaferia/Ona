import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/send-welcome-email";
import { checkRateLimitSendWelcome } from "@/lib/rate-limit";

/**
 * Welcome email: POST with { email, userId? }.
 * Auth callback sends welcome email directly (lib); this route is for cron/manual use.
 * In production, set SEND_WELCOME_SECRET and send header X-Send-Welcome-Secret to protect.
 */
export async function POST(request: NextRequest) {
  const { ok } = await checkRateLimitSendWelcome(request);
  if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "60" } });

  const secret = process.env.SEND_WELCOME_SECRET;
  if (secret) {
    const headerSecret = request.headers.get("x-send-welcome-secret");
    if (headerSecret !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let body: { email?: string; userId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  if (body.userId) {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", body.userId)
      .single();
    if (!profile) return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const result = await sendWelcomeEmail(email);
  if (result.ok) {
    return NextResponse.json({ ok: true, id: result.id });
  }
  if (result.error === "RESEND_API_KEY not set") {
    return NextResponse.json({ ok: true, skipped: "no RESEND_API_KEY" });
  }
  return NextResponse.json({ error: result.error }, { status: 502 });
}
