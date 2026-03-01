import Link from "next/link";
import { Shield, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 bg-[var(--bg-primary)]">
      <Link href="/" className="mb-8 flex items-center gap-2 font-semibold text-[var(--text-primary)]">
        <Shield className="h-6 w-6 text-forge-500" />
        LeadForge
      </Link>
      <div className="text-center">
        <p className="text-8xl font-bold text-[var(--text-muted)]">404</p>
        <h1 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">Page not found</h1>
        <p className="mt-2 text-[var(--text-muted)]">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="btn-scale inline-flex items-center gap-2 rounded-xl bg-forge-500 px-6 py-3 font-medium text-white hover:bg-forge-600"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
