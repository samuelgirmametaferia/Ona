"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Pencil, Trash2, Loader2 } from "lucide-react";

type Lead = {
  id: string;
  company_name: string;
  city: string | null;
  province: string | null;
  email: string | null;
  verified_at: string | null;
};

export function AdminLeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  function fetchLeads() {
    setLoading(true);
    fetch(`/api/admin/leads?page=${page}&pageSize=${pageSize}`)
      .then((r) => r.json())
      .then((data) => {
        setLeads(data.leads ?? []);
        setTotal(data.total ?? 0);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchLeads depends on page; avoid stale closure
  }, [page]);

  async function deleteLead(id: string) {
    if (!confirm("Delete this lead?")) return;
    const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    if (res.ok) fetchLeads();
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="rounded-xl border border-stone-700 overflow-hidden">
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-forge-500" />
        </div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-700 bg-stone-800/50">
            <tr>
              <th className="px-4 py-3 font-medium text-stone-300">Company</th>
              <th className="px-4 py-3 font-medium text-stone-300">City</th>
              <th className="px-4 py-3 font-medium text-stone-300">Province</th>
              <th className="px-4 py-3 font-medium text-stone-300">Email</th>
              <th className="px-4 py-3 font-medium text-stone-300">Verified</th>
              <th className="w-24 px-4 py-3 font-medium text-stone-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-stone-800 last:border-0 hover:bg-stone-800/30">
                <td className="px-4 py-3 font-medium text-white">{lead.company_name}</td>
                <td className="px-4 py-3 text-stone-400">{lead.city ?? "—"}</td>
                <td className="px-4 py-3 text-stone-400">{lead.province ?? "—"}</td>
                <td className="px-4 py-3 text-stone-400">{lead.email ?? "—"}</td>
                <td className="px-4 py-3 text-stone-500">{lead.verified_at ? formatDate(lead.verified_at) : "—"}</td>
                <td className="px-4 py-3 flex gap-2">
                  <Link href={`/admin/leads/${lead.id}`} className="text-stone-400 hover:text-white">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button onClick={() => deleteLead(lead.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-stone-700 px-4 py-3">
          <p className="text-sm text-stone-400">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded border border-stone-600 px-3 py-1 text-sm text-stone-400 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded border border-stone-600 px-3 py-1 text-sm text-stone-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
