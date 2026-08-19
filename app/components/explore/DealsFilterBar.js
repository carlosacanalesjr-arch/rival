"use client";

import { dealCategories } from "@/app/lib/exploreSeedData";

const CATEGORY_OPTIONS = ["All", ...dealCategories];

export default function DealsFilterBar({ filters, onChange }) {
  const set = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="space-y-2.5 px-4 pb-3">
      {/* See EventsFilterBar.js's identical wrapper for why this is a mask-image, not a
          scroll-position-tracked overlay: it fades both edges with zero JS. */}
      <div
        className="no-scrollbar flex gap-2 overflow-x-auto"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)",
        }}
      >
        {CATEGORY_OPTIONS.map((category) => {
          const selected = filters.category === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => set({ category })}
              className={`min-h-11 shrink-0 rounded-full border px-4 text-xs font-bold transition ${
                selected
                  ? "border-rival-red bg-rival-red/15 text-rival-red"
                  : "border-border-subtle bg-surface text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <input
        value={filters.location}
        onChange={(e) => set({ location: e.target.value })}
        placeholder="Location"
        className="min-h-11 w-full rounded-xl border border-border-subtle bg-surface px-3 text-sm text-white placeholder:text-zinc-600 focus:border-rival-red focus:outline-none"
      />
    </div>
  );
}
