"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Shield, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function DashboardNav({ email, isAdmin }: { email: string; isAdmin: boolean }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)]/50">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
            <Shield className="h-5 w-5 text-forge-500" />
            Loadforge
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/account"
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <Settings className="h-4 w-4" />
              Account
            </Link>
            <Link
              href="/contact"
              className="text-sm text-stone-400 hover:text-white"
            >
              Contact
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm text-amber-400 hover:text-amber-300"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-sm text-[var(--text-muted)]">{email}</span>
          <button
            onClick={signOut}
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
