import Link from "next/link";
import { Shield, HelpCircle } from "lucide-react";
import { FAQAccordion } from "@/components/landing/FAQAccordion";

export const metadata = {
  title: "FAQ | LeadForge",
  description: "Frequently asked questions about LeadForge: data freshness, refunds, cancellation, and verification.",
};

const faqs = [
  {
    id: "data-freshness",
    question: "How fresh is the data?",
    answer: "We update our database monthly. Each lead shows a verification date so you know when it was last checked. We verify contacts across industries to ensure high-quality B2B data.",
  },
  {
    id: "refund",
    question: "What is your refund and cancellation policy?",
    answer: "You can cancel your subscription anytime from your account or via Lemon Squeezy—no long-term commitment. If you're not satisfied within 14 days of your first paid charge, contact us for a full refund. After that, we offer prorated refunds at our discretion.",
  },
  {
    id: "cancel",
    question: "How do I cancel my subscription?",
    answer: "Go to Account in your dashboard and click “Manage billing at Lemon Squeezy.” You can cancel there with no phone call required. Access continues until the end of your billing period.",
  },
  {
    id: "email-verification",
    question: "Are emails verified?",
    answer: "We verify that contact details exist and are associated with the business. We don’t run real-time deliverability checks on every email; we recommend using a verification tool when doing large campaigns.",
  },
  {
    id: "export-limits",
    question: "How do export limits work?",
    answer: "Pro includes 1,000 CSV exports per month (resets at the start of each billing month). Agency has unlimited exports. Each export is one CSV file; the number of rows depends on how many leads you select.",
  },
  {
    id: "privacy",
    question: "How is my data used?",
    answer: "We use your account data only to provide the service, process payments, and send essential emails (e.g. welcome, password reset). We don’t sell your data. See our Privacy Policy for full details.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
            <Shield className="h-5 w-5 text-forge-500" />
            LeadForge
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/#pricing" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              Pricing
            </Link>
            <Link href="/status" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              Status
            </Link>
            <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              Back to home
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-forge-500/20 p-3">
            <HelpCircle className="h-8 w-8 text-forge-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Frequently asked questions</h1>
            <p className="mt-1 text-[var(--text-muted)]">
              Data, billing, and how to get the most out of LeadForge.
            </p>
          </div>
        </div>

        <div className="mt-12 space-y-3">
          <FAQAccordion items={faqs} />
        </div>

        <p className="mt-12 text-center text-sm text-[var(--text-muted)]">
          Still have questions?{" "}
          <Link href="/contact" className="text-forge-500 hover:underline">
            Contact us
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
