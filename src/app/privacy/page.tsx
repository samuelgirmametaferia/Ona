import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | LeadForge",
  description: "Privacy Policy for LeadForge B2B lead database.",
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Privacy Policy</h1>
        <p className="mt-2 text-[var(--text-muted)]">Last updated: {new Date().toLocaleDateString("en-CA")}</p>

        <div className="mt-10 space-y-8 text-[var(--text-secondary)]">
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">1. Who we are</h2>
            <p className="mt-2">
              LeadForge (“we”) operates a B2B lead database service. This policy describes how we collect, use, and protect your information when you use our website and service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">2. Information we collect</h2>
            <p className="mt-2">We collect:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><strong className="text-[var(--text-primary)]">Account data:</strong> email address, password (hashed), and if you use Google sign-in, the email and profile info provided by Google.</li>
              <li><strong className="text-[var(--text-primary)]">Payment data:</strong> billing is handled by Lemon Squeezy. We store your subscription plan and status; we do not store your full payment card details.</li>
              <li><strong className="text-[var(--text-primary)]">Usage data:</strong> we may log access to the app, exports, and API usage for security, limits, and improving the service.</li>
              <li><strong className="text-[var(--text-primary)]">Communications:</strong> if you contact us (e.g. via the contact form or email), we keep the content and your contact details to respond.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">3. How we use your information</h2>
            <p className="mt-2">
              We use your information to: provide and operate the Service; authenticate you; process subscriptions and enforce plan limits; send transactional emails (e.g. password reset, subscription updates); respond to support requests; improve the product; and comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">4. Data storage and processors</h2>
            <p className="mt-2">
              We use Supabase (database and authentication) and Lemon Squeezy (payments). Data may be stored in regions chosen by these providers. We do not sell your personal information. We may share data only as required by law or to protect our rights and safety.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">5. Cookies and similar tech</h2>
            <p className="mt-2">
              We use session cookies and similar technology for authentication and preferences. These are necessary for the Service to function. We do not use third-party advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">6. Your rights</h2>
            <p className="mt-2">
              Depending on your location, you may have the right to access, correct, or delete your personal data, or to object to or restrict processing. To exercise these rights, contact us via the <Link href="/contact" className="text-forge-500 hover:underline">Contact</Link> page. You can also delete your account (and associated data) by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">7. Retention</h2>
            <p className="mt-2">
              We retain account and subscription data for as long as your account is active and for a reasonable period after cancellation for legal and support purposes. Export and usage logs may be retained for billing and security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">8. Security</h2>
            <p className="mt-2">
              We use industry-standard measures (e.g. HTTPS, hashed passwords, secure env for secrets) to protect your data. No method of transmission or storage is 100% secure; we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">9. Changes</h2>
            <p className="mt-2">
              We may update this Privacy Policy. The “Last updated” date will be revised when we do. Continued use after changes constitutes acceptance. We will notify you of material changes where required.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">10. Contact</h2>
            <p className="mt-2">
              For privacy-related questions or requests: <Link href="/contact" className="text-forge-500 hover:underline">Contact us</Link>.
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
