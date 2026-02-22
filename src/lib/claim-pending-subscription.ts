import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

/**
 * Claim any pending subscriptions for this email (pay-first flow).
 * Call after signup (auth callback) or on dashboard/account load for existing users.
 * Updates profile to the pending plan and marks pending rows as claimed.
 */
export async function claimPendingSubscriptions(email: string): Promise<void> {
  if (!email?.trim()) return;

  const normalizedEmail = email.trim().toLowerCase();
  const { data: pendingList } = await supabaseAdmin
    .from("pending_subscriptions")
    .select("id, plan")
    .eq("email", normalizedEmail)
    .eq("status", "pending");

  if (!pendingList?.length) return;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", normalizedEmail)
    .single();

  if (!profile) return;

  const plan = pendingList[0].plan;
  await supabaseAdmin
    .from("profiles")
    .update({
      subscription_plan: plan,
      subscription_status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  await supabaseAdmin
    .from("pending_subscriptions")
    .update({ user_id: profile.id, status: "claimed" })
    .eq("email", normalizedEmail)
    .eq("status", "pending");
}
