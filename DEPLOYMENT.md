# Loadforge — Deployment checklist

Use this list to deploy to production (e.g. Vercel). Do the **Your part** items; the rest is already implemented.

---

## 1. Hosting (e.g. Vercel)

- [ ] Push code to GitHub (or connect your repo to Vercel).
- [ ] Create a new project in [Vercel](https://vercel.com) and import the repo.
- [ ] Add your production domain (e.g. `loadforge.org` or `app.loadforge.org`) in Vercel → Project → Settings → Domains.
- [ ] Set **all** environment variables in Vercel → Project → Settings → Environment Variables (see section 2). Use **Production** (and Preview if you want).
- [ ] Deploy. Subsequent pushes to main will auto-deploy if connected.

---

## 2. Environment variables (production)

Set these in your host’s dashboard. **Never commit real values to the repo.**

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (production project). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (keep secret). |
| `LEMONSQUEEZY_API_KEY` | Yes | From Lemon Squeezy → Settings → API. |
| `LEMONSQUEEZY_STORE_ID` | Yes | Your store ID. |
| `LEMONSQUEEZY_VARIANT_ID_PRO` | Yes | Variant ID for Pro plan product. |
| `LEMONSQUEEZY_VARIANT_ID_AGENCY` | Yes | Variant ID for Agency plan product. |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Yes | From Lemon Squeezy webhook (signing secret). |
| `NEXT_PUBLIC_APP_URL` | Yes | **Production URL**, e.g. `https://loadforge.org` or `https://app.loadforge.org`. Used for auth redirects, emails, and checkout success URL. |
| `RESEND_API_KEY` | Recommended | So welcome emails send after signup. |
| `RESEND_FROM` | Recommended | e.g. `Loadforge <noreply@loadforge.org>` (use your verified Resend domain). |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Optional | Shown on /contact page. |
| `SEND_WELCOME_SECRET` | Optional | If set, `POST /api/send-welcome` requires header `X-Send-Welcome-Secret: <value>`. Use a random string in production to lock down that endpoint. |
| `UPSTASH_REDIS_REST_URL` | Optional | From [Upstash](https://upstash.com) Redis. When set with `UPSTASH_REDIS_REST_TOKEN`, rate limiting uses Redis (recommended on Vercel so limits are shared across serverless instances). |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Upstash Redis REST token. |

---

## 3. Supabase (production)

- [ ] Create a **production** Supabase project (or use existing).
- [ ] In **SQL Editor**, run the full `supabase/schema.sql` (tables, indexes, RLS, trigger, audit_log). Then run `supabase/schema-activity-campaigns.sql` for activity tracking and email campaigns. If you already have tables, run only the parts you’re missing or migrate carefully.
- [ ] **Authentication → URL Configuration:**
  - Set **Site URL** to your production app URL (e.g. `https://loadforge.org`).
  - Add **Redirect URLs**: `https://loadforge.org/auth/callback`, `https://yourdomain.com/auth/callback` (all domains you use).
- [ ] **Authentication → Providers:** Enable Email and Google (or others) as needed. For Google, add the OAuth client ID/secret from Google Cloud Console; set authorized redirect URI to Supabase’s callback URL they show you.
- [ ] Load or import your **leads** data into `public.leads` (the app expects rows there). Use admin upload or a one-off script.

---

## 4. Lemon Squeezy (production)

- [ ] Create products (e.g. “Pro” and “Agency”) and variants with the correct prices ($49 / $99 or your choice).
- [ ] Copy **Variant IDs** and set `LEMONSQUEEZY_VARIANT_ID_PRO` and `LEMONSQUEEZY_VARIANT_ID_AGENCY`.
- [ ] **Webhooks:** Add a webhook URL: `https://your-production-domain.com/api/lemonsqueezy/webhook`.
- [ ] Select events: `order_created`, `subscription_created`, `subscription_updated`, `subscription_cancelled`, `subscription_expired` (or whatever your webhook handler expects; see `src/app/api/lemonsqueezy/webhook/route.ts`).
- [ ] Copy the **Signing secret** and set `LEMONSQUEEZY_WEBHOOK_SECRET`.

---

## 5. Resend (production)

- [ ] Domain already verified (e.g. loadforge.org) at [resend.com/domains](https://resend.com/domains).
- [ ] Set `RESEND_FROM` to an address on that domain (e.g. `Loadforge <noreply@loadforge.org>`).
- [ ] Set `RESEND_API_KEY` in production env.

---

## 6. Post-deploy checks

- [ ] Visit `https://your-domain.com` and confirm the landing page loads.
- [ ] Sign up with email and confirm: receive confirmation email, then welcome email (if Resend is set).
- [ ] Sign up with Google: redirects back to app and welcome email sends (if Resend is set).
- [ ] Log in, open Dashboard → Account: upgrade to Pro or Agency starts Lemon Squeezy checkout.
- [ ] Complete a test purchase (or use LS test mode); confirm webhook runs and profile updates to Pro/Agency (check Supabase `profiles` and export usage).
- [ ] Cancel or manage subscription via “Manage billing at Lemon Squeezy” and confirm plan resets after cancellation/expiry.

---

## Already implemented in the repo

- Next.js app with auth (Supabase), dashboard, admin, landing, pricing, legal pages.
- Lemon Squeezy checkout and webhook; subscription plan/status stored in `profiles`.
- Welcome email (Resend) triggered from auth callback; optional protection via `SEND_WELCOME_SECRET`.
- Signup → paid plan flow: `?plan=pro` / `?plan=agency` redirects to account page to complete checkout.
- Security headers (next.config.js), sitemap, robots.txt, env example.
- RLS and audit log in schema.
- **Rate limiting:** Auth callback, activity API, send-welcome, and all admin APIs are rate-limited (in-memory by default; use Upstash env vars on Vercel for shared Redis limits).
- **Vercel:** `vercel.json` and build are configured; deploy by connecting the repo and setting env vars.

---

## Quick reference: production URLs to configure

| Where | URL to use |
|-------|------------|
| Vercel domain | Your production domain |
| `NEXT_PUBLIC_APP_URL` | `https://loadforge.org` (or your real URL) |
| Supabase Redirect URLs | `https://loadforge.org/auth/callback` |
| Lemon Squeezy webhook | `https://loadforge.org/api/lemonsqueezy/webhook` |

Replace `loadforge.org` with your actual production domain.
