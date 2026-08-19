"use client";

// iOS-style segmented control (a rounded pill track with a solid highlighted segment),
// distinct from the underline-tab style ProgramsScreen/ProfileScreen use elsewhere — this
// screen specifically asked for the segmented-control look. min-h-11 (44px) is on each
// button directly, not the track (a track height with h-full children would only leave each
// button ~36px after the track's own p-1 padding is subtracted).
export default function SegmentedControl({ options, selected, onSelect }) {
  return (
    <div role="tablist" className="flex items-center gap-1 rounded-full border border-border-subtle bg-surface p-1">
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(option)}
            className={`min-h-11 flex-1 rounded-full text-sm font-bold transition ${
              isSelected ? "bg-rival-red text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
