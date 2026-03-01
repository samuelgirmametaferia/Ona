import { Database, CheckCircle2, Download, Shield, RefreshCw } from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Comprehensive B2B database",
    text: "Millions of verified companies in one searchable, filterable database. No more juggling spreadsheets or multiple sources.",
  },
  {
    icon: CheckCircle2,
    title: "Verified contacts",
    text: "Emails and phones checked so you don’t burn your domain or waste time on bounces.",
  },
  {
    icon: Download,
    title: "Export and go",
    text: "CSV export with your plan limits. Use the data in your CRM or outreach tools immediately.",
  },
  {
    icon: RefreshCw,
    title: "Updated monthly",
    text: "Data is refreshed so you’re not chasing leads that have changed or closed.",
  },
  {
    icon: Shield,
    title: "Built for compliance",
    text: "Use the data responsibly; we keep it clean so you can focus on outreach that converts.",
  },
];

export function SolutionSection() {
  return (
    <section className="border-b border-[var(--border)] px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          Your solution: verified B2B data, zero scraping
        </h2>
        <p className="mt-4 text-center text-lg text-[var(--text-muted)]">
          One platform to search, filter, and export verified contacts. Built for sales teams and agencies.
        </p>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.slice(0, 3).map((f, i) => (
            <div
              key={f.title}
              className="card-lift rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forge-500/10">
                <f.icon className="h-6 w-6 text-forge-500" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[var(--text-primary)]">{f.title}</h3>
              <p className="mt-2 text-[var(--text-muted)]">{f.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {features.slice(3).map((f) => (
            <div
              key={f.title}
              className="card-lift rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forge-500/10">
                <f.icon className="h-6 w-6 text-forge-500" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[var(--text-primary)]">{f.title}</h3>
              <p className="mt-2 text-[var(--text-muted)]">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
