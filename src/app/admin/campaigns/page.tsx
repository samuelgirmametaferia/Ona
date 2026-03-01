"use client";

import { useState, useEffect } from "react";
import { Mail, Loader2, Send, Users } from "lucide-react";

const PLACEHOLDERS = "{{email}} {{name}} {{last_login}} {{engagement_score}} {{plan}}";

type Campaign = { id: string; name: string; subject: string; conditions: Record<string, unknown>; created_at: string };

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [inactiveDaysMin, setInactiveDaysMin] = useState("");
  const [engagementScoreMax, setEngagementScoreMax] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [saving, setSaving] = useState(false);
  const [recipients, setRecipients] = useState<{ email: string; name: string }[]>([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/campaigns")
      .then((r) => r.json())
      .then((d) => { if (d.campaigns) setCampaigns(d.campaigns); })
      .finally(() => setLoading(false));
  }, []);

  async function previewRecipients() {
    const params = new URLSearchParams();
    if (inactiveDaysMin) params.set("inactive_days_min", inactiveDaysMin);
    if (engagementScoreMax) params.set("engagement_score_max", engagementScoreMax);
    if (planFilter) params.set("plan", planFilter);
    setLoadingRecipients(true);
    try {
      const res = await fetch(`/api/admin/campaigns/recipients?${params}`);
      const data = await res.json();
      setRecipients(data.recipients ?? []);
    } finally {
      setLoadingRecipients(false);
    }
  }

  async function saveCampaign(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setSaving(true);
    try {
      const conditions: Record<string, unknown> = {};
      if (inactiveDaysMin) conditions.inactive_days_min = parseInt(inactiveDaysMin, 10);
      if (engagementScoreMax) conditions.engagement_score_max = parseInt(engagementScoreMax, 10);
      if (planFilter) conditions.plan = planFilter;

      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, subject, body_html: bodyHtml, conditions }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Campaign saved.");
        setCampaigns((c) => [{ ...data, conditions }, ...c]);
        setName("");
        setSubject("");
        setBodyHtml("");
        setInactiveDaysMin("");
        setEngagementScoreMax("");
        setPlanFilter("");
      } else {
        setMessage(data.error ?? "Failed");
      }
    } finally {
      setSaving(false);
    }
  }

  async function sendCampaign(id: string) {
    setMessage("");
    setSending(id);
    try {
      const res = await fetch(`/api/admin/campaigns/${id}/send`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Sent: ${data.sent}, Failed: ${data.failed}`);
      } else {
        setMessage(data.error ?? "Send failed");
      }
    } finally {
      setSending(null);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Email campaigns</h1>
      <p className="text-sm text-[var(--text-muted)]">
        Create campaigns with placeholders: {PLACEHOLDERS}. Set conditions to target inactive or low-engagement users.
      </p>

      <form onSubmit={saveCampaign} className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">New campaign</h2>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)]">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-[var(--text-primary)]" placeholder="e.g. Inactive users" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)]">Subject</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} required className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-[var(--text-primary)]" placeholder="Hi {{name}}, we miss you" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)]">Body (HTML)</label>
          <textarea value={bodyHtml} onChange={(e) => setBodyHtml(e.target.value)} required rows={6} className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 font-mono text-sm text-[var(--text-primary)]" placeholder={"<p>Hi {{name}},</p><p>Last login: {{last_login}}. Score: {{engagement_score}}.</p>"} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)]">Inactive at least (days)</label>
            <input type="number" min={0} value={inactiveDaysMin} onChange={(e) => setInactiveDaysMin(e.target.value)} className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-[var(--text-primary)]" placeholder="7" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)]">Max engagement score</label>
            <input type="number" min={0} value={engagementScoreMax} onChange={(e) => setEngagementScoreMax(e.target.value)} className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-[var(--text-primary)]" placeholder="10" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)]">Plan</label>
            <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-[var(--text-primary)]">
              <option value="">Any</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="agency">Agency</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-forge-500 px-4 py-2 text-sm font-medium text-white hover:bg-forge-600 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Save campaign
          </button>
          <button type="button" onClick={previewRecipients} disabled={loadingRecipients} className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50">
            {loadingRecipients ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
            Preview recipients
          </button>
        </div>
        {recipients.length > 0 && <p className="text-sm text-[var(--text-muted)]">Recipients matching conditions: {recipients.length}</p>}
      </form>

      {message && <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--text-primary)]">{message}</div>}

      <div>
        <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">Saved campaigns</h2>
        {loading ? (
          <Loader2 className="h-8 w-8 animate-spin text-[var(--text-muted)]" />
        ) : (
          <ul className="space-y-3">
            {campaigns.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{c.name}</p>
                  <p className="text-sm text-[var(--text-muted)]">{c.subject}</p>
                </div>
                <button type="button" onClick={() => sendCampaign(c.id)} disabled={!!sending} className="inline-flex items-center gap-2 rounded-lg bg-forge-500 px-4 py-2 text-sm font-medium text-white hover:bg-forge-600 disabled:opacity-50">
                  {sending === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Send
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
