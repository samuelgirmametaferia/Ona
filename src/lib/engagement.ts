import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const DAYS_7 = 7 * 24 * 60 * 60 * 1000;

export interface UserEngagement {
  id: string;
  email: string;
  role: string;
  subscription_plan: string;
  created_at: string;
  last_login_at: string | null;
  login_count_7d: number;
  export_count_7d: number;
  page_views_7d: number;
  search_count_7d: number;
  engagement_score: number;
}

/**
 * Compute engagement score: logins*2 + exports*3 + page_views*0.5 + search*1 (last 7 days).
 */
function score(logins: number, exports: number, pageViews: number, searches: number): number {
  return Math.round(logins * 2 + exports * 3 + pageViews * 0.5 + searches * 1);
}

export async function getUsersWithEngagement(): Promise<UserEngagement[]> {
  const since = new Date(Date.now() - DAYS_7).toISOString();

  const { data: profiles } = await admin.from("profiles").select("id, email, role, subscription_plan, created_at").order("created_at", { ascending: false });
  if (!profiles?.length) return [];

  const { data: events } = await admin
    .from("activity_events")
    .select("user_id, event_type, created_at")
    .gte("created_at", since);

  const byUser: Record<string, { logins: number; exports: number; page_views: number; searches: number; lastLogin: string | null }> = {};
  for (const p of profiles) {
    byUser[p.id] = { logins: 0, exports: 0, page_views: 0, searches: 0, lastLogin: null };
  }
  for (const e of events ?? []) {
    const u = byUser[e.user_id];
    if (!u) continue;
    if (e.event_type === "login") {
      u.logins += 1;
      if (!u.lastLogin || e.created_at > u.lastLogin) u.lastLogin = e.created_at;
    } else if (e.event_type === "export") u.exports += 1;
    else if (e.event_type === "page_view" || e.event_type === "dashboard_view") u.page_views += 1;
    else if (e.event_type === "search") u.searches += 1;
  }

  return profiles.map((p) => {
    const u = byUser[p.id] ?? { logins: 0, exports: 0, page_views: 0, searches: 0, lastLogin: null };
    return {
      id: p.id,
      email: p.email,
      role: p.role,
      subscription_plan: p.subscription_plan,
      created_at: p.created_at,
      last_login_at: u.lastLogin,
      login_count_7d: u.logins,
      export_count_7d: u.exports,
      page_views_7d: u.page_views,
      search_count_7d: u.searches,
      engagement_score: score(u.logins, u.exports, u.page_views, u.searches),
    };
  });
}
