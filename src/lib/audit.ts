import type { SupabaseClient } from "@supabase/supabase-js";

export type AuditAction =
  | "lead_created"
  | "lead_updated"
  | "lead_deleted"
  | "bulk_upload";

export type AuditPayload = {
  actorId: string;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
};

export async function logAudit(
  admin: SupabaseClient,
  payload: AuditPayload
): Promise<void> {
  await admin.from("audit_log").insert({
    actor_id: payload.actorId,
    action: payload.action,
    entity_type: payload.entityType,
    entity_id: payload.entityId ?? null,
    details: payload.details ?? null,
  });
}
