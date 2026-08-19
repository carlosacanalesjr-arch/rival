"use client";

const ACK_KEY = "rival_content_guidelines_ack_v1";

// Tracked per email (not just a single global flag) since multiple business accounts can
// share this browser during testing/demoing, and each should see it once on their own
// first post — not skip it just because some other business already acknowledged it here.
function readAcks() {
  try {
    return JSON.parse(localStorage.getItem(ACK_KEY) || "{}");
  } catch {
    return {};
  }
}

export function hasAcknowledgedGuidelines(email) {
  if (typeof window === "undefined" || !email) return false;
  return Boolean(readAcks()[email]);
}

export function acknowledgeGuidelines(email) {
  if (typeof window === "undefined" || !email) return;
  try {
    const acks = readAcks();
    acks[email] = true;
    localStorage.setItem(ACK_KEY, JSON.stringify(acks));
  } catch {
    // Storage full or unavailable — worst case, this shows again next time.
  }
}

// Shown once, gating the very first submission from either post form (see
// hasAcknowledgedGuidelines above). Not a hard legal doc, just the plain-language basics
// Apple guideline 1.2 expects apps with UGC to surface to posters.
export default function ContentGuidelinesModal({ onAgree, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl border border-border-subtle bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-2xl sm:pb-5">
        <h3 className="text-base font-bold text-white">Before you post</h3>
        <p className="mt-1 text-xs text-zinc-500">A quick heads-up — this only shows once.</p>

        <ul className="mt-4 space-y-2.5 text-sm text-zinc-300">
          <li className="flex gap-2.5">
            <span className="text-rival-red">•</span>
            No spam, scams, or content unrelated to fitness events and deals.
          </li>
          <li className="flex gap-2.5">
            <span className="text-rival-red">•</span>
            No harassing, hateful, sexually explicit, or otherwise objectionable content.
          </li>
          <li className="flex gap-2.5">
            <span className="text-rival-red">•</span>
            Keep dates, locations, discounts, and links accurate and up to date.
          </li>
          <li className="flex gap-2.5">
            <span className="text-rival-red">•</span>
            Posts can be reported by athletes and removed from browsing if flagged.
          </li>
        </ul>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 flex-1 rounded-full border border-border-subtle bg-black text-sm font-bold text-zinc-300 transition hover:bg-surface-raised"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onAgree}
            className="min-h-11 flex-1 rounded-full bg-rival-red text-sm font-extrabold tracking-wide text-white transition hover:bg-red-600"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}
