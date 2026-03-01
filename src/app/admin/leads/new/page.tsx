"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    owner_name: "",
    email: "",
    phone: "",
    website: "",
    city: "",
    province: "",
    employee_count: "",
    revenue_estimate: "",
    linkedin: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        employee_count: form.employee_count ? parseInt(form.employee_count, 10) : null,
        verified_at: new Date().toISOString(),
      }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/leads/${data.id}`);
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Failed to create lead");
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/leads" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>
      <h1 className="text-2xl font-bold text-white">Add lead</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-stone-700 bg-stone-900/50 p-6">
        <div>
          <label className="block text-sm font-medium text-stone-300">Company name *</label>
          <input
            required
            value={form.company_name}
            onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-300">Owner name</label>
          <input
            value={form.owner_name}
            onChange={(e) => setForm((f) => ({ ...f, owner_name: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-white"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-stone-300">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-300">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-300">Website</label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-white"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-stone-300">City</label>
            <input
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-300">Province</label>
            <input
              value={form.province}
              onChange={(e) => setForm((f) => ({ ...f, province: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-white"
              placeholder="e.g. ON, BC"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-stone-300">Employee count</label>
            <input
              type="number"
              min={0}
              value={form.employee_count}
              onChange={(e) => setForm((f) => ({ ...f, employee_count: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-300">Revenue estimate</label>
            <input
              value={form.revenue_estimate}
              onChange={(e) => setForm((f) => ({ ...f, revenue_estimate: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-300">LinkedIn</label>
          <input
            type="url"
            value={form.linkedin}
            onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-white"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-forge-500 px-4 py-2 text-sm font-medium text-white hover:bg-forge-600 disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save lead"}
          </button>
          <Link href="/admin/leads" className="rounded-lg border border-stone-600 px-4 py-2 text-sm text-stone-300 hover:bg-stone-800">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
