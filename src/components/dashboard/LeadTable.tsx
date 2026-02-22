"use client";

import { useState, useEffect, useCallback } from "react";
import { track } from "@vercel/analytics";
import { formatDate, blurEmail, blurPhone } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Download, Loader2, Search } from "lucide-react";
import { TableSkeleton } from "@/components/ui/Skeleton";

type Lead = {
  id: string;
  company_name: string;
  owner_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  city: string | null;
  province: string | null;
  verified_at: string | null;
  created_at: string;
};

type ListResponse = {
  leads: Lead[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  viewLimit: number | null;
};

export function LeadTable({ plan }: { plan: string }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [sort, setSort] = useState("verified_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);
  const canExport = plan === "pro" || plan === "agency";
  const blurContact = plan === "free";

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", "20");
    if (q) params.set("q", q);
    if (province) params.set("province", province);
    if (city) params.set("city", city);
    params.set("sort", sort);
    params.set("order", order);
    const res = await fetch(`/api/leads/list?${params}`);
    const data: ListResponse = await res.json();
    if (res.ok) {
      setLeads(data.leads ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    }
    setLoading(false);
  }, [page, q, province, city, sort, order]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetch("/api/leads/provinces")
      .then((r) => r.json())
      .then(setProvinces)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!province) {
      setCities([]);
      return;
    }
    fetch(`/api/leads/cities?province=${encodeURIComponent(province)}`)
      .then((r) => r.json())
      .then(setCities)
      .catch(() => {});
  }, [province]);

  function handleSort(col: string) {
    if (sort === col) setOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSort(col);
      setOrder("desc");
    }
  }

  async function handleExport() {
    if (!canExport) return;
    const ids = selected.size ? Array.from(selected) : leads.map((l) => l.id);
    if (ids.length === 0) return;
    setExporting(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds: ids }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Export failed");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `loadforge-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      track("Export", { count: ids.length });
      setSelected(new Set());
      fetchLeads();
    } finally {
      setExporting(false);
    }
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === leads.length) setSelected(new Set());
    else setSelected(new Set(leads.map((l) => l.id)));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search company..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchLeads()}
          className="rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-white placeholder-stone-500 focus:border-forge-500 focus:outline-none w-56"
        />
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-white focus:border-forge-500 focus:outline-none"
        >
          <option value="">All provinces</option>
          {provinces.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-white focus:border-forge-500 focus:outline-none"
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button
          onClick={() => { setPage(1); fetchLeads(); }}
          className="rounded-lg bg-forge-500 px-4 py-2 text-sm font-medium text-white hover:bg-forge-600"
        >
          Apply
        </button>
        {canExport && (
          <button
            onClick={handleExport}
            disabled={exporting || (selected.size === 0 && leads.length === 0)}
            className="ml-auto flex items-center gap-2 rounded-lg border border-stone-600 px-4 py-2 text-sm font-medium text-stone-300 hover:bg-stone-800 disabled:opacity-50"
          >
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export {selected.size > 0 ? `(${selected.size})` : "all"}
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-700">
        {loading ? (
          <TableSkeleton rows={10} cols={canExport ? 8 : 7} />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-700 bg-stone-800/50">
              <tr>
                {canExport && (
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={leads.length > 0 && selected.size === leads.length}
                      onChange={toggleSelectAll}
                      className="rounded border-stone-600 bg-stone-800"
                    />
                  </th>
                )}
                <th className="px-4 py-3">
                  <button onClick={() => handleSort("company_name")} className="font-medium text-stone-300 hover:text-white">
                    Company {sort === "company_name" && (order === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button onClick={() => handleSort("city")} className="font-medium text-stone-300 hover:text-white">
                    City {sort === "city" && (order === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button onClick={() => handleSort("province")} className="font-medium text-stone-300 hover:text-white">
                    Province {sort === "province" && (order === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium text-stone-300">Email</th>
                <th className="px-4 py-3 font-medium text-stone-300">Phone</th>
                <th className="px-4 py-3 font-medium text-stone-300">Website</th>
                <th className="px-4 py-3">
                  <button onClick={() => handleSort("verified_at")} className="font-medium text-stone-300 hover:text-white">
                    Verified {sort === "verified_at" && (order === "asc" ? "↑" : "↓")}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-stone-800 last:border-0 hover:bg-stone-800/30">
                  {canExport && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(lead.id)}
                        onChange={() => toggleSelect(lead.id)}
                        className="rounded border-stone-600 bg-stone-800"
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 font-medium text-white">{lead.company_name}</td>
                  <td className="px-4 py-3 text-stone-400">{lead.city ?? "—"}</td>
                  <td className="px-4 py-3 text-stone-400">{lead.province ?? "—"}</td>
                  <td className="px-4 py-3">
                    {blurContact ? (
                      <span className="blur-value inline-block min-w-[100px]">{blurEmail(lead.email)}</span>
                    ) : (
                      lead.email || "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {blurContact ? (
                      <span className="blur-value inline-block min-w-[80px]">{blurPhone(lead.phone)}</span>
                    ) : (
                      lead.phone || "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {lead.website ? (
                      <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-forge-500 hover:underline truncate max-w-[120px] block">
                        {lead.website.replace(/^https?:\/\//, "")}
                      </a>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-stone-500">{lead.verified_at ? formatDate(lead.verified_at) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && leads.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 px-4">
            <div className="rounded-full bg-[var(--bg-tertiary)] p-4">
              <Search className="h-8 w-8 text-[var(--text-muted)]" />
            </div>
            <p className="text-center font-medium text-[var(--text-primary)]">No leads match your filters</p>
            <p className="text-center text-sm text-[var(--text-muted)] max-w-sm">
              Try removing a filter or broadening your search to see more results.
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-stone-400">
            Showing page {page} of {totalPages} ({(total ?? 0).toLocaleString()} total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-stone-600 px-3 py-1.5 text-sm text-stone-400 hover:bg-stone-800 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-stone-600 px-3 py-1.5 text-sm text-stone-400 hover:bg-stone-800 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
