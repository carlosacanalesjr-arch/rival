"use client";

import { useState, useRef, useEffect } from "react";
import { getLevelOrder } from "@/app/lib/programsData";

export const LEVEL_STYLES = {
  Beginner: { trigger: "border-emerald-500/40 bg-emerald-500/15 text-emerald-400", option: "bg-emerald-500/15 text-emerald-400" },
  Intermediate: { trigger: "border-sky-500/40 bg-sky-500/15 text-sky-400", option: "bg-sky-500/15 text-sky-400" },
  Advanced: { trigger: "border-rival-red/40 bg-rival-red/15 text-rival-red", option: "bg-rival-red/15 text-rival-red" },
  "Test-Ready": { trigger: "border-rival-red/40 bg-rival-red/15 text-rival-red", option: "bg-rival-red/15 text-rival-red" },
};

export const PLACEHOLDER_TRIGGER_STYLE = "border-border-subtle bg-surface-raised text-zinc-400";

// variant "picker" is the pre-enrollment preview (no commitment yet, no confirm needed).
// variant "current" is a live enrollment: trigger is forced red with a dot, and switching
// to a different level requires the user to confirm before it's committed.
export function LevelSelector({ selected, onSelect, variant = "picker", category }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const levelOptions = getLevelOrder(category);

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const handlePick = (level) => {
    setOpen(false);
    if (level === selected) return;
    if (variant === "current") {
      const confirmed = window.confirm(`Switch to ${level}? Your current progress will be saved.`);
      if (!confirmed) return;
    }
    onSelect(level);
  };

  const triggerStyle =
    variant === "current"
      ? "border-rival-red/40 bg-rival-red/15 text-rival-red"
      : selected
      ? LEVEL_STYLES[selected].trigger
      : PLACEHOLDER_TRIGGER_STYLE;

  return (
    <div
      ref={ref}
      className="relative shrink-0"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold transition ${triggerStyle}`}
      >
        {variant === "current" && (
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse-live rounded-full bg-rival-red" aria-hidden />
        )}
        {selected || "Select Level"}
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
          className="absolute right-0 top-full z-10 mt-1 w-36 overflow-hidden rounded-xl border border-border-subtle bg-surface-raised shadow-lg"
        >
          {levelOptions.map((level) => (
            <button
              key={level}
              role="option"
              aria-selected={level === selected}
              onClick={() => handlePick(level)}
              className={`flex w-full items-center gap-1.5 px-3 py-2 text-left text-xs font-semibold transition ${
                level === selected ? LEVEL_STYLES[level].option : "text-zinc-300 hover:bg-black/40"
              }`}
            >
              {level === selected && variant === "current" && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rival-red" aria-hidden />
              )}
              {level}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Agency focus (Police / DPS Trooper / Border Patrol) only changes phase-level emphasis
// notes, not the underlying workouts, so unlike LevelSelector this never needs a confirm
// or a "current" variant tied to progress — it's just a preference tag.
export function FocusSelector({ options, selected, onSelect }) {
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

  const handlePick = (focus) => {
    setOpen(false);
    if (focus !== selected) onSelect(focus);
  };

  return (
    <div
      ref={ref}
      className="relative inline-block"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold transition ${
          selected ? "border-amber-500/40 bg-amber-500/15 text-amber-400" : PLACEHOLDER_TRIGGER_STYLE
        }`}
      >
        {selected || "Agency Focus"}
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
          className="absolute left-0 top-full z-10 mt-1 w-40 overflow-hidden rounded-xl border border-border-subtle bg-surface-raised shadow-lg"
        >
          {options.map((focus) => (
            <button
              key={focus}
              role="option"
              aria-selected={focus === selected}
              onClick={() => handlePick(focus)}
              className={`flex w-full items-center px-3 py-2 text-left text-xs font-semibold transition ${
                focus === selected ? "bg-amber-500/15 text-amber-400" : "text-zinc-300 hover:bg-black/40"
              }`}
            >
              {focus}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
