import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { PreviewTable } from "@/components/landing/PreviewTable";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { LandingSocialProof } from "@/components/landing/LandingSocialProof";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { CookieNotice } from "@/components/landing/CookieNotice";

async function getLeadCount(): Promise<number> {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { count } = await supabase.from("leads").select("*", { count: "exact", head: true });
    return count ?? 3482;
  } catch {
    return 3482;
  }
}

export default async function HomePage() {
  const leadCount = await getLeadCount();

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* 1. Hero — clear promise, one CTA, supporting line */}
        <section className="border-b border-[var(--border)] px-4 pb-28 pt-24 md:pb-36 md:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="animate-fade-up text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl lg:text-6xl lg:leading-tight">
              The most accurate database of{" "}
              <span className="text-forge-500">roofing contractors</span> in Canada
            </h1>
            <p className="animate-fade-up mt-8 text-xl text-[var(--text-muted)] md:text-2xl" style={{ animationDelay: "0.1s" }}>
              Verified monthly. No scraped junk. Built for agencies.
            </p>
            <p className="animate-fade-up mt-3 text-lg text-[var(--text-muted)]" style={{ animationDelay: "0.15s" }}>
              {leadCount.toLocaleString()} companies — search, filter, and export in minutes.
            </p>
            <div className="animate-fade-up mt-12 flex flex-wrap items-center justify-center gap-5" style={{ animationDelay: "0.2s" }}>
              <Link
                href="/api/lemonsqueezy/checkout-public?plan=pro"
                className="btn-scale rounded-2xl bg-forge-500 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-forge-500/25 hover:bg-forge-600"
              >
                Get Pro access
              </Link>
              <Link
                href="#preview"
                className="btn-scale rounded-2xl border-2 border-[var(--border)] px-10 py-4 text-lg font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
              >
                Preview database
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Social proof — logos or user count */}
        <LandingSocialProof leadCount={leadCount} />

        {/* 3. Problem — why current solutions fail */}
        <ProblemSection />

        {/* 4. Solution — 3–5 feature blocks */}
        <SolutionSection />

        {/* 5. Demo / visual */}
        <section id="preview" className="border-y border-[var(--border)] px-4 py-28">
          <div className="mx-auto max-w-5xl">
            <h2 className="animate-fade-up text-center text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
              See what you get
            </h2>
            <p className="mt-4 text-center text-lg text-[var(--text-muted)]">
              Company names, location, and verification dates. Unlock to see emails & phones.
            </p>
            <div className="mt-14">
              <PreviewTable />
            </div>
          </div>
        </section>

        {/* 6. Reviews */}
        <Testimonials />

        {/* 7. Pricing */}
        <Pricing />

        {/* 8. Final CTA */}
        <section className="border-t border-[var(--border)] px-4 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
              Stop wasting 20 hours scraping. Get verified contacts instantly.
            </h2>
            <Link
              href="/api/lemonsqueezy/checkout-public?plan=pro"
              className="btn-scale mt-8 inline-block rounded-2xl bg-forge-500 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-forge-500/25 hover:bg-forge-600"
            >
              Get Pro access
            </Link>
          </div>
        </section>

        <CookieNotice />
        <footer className="border-t border-[var(--border)] px-4 py-10">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
            <span>© Loadforge. One niche. One country. Verified.</span>
            <nav className="flex flex-wrap items-center gap-6">
              <Link href="/faq" className="hover:text-[var(--text-primary)]">FAQ</Link>
              <Link href="/status" className="hover:text-[var(--text-primary)]">Status</Link>
              <Link href="/terms" className="hover:text-[var(--text-primary)]">Terms</Link>
              <Link href="/privacy" className="hover:text-[var(--text-primary)]">Privacy</Link>
              <Link href="/contact" className="hover:text-[var(--text-primary)]">Contact</Link>
              <Link href="/login" className="hover:text-[var(--text-primary)]">Log in</Link>
            </nav>
          </div>
        </footer>
      </main>
    </>
  );
}
