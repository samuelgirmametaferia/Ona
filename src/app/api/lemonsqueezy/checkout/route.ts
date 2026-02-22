import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import {
  createCheckout,
  getVariantId,
  isLemonSqueezyConfigured,
  type PlanKey,
} from "@/lib/lemonsqueezy";

export async function POST(request: NextRequest) {
  if (!isLemonSqueezyConfigured()) {
    return NextResponse.json(
      { error: "Lemon Squeezy is not configured" },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { plan?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const plan = body.plan === "agency" ? "agency" : "pro";
  const variantId = getVariantId(plan);
  const storeId = process.env.LEMONSQUEEZY_STORE_ID!;
  if (!variantId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  try {
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/dashboard/account?success=1`;
    const { url } = await createCheckout({
      storeId,
      variantId,
      customData: { user_id: user.id },
      successUrl,
    });
    return NextResponse.json({ url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
