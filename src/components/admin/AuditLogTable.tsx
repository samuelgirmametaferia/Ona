"use client";

import { formatDate } from "@/lib/utils";

type Entry = {
  id: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
};

export function AuditLogTable({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--text-muted)]">
        No audit entries yet. Lead add, edit, delete, and bulk uploads will appear here.
      </div>
    );
  }

  const actionLabel: Record<string, string> = {
    lead_created: "Created",
    lead_updated: "Updated",
    lead_deleted: "Deleted",
    bulk_upload: "Bulk upload",
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)]">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[var(--border)] bg-[var(--bg-tertiary)]/50">
          <tr>
            <th className="px-4 py-3 font-medium text-[var(--text-muted)]">Time</th>
            <th className="px-4 py-3 font-medium text-[var(--text-muted)]">Actor</th>
            <th className="px-4 py-3 font-medium text-[var(--text-muted)]">Action</th>
            <th className="px-4 py-3 font-medium text-[var(--text-muted)]">Entity</th>
            <th className="px-4 py-3 font-medium text-[var(--text-muted)]">Details</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-tertiary)]/30">
              <td className="whitespace-nowrap px-4 py-3 text-[var(--text-secondary)]">{formatDate(e.createdAt)}</td>
              <td className="px-4 py-3 text-[var(--text-secondary)]">{e.actorEmail}</td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-forge-500/20 text-forge-500">
                  {actionLabel[e.action] ?? e.action}
                </span>
              </td>
              <td className="px-4 py-3 text-[var(--text-secondary)]">
                {e.entityType}
                {e.entityId && (
                  <span className="ml-1 font-mono text-xs text-[var(--text-muted)]">{e.entityId.slice(0, 8)}…</span>
                )}
              </td>
              <td className="px-4 py-3 text-[var(--text-muted)]">
                {e.details && typeof e.details === "object" && Object.keys(e.details).length > 0
                  ? JSON.stringify(e.details)
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
