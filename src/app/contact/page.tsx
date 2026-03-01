import Link from "next/link";
import { Shield, Mail } from "lucide-react";

export const metadata = {
  title: "Contact | LeadForge",
  description: "Contact LeadForge for support and inquiries.",
};

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@leadforge.io";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
            <Shield className="h-5 w-5 text-forge-500" />
            LeadForge
          </Link>
          <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            Back to home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Contact us</h1>
        <p className="mt-2 text-[var(--text-muted)]">
          Questions, support, or feedback? We’re here to help.
        </p>

        <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-forge-500/20 p-3">
              <Mail className="h-6 w-6 text-forge-500" />
            </div>
            <div>
              <h2 className="font-semibold text-[var(--text-primary)]">Email</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                For support, billing questions, or partnership inquiries, email us at:
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-3 inline-block text-forge-500 hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
              <p className="mt-4 text-sm text-[var(--text-muted)]">
                We aim to respond within 1–2 business days.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-10 text-sm text-[var(--text-muted)]">
          <Link href="/" className="text-forge-500 hover:underline">← Back to LeadForge</Link>
        </p>
      </main>
    </div>
  );
}
