import Link from "next/link";
import { Shield, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Status | LeadForge",
  description: "LeadForge service status and maintenance updates.",
};

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
            <Shield className="h-5 w-5 text-forge-500" />
            LeadForge
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/faq" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              FAQ
            </Link>
            <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              Back to home
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-emerald-500/20 p-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-[var(--text-primary)]">All systems operational</h1>
          <p className="mt-3 text-[var(--text-muted)]">
            LeadForge and its dependencies are running normally. If you experience issues, please{" "}
            <Link href="/contact" className="text-forge-500 hover:underline">contact us</Link>.
          </p>
        </div>

        <div className="mt-16 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Services</h2>
          <ul className="mt-4 space-y-4">
            <li className="flex items-center justify-between border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
              <span className="text-[var(--text-secondary)]">Web app & API</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Operational
              </span>
            </li>
            <li className="flex items-center justify-between border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
              <span className="text-[var(--text-secondary)]">Authentication</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Operational
              </span>
            </li>
            <li className="flex items-center justify-between border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
              <span className="text-[var(--text-secondary)]">Payments (Lemon Squeezy)</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Operational
              </span>
            </li>
          </ul>
        </div>

        <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
          Planned maintenance will be announced here and via email when applicable.
        </p>
      </main>
    </div>
  );
}
