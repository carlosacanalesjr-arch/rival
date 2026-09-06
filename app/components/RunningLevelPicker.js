"use client";

import { useEffect, useRef, useState } from "react";

// Foundation isn't in LevelFocusSelectors' LEVEL_STYLES (that map is for Program levels —
// Beginner/Intermediate/Advanced/Test-Ready), so it gets its own small style map here. Same
// red the static "Foundation" label used to render in, so today's default look is unchanged.
const RUNNING_LEVEL_STYLES = {
  Foundation: { trigger: "border-rival-red/40 bg-rival-red/15 text-rival-red", option: "bg-rival-red/15 text-rival-red" },
  Intermediate: { trigger: "border-sky-500/40 bg-sky-500/15 text-sky-400", option: "bg-sky-500/15 text-sky-400" },
  Advanced: { trigger: "border-amber-500/40 bg-amber-500/15 text-amber-400", option: "bg-amber-500/15 text-amber-400" },
};

function levelStyle(level) {
  return RUNNING_LEVEL_STYLES[level] || { trigger: "border-border-subtle bg-surface-raised text-foreground-secondary", option: "text-foreground-secondary" };
}

// The real Foundation/Intermediate selector that replaces the old static "Foundation" label at
// the top of the Running screen (Section 13). Picking a different level never applies
// immediately — `onRequestSwitch` hands it up so the caller can gate it behind a confirmation
// modal first, since switching resets the athlete's personal completion window for that level.
export function RunningLevelDropdown({ levels, activeLevel, onRequestSwitch }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const style = levelStyle(activeLevel);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide transition ${style.trigger}`}
      >
        {activeLevel || "Select Level"}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-border-subtle bg-surface-raised shadow-lg"
        >
          {levels.map((level) => (
            <button
              key={level}
              role="option"
              aria-selected={level === activeLevel}
              onClick={() => {
                setOpen(false);
                if (level !== activeLevel) onRequestSwitch(level);
              }}
              className={`flex w-full items-center px-3 py-2.5 text-left text-sm font-semibold transition ${
                level === activeLevel ? levelStyle(level).option : "text-foreground-secondary hover:bg-black/40"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Confirmation modal shown before an explicit level switch is applied (Section 13 requires this
// even though switching itself isn't gated by prior completion). Copy mirrors the spec's example
// almost verbatim so the consequence — fresh window, preserved-but-paused progress — is explicit
// before it happens.
export function LevelSwitchConfirmModal({ fromLevel, toLevel, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl border border-border-subtle bg-surface p-5 sm:rounded-2xl">
        <h3 className="text-base font-bold text-foreground">Switch to {toLevel}?</h3>
        <p className="mt-2 text-sm text-muted">
          Your {fromLevel} progress is saved, but your 3-month window for {toLevel} starts today.
        </p>
        <p className="mt-2 text-xs text-muted-2">
          You can switch back to {fromLevel} anytime — nothing you&apos;ve done there is lost.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 flex-1 rounded-full border border-border-subtle bg-background text-sm font-bold text-foreground-secondary transition hover:bg-surface-raised"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-11 flex-1 whitespace-nowrap rounded-full bg-rival-red text-sm font-extrabold tracking-wide text-white transition hover:bg-red-600"
          >
            Confirm Switch
          </button>
        </div>
      </div>
    </div>
  );
}

// Shown in place of the normal Today/Missed content on an athlete's very first visit to Running
// (Section 13 — no more defaulting everyone into Foundation). Levels with no seeded content yet
// are shown disabled with a "Coming soon" tag rather than letting a first-time pick dead-end
// into an empty state immediately — an athlete can still switch into one later via the dropdown
// once they understand what they're getting (see the spec's own switch-to-Intermediate example).
export function FirstLevelPicker({ levels, hasContent, onChoose }) {
  return (
    <div className="px-4 pt-4">
      <div className="rounded-2xl border border-border-subtle bg-surface p-5">
        <h2 className="text-base font-bold text-foreground">Choose your starting level</h2>
        <p className="mt-1 text-sm text-muted">
          Every athlete on a level sees the same locked daily calendar. You can switch levels anytime later.
        </p>
        <div className="mt-4 space-y-2.5">
          {levels.map((level) => {
            const available = hasContent(level);
            const style = levelStyle(level);
            return (
              <button
                key={level}
                type="button"
                disabled={!available}
                onClick={() => available && onChoose(level)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition ${
                  available
                    ? `${style.trigger} hover:brightness-110`
                    : "border-border-subtle bg-surface-raised text-muted-3 opacity-60"
                }`}
              >
                <span className="text-sm font-bold">{level}</span>
                {!available && (
                  <span className="rounded-full border border-border-subtle px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-2">
                    Coming soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
