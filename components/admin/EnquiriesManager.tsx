"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Mail, MessageCircle, Phone, Trash2 } from "lucide-react";
import {
  ENQUIRY_STATUSES,
  ENQUIRY_STATUS_LABELS,
  countEnquiriesByStatus,
  type EnquiryStatus,
  type StoredEnquiry,
} from "@/lib/enquiries/types";
import {
  downloadEnquiryExport,
  type EnquiryExportFormat,
} from "@/lib/enquiries/export";
import { buttonVariants } from "@/components/ui/button";
import { inputClass } from "@/components/admin/fields";
import { cn } from "@/lib/utils";

type FilterStatus = "all" | EnquiryStatus;

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  new: "bg-amber-100 text-amber-900",
  contacted: "bg-sky-100 text-sky-900",
  quoted: "bg-teal/10 text-teal",
  booked: "bg-emerald-100 text-emerald-800",
  closed: "bg-slate-200 text-slate-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatWhen(value?: string | null) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatDay(value?: string | null) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(`${value}T00:00:00`));
  } catch {
    return value;
  }
}

function toWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export function EnquiriesManager() {
  const [enquiries, setEnquiries] = useState<StoredEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");
  const [showArchived, setShowArchived] = useState(false);
  const [exportFormat, setExportFormat] = useState<EnquiryExportFormat>("csv");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  async function reload() {
    const res = await fetch("/api/admin/enquiries");
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Could not load enquiries.");
    }
    setEnquiries(data.enquiries || []);
  }

  useEffect(() => {
    reload()
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Could not load enquiries.");
      })
      .finally(() => setLoading(false));
  }, []);

  const selected = enquiries.find((item) => item.id === selectedId) || null;

  useEffect(() => {
    setNotesDraft(selected?.notes || "");
  }, [selected?.id, selected?.notes]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return enquiries.filter((item) => {
      if (showArchived ? !item.archived : item.archived) return false;
      if (status !== "all" && item.status !== status) return false;
      if (!needle) return true;
      const haystack = [
        item.reference,
        item.fullName,
        item.phone,
        item.email,
        item.pickupLocation,
        item.destination,
        item.preferredVehicle,
        item.tripType,
        item.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [enquiries, query, showArchived, status]);

  const counts = countEnquiriesByStatus(enquiries);

  async function patch(id: string, body: { status?: EnquiryStatus; notes?: string; archived?: boolean }) {
    setSaving(true);
    setError("");
    setMessage("");
    const res = await fetch("/api/admin/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Update failed.");
      return;
    }
    setEnquiries((prev) =>
      prev.map((item) => (item.id === data.enquiry.id ? data.enquiry : item)),
    );
    setMessage("Enquiry updated.");
  }

  async function remove(id: string, reference: string) {
    if (!window.confirm(`Delete enquiry ${reference}? This cannot be undone.`)) return;
    setSaving(true);
    setError("");
    setMessage("");
    const res = await fetch("/api/admin/enquiries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Delete failed.");
      return;
    }
    setEnquiries((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) setSelectedId(null);
    setMessage("Enquiry deleted.");
  }

  function exportEnquiries(scope: "filtered" | "all") {
    const rows = scope === "filtered" ? visible : enquiries;
    if (rows.length === 0) {
      setError(
        scope === "filtered"
          ? "No filtered enquiries to export."
          : "No enquiries to export.",
      );
      return;
    }
    downloadEnquiryExport(rows, exportFormat, scope);
    setError("");
    setMessage(
      `Exported ${rows.length} ${rows.length === 1 ? "enquiry" : "enquiries"} as ${
        exportFormat === "excel" ? "Excel" : "CSV"
      }.`,
    );
  }

  if (loading) {
    return <p className="text-sm text-text-muted">Loading enquiries…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {(
          [
            ["New", counts.new],
            ["Contacted", counts.contacted],
            ["Quoted", counts.quoted],
            ["Booked", counts.booked],
          ] as const
        ).map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-soft"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              {label}
            </p>
            <p className="mt-1 text-2xl font-bold text-navy">{value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <label className="block flex-1 space-y-1.5">
            <span className="text-sm font-semibold text-navy">Search</span>
            <input
              className={inputClass}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, phone, reference, destination…"
            />
          </label>
          <label className="block space-y-1.5 md:w-48">
            <span className="text-sm font-semibold text-navy">Status</span>
            <select
              className={inputClass}
              value={status}
              onChange={(e) => setStatus(e.target.value as FilterStatus)}
            >
              <option value="all">All open</option>
              {ENQUIRY_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {ENQUIRY_STATUS_LABELS[value]}
                </option>
              ))}
            </select>
          </label>
          <label className="inline-flex items-center gap-2 pb-2 text-sm font-medium text-navy">
            <input
              type="checkbox"
              className="h-4 w-4 accent-teal"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
            />
            Show archived
          </label>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:flex-wrap sm:items-end">
          <label className="block space-y-1.5 sm:w-40">
            <span className="text-sm font-semibold text-navy">Export format</span>
            <select
              className={inputClass}
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as EnquiryExportFormat)}
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </select>
          </label>
          <button
            type="button"
            disabled={visible.length === 0}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            onClick={() => exportEnquiries("filtered")}
          >
            <Download className="h-4 w-4" />
            Export filtered ({visible.length})
          </button>
          <button
            type="button"
            disabled={enquiries.length === 0}
            className={cn(buttonVariants({ variant: "navy", size: "sm" }))}
            onClick={() => exportEnquiries("all")}
          >
            <Download className="h-4 w-4" />
            Export all ({enquiries.length})
          </button>
        </div>
      </div>

      {message ? <p className="text-sm font-medium text-teal">{message}</p> : null}
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          {visible.length === 0 ? (
            <p className="p-6 text-sm text-text-muted">
              {enquiries.length === 0
                ? "No enquiries yet. New website form submissions will appear here."
                : "No enquiries match this search."}
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {visible.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={cn(
                      "w-full px-4 py-4 text-left transition hover:bg-bg-light",
                      selectedId === item.id && "bg-teal/5",
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          STATUS_STYLES[item.status],
                        )}
                      >
                        {ENQUIRY_STATUS_LABELS[item.status]}
                      </span>
                      <span className="text-xs font-semibold text-text-muted">
                        {item.reference}
                      </span>
                      {item.archived ? (
                        <span className="text-xs font-semibold text-slate-500">Archived</span>
                      ) : null}
                    </div>
                    <p className="mt-1 font-bold text-navy">{item.fullName}</p>
                    <p className="mt-1 text-sm text-text-muted">
                      {item.pickupLocation} → {item.destination}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      {item.phone}
                      {item.travelDate ? ` · Travel ${formatDay(item.travelDate)}` : ""}
                      {` · ${formatWhen(item.submittedAt)}`}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-teal">
                  {selected.reference}
                </p>
                <h2 className="mt-1 text-xl font-bold text-navy">{selected.fullName}</h2>
              </div>

              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-navy">Status</span>
                <select
                  className={inputClass}
                  value={selected.status}
                  disabled={saving}
                  onChange={(e) =>
                    patch(selected.id, { status: e.target.value as EnquiryStatus })
                  }
                >
                  {ENQUIRY_STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {ENQUIRY_STATUS_LABELS[value]}
                    </option>
                  ))}
                </select>
              </label>

              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <Detail label="Phone" value={selected.phone} />
                <Detail label="Email" value={selected.email || "—"} />
                <Detail label="Travel date" value={formatDay(selected.travelDate)} />
                <Detail label="Return date" value={formatDay(selected.returnDate)} />
                <Detail label="Pickup" value={selected.pickupLocation} />
                <Detail label="Destination" value={selected.destination} />
                <Detail label="Passengers" value={selected.passengers?.toString() || "—"} />
                <Detail label="Vehicle" value={selected.preferredVehicle || "—"} />
                <Detail label="Trip type" value={selected.tripType || "—"} />
                <Detail label="Source page" value={selected.sourcePage || "—"} />
                <Detail label="Submitted" value={formatWhen(selected.submittedAt)} />
              </dl>

              {selected.message ? (
                <div>
                  <p className="text-sm font-semibold text-navy">Customer message</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-text-muted">
                    {selected.message}
                  </p>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <a
                  href={`tel:${selected.phone}`}
                  className={cn(buttonVariants({ variant: "teal", size: "sm" }))}
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
                <a
                  href={`https://wa.me/${toWhatsAppNumber(selected.phone)}?text=${encodeURIComponent(
                    `Hi ${selected.fullName}, this is Arohan Travels regarding your enquiry ${selected.reference}.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "whatsapp", size: "sm" }))}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                {selected.email ? (
                  <a
                    href={`mailto:${selected.email}?subject=${encodeURIComponent(
                      `Your travel enquiry ${selected.reference}`,
                    )}`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                ) : null}
              </div>

              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-navy">Internal notes</span>
                <textarea
                  className={cn(inputClass, "min-h-28")}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Call outcome, quoted amount, follow-up reminder…"
                />
              </label>
              <button
                type="button"
                disabled={saving || notesDraft === selected.notes}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                onClick={() => patch(selected.id, { notes: notesDraft })}
              >
                Save notes
              </button>

              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  disabled={saving}
                  className="text-sm font-semibold text-navy"
                  onClick={() => patch(selected.id, { archived: !selected.archived })}
                >
                  {selected.archived ? "Restore from archive" : "Archive"}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-red-600"
                  onClick={() => remove(selected.id, selected.reference)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-muted">
              Select an enquiry to view details, change status, add notes, or contact the customer.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-widest text-text-muted">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-navy">{value}</dd>
    </div>
  );
}
