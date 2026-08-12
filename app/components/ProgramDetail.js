"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrograms } from "@/app/lib/ProgramsContext";
import {
  getEnrollmentStatus,
  getActiveWeeks,
  categoriesWithLevelSelector,
  getNextLevelProgram,
} from "@/app/lib/programsData";
import { LEVEL_STYLES, PLACEHOLDER_TRIGGER_STYLE, LevelSelector, FocusSelector } from "@/app/components/LevelFocusSelectors";

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrophyIcon({ className }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path
        d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4ZM7 6H4a3 3 0 0 0 3 3M17 6h3a3 3 0 0 1-3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-3">
      <p className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function LevelReadOnlyBadge({ level }) {
  const style = level ? LEVEL_STYLES[level]?.trigger || PLACEHOLDER_TRIGGER_STYLE : PLACEHOLDER_TRIGGER_STYLE;
  return <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${style}`}>{level || "Not selected"}</span>;
}

function FocusReadOnlyBadge({ focus }) {
  const style = focus ? "border-amber-500/40 bg-amber-500/15 text-amber-400" : PLACEHOLDER_TRIGGER_STYLE;
  return <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${style}`}>{focus || "Not selected"}</span>;
}

const PHASE_META = [
  { number: 1, label: "Foundation" },
  { number: 2, label: "Build" },
  { number: 3, label: "Peak" },
];

function getPhases(weeks) {
  const size = Math.ceil(weeks.length / 3);
  return PHASE_META.map((phase, i) => ({
    ...phase,
    weeks: weeks.slice(i * size, Math.min((i + 1) * size, weeks.length)),
  })).filter((phase) => phase.weeks.length > 0);
}

// Turns { sets, reps, duration, rest } into a single compact line, e.g. "3 × 12 · Rest 60 sec"
// or "25 min · Zone 2". Any subset of fields can be present depending on the exercise.
function formatPrescription(item) {
  const parts = [];
  if (item.sets && item.reps) parts.push(`${item.sets} × ${item.reps}`);
  else if (item.reps) parts.push(item.reps);
  else if (item.sets) parts.push(`${item.sets} sets`);
  if (item.duration) parts.push(item.duration);
  if (item.intensity) parts.push(item.intensity);
  if (item.rest) parts.push(`Rest ${item.rest}`);
  return parts.join(" · ");
}

