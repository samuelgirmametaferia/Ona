"use client";

import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Stopped wasting 20 hours scraping. Had a list of 500 roofing contacts in 10 minutes.",
    author: "Sarah M.",
    role: "Marketing agency owner",
    stars: 5,
  },
  {
    quote: "One closed deal paid for Loadforge for the year. No-brainer for B2B outreach.",
    author: "James K.",
    role: "SaaS founder",
    stars: 5,
  },
  {
    quote: "Finally a list that’s actually verified. Emails that bounce are rare.",
    author: "Alex T.",
    role: "Wholesaler",
    stars: 5,
  },
];

export function SignupTestimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const t = testimonials[index];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-lg)] transition-colors">
      <Quote className="absolute right-4 top-4 h-10 w-10 text-forge-500/20" />
      <div className="flex gap-1">
        {Array.from({ length: t.stars }).map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-forge-500 text-forge-500" />
        ))}
      </div>
      <p className="mt-4 text-lg leading-relaxed text-[var(--text-primary)] transition-opacity duration-500">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forge-500/20 text-lg font-semibold text-forge-500">
          {t.author.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-[var(--text-primary)]">{t.author}</p>
          <p className="text-sm text-[var(--text-muted)]">{t.role}</p>
        </div>
      </div>
      <div className="mt-6 flex gap-1.5">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Testimonial ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i === index ? "bg-forge-500" : "bg-[var(--border)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
