import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getRecipientsByConditions, replacePlaceholders, recordCampaignSend } from "@/lib/campaigns";
import type { CampaignConditions } from "@/lib/campaigns";
import { checkRateLimitAdmin } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { ok } = await checkRateLimitAdmin(request);
  if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "60" } });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 503 });

  const { id } = await params;
  const admin = createAdminClient();
  const { data: campaign } = await admin.from("email_campaigns").select("id, subject, body_html, conditions").eq("id", id).single();
  if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });

  const conditions: CampaignConditions = (campaign.conditions as CampaignConditions) ?? {};
  const recipients = await getRecipientsByConditions(conditions);
  const from = process.env.RESEND_FROM ?? "LeadForge <noreply@leadforge.io>";
  const resend = new Resend(apiKey);
  const results: { email: string; ok: boolean; error?: string }[] = [];

  for (const r of recipients) {
    const lastLogin = r.last_login_at ? new Date(r.last_login_at).toLocaleDateString() : "Never";
    const html = replacePlaceholders(campaign.body_html, {
      email: r.email,
      name: r.name,
      last_login: lastLogin,
      engagement_score: String(r.engagement_score),
      plan: r.plan,
    });
    try {
      const { error } = await resend.emails.send({
        from,
        to: r.email,
        subject: campaign.subject,
        html,
      });
      if (error) {
        results.push({ email: r.email, ok: false, error: error.message });
      } else {
        await recordCampaignSend(id, r.id);
        results.push({ email: r.email, ok: true });
      }
    } catch (e) {
      results.push({ email: r.email, ok: false, error: String(e) });
    }
  }

  return NextResponse.json({ sent: results.filter((x) => x.ok).length, failed: results.filter((x) => !x.ok).length, results });
}
