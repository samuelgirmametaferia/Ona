# Loadforge — Security overview

This doc summarizes how the app is secured and what to watch in production.

---

## What’s in place

### Authentication & sessions
- **Supabase Auth**: Login/signup (email + Google). Sessions via HTTP-only cookies; middleware refreshes the session on each request.
- **Protected routes**: Dashboard and admin require a valid session; API routes that need a user call `getUser()` and return 401 when missing.
- **Admin**: Admin UI and all `/api/admin/*` routes check `profile.role === "admin"` and return 403 for non-admins. Admin role is set in the database (`profiles.role`).

### Authorization & data access
- **RLS (Row Level Security)** on Supabase:
  - **profiles**: Users can only SELECT/UPDATE their own row; service role can do everything (used server-side only).
  - **leads**: Any authenticated user can SELECT; only the service role can INSERT/UPDATE/DELETE (used in admin API routes).
  - **exports**: Users can INSERT only with their own `user_id` and SELECT only their own rows.
  - **audit_log**, **pending_subscriptions**: Service role only.
- **Plan limits**: Export and list APIs use `subscription_plan` from the user’s profile; export is blocked for free and capped for Pro.

### API security
- **Lemon Squeezy webhook**: Uses raw body and verifies `X-Signature` with HMAC-SHA256 and `LEMONSQUEEZY_WEBHOOK_SECRET`. Invalid signature → 401.
- **Send-welcome**: If `SEND_WELCOME_SECRET` is set, `POST /api/send-welcome` requires header `X-Send-Welcome-Secret`; otherwise the route is open (suitable only for internal/cron use).
- **Checkout**: Logged-in checkout includes `user_id` in custom data; public checkout uses `checkout_first` and links by email via `pending_subscriptions` and claim logic.
- **Input**: Plan/sort/order and pagination are validated or allowlisted. Search query `q` is length-limited and `%`/`_` are escaped for `ilike` to avoid pattern abuse.

### Rate limiting
- **Leads list, preview, count**: Rate limited by IP (in-memory; resets on restart). Export has its own per-user limit (10 per minute) and monthly plan limits.
- **Production**: For multiple instances or high traffic, consider a shared store (e.g. Redis/Upstash) for rate limits.

### HTTP & headers
- **next.config.js**: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` on all responses.
- **HTTPS**: Enforced by your host (e.g. Vercel) in production. Use `NEXT_PUBLIC_APP_URL` with `https://` and ensure Supabase/Lemon Squeezy are configured for HTTPS.

### Secrets
- **No secrets in the repo**: API keys and webhook secrets live in env (e.g. `.env.local` / Vercel). `.env.example` documents variables without values.
- **Service role key**: Used only in server-side code (webhook, claim-pending, admin client). Never exposed to the client.

---

## Things to do / be aware of

1. **Admin users**: Someone must set `profiles.role = 'admin'` in the database (e.g. via Supabase SQL or dashboard) for your first admin. There is no self-service “become admin” in the app.
2. **Send-welcome in production**: Set `SEND_WELCOME_SECRET` and send that header when calling `POST /api/send-welcome` from a cron or internal service so the route isn’t callable by the public.
3. **Rate limiting**: Current limiter is in-memory. Under multiple serverless instances, limits are per instance. For stricter global limits, add a shared store (e.g. Upstash Redis).
4. **Public endpoints**: `/api/leads/count` and `/api/leads/preview` are unauthenticated by design (for the landing page). They only expose a total count and a small sample of leads; no PII in preview.
5. **Public checkout**: `GET /api/lemonsqueezy/checkout-public?plan=pro|agency` is unauthenticated so visitors can pay first. Abuse is limited by Lemon Squeezy (payments and their own fraud controls).

---

## Quick checklist for production

- [ ] All env vars set in the host (no defaults that point to dev).
- [ ] `SUPABASE_SERVICE_ROLE_KEY` and Lemon Squeezy/Resend keys never in client or logs.
- [ ] Supabase Auth redirect URLs and Lemon Squeezy webhook URL use production HTTPS.
- [ ] First admin created by setting `profiles.role = 'admin'` for your user.
- [ ] `SEND_WELCOME_SECRET` set if you call `/api/send-welcome` from automation.
