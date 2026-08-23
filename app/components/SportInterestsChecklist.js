export const SPORT_INTEREST_OPTIONS = [
  "HYROX",
  "DEKA",
  "Running",
  "Strength & Conditioning",
  "Olympic Weightlifting",
  "CrossFit",
  "Public Safety Prep",
];

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SportInterestsChecklist({ options = SPORT_INTEREST_OPTIONS, value, onChange }) {
  const toggle = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((o) => o !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="space-y-2">
      {options.map((option) => {
        const checked = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            aria-pressed={checked}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              checked
                ? "border-rival-red bg-rival-red/15 text-white"
                : "border-border-subtle bg-surface text-zinc-400 hover:border-zinc-600"
            }`}
          >
            {option}
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                checked ? "border-rival-red bg-rival-red" : "border-zinc-600"
              }`}
            >
              {checked && <CheckIcon />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
