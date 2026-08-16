"use client";

import { useState } from "react";

const FIELDS = [
  { key: "sets", label: "Sets" },
  { key: "reps", label: "Reps" },
  { key: "duration", label: "Duration" },
  { key: "intensity", label: "Intensity" },
  { key: "rest", label: "Rest" },
];

function toDraft(item) {
  return {
    name: item?.name || "",
    sets: item?.sets ?? "",
    reps: item?.reps ?? "",
    duration: item?.duration || "",
    intensity: item?.intensity || "",
    rest: item?.rest || "",
    notes: item?.notes || "",
  };
}

// `sets` is stored as a number when present (matches the seed data + formatPrescription's
// `${sets} × ${reps}` check); every other field stays a free-text string. Fields left blank
// are simply omitted, since this replaces the item wholesale rather than merging.
function toItem(draft) {
  const item = { name: draft.name.trim() };
  const setsNum = draft.sets === "" ? null : Number(draft.sets);
  if (setsNum) item.sets = setsNum;
  if (draft.reps.trim()) item.reps = draft.reps.trim();
  if (draft.duration.trim()) item.duration = draft.duration.trim();
  if (draft.intensity.trim()) item.intensity = draft.intensity.trim();
  if (draft.rest.trim()) item.rest = draft.rest.trim();
  if (draft.notes.trim()) item.notes = draft.notes.trim();
  return item;
}

// Shared add/edit form for a single exercise item (warmup/exercises/cooldown all use the
// same field set) — mirrors formatPrescription's vocabulary (sets/reps/duration/intensity/
// rest) plus name/notes, so nothing entered here needs a new rendering rule to display.
export default function ExerciseRowForm({ item, onSave, onCancel }) {
  const [draft, setDraft] = useState(() => toDraft(item));

  const update = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));

  const handleSave = () => {
    if (!draft.name.trim()) return;
    onSave(toItem(draft));
  };

  return (
    <div className="rounded-xl border border-rival-red/40 bg-black p-3">
      <div className="grid grid-cols-2 gap-2">
        <input
          value={draft.name}
          onChange={update("name")}
          placeholder="Name"
          autoFocus
          className="col-span-2 rounded-lg border border-border-subtle bg-surface px-2 py-1.5 text-xs text-white outline-none focus:border-rival-red"
        />
        {FIELDS.map((f) => (
          <input
            key={f.key}
            value={draft[f.key]}
            onChange={update(f.key)}
            placeholder={f.label}
            className="rounded-lg border border-border-subtle bg-surface px-2 py-1.5 text-xs text-white outline-none focus:border-rival-red"
          />
        ))}
        <textarea
          value={draft.notes}
          onChange={update("notes")}
          placeholder="Notes"
          rows={2}
          className="col-span-2 rounded-lg border border-border-subtle bg-surface px-2 py-1.5 text-xs text-white outline-none focus:border-rival-red"
        />
      </div>
      <div className="mt-2 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="text-xs font-semibold text-zinc-500 hover:text-zinc-300">
          Cancel
        </button>
        <button type="button" onClick={handleSave} className="text-xs font-bold text-rival-red">
          Save
        </button>
      </div>
    </div>
  );
}
