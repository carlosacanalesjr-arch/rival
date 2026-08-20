"use client";

import { eventTypes } from "@/app/lib/exploreSeedData";
import ScrollFadeRow from "@/app/components/explore/ScrollFadeRow";

const TYPE_OPTIONS = ["All", ...eventTypes];

// Controlled by the parent screen (filters + onChange), same convention as
// LevelSelector/FocusSelector elsewhere in the app. Chips and inputs are all min-h-11 (44px)
// for HIG's minimum tap target.
export default function EventsFilterBar({ filters, onChange }) {
  const set = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="space-y-2.5 px-4 pb-3">
      <ScrollFadeRow>
        {TYPE_OPTIONS.map((type) => {
          const selected = filters.type === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => set({ type })}
              className={`min-h-11 shrink-0 rounded-full border px-4 text-xs font-bold transition ${
                selected
                  ? "border-rival-red bg-rival-red/15 text-rival-red"
                  : "border-border-subtle bg-surface text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {type}
            </button>
          );
        })}
      </ScrollFadeRow>

      <div className="grid grid-cols-2 gap-2">
        <input
          value={filters.location}
          onChange={(e) => set({ location: e.target.value })}
          placeholder="Location"
          className="min-h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm text-white placeholder:text-zinc-600 focus:border-rival-red focus:outline-none"
        />
        <div className="grid grid-cols-2 gap-1.5">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => set({ dateFrom: e.target.value })}
            aria-label="From date"
            className="min-h-11 rounded-xl border border-border-subtle bg-surface px-2 text-xs text-white focus:border-rival-red focus:outline-none"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => set({ dateTo: e.target.value })}
            aria-label="To date"
            className="min-h-11 rounded-xl border border-border-subtle bg-surface px-2 text-xs text-white focus:border-rival-red focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
