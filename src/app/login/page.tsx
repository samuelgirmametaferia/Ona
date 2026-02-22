"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Shield, Loader2, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (useMagicLink) {
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setLoading(false);
      if (err) {
        setError(err.message);
        return;
      }
      setMagicSent(true);
      return;
    }
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function signInWithGoogle() {
    setError("");
    setGoogleLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (err) {
        setError(err.message);
        setGoogleLoading(false);
        return;
      }
      // Redirect started; keep loading until page unloads
    } catch (e) {
      setError("Something went wrong. Try signing in with email below.");
      setGoogleLoading(false);
    }
  }

  if (magicSent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow-lg)] transition-colors">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Check your email</h1>
          <p className="mt-2 text-[var(--text-muted)]">
            We sent a sign-in link to <strong className="text-[var(--text-secondary)]">{email}</strong>. Click it to log in.
          </p>
          <Link href="/login" className="mt-6 inline-block text-forge-500 hover:underline">
            Back to log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-10 flex items-center gap-2 font-semibold text-[var(--text-primary)]">
        <Shield className="h-6 w-6 text-forge-500" />
        Loadforge
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-lg)] transition-colors">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Log in</h1>
        <p className="mt-2 text-[var(--text-muted)]">Access your lead database</p>

        {/* Google - primary, with loading and error fallback */}
        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={googleLoading}
          className="btn-scale mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] py-3.5 font-medium text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-60"
        >
          {googleLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {googleLoading ? "Signing in with Google…" : "Continue with Google"}
        </button>

        {error && (
          <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
            <p className="text-sm text-amber-600 dark:text-amber-400">{error}</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Use email below to sign in instead.</p>
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs text-[var(--text-muted)]">or</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
          {!useMagicLink && (
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)]">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-forge-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!useMagicLink}
                className="input-glow mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text-primary)] focus:border-forge-500 focus:outline-none focus:ring-2 focus:ring-forge-500/20"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-scale w-full rounded-xl bg-forge-500 py-3.5 font-medium text-white hover:bg-forge-600 disabled:opacity-50"
          >
            {loading ? "Sending…" : useMagicLink ? "Email me a sign-in link" : "Log in"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setUseMagicLink(!useMagicLink)}
          className="mt-4 flex w-full items-center justify-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <Mail className="h-4 w-4" />
          {useMagicLink ? "Use password instead" : "Use passwordless link instead"}
        </button>

        <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
          Don’t have an account?{" "}
          <Link href="/signup" className="font-medium text-forge-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
