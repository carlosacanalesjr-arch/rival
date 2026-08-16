"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrograms } from "@/app/lib/ProgramsContext";
import { getWeeksForLevel } from "@/app/lib/programsData";
import { useDayContent } from "@/app/lib/ExerciseContentContext";
import { formatPrescription, getSectionSlug } from "@/app/components/ExerciseBreakdown";
import VideoLinkField from "@/app/components/VideoLinkField";
import ExerciseRowForm from "@/app/components/admin/ExerciseRowForm";
import { BackIcon } from "@/app/components/admin/AdminIcons";

const SECTIONS = [
  { key: "warmup", title: "Warm-Up" },
  { key: "exercises", title: "Exercises" },
  { key: "cooldown", title: "Cooldown" },
];

// Explicit-save field, matching ExerciseRowForm's pattern — typing only updates local
// draft state; nothing is written to the persisted override until Save is clicked.
function DayLabelField({ label, onSave }) {
  const [value, setValue] = useState(label || "");
  const dirty = value !== (label || "");

  return (
    <div className="mt-3">
      <label className="text-xs font-bold uppercase tracking-wide text-zinc-500">Day label</label>
      <div className="mt-1 flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Optional day label"
          className="min-w-0 flex-1 rounded-lg border border-border-subtle bg-surface px-2 py-1.5 text-sm text-white outline-none focus:border-rival-red"
        />
        {dirty && (
          <button type="button" onClick={() => onSave(value)} className="shrink-0 text-xs font-bold text-rival-red">
            Save
          </button>
        )}
      </div>
    </div>
  );
}

function ExerciseSectionEditor({
  title,
  items,
  mediaKeyPrefix,
  editingIndex,
  onStartEdit,
  onCancelEdit,
  onAdd,
  onEdit,
  onRemove,
}) {
  const sectionSlug = getSectionSlug(title);
  return (
    <div className="mt-4">
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">{title}</p>
      <div className="mt-2 space-y-2">
        {(items || []).map((item, i) =>
          editingIndex === i ? (
            <ExerciseRowForm key={i} item={item} onSave={(next) => onEdit(i, next)} onCancel={onCancelEdit} />
          ) : (
            <div
              key={i}
              className="flex items-center justify-between gap-2 rounded-xl border border-border-subtle bg-surface p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                <p className="text-[11px] text-zinc-500">{formatPrescription(item)}</p>
                {item.notes && <p className="mt-0.5 text-[11px] text-zinc-500">{item.notes}</p>}
                <VideoLinkField mediaKey={`exercise:${mediaKeyPrefix}:${sectionSlug}:${i}`} />
              </div>
              <div className="flex shrink-0 gap-3">
                <button
                  type="button"
                  onClick={() => onStartEdit(i)}
                  className="text-[11px] font-semibold text-rival-red"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Remove "${item.name}"?`)) onRemove(i);
                  }}
                  className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-300"
                >
                  Remove
                </button>
              </div>
            </div>
          )
        )}
        {editingIndex === "new" ? (
          <ExerciseRowForm item={null} onSave={(next) => onAdd(next)} onCancel={onCancelEdit} />
        ) : (
          <button
            type="button"
            onClick={() => onStartEdit("new")}
            className="w-full rounded-xl border border-dashed border-zinc-700 p-3 text-xs font-semibold text-zinc-500 transition hover:border-zinc-500 hover:text-zinc-300"
          >
            + Add exercise
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdminDayEditor({ programId, levelKey, week, day }) {
  const router = useRouter();
  const { programs } = usePrograms();
  const program = programs.find((p) => p.id === programId);
  const weeks = program ? getWeeksForLevel(program, levelKey) : [];
  const weekData = weeks.find((w) => w.week === week);
  const baseDay = weekData?.days?.find((d) => d.day === day);

  // editing: { [section]: index | "new" | undefined } — which row (if any) is open for edit
  const [editing, setEditing] = useState({});

  const { content, isOverridden, setDay, resetDay, addExercise, updateExercise, removeExercise } = useDayContent(
    program,
    week,
    day,
    baseDay,
    levelKey
  );

  if (!program || !weekData) {
    return <p className="text-sm text-zinc-500">Not found.</p>;
  }

  const startEdit = (section, index) => setEditing((e) => ({ ...e, [section]: index }));
  const cancelEdit = (section) => setEditing((e) => ({ ...e, [section]: undefined }));

  return (
    <div>
      <button
        onClick={() => router.push(`/admin/${programId}/${levelKey}/${week}`)}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <BackIcon /> Days
      </button>
      <h1 className="mt-3 text-xl font-extrabold text-white">
        {program.title} · Week {week} · Day {day}
      </h1>

      {/* Keyed by isOverridden so "Reset day to placeholder" remounts this with the fresh
          (un-overridden) label instead of showing stale locally-held draft text. */}
      <DayLabelField
        key={isOverridden ? "overridden" : "base"}
        label={content.label}
        onSave={(label) => setDay({ ...content, label })}
      />

      {SECTIONS.map(({ key, title }) => (
        <ExerciseSectionEditor
          key={key}
          title={title}
          items={content[key]}
          mediaKeyPrefix={`${programId}:${levelKey}:${week}:${day}`}
          editingIndex={editing[key]}
          onStartEdit={(index) => startEdit(key, index)}
          onCancelEdit={() => cancelEdit(key)}
          onAdd={(item) => {
            addExercise(key, item);
            cancelEdit(key);
          }}
          onEdit={(index, nextItem) => {
            updateExercise(key, index, nextItem);
            cancelEdit(key);
          }}
          onRemove={(index) => removeExercise(key, index)}
        />
      ))}

      {isOverridden && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Reset this day back to the placeholder content?")) resetDay();
          }}
          className="mt-6 text-xs font-semibold text-zinc-500 hover:text-zinc-300"
        >
          Reset day to placeholder
        </button>
      )}
    </div>
  );
}
