import { Clock, AlertCircle, FileSearch } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Hours lost scraping",
    text: "Manual scraping and directory hunting eats 15–20 hours before you even send one email.",
  },
  {
    icon: AlertCircle,
    title: "Bounce rates and bad data",
    text: "Unverified lists mean wasted sends, damaged sender reputation, and missed deals.",
  },
  {
    icon: FileSearch,
    title: "Scattered, outdated sources",
    text: "Multiple sources, no single source of truth, and no way to know when data was last verified.",
  },
];

export function ProblemSection() {
  return (
    <section className="border-b border-[var(--border)] px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          Why current solutions fail
        </h2>
        <p className="mt-4 text-center text-lg text-[var(--text-muted)]">
          Most teams waste time and money before they reach a single decision-maker.
        </p>
        <div className="stagger mt-16 grid gap-8 md:grid-cols-3">
          {problems.map((p) => (
            <div
              key={p.title}
              className="card-lift rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                <p.icon className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[var(--text-primary)]">{p.title}</h3>
              <p className="mt-2 text-[var(--text-muted)]">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
