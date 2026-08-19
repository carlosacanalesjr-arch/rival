"use client";

import { useState } from "react";

const REPORT_REASONS = ["Spam", "Inappropriate", "Misleading", "Other"];

// Same bottom-sheet-on-mobile modal shell as ChallengeDetail.js's SubmitResultModal. Used by
// both EventCard/EventDetailScreen and DealCard/DealDetailScreen — Apple guideline 1.2 (UGC)
// requires a way to report content; this is that mechanism for both content types.
export default function ReportModal({ targetLabel, onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) return;
    onSubmit(reason, note.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl border border-border-subtle bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-2xl sm:pb-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Report</h3>
          <button onClick={onClose} aria-label="Close" className="flex h-11 w-11 items-center justify-center text-zinc-400 hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="mt-1 text-xs text-zinc-500">{targetLabel}</p>

        <form onSubmit={handleSubmit} className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Reason</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {REPORT_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className={`min-h-11 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  reason === r
                    ? "border-rival-red bg-rival-red/15 text-rival-red"
                    : "border-border-subtle bg-black text-zinc-300 hover:border-zinc-600"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-zinc-500" htmlFor="report-note">
            Details (optional)
          </label>
          <textarea
            id="report-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Anything that helps us understand the issue"
            className="mt-1.5 w-full rounded-xl border border-border-subtle bg-black px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-rival-red focus:outline-none"
          />

          <button
            type="submit"
            disabled={!reason}
            className="mt-4 min-h-11 w-full rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white disabled:opacity-40"
          >
            SUBMIT REPORT
          </button>
        </form>
      </div>
    </div>
  );
}
