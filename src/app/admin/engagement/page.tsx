"use client";

import { useState, useEffect } from "react";
import { BarChart3, Loader2 } from "lucide-react";

type UserEngagement = {
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
};

export default function AdminEngagementPage() {
  const [users, setUsers] = useState<UserEngagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "low">("all");

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/engagement")
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "low" ? users.filter((u) => u.engagement_score < 5 && u.role !== "admin") : users;
  const lowEngagementCount = users.filter((u) => u.engagement_score < 5 && u.role !== "admin").length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">User engagement</h1>
      <p className="text-sm text-[var(--text-muted)]">
        Last 7 days: logins, exports, page views, searches. Engagement score = logins×2 + exports×3 + page_views×0.5 + search×1.
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${filter === "all" ? "bg-forge-500 text-white" : "bg-[var(--bg-tertiary)] text-[var(--text-primary)]"}`}
        >
          All users
        </button>
        <button
          type="button"
          onClick={() => setFilter("low")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${filter === "low" ? "bg-amber-500 text-white" : "bg-[var(--bg-tertiary)] text-[var(--text-primary)]"}`}
        >
          Low engagement ({lowEngagementCount})
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)]">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--text-muted)]" />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--bg-tertiary)]">
              <tr>
                <th className="px-4 py-3 font-medium text-[var(--text-primary)]">Email</th>
                <th className="px-4 py-3 font-medium text-[var(--text-primary)]">Plan</th>
                <th className="px-4 py-3 font-medium text-[var(--text-primary)]">Last login</th>
                <th className="px-4 py-3 font-medium text-[var(--text-primary)]">Logins (7d)</th>
                <th className="px-4 py-3 font-medium text-[var(--text-primary)]">Exports (7d)</th>
                <th className="px-4 py-3 font-medium text-[var(--text-primary)]">Views (7d)</th>
                <th className="px-4 py-3 font-medium text-[var(--text-primary)]">Searches (7d)</th>
                <th className="px-4 py-3 font-medium text-[var(--text-primary)]">Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3 text-[var(--text-primary)]">{u.email}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{u.subscription_plan}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{u.last_login_at ? new Date(u.last_login_at).toLocaleString() : "—"}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{u.login_count_7d}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{u.export_count_7d}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{u.page_views_7d}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{u.search_count_7d}</td>
                  <td className="px-4 py-3">
                    <span className={u.engagement_score < 5 ? "font-medium text-amber-500" : "text-[var(--text-primary)]"}>{u.engagement_score}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
