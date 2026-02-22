-- LeadForge schema for Supabase (run in SQL Editor)

-- Custom types
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'agency');
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Users (extends Supabase auth.users via public.profiles)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  stripe_customer_id TEXT,
  subscription_plan subscription_plan NOT NULL DEFAULT 'free',
  subscription_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Leads
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  owner_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  city TEXT,
  province TEXT,
  employee_count INT,
  revenue_estimate TEXT,
  linkedin TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Exports (track per-user export count)
CREATE TABLE public.exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lead_ids UUID[] NOT NULL,
  exported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_leads_province ON public.leads(province);
CREATE INDEX idx_leads_city ON public.leads(city);
CREATE INDEX idx_leads_company_name ON public.leads(company_name);
CREATE INDEX idx_leads_verified_at ON public.leads(verified_at DESC);
CREATE INDEX idx_exports_user_id ON public.exports(user_id);
CREATE INDEX idx_exports_exported_at ON public.exports(exported_at);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own row; service role for admin
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage profiles" ON public.profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Leads: authenticated users can read; only service_role/admin can write (handled in API)
CREATE POLICY "Authenticated users can read leads" ON public.leads
  FOR SELECT TO authenticated USING (true);

-- Exports: users can insert own; read own
CREATE POLICY "Users can insert own exports" ON public.exports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own exports" ON public.exports
  FOR SELECT USING (auth.uid() = user_id);

-- Trigger: create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Only service role can change profiles.role (prevents self-promotion)
CREATE OR REPLACE FUNCTION public.ensure_role_change_by_service_role()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role AND current_setting('request.jwt.claims', true)::json->>'role' IS DISTINCT FROM 'service_role' THEN
    RAISE EXCEPTION 'Only service role can change user role';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profiles_role_change
  BEFORE UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.ensure_role_change_by_service_role();

-- Audit log (admin actions: lead add/edit/delete, bulk upload)
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at DESC);
CREATE INDEX idx_audit_log_actor_id ON public.audit_log(actor_id);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access audit_log" ON public.audit_log
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Pending subscriptions: pay-first flow (no user_id at checkout); claim when user signs up or logs in
CREATE TABLE public.pending_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  plan subscription_plan NOT NULL,
  lemon_order_id TEXT,
  lemon_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'claimed')),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_pending_subscriptions_email ON public.pending_subscriptions(email);
CREATE INDEX idx_pending_subscriptions_status ON public.pending_subscriptions(status);

ALTER TABLE public.pending_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access pending_subscriptions" ON public.pending_subscriptions
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Optional: allow anon read for landing page count (or use a view/function)
-- For MVP we'll fetch count server-side with service role or a single public count.
