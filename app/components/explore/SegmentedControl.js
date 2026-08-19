"use client";

// iOS-style segmented control (a rounded pill track with a solid highlighted segment),
// distinct from the underline-tab style ProgramsScreen/ProfileScreen use elsewhere — this
// screen specifically asked for the segmented-control look. h-11 (44px) meets Apple HIG's
// minimum 44x44pt tap target on every segment.
export default function SegmentedControl({ options, selected, onSelect }) {
  return (
    <div role="tablist" className="flex h-11 items-center gap-1 rounded-full border border-border-subtle bg-surface p-1">
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(option)}
            className={`h-full flex-1 rounded-full text-sm font-bold transition ${
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
