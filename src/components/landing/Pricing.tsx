import Link from "next/link";
import { Check, Shield } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "Explore the database",
    features: ["View first 50 leads", "Search & filter", "No export"],
    cta: "Get started",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    desc: "For sales teams & founders",
    features: ["Full database access", "1,000 CSV exports/month", "All filters", "Email & phone unlocked"],
    cta: "Get Pro",
    href: "/api/lemonsqueezy/checkout-public?plan=pro",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$99",
    period: "/month",
    desc: "Unlimited scale",
    features: ["Everything in Pro", "Unlimited exports", "Bulk select", "Advanced filters", "Priority support"],
    cta: "Get Agency",
    href: "/api/lemonsqueezy/checkout-public?plan=agency",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-[var(--border)] py-28">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          Simple pricing. No hidden fees.
        </h2>
        <p className="mt-4 text-center text-lg text-[var(--text-muted)]">
          One closed deal pays for the tool. Cancel anytime.
        </p>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card-lift rounded-2xl border p-8 shadow-[var(--shadow)] transition-colors ${
                plan.highlighted
                  ? "border-forge-500 bg-forge-500/10"
                  : "border-[var(--border)] bg-[var(--card)]"
              }`}
            >
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">{plan.name}</h3>
              <p className="mt-2 text-[var(--text-muted)]">{plan.desc}</p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[var(--text-primary)]">{plan.price}</span>
                {plan.period && <span className="text-[var(--text-muted)]">{plan.period}</span>}
              </p>
              <ul className="mt-8 space-y-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <Check className="h-5 w-5 shrink-0 text-forge-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`btn-scale mt-8 block w-full rounded-xl py-3.5 text-center font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-forge-500 text-white hover:bg-forge-600"
                    : "bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border)]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-[var(--text-muted)]">
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 shrink-0" />
            Pay first, then create your account with the same email to unlock access. Cancel anytime.
          </span>
          <Link href="/faq#refund" className="text-forge-500 hover:text-forge-400 hover:underline">
            Refund & cancellation policy
          </Link>
        </p>
      </div>
    </section>
  );
}
