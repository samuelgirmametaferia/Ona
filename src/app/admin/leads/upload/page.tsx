"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, FileText } from "lucide-react";

const EXPECTED_HEADERS = [
  "company_name",
  "owner_name",
  "email",
  "phone",
  "website",
  "city",
  "province",
  "employee_count",
  "revenue_estimate",
  "linkedin",
];

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ added: number; errors: string[] } | null>(null);

  function parseCsv(text: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (inQuotes) {
        if (c === '"') cell += '"';
        else cell += c;
      } else if (c === ",") {
        row.push(cell.trim());
        cell = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\n") {
          row.push(cell.trim());
          cell = "";
          rows.push(row);
          row = [];
        }
        if (c === "\r" && text[i + 1] === "\n") i++;
      } else {
        cell += c;
      }
    }
    if (cell || row.length) {
      row.push(cell.trim());
      rows.push(row);
    }
    return rows;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const text = await file.text();
      const rows = parseCsv(text);
      if (rows.length < 2) {
        setResult({ added: 0, errors: ["CSV must have header row and at least one data row."] });
        setLoading(false);
        return;
      }
      const headers = rows[0].map((h) => h.toLowerCase().replace(/\s+/g, "_"));
      const missing = EXPECTED_HEADERS.filter((h) => !headers.includes(h));
      if (missing.length && !headers.includes("company_name")) {
        setResult({ added: 0, errors: [`Missing columns: ${missing.join(", ")}. At least "company_name" required.`] });
        setLoading(false);
        return;
      }
      const errors: string[] = [];
      let added = 0;
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const obj: Record<string, unknown> = {};
        headers.forEach((h, j) => {
          const v = row[j];
          if (h === "employee_count") obj[h] = v ? parseInt(v, 10) : null;
          else obj[h] = v || null;
        });
        if (!obj.company_name) {
          errors.push(`Row ${i + 1}: missing company_name`);
          continue;
        }
        const res = await fetch("/api/admin/leads/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(obj),
        });
        if (res.ok) added++;
        else {
          const err = await res.json().catch(() => ({}));
          errors.push(`Row ${i + 1}: ${err.error || res.status}`);
        }
      }
      setResult({ added, errors: errors.slice(0, 20) });
    } catch (err) {
      setResult({ added: 0, errors: [err instanceof Error ? err.message : "Upload failed"] });
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/leads" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>
      <h1 className="text-2xl font-bold text-white">Bulk upload CSV</h1>
      <p className="text-sm text-stone-400">
        CSV must include a header row. Expected columns: company_name (required), owner_name, email, phone, website, city, province, employee_count, revenue_estimate, linkedin.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-stone-700 bg-stone-900/50 p-6">
        <div>
          <label className="block text-sm font-medium text-stone-300">CSV file</label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm text-stone-400 file:mr-3 file:rounded file:border-0 file:bg-forge-500 file:px-4 file:py-2 file:text-white file:hover:bg-forge-600"
            />
            {file && <span className="text-stone-500">{file.name}</span>}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !file}
          className="flex items-center gap-2 rounded-lg bg-forge-500 px-4 py-2 text-sm font-medium text-white hover:bg-forge-600 disabled:opacity-50"
        >
          {loading ? "Uploading…" : <><Upload className="h-4 w-4" /> Upload</>}
        </button>
      </form>
      {result && (
        <div className="rounded-xl border border-stone-700 bg-stone-900/50 p-6">
          <h2 className="font-semibold text-white">Result</h2>
          <p className="mt-2 text-forge-500">{result.added} leads added.</p>
          {result.errors.length > 0 && (
            <div className="mt-2 text-sm text-red-400">
              <p className="font-medium">Errors:</p>
              <ul className="list-disc pl-4">
                {result.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
