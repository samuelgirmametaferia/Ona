"use client";

export function LandingSocialProof({ leadCount }: { leadCount: number }) {
  return (
    <section className="border-b border-[var(--border)] px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-sm font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Trusted by agencies and sales teams
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
              {leadCount.toLocaleString()}+
            </p>
            <p className="text-sm text-[var(--text-muted)]">Verified leads</p>
          </div>
          <div className="h-8 w-px bg-[var(--border)] hidden sm:block" />
          <div className="text-center">
            <p className="text-3xl font-bold text-[var(--text-primary)] md:text-4xl">Updated</p>
            <p className="text-sm text-[var(--text-muted)]">Monthly</p>
          </div>
          <div className="h-8 w-px bg-[var(--border)] hidden sm:block" />
          <div className="text-center">
            <p className="text-3xl font-bold text-[var(--text-primary)] md:text-4xl">Canada</p>
            <p className="text-sm text-[var(--text-muted)]">Roofing contractors</p>
          </div>
        </div>
      </div>
    </section>
  );
}
