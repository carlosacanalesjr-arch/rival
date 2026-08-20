"use client";

import { useReports } from "@/app/lib/ReportsContext";

const KIND_LABELS = {
  event: "Event",
  deal: "Deal",
  app_feedback: "App Feedback",
};

const KIND_STYLES = {
  event: "bg-rival-red/15 text-rival-red",
  deal: "bg-emerald-500/15 text-emerald-400",
  app_feedback: "bg-sky-500/15 text-sky-400",
};

function formatTimestamp(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminReportsList() {
  const { reports, markReviewed } = useReports();

  const active = reports
    .filter((r) => !r.reviewed)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      <h1 className="text-xl font-extrabold text-white">Reports</h1>
      <p className="mt-1 text-sm text-zinc-500">Event/deal reports and app feedback from athletes.</p>

      <div className="mt-4 space-y-3">
        {active.length === 0 && (
          <p className="rounded-xl border border-border-subtle bg-surface p-4 text-sm text-zinc-500">
            No active reports.
          </p>
        )}

        {active.map((r) => (
          <div key={r.id} className="rounded-xl border border-border-subtle bg-surface p-3">
            <div className="flex items-center justify-between gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${KIND_STYLES[r.kind] ?? "bg-zinc-800 text-zinc-300"}`}>
                {KIND_LABELS[r.kind] ?? r.kind}
              </span>
              <span className="text-[11px] text-zinc-500">{formatTimestamp(r.createdAt)}</span>
            </div>

            {r.itemLabel && <p className="mt-2 text-sm font-bold text-white">{r.itemLabel}</p>}
            {r.reason && <p className="mt-1 text-xs font-semibold text-zinc-300">Reason: {r.reason}</p>}
            {r.details && <p className="mt-1.5 text-sm text-zinc-400">{r.details}</p>}

            {r.screenshotUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- runtime data URL, not a static asset
              <img src={r.screenshotUrl} alt="Attached screenshot" className="mt-2 max-h-40 rounded-lg border border-border-subtle object-contain" />
            )}

            <p className="mt-2 text-[11px] text-zinc-500">Reported by {r.reporterEmail || "anonymous"}</p>

            <button
              type="button"
              onClick={() => markReviewed(r.id)}
              className="mt-3 min-h-11 w-full rounded-full border border-border-subtle bg-black text-xs font-bold text-zinc-300 transition hover:bg-surface-raised"
            >
              Mark as reviewed
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