function ExerciseGroup({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-2 first:mt-0">
      <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">{title}</p>
      <ul className="mt-1 space-y-1.5">
        {items.map((item, i) => (
          <li key={i}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs font-semibold text-zinc-200">{item.name}</span>
              <span className="shrink-0 text-[11px] text-zinc-500">{formatPrescription(item)}</span>
            </div>
            {item.notes && <p className="mt-0.5 text-[11px] text-zinc-500">{item.notes}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DayBreakdown({ day }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-raised p-3">
      <p className="text-xs font-extrabold text-white">
        Day {day.day}
        {day.label ? ` · ${day.label}` : ""}
      </p>
      <ExerciseGroup title="Warm-Up" items={day.warmup} />
      <ExerciseGroup title="Exercises" items={day.exercises} />
      <ExerciseGroup title="Cooldown" items={day.cooldown} />
    </div>
  );
}

export default function ProgramDetail({ id }) {
  const router = useRouter();
  const { programs, toggleEnroll, updateEnrolledLevel, updateEnrolledFocus } = usePrograms();
  const [expandedWeeks, setExpandedWeeks] = useState(() => new Set());

  const program = programs.find((p) => p.id === id);

  if (!program) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black px-6 text-center">
        <p className="text-lg font-bold text-white">Program not found</p>
        <button
          onClick={() => router.push("/programs")}
          className="rounded-full bg-rival-red px-5 py-2.5 text-sm font-bold text-white"
        >
          Back to Programs
        </button>
      </div>
    );
  }

  const percent = Math.round((program.currentWeek / program.duration) * 100);
  const phases = getPhases(getActiveWeeks(program));
  const status = getEnrollmentStatus(program);

  const showLevelRow = categoriesWithLevelSelector.includes(program.category);
  const showFocusRow = Boolean(program.focusOptions);
  // Selections are only editable pre-enrollment. Once an athlete has actually started
  // workouts, changing level/focus goes through the existing level-up/repeat flow
  // (CompletionActionButton on the Browse / My Programs cards) instead of a silent swap
  // here that would yank them into different content mid-cycle.
  const canEditSelections = status === "not-enrolled";

  // HYROX has no level selector — Beginner/Intermediate/Advanced are separate program
  // records — so instead of a review-and-change row it gets a direct link to the next
  // tier's own page. This is just navigation (not a data edit), so it's shown regardless
  // of enrollment status rather than being locked once the athlete has started workouts.
  const isHyrox = program.category === "HYROX";
  const nextLevelProgram = isHyrox ? getNextLevelProgram(program, programs) : null;

  const toggleWeek = (weekNumber) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekNumber)) next.delete(weekNumber);
      else next.add(weekNumber);
      return next;
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border-subtle bg-black/90 px-4 py-3 backdrop-blur">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="text-zinc-300 hover:text-white"
        >
          <BackIcon />
        </button>
        <h1 className="truncate text-base font-bold text-white">{program.title}</h1>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 pb-28">
        <div className="relative border-b border-border-subtle bg-surface px-4 pb-5 pt-5">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rival-red to-orange-500" aria-hidden />
          <span className="inline-block rounded-full bg-rival-red/15 px-2.5 py-1 text-[11px] font-bold text-rival-red">
            {program.category}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold text-white">{program.title}</h2>

          {isHyrox && nextLevelProgram && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-500">Next Level</span>
              <button
                onClick={() => router.push(`/programs/${nextLevelProgram.id}`)}
                className="flex items-center gap-1.5 rounded-full border border-rival-red/40 bg-rival-red/15 px-2.5 py-1 text-[11px] font-bold text-rival-red transition hover:bg-rival-red/25"
              >
                Level Up to {nextLevelProgram.difficulty}
                <span aria-hidden>→</span>
              </button>
            </div>
          )}

          {(showLevelRow || showFocusRow) && (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              {showLevelRow && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-500">Level</span>
                  {canEditSelections ? (
                    <LevelSelector
                      selected={program.enrolledLevel || null}
                      onSelect={(level) => updateEnrolledLevel(program.id, level)}
                      variant="picker"
                      category={program.category}
                    />
                  ) : (
                    <LevelReadOnlyBadge level={program.enrolledLevel} />
                  )}
                </div>
              )}
              {showFocusRow && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-500">Agency Focus</span>
                  {canEditSelections ? (
                    <FocusSelector
                      options={program.focusOptions}
                      selected={program.enrolledFocus || null}
                      onSelect={(focus) => updateEnrolledFocus(program.id, focus)}
                    />
                  ) : (
                    <FocusReadOnlyBadge focus={program.enrolledFocus} />
                  )}
                </div>
              )}
            </div>
          )}

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{program.fullDescription}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <InfoTile label="Duration" value={`${program.duration} weeks`} />
            {program.difficulty && <InfoTile label="Difficulty" value={program.difficulty} />}
            <InfoTile label="Category" value={program.category} />
            <InfoTile label="Sessions/Week" value={program.sessionsPerWeek} />
          </div>

          {program.joined && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Your progress</span>
                <span className="font-semibold text-white">{percent}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rival-red to-orange-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <section className="mt-6 px-4">
          <h3 className="text-base font-bold text-white">Your Coach</h3>
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface p-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rival-red to-rival-red-dim text-lg font-extrabold text-white">
              {program.coach.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{program.coach.name}</p>
              <p className="truncate text-xs text-rival-red">{program.coach.title}</p>
              <p className="mt-1 text-xs text-zinc-400">{program.coach.bio}</p>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h3 className="px-4 text-base font-bold text-white">3-Month Breakdown</h3>
          <div className="mx-4 mt-3 space-y-4">
            {phases.map((phase) => {
              const firstWeek = phase.weeks[0].week;
              const lastWeek = phase.weeks[phase.weeks.length - 1].week;
              return (
                <div key={phase.number} className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
                  <div className="border-b border-border-subtle px-4 py-3">
                    <p className="text-sm font-extrabold text-white">
                      Phase {phase.number} · {phase.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-500">
                      {firstWeek === lastWeek ? `Week ${firstWeek}` : `Weeks ${firstWeek}–${lastWeek}`}
                    </p>
                  </div>
                  <ol className="space-y-2 p-3">
                    {phase.weeks.map((w) => {
                      const isDone = status === "completed" || (program.joined && w.week < program.currentWeek);
                      const isCurrent = status === "enrolled" && w.week === program.currentWeek;
                      const hasDays = w.days && w.days.length > 0;
                      const isExpanded = expandedWeeks.has(w.week);
                      return (
                        <li
                          key={w.week}
                          className={`overflow-hidden rounded-xl border ${
                            isCurrent ? "border-rival-red bg-rival-red/5" : "border-border-subtle bg-black"
                          }`}
                        >
                          <div
                            role={hasDays ? "button" : undefined}
                            tabIndex={hasDays ? 0 : undefined}
                            onClick={hasDays ? () => toggleWeek(w.week) : undefined}
                            onKeyDown={
                              hasDays
                                ? (e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      toggleWeek(w.week);
                                    }
                                  }
                                : undefined
                            }
                            className={`flex items-center gap-3 p-3 ${hasDays ? "cursor-pointer" : ""}`}
                          >
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                                isDone
                                  ? "bg-rival-red text-white"
                                  : isCurrent
                                  ? "border border-rival-red text-rival-red"
                                  : "bg-surface-raised text-zinc-400"
                              }`}
                            >
                              {isDone ? "✓" : w.week}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-white">{w.title}</p>
                              <p className="mt-0.5 text-xs text-zinc-400">{w.focus}</p>
                            </div>
                            {isCurrent && (
                              <span className="shrink-0 rounded-full bg-rival-red/15 px-2 py-0.5 text-[10px] font-bold text-rival-red">
                                NOW
                              </span>
                            )}
                            {hasDays && (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className={`shrink-0 text-zinc-400 transition-transform duration-200 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              >
                                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          {hasDays && isExpanded && (
                            <div className="space-y-2 border-t border-border-subtle p-3">
                              {w.days.map((day) => (
                                <DayBreakdown key={day.day} day={day} />
                              ))}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t border-border-subtle bg-black/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        {status === "completed" ? (
          <div className="flex items-center justify-center gap-2 rounded-full border border-border-subtle bg-surface-raised py-3">
            <TrophyIcon className="text-yellow-400" />
            <span className="text-sm font-bold text-zinc-100">Completed ✓</span>
          </div>
        ) : status === "enrolled" ? (
          <div className="flex items-center gap-3 rounded-full bg-rival-red px-4 py-3">
            <span className="text-sm font-bold text-white">✓ Enrolled</span>
            <span className="ml-auto text-xs text-white/80">
              Week {program.currentWeek} of {program.duration}
            </span>
          </div>
        ) : (
          <button
            onClick={() => toggleEnroll(program.id)}
            className="w-full rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white hover:bg-red-600"
          >
            START PROGRAM
          </button>
        )}
      </div>
    </div>
  );
}
