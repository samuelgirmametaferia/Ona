"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface PreviewRow {
  company_name: string;
  city: string | null;
  province: string | null;
  website: string | null;
  verified_at: string | null;
}

export function PreviewTable() {
  const [rows, setRows] = useState<PreviewRow[]>([]);

  useEffect(() => {
    fetch("/api/leads/preview")
      .then((r) => r.json())
      .then(setRows)
      .catch(() =>
        setRows([
          { company_name: "ABC Roofing Ltd", city: "Toronto", province: "ON", website: "https://example.com", verified_at: new Date().toISOString() },
          { company_name: "Peak Roofing", city: "Vancouver", province: "BC", website: "https://example.com", verified_at: new Date().toISOString() },
          { company_name: "Summit Contractors", city: "Calgary", province: "AB", website: "https://example.com", verified_at: new Date().toISOString() },
        ])
      );
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--bg-tertiary)]">
            <th className="px-5 py-4 font-medium text-[var(--text-muted)]">Company</th>
            <th className="px-5 py-4 font-medium text-[var(--text-muted)]">City</th>
            <th className="px-5 py-4 font-medium text-[var(--text-muted)]">Province</th>
            <th className="px-5 py-4 font-medium text-[var(--text-muted)]">Email</th>
            <th className="px-5 py-4 font-medium text-[var(--text-muted)]">Phone</th>
            <th className="px-5 py-4 font-medium text-[var(--text-muted)]">Verified</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--border)] last:border-0">
              <td className="px-5 py-4 font-medium text-[var(--text-primary)]">{row.company_name}</td>
              <td className="px-5 py-4 text-[var(--text-muted)]">{row.city ?? "—"}</td>
              <td className="px-5 py-4 text-[var(--text-muted)]">{row.province ?? "—"}</td>
              <td className="px-5 py-4">
                <span className="blur-value inline-block min-w-[120px]">contact@company.com</span>
              </td>
              <td className="px-5 py-4">
                <span className="blur-value inline-block min-w-[90px]">(555) 123-4567</span>
              </td>
              <td className="px-5 py-4 text-[var(--text-muted)]">
                {row.verified_at ? formatDate(row.verified_at) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-[var(--border)] bg-[var(--bg-tertiary)] px-5 py-3 text-center text-sm text-[var(--text-muted)]">
        Unlock full database to see emails & phones • Updated monthly
      </p>
    </div>
  );
}
