import { createClient } from "@/lib/supabase/server";

export type ProfileRow = {
  id: string;
  email: string;
  role: string;
  stripe_customer_id: string | null;
  subscription_plan: string;
  subscription_status: string | null;
  created_at: string;
};

export async function getProfile(): Promise<ProfileRow | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return data as ProfileRow | null;
}

export async function requireAuth() {
  const profile = await getProfile();
  if (!profile) {
    throw new Response("Unauthorized", { status: 302, headers: { Location: "/login" } });
  }
  return profile;
}

export async function requireAdmin() {
  const profile = await requireAuth();
  if (profile.role !== "admin") {
    throw new Response("Forbidden", { status: 403 });
  }
  return profile;
}
