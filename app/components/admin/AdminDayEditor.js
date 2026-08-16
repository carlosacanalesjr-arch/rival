"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrograms } from "@/app/lib/ProgramsContext";
import { getWeeksForLevel } from "@/app/lib/programsData";
import { useDayContent } from "@/app/lib/ExerciseContentContext";
import { formatPrescription } from "@/app/components/ExerciseBreakdown";
import ExerciseRowForm from "@/app/components/admin/ExerciseRowForm";
import { BackIcon } from "@/app/components/admin/AdminIcons";

const SECTIONS = [
  { key: "warmup", title: "Warm-Up" },
  { key: "exercises", title: "Exercises" },
  { key: "cooldown", title: "Cooldown" },
];

function ExerciseSectionEditor({ title, items, editingIndex, onStartEdit, onCancelEdit, onAdd, onEdit, onRemove }) {
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

      <div className="mt-3">
        <label className="text-xs font-bold uppercase tracking-wide text-zinc-500">Day label</label>
        <input
          defaultValue={content.label || ""}
          onBlur={(e) => setDay({ ...content, label: e.target.value })}
          placeholder="Optional day label"
          className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-2 py-1.5 text-sm text-white outline-none focus:border-rival-red"
        />
      </div>

      {SECTIONS.map(({ key, title }) => (
        <ExerciseSectionEditor
          key={key}
          title={title}
          items={content[key]}
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
