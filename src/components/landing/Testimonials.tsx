import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Stopped wasting 20 hours scraping. Had a list of 500 roofing contacts in 10 minutes.",
    author: "Sarah M.",
    role: "Marketing agency owner",
  },
  {
    quote:
      "One closed deal paid for Loadforge for the year. No-brainer for B2B outreach.",
    author: "James K.",
    role: "SaaS founder",
  },
  {
    quote:
      "Finally a list that's actually verified. Emails that bounce are rare.",
    author: "Alex T.",
    role: "Wholesaler",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-[var(--border)] py-28">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          Trusted by agencies and founders
        </h2>
        <p className="mt-4 text-center text-lg text-[var(--text-muted)]">
          Early beta. Real results.
        </p>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <blockquote
              key={i}
              className="card-lift rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow)]"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-5 w-5 fill-forge-500 text-forge-500" />
                ))}
              </div>
              <p className="mt-4 text-lg leading-relaxed text-[var(--text-secondary)]">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-6">
                <cite className="not-italic font-semibold text-[var(--text-primary)]">{t.author}</cite>
                <p className="text-sm text-[var(--text-muted)]">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
