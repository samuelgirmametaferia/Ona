-- Run after schema.sql. Activity tracking, email campaigns, and campaign sends.

-- Activity events: login, page_view, export, search, etc.
CREATE TABLE public.activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_activity_events_user_id ON public.activity_events(user_id);
CREATE INDEX idx_activity_events_created_at ON public.activity_events(created_at DESC);
CREATE INDEX idx_activity_events_type_created ON public.activity_events(event_type, created_at DESC);

ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access activity_events" ON public.activity_events
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Email campaigns: templates with conditions for targeting
CREATE TABLE public.email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  conditions JSONB DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_email_campaigns_created_at ON public.email_campaigns(created_at DESC);

ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access email_campaigns" ON public.email_campaigns
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Campaign sends: audit of who received which campaign
CREATE TABLE public.campaign_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'sent'
);
CREATE INDEX idx_campaign_sends_campaign_id ON public.campaign_sends(campaign_id);
CREATE INDEX idx_campaign_sends_user_id ON public.campaign_sends(user_id);
CREATE UNIQUE INDEX idx_campaign_sends_unique ON public.campaign_sends(campaign_id, user_id);

ALTER TABLE public.campaign_sends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access campaign_sends" ON public.campaign_sends
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
