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
| `NEXT_PUBLIC_APP_URL` | Yes | **Production URL**, e.g. `https://loadforge.org`. Used for auth redirects, checkout success URL, and welcome email links. Set this in production so welcome emails do not link to localhost. |
| `APP_URL` | Optional | Server-only; used for welcome email links. If set (e.g. `https://loadforge.org`), email links use this even when `NEXT_PUBLIC_APP_URL` is wrong. If the resolved URL is localhost, the code falls back to `https://loadforge.org` for emails. |
| `RESEND_API_KEY` | Recommended | So welcome emails send after signup. |
| `RESEND_FROM` | Recommended | e.g. `Loadforge <noreply@loadforge.org>` (use your verified Resend domain). |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Optional | Shown on /contact page. |
| `SEND_WELCOME_SECRET` | Optional | If set, `POST /api/send-welcome` requires header `X-Send-Welcome-Secret: <value>`. Use a random string in production to lock down that endpoint. |
| `UPSTASH_REDIS_REST_URL` | Optional | From [Upstash](https://upstash.com) Redis. When set with `UPSTASH_REDIS_REST_TOKEN`, rate limiting uses Redis (recommended on Vercel so limits are shared across serverless instances). |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Upstash Redis REST token. |

---

## 2b. Generate SEND_WELCOME_SECRET and other changes from .env.local

When you import `.env.local` into production, do the following.

### Generate SEND_WELCOME_SECRET

Run one of these in a terminal and paste the output into your production env as `SEND_WELCOME_SECRET`:

**PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

**Node (if you have Node in PATH):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use the generated string only in production env (Vercel, etc.). Any caller of `POST /api/send-welcome` must send the header `X-Send-Welcome-Secret: <that-value>`.

### What to change when moving .env.local to production

| Item | In production |
|------|----------------|
| **NEXT_PUBLIC_APP_URL** | Your live URL, e.g. `https://your-app.vercel.app` or `https://loadforge.org`. **Must** be set. |
| **SEND_WELCOME_SECRET** | Add the value you generated above (recommended so only your app/cron can trigger welcome emails). |
| **Supabase** | If you use a separate production Supabase project: replace all three Supabase env vars with that project's values. |
| **RESEND_FROM** | Use an address on your **verified** Resend domain (e.g. `Loadforge <noreply@yourdomain.com>`), not the default onboarding address. |
| **Lemon Squeezy** | If you use a production store: use production API key, store ID, variant IDs, and create a **production** webhook with URL `https://<your-domain>/api/lemonsqueezy/webhook` and set `LEMONSQUEEZY_WEBHOOK_SECRET` to that webhook's signing secret. |
| **Upstash** (optional) | Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` so rate limiting is shared across Vercel instances. |

---

## 3. Supabase (production)

- [ ] Create a **production** Supabase project (or use existing).
- [ ] **SQL (run in order):** In **SQL Editor**, run the full `supabase/schema.sql` (tables, indexes, RLS, trigger, audit_log). Then run `supabase/schema-activity-campaigns.sql` for activity tracking and email campaigns. If you already have tables, run only the parts you’re missing or migrate carefully.
- [ ] **Authentication → URL Configuration** (Dashboard → Authentication → URL Configuration):
  - **Site URL:** your production app URL (e.g. `https://loadforge.org`). If this is still `http://localhost:3000`, post-login redirects will go to localhost.
  - **Redirect URLs:** add `https://loadforge.org/auth/callback` (and www if needed). The app sends `window.location.origin + '/auth/callback'`, so Supabase must allow your production origin here.
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
