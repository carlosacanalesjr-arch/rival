"use client";

import { useState } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { submitReport } from "@/app/lib/ReportsContext";

const MAX_BYTES = 4 * 1024 * 1024;

// General "something's wrong with the app" entry point — distinct from ReportModal, which is
// scoped to a single event/deal. Submissions land in the same admin Reports list, tagged
// "App Feedback" (kind: "app_feedback") so they're visually distinguishable from content reports.
export default function ReportIssueModal({ onClose }) {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setImageError("Image is too large (max 4MB).");
      return;
    }
    setImageError(null);
    const reader = new FileReader();
    reader.onload = () => setScreenshotUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    submitReport({
      kind: "app_feedback",
      details: description.trim(),
      screenshotUrl,
      reporterEmail: user?.email || null,
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl border border-border-subtle bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-2xl sm:pb-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Report an issue</h3>
          <button onClick={onClose} aria-label="Close" className="flex h-11 w-11 items-center justify-center text-zinc-400 hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="mt-4">
            <p className="text-sm font-semibold text-emerald-400">Thanks — we&apos;ll take a look.</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 min-h-11 w-full rounded-full bg-rival-red text-sm font-extrabold tracking-wide text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4">
            <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500" htmlFor="issue-description">
              What&apos;s going on?
            </label>
            <textarea
              id="issue-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the issue"
              className="mt-1.5 w-full rounded-xl border border-border-subtle bg-black px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-rival-red focus:outline-none"
            />

            <div className="mt-3">
              <label className="flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-black text-xs font-semibold text-zinc-400 hover:border-zinc-500">
                {screenshotUrl ? "Screenshot attached — tap to replace" : "Attach a screenshot (optional)"}
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
              {imageError && <p className="mt-1 text-xs text-rival-red">{imageError}</p>}
            </div>

            <button
              type="submit"
              disabled={!description.trim()}
              className="mt-4 min-h-11 w-full rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white disabled:opacity-40"
            >
              SUBMIT
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
