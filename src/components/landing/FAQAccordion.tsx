"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Item = { id: string; question: string; answer: string };

export function FAQAccordion({ items }: { items: Item[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            id={item.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow)] transition-colors"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]/50 rounded-xl transition-colors"
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ease-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="border-t border-[var(--border)] px-5 py-4 text-[var(--text-secondary)]">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
