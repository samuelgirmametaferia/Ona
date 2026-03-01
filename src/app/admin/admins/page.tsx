"use client";

import { useState, useEffect } from "react";
import { Shield, UserPlus, Trash2, Loader2 } from "lucide-react";

type Admin = { id: string; email: string; role: string; created_at: string };

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function fetchAdmins() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/admins");
      const data = await res.json();
      if (res.ok) setAdmins(data.admins ?? []);
      else setError(data.error ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Admin added.");
        setEmail("");
        fetchAdmins();
      } else {
        setError(data.error ?? "Failed to add admin");
      }
    } finally {
      setAdding(false);
    }
  }

  async function removeAdmin(id: string) {
    setError("");
    setMessage("");
    setRemoving(id);
    try {
      const res = await fetch(`/api/admin/admins/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setMessage("Admin removed.");
        fetchAdmins();
      } else {
        setError(data.error ?? "Failed to remove");
      }
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Administrators</h1>
      <p className="text-sm text-[var(--text-muted)]">
        Add or remove administrators. Only admins can access the admin panel and manage leads, users, and campaigns.
      </p>

      <form onSubmit={addAdmin} className="flex flex-wrap items-end gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="min-w-[200px]">
          <label className="block text-sm font-medium text-[var(--text-secondary)]">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-[var(--text-primary)]"
          />
        </div>
        <button
          type="submit"
          disabled={adding}
          className="inline-flex items-center gap-2 rounded-lg bg-forge-500 px-4 py-2 text-sm font-medium text-white hover:bg-forge-600 disabled:opacity-50"
        >
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Add admin
        </button>
      </form>

      {error && <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-600 dark:text-amber-400">{error}</div>}
      {message && <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400">{message}</div>}

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
                <th className="px-4 py-3 font-medium text-[var(--text-primary)]">Added</th>
                <th className="w-24 px-4 py-3 font-medium text-[var(--text-primary)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3 text-[var(--text-primary)]">{a.email}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{new Date(a.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => removeAdmin(a.id)}
                      disabled={removing === a.id || admins.length <= 1}
                      className="inline-flex items-center gap-1 rounded border border-red-500/30 px-2 py-1 text-xs text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      {removing === a.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                      Remove
                    </button>
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
