import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Terms of Service | LeadForge",
  description: "Terms of Service for LeadForge B2B lead database.",
};

export default function TermsPage() {
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
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Terms of Service</h1>
        <p className="mt-2 text-[var(--text-muted)]">Last updated: {new Date().toLocaleDateString("en-CA")}</p>

        <div className="mt-10 space-y-8 text-[var(--text-secondary)]">
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">1. Agreement</h2>
            <p className="mt-2">
              By using LeadForge (“Service”), you agree to these Terms of Service. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">2. Description of Service</h2>
            <p className="mt-2">
              LeadForge provides a subscription-based B2B lead database with verified company contacts across industries. Access, filters, and export limits depend on your plan (Free, Pro, Agency).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">3. Acceptable Use</h2>
            <p className="mt-2">You agree not to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Resell, redistribute, or sublicense the database or exports in bulk.</li>
              <li>Scrape, crawl, or automate access to the Service beyond normal use of the dashboard and export features.</li>
              <li>Use the data for illegal or fraudulent purposes, or in violation of applicable anti-spam or privacy laws.</li>
              <li>Share your account or credentials with others; each subscription is for a single user or organization as agreed.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">4. Subscription and Payment</h2>
            <p className="mt-2">
              Paid plans (Pro, Agency) are billed monthly via Lemon Squeezy. You authorize recurring charges until you cancel. Prices are in the currency shown at checkout. You are responsible for any taxes applicable in your jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">5. Refund and Cancellation Policy</h2>
            <p className="mt-2">
              You may cancel your subscription at any time from your account or via Lemon Squeezy. Cancellation stops future charges; we do not refund fees for the current billing period. There are no refunds for partial months or unused exports.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">6. Data and Accuracy</h2>
            <p className="mt-2">
              We strive to provide accurate, verified contact data but do not guarantee completeness or accuracy. You use the data at your own risk and are responsible for complying with laws (e.g. CASL, GDPR) when contacting leads.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">7. Limitation of Liability</h2>
            <p className="mt-2">
              The Service is provided “as is.” To the maximum extent permitted by law, LeadForge and its operators are not liable for any indirect, incidental, or consequential damages, or loss of profits or data, arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">8. Changes</h2>
            <p className="mt-2">
              We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance. Material changes will be communicated via email or a notice in the Service where practicable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">9. Contact</h2>
            <p className="mt-2">
              Questions about these Terms? Contact us at <Link href="/contact" className="text-forge-500 hover:underline">Contact</Link>.
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-[var(--text-muted)]">
          <Link href="/" className="text-forge-500 hover:underline">← Back to LeadForge</Link>
        </p>
      </main>
    </div>
  );
}
