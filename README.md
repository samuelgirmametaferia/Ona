# Loadforge

A subscription-based B2B lead database for one niche in one country (e.g. **Roofing Contractors in Canada**). Verified, searchable, exportable.

## Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS
- **Backend:** Next.js API routes, Supabase (Postgres + Auth)
- **Payments:** Stripe (subscriptions)
- **Hosting:** Vercel

## Setup

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Supabase**

   - Create a project at [supabase.com](https://supabase.com).
   - In SQL Editor, run the contents of `supabase/schema.sql`.
   - In Authentication → Providers, enable Email and Google if you want OAuth.
   - Copy the project URL and keys into `.env.local` (see `.env.example`).

3. **Stripe**

   - Create products and recurring prices: **Pro $49/month**, **Agency $99/month**.
   - Copy the price IDs and `STRIPE_SECRET_KEY` into `.env.local`.
   - For webhooks (subscription sync), add endpoint:
     - URL: `https://your-domain.com/api/stripe/webhook`
     - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Use the webhook signing secret as `STRIPE_WEBHOOK_SECRET`.

4. **Env**

   Copy `.env.example` to `.env.local` and fill in all values.

5. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## First admin user

In Supabase SQL Editor after your first sign-up:

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
```

Then you can use **Admin** (link in dashboard nav) to add leads, bulk upload CSV, and view MRR/stats.

## MVP features

- **Landing:** Headline, lead count, blurred preview table, pricing, testimonials, CTA
- **Auth:** Email/password + Google OAuth (Supabase)
- **Dashboard:** Total leads, added this month, last updated; lead table with search, province/city filters, sort, pagination
- **Plans:** Free (50 leads, no export), Pro ($49/mo, 1k exports/mo), Agency ($99/mo, unlimited exports)
- **Export:** CSV export for paid users; rate-limited; per-plan monthly limit
- **Admin:** Add/edit/delete leads, bulk CSV upload, users list, MRR and exports stats

## Project structure

- `src/app` – Pages and API routes
- `src/components` – Landing and dashboard components
- `src/lib` – Supabase clients, Stripe, auth helpers, utils
- `supabase/schema.sql` – Tables, RLS, trigger for new user profile

## Marketing angle (example)

> “Stop wasting 20 hours scraping roofing contractor emails. Get 3,482 verified contacts instantly.”

One niche. One country. Quality over quantity.
