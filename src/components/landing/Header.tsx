"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-sm transition-colors duration-300"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-[var(--text-primary)]"
        >
          <Shield className="h-6 w-6 text-forge-500" />
          Loadforge
        </Link>
        <nav className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="#pricing"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/faq"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/login"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/api/lemonsqueezy/checkout-public?plan=pro"
            className="btn-scale rounded-xl bg-forge-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-forge-600 transition-colors"
          >
            Get Pro
          </Link>
        </nav>
      </div>
    </header>
  );
}
