import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/send-welcome-email";
import { claimPendingSubscriptions } from "@/lib/claim-pending-subscription";
import { logActivity } from "@/lib/activity";
import { checkRateLimitAuth } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const { ok } = await checkRateLimitAuth(request);
  if (!ok) {
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/login?error=rate_limit`);
  }

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const planParam = searchParams.get("plan")?.toLowerCase();
  const fromCheckout = searchParams.get("from_checkout") === "1";

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && user?.email) {
      await logActivity({ userId: user.id, eventType: "login" });
      // Claim any pay-first subscription (same email as checkout)
      await claimPendingSubscriptions(user.email);
      // Send welcome email directly (no self-fetch). No-op if RESEND_API_KEY not set.
      const result = await sendWelcomeEmail(user.email);
      if (!result.ok && result.error !== "RESEND_API_KEY not set") {
        console.error("[auth/callback] Welcome email failed:", result.error);
      }
      // After pay-first signup, go to dashboard (subscription already claimed)
      if (fromCheckout) {
        return NextResponse.redirect(`${origin}/dashboard?welcome=1`);
      }
      // If they signed up for a paid plan (account-first), send them to account to complete checkout
      const plan = planParam === "agency" ? "agency" : planParam === "pro" ? "pro" : null;
      const redirectPath = plan ? `/dashboard/account?plan=${plan}` : next;
      return NextResponse.redirect(`${origin}${redirectPath}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
