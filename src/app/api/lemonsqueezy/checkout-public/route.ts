import { NextRequest, NextResponse } from "next/server";
import {
  createCheckout,
  getVariantId,
  isLemonSqueezyConfigured,
} from "@/lib/lemonsqueezy";

/**
 * Public checkout (no login): pay first, then create account.
 * GET /api/lemonsqueezy/checkout-public?plan=pro|agency
 * Redirects to Lemon Squeezy checkout. Success URL sends user to signup to create account with same email.
 */
export async function GET(request: NextRequest) {
  if (!isLemonSqueezyConfigured()) {
    return NextResponse.redirect(new URL("/?error=checkout_unavailable", request.url));
  }

  const planParam = request.nextUrl.searchParams.get("plan")?.toLowerCase();
  const plan = planParam === "agency" ? "agency" : "pro";
  const variantId = getVariantId(plan);
  const storeId = process.env.LEMONSQUEEZY_STORE_ID!;

  if (!variantId) {
    return NextResponse.redirect(new URL("/?error=invalid_plan", request.url));
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const successUrl = `${baseUrl}/signup?from_checkout=1&plan=${plan}`;

  try {
    const { url } = await createCheckout({
      storeId,
      variantId,
      customData: { checkout_first: "1" },
      successUrl,
    });
    return NextResponse.redirect(url);
  } catch {
    return NextResponse.redirect(new URL("/?error=checkout_failed", request.url));
  }
}
