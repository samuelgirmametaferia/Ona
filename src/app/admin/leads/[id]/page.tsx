"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Lead = {
  id: string;
  company_name: string;
  owner_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  city: string | null;
  province: string | null;
  employee_count: number | null;
  revenue_estimate: string | null;
  linkedin: string | null;
  verified_at: string | null;
  created_at: string;
};

export default function EditLeadPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`/api/admin/leads/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setLead(data);
        setForm({
          company_name: data.company_name ?? "",
          owner_name: data.owner_name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          website: data.website ?? "",
          city: data.city ?? "",
          province: data.province ?? "",
          employee_count: data.employee_count != null ? String(data.employee_count) : "",
          revenue_estimate: data.revenue_estimate ?? "",
          linkedin: data.linkedin ?? "",
          verified_at: data.verified_at ? data.verified_at.slice(0, 16) : "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!lead) return;
    setSaving(true);
    const payload: Record<string, unknown> = { ...form };
    if (payload.employee_count === "") payload.employee_count = null;
    else if (payload.employee_count) payload.employee_count = parseInt(payload.employee_count as string, 10);
    if (payload.verified_at === "") payload.verified_at = null;
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setLead(data);
      setForm({
        company_name: data.company_name ?? "",
        owner_name: data.owner_name ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        website: data.website ?? "",
        city: data.city ?? "",
        province: data.province ?? "",
        employee_count: data.employee_count != null ? String(data.employee_count) : "",
        revenue_estimate: data.revenue_estimate ?? "",
        linkedin: data.linkedin ?? "",
        verified_at: data.verified_at ? data.verified_at.slice(0, 16) : "",
      });
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Failed to update");
    }
  }

  if (loading) return <div className="text-stone-400">Loading…</div>;
  if (!lead) return <div className="text-stone-400">Lead not found.</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/leads" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>
      <h1 className="text-2xl font-bold text-white">Edit lead</h1>
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
        <div>
          <label className="block text-sm font-medium text-stone-300">Verified at</label>
          <input
            type="datetime-local"
            value={form.verified_at}
            onChange={(e) => setForm((f) => ({ ...f, verified_at: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-white"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-forge-500 px-4 py-2 text-sm font-medium text-white hover:bg-forge-600 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <Link href="/admin/leads" className="rounded-lg border border-stone-600 px-4 py-2 text-sm text-stone-300 hover:bg-stone-800">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
