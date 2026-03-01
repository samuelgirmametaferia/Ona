/**
 * Lemon Squeezy API helpers.
 * Docs: https://docs.lemonsqueezy.com/api/checkouts/create-checkout
 */

const LEMON_API = "https://api.lemonsqueezy.com/v1";

export type PlanKey = "pro" | "agency";

export async function createCheckout(params: {
  storeId: string;
  variantId: string;
  /** For logged-in users pass { user_id }. For pay-first (no account yet) pass { checkout_first: "1" }. */
  customData: { user_id?: string; checkout_first?: string };
  successUrl?: string;
}): Promise<{ url: string }> {
  const key = process.env.LEMONSQUEEZY_API_KEY;
  if (!key) throw new Error("LEMONSQUEEZY_API_KEY is not set");

  const redirectUrl = params.successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account?success=1`;
  const body = {
    data: {
      type: "checkouts",
      attributes: {
        checkout_data: {
          custom: params.customData,
        },
        product_options: {
          redirect_url: redirectUrl,
        },
      },
      relationships: {
        store: { data: { type: "stores", id: String(params.storeId) } },
        variant: { data: { type: "variants", id: String(params.variantId) } },
      },
    },
  };

  const res = await fetch(`${LEMON_API}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Lemon Squeezy API ${res.status}`);
  }

  const json = (await res.json()) as { data: { attributes: { url: string } } };
  return { url: json.data.attributes.url };
}

export function getVariantId(plan: PlanKey): string | null {
  if (plan === "pro") return process.env.LEMONSQUEEZY_VARIANT_ID_PRO ?? null;
  if (plan === "agency") return process.env.LEMONSQUEEZY_VARIANT_ID_AGENCY ?? null;
  return null;
}

export function isLemonSqueezyConfigured(): boolean {
  return !!(
    process.env.LEMONSQUEEZY_API_KEY &&
    process.env.LEMONSQUEEZY_STORE_ID &&
    process.env.LEMONSQUEEZY_VARIANT_ID_PRO &&
    process.env.LEMONSQUEEZY_VARIANT_ID_AGENCY
  );
}
