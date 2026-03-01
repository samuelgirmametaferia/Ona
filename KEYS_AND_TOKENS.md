# Loadforge — Keys and Tokens Checklist

Use this list to gather every key and token needed to run and monetize Loadforge. Copy values into `.env.local` (development) or your host’s environment (e.g. Vercel).

---

## 1. Supabase

**Where:** [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Project Settings** → **API**.

| Variable | Description | Example / where to get it |
|----------|-------------|----------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | `https://xxxxx.supabase.co` (Project URL on API settings) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (safe for client) | Long JWT starting with `eyJ...` (anon public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role secret (server-only) | Long JWT (service_role) — **never expose in client** |

**Notes:**
- Anon key is used for auth and for reading leads (with RLS).
- Service role is used for admin operations (CRUD leads, webhooks, server-only reads).

---

## 2. Stripe

**Where:** [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **API keys** and **Webhooks**.

| Variable | Description | Example / where to get it |
|----------|-------------|----------------------------|
| `STRIPE_SECRET_KEY` | Secret API key (server-only) | `sk_test_...` (test) or `sk_live_...` (live) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | `whsec_...` (from Webhooks → Add endpoint → Signing secret) |
| `STRIPE_PRO_PRICE_ID` | Pro plan recurring price ID | `price_...` (Product: Pro, $49/month recurring) |
| `STRIPE_AGENCY_PRICE_ID` | Agency plan recurring price ID | `price_...` (Product: Agency, $99/month recurring) |

**Setup:**
1. Create two Products: **Pro** ($49/month) and **Agency** ($99/month); copy each **Price ID**.
2. Add webhook endpoint: `https://your-domain.com/api/stripe/webhook`.
3. Subscribe to: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.
4. Copy the **Signing secret** into `STRIPE_WEBHOOK_SECRET`.

---

## 2b. Lemon Squeezy (alternative to Stripe)

**Where:** [Lemon Squeezy Dashboard](https://app.lemonsqueezy.com) → **Settings** → **API** and **Webhooks**.

| Variable | Description | Example / where to get it |
|----------|-------------|----------------------------|
| `LEMONSQUEEZY_API_KEY` | API key (server-only) | From Settings → API |
| `LEMONSQUEEZY_STORE_ID` | Your store ID | From store URL or API |
| `LEMONSQUEEZY_VARIANT_ID_PRO` | Pro plan variant ID ($49/mo) | From Products → Pro → variant ID |
| `LEMONSQUEEZY_VARIANT_ID_AGENCY` | Agency plan variant ID ($99/mo) | From Products → Agency → variant ID |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Webhook signing secret | From Webhooks → Add endpoint → Signing secret |

**Setup:**
1. Create two subscription products: **Pro** ($49/month) and **Agency** ($99/month); copy each **Variant ID**.
2. Add webhook endpoint: `https://your-domain.com/api/lemonsqueezy/webhook`.
3. Subscribe to: `order_created`, `subscription_created`, `subscription_updated`, `subscription_cancelled`, `subscription_expired`.
4. Copy the **Signing secret** into `LEMONSQUEEZY_WEBHOOK_SECRET`.

When all Lemon Squeezy env vars are set, the app uses Lemon Squeezy for checkout instead of Stripe.

---

## 3. App URL and optional support email

**Where:** You choose the values.

| Variable | Description | Example |
|----------|-------------|--------|
| `NEXT_PUBLIC_APP_URL` | Full public URL of the app (for redirects, Stripe success/cancel) | `http://localhost:3000` or `https://loadforge.org` |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Support email shown on Contact page (optional) | `support@loadforge.org` |

---

## 4. Hosting (e.g. Vercel)

**Where:** Vercel (or other host) project → **Settings** → **Environment Variables**.

- Add **every** variable from sections 1–3.
- For production, use **production** (and optionally **preview**) values:
  - `NEXT_PUBLIC_APP_URL` = your production domain.
  - Stripe: use **live** keys and **live** webhook signing secret if you’re charging real money.

**Vercel-specific (optional):**
- No extra keys required for basic deploy; env vars above are enough.
- If you use Vercel Analytics or other add-ons, their keys are separate.

---

## Quick copy-paste list (names only)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRO_PRICE_ID
STRIPE_AGENCY_PRICE_ID
LEMONSQUEEZY_API_KEY
LEMONSQUEEZY_STORE_ID
LEMONSQUEEZY_VARIANT_ID_PRO
LEMONSQUEEZY_VARIANT_ID_AGENCY
LEMONSQUEEZY_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPPORT_EMAIL
```

---

## Security reminders

- **Never** commit `.env.local` or put real keys in the repo.
- **Never** use the service role key or Stripe secret key in client-side code.
- Use **test** Stripe keys and test mode until you’re ready to go live; then switch to **live** keys and create a **live** webhook endpoint.
- Rotate any key if it might have been exposed.
