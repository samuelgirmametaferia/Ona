import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export type ActivityEventType = "login" | "page_view" | "export" | "search" | "dashboard_view";

/**
 * Log an activity event. Call from API routes or server components with service role.
 */
export async function logActivity(params: {
  userId: string;
  eventType: ActivityEventType;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await admin.from("activity_events").insert({
      user_id: params.userId,
      event_type: params.eventType,
      metadata: params.metadata ?? {},
    });
  } catch {
    // Non-blocking; don't fail the request
  }
}
