import { createClient } from "@supabase/supabase-js";
import { getUsersWithEngagement } from "./engagement";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export interface CampaignConditions {
  inactive_days_min?: number;
  engagement_score_max?: number;
  plan?: "free" | "pro" | "agency";
}

/**
 * Get user IDs that match the given conditions (for targeting).
 */
export async function getRecipientsByConditions(conditions: CampaignConditions): Promise<{ id: string; email: string; name: string; last_login_at: string | null; engagement_score: number; plan: string }[]> {
  const users = await getUsersWithEngagement();
  const inactiveDaysMin = conditions.inactive_days_min ?? 0;
  const engagementScoreMax = conditions.engagement_score_max ?? 1e9;
  const planFilter = conditions.plan;

  const now = Date.now();
  const inactiveCutoff = now - (inactiveDaysMin * 24 * 60 * 60 * 1000);

  return users.filter((u) => {
    if (u.role === "admin") return false;
    if (planFilter && u.subscription_plan !== planFilter) return false;
    if (u.engagement_score > engagementScoreMax) return false;
    if (inactiveDaysMin > 0) {
      const last = u.last_login_at ? new Date(u.last_login_at).getTime() : 0;
      if (last >= inactiveCutoff) return false;
    }
    return true;
  }).map((u) => ({
    id: u.id,
    email: u.email,
    name: u.email.split("@")[0] || "there",
    last_login_at: u.last_login_at,
    engagement_score: u.engagement_score,
    plan: u.subscription_plan,
  }));
}

export function replacePlaceholders(html: string, data: { email: string; name: string; last_login: string; engagement_score: string; plan: string }): string {
  return html
    .replace(/\{\{\s*email\s*\}\}/gi, data.email)
    .replace(/\{\{\s*name\s*\}\}/gi, data.name)
    .replace(/\{\{\s*last_login\s*\}\}/gi, data.last_login)
    .replace(/\{\{\s*engagement_score\s*\}\}/gi, data.engagement_score)
    .replace(/\{\{\s*plan\s*\}\}/gi, data.plan);
}

export async function recordCampaignSend(campaignId: string, userId: string): Promise<void> {
  try {
    await admin.from("campaign_sends").insert({ campaign_id: campaignId, user_id: userId, status: "sent" });
  } catch {
    // Ignore duplicate (campaign_id, user_id) or other insert errors
  }
}
