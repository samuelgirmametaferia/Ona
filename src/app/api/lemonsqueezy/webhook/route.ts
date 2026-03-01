import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const PRO_VARIANT_ID = process.env.LEMONSQUEEZY_VARIANT_ID_PRO;
const AGENCY_VARIANT_ID = process.env.LEMONSQUEEZY_VARIANT_ID_AGENCY;

function planFromVariantId(variantId: number): "pro" | "agency" | null {
  const id = String(variantId);
  if (PRO_VARIANT_ID && String(PRO_VARIANT_ID) === id) return "pro";
  if (AGENCY_VARIANT_ID && String(AGENCY_VARIANT_ID) === id) return "agency";
  return null;
}

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const sigBuf = Buffer.from(signature, "hex");
  const hmacBuf = Buffer.from(hmac, "hex");
  if (sigBuf.length !== hmacBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, hmacBuf);
}

export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json("Webhook secret not set", { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("X-Signature") ?? "";
  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json("Invalid signature", { status: 401 });
  }

  let payload: {
    meta?: { event_name?: string; custom_data?: { user_id?: string; checkout_first?: string } };
    data?: {
      type?: string;
      id?: string;
      attributes?: {
        user_email?: string;
        variant_id?: number;
        status?: string;
        first_order_item?: { variant_id?: number };
      };
    };
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json("Invalid JSON", { status: 400 });
  }

  const eventName = payload.meta?.event_name;
  const customData = payload.meta?.custom_data;
  const userId = customData?.user_id;
  const isCheckoutFirst = customData?.checkout_first === "1" || !userId;
  const attrs = payload.data?.attributes;
  const userEmail = attrs?.user_email?.trim()?.toLowerCase();

  // --- Logged-in checkout: update profile by user_id ---
  if (userId) {
    switch (eventName) {
      case "order_created": {
        const variantId = attrs?.first_order_item?.variant_id ?? attrs?.variant_id;
        const plan = variantId != null ? planFromVariantId(Number(variantId)) : null;
        if (plan) {
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_plan: plan,
              subscription_status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);
        }
        return NextResponse.json({ received: true });
      }
      case "subscription_created":
      case "subscription_updated": {
        const variantId = attrs?.variant_id;
        const status = attrs?.status;
        const plan = variantId != null ? planFromVariantId(Number(variantId)) : null;
        if (plan) {
          const subStatus = status === "active" || status === "on_trial" ? "active" : status ?? null;
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_plan: plan,
              subscription_status: subStatus,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);
        }
        return NextResponse.json({ received: true });
      }
      case "subscription_cancelled":
      case "subscription_expired": {
        await supabaseAdmin
          .from("profiles")
          .update({
            subscription_plan: "free",
            subscription_status: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
        return NextResponse.json({ received: true });
      }
      default:
        return NextResponse.json({ received: true });
    }
  }

  // --- Pay-first (checkout_first): store pending by email or update profile by email ---
  if (!userEmail) return NextResponse.json({ received: true });

  switch (eventName) {
    case "order_created": {
      const variantId = attrs?.first_order_item?.variant_id ?? attrs?.variant_id;
      const plan = variantId != null ? planFromVariantId(Number(variantId)) : null;
      if (plan) {
        await supabaseAdmin.from("pending_subscriptions").insert({
          email: userEmail,
          plan,
          lemon_order_id: payload.data?.id ?? null,
          status: "pending",
        });
      }
      break;
    }
    case "subscription_created":
    case "subscription_updated": {
      const variantId = attrs?.variant_id;
      const plan = variantId != null ? planFromVariantId(Number(variantId)) : null;
      if (plan) {
        await supabaseAdmin.from("pending_subscriptions").insert({
          email: userEmail,
          plan,
          lemon_subscription_id: payload.data?.id ?? null,
          status: "pending",
        });
      }
      break;
    }
    case "subscription_cancelled":
    case "subscription_expired": {
      await supabaseAdmin
        .from("profiles")
        .update({
          subscription_plan: "free",
          subscription_status: null,
          updated_at: new Date().toISOString(),
        })
        .eq("email", userEmail);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
