"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Shield } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords don’t match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Link href="/" className="mb-10 flex items-center gap-2 font-semibold text-[var(--text-primary)]">
        <Shield className="h-6 w-6 text-forge-500" />
        LeadForge
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-lg)] transition-colors">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Set new password</h1>
        <p className="mt-2 text-[var(--text-muted)]">
          Enter your new password below.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)]">
              New password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="input-glow mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text-primary)] focus:border-forge-500 focus:outline-none focus:ring-2 focus:ring-forge-500/20"
            />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-[var(--text-secondary)]">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              className="input-glow mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text-primary)] focus:border-forge-500 focus:outline-none focus:ring-2 focus:ring-forge-500/20"
            />
          </div>
          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-scale w-full rounded-xl bg-forge-500 py-3.5 font-medium text-white hover:bg-forge-600 disabled:opacity-50"
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
          <Link href="/login" className="text-forge-500 hover:underline">Back to log in</Link>
        </p>
      </div>
    </div>
  );
}
