"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Shield, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow-lg)] transition-colors">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle className="h-6 w-6 text-emerald-500" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">
            Check your email
          </h1>
          <p className="mt-2 text-[var(--text-muted)]">
            We sent a password reset link to <strong className="text-[var(--text-secondary)]">{email}</strong>.
            It may take a minute to arrive.
          </p>
          <Link
            href="/login"
            className="btn-scale mt-6 inline-block rounded-xl bg-forge-500 px-6 py-3 font-medium text-white hover:bg-forge-600"
          >
            Back to log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Link
        href="/login"
        className="absolute left-4 top-4 flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to log in
      </Link>
      <Link href="/" className="mb-10 flex items-center gap-2 font-semibold text-[var(--text-primary)]">
        <Shield className="h-6 w-6 text-forge-500" />
        Loadforge
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-lg)] transition-colors">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Reset password</h1>
        <p className="mt-2 text-[var(--text-muted)]">
          Enter your email and we’ll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-glow mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-forge-500 focus:outline-none focus:ring-2 focus:ring-forge-500/20"
              placeholder="you@company.com"
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
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}
