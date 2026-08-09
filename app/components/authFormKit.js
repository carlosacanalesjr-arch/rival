export const inputClass =
  "w-full rounded-xl border border-border-subtle bg-surface px-3.5 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-rival-red focus:outline-none";
export const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500";

export function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M17.9 17.9A11 11 0 0 1 12 19c-7 0-11-7-11-7a20.6 20.6 0 0 1 5.1-5.9M9.9 4.2A9.9 9.9 0 0 1 12 4c7 0 11 7 11 7a20.6 20.6 0 0 1-2.6 3.6M14.1 14.1a3 3 0 1 1-4.2-4.2M1 1l22 22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Field({ label, children }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export function ChipGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
              selected
                ? "border-rival-red bg-rival-red/15 text-rival-red"
                : "border-border-subtle bg-surface text-zinc-400 hover:border-zinc-600"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function PasswordField({ label = "Password", value, onChange, showPassword, onToggle, placeholder, autoComplete }) {
  return (
    <Field label={label}>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`${inputClass} pr-11`}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </Field>
  );
}
