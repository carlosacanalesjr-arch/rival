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
import ImageSlot from "@/app/components/ImageSlot";
import { ExerciseGroup } from "@/app/components/ExerciseBreakdown";

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
  { number: 1, label: "Foundation", summary: "General fitness base building — aerobic capacity, movement technique, and work capacity." },
  { number: 2, label: "Build", summary: "Increasing volume and intensity as your base solidifies." },
  { number: 3, label: "Peak", summary: "Event-specific work, full simulations, and taper into peak readiness." },
];

function getPhases(weeks) {
  const size = Math.ceil(weeks.length / 3);
  return PHASE_META.map((phase, i) => ({
    ...phase,
    weeks: weeks.slice(i * size, Math.min((i + 1) * size, weeks.length)),
  })).filter((phase) => phase.weeks.length > 0);
}

function DayBreakdown({ day, keyPrefix }) {
  const dayKeyPrefix = `${keyPrefix}:${day.day}`;
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-raised p-3">
      <p className="text-xs font-extrabold text-white">
        Day {day.day}
        {day.label ? ` · ${day.label}` : ""}
      </p>
      <ExerciseGroup title="Warm-Up" items={day.warmup} keyPrefix={dayKeyPrefix} />
      <ExerciseGroup title="Exercises" items={day.exercises} keyPrefix={dayKeyPrefix} />
      <ExerciseGroup title="Cooldown" items={day.cooldown} keyPrefix={dayKeyPrefix} />
    </div>
  );
}

export default function ProgramDetail({ id }) {
  const router = useRouter();
  const { programs, toggleEnroll, updateEnrolledLevel, updateEnrolledFocus } = usePrograms();
  const [expandedWeeks, setExpandedWeeks] = useState(() => new Set());
  // Accordion: a single open phase number (or null), not a Set — opening one phase
  // collapses whichever other phase was open, so the page can't grow to show all 12 weeks.
  const [openPhase, setOpenPhase] = useState(null);

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

  const togglePhase = (phaseNumber) => {
    setOpenPhase((prev) => (prev === phaseNumber ? null : phaseNumber));
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
        <div className="relative h-44 w-full">
          <ImageSlot
            mediaKey={`program-hero:${program.id}`}
            alt={`${program.title} hero image`}
            label="Add program image"
            className="h-full w-full"
          />
        </div>

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
          <div className="mx-4 mt-3 space-y-3">
            {phases.map((phase) => {
              const firstWeek = phase.weeks[0].week;
              const lastWeek = phase.weeks[phase.weeks.length - 1].week;
              const isPhaseOpen = openPhase === phase.number;
              const isPhaseCurrent = status === "enrolled" && phase.weeks.some((w) => w.week === program.currentWeek);
              return (
                <div
                  key={phase.number}
                  className={`overflow-hidden rounded-2xl border ${
                    isPhaseCurrent ? "border-rival-red/50 bg-rival-red/5" : "border-border-subtle bg-surface"
                  }`}
                >
                  <button
                    onClick={() => togglePhase(phase.number)}
                    aria-expanded={isPhaseOpen}
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-sm font-extrabold text-white">
                        Month {phase.number}: {phase.label}
                        {isPhaseCurrent && (
                          <span className="shrink-0 rounded-full bg-rival-red/15 px-2 py-0.5 text-[10px] font-bold text-rival-red">
                            NOW
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500">{phase.summary}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-[11px] text-zinc-500">
                        {firstWeek === lastWeek ? `Week ${firstWeek}` : `Weeks ${firstWeek}–${lastWeek}`}
                      </span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`shrink-0 text-zinc-400 transition-transform duration-200 ${
                          isPhaseOpen ? "rotate-180" : ""
                        }`}
                      >
                        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>

                  {isPhaseOpen && (
                  <ol className="space-y-2 border-t border-border-subtle p-3">
                    {phase.weeks.map((w) => {
                      const isDone = status === "completed" || (program.joined && w.week < program.currentWeek);
                      const isCurrent = status === "enrolled" && w.week === program.currentWeek;
                      const hasDays = w.days && w.days.length > 0;
                      const isExpanded = expandedWeeks.has(w.week);
                      return (
                        <li
                          key={w.week}
                          className={`overflow-hidden rounded-xl border ${
                            isCurrent ? "border-rival-red" : "border-border-subtle"
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
                            className={`relative flex min-h-28 flex-col justify-end ${hasDays ? "cursor-pointer" : ""}`}
                          >
                            <div className="absolute inset-0">
                              <ImageSlot
                                mediaKey={`week-bg:${program.id}:${w.week}`}
                                alt={`Week ${w.week} background`}
                                label="Add image"
                                cornerControlsOnly
                                className="h-full w-full"
                              />
                            </div>
                            <div
                              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent"
                              aria-hidden
                            />

                            <div className="absolute left-2 top-2 z-10 flex items-center gap-1.5">
                              {isDone && (
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rival-red text-xs font-extrabold text-white">
                                  ✓
                                </span>
                              )}
                              {isCurrent && (
                                <span className="rounded-full bg-rival-red px-2 py-0.5 text-[10px] font-bold text-white">
                                  NOW
                                </span>
                              )}
                            </div>

                            <div className="relative z-10 flex items-end justify-between gap-2 p-3">
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-white/80">Week {w.week}</p>
                                <p className="truncate text-sm font-extrabold text-white">{w.title}</p>
                              </div>
                              {hasDays && (
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  className={`shrink-0 text-white/80 transition-transform duration-200 ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                >
                                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          </div>
                          {hasDays && isExpanded && (
                            <div className="space-y-2 border-t border-border-subtle p-3">
                              {w.days.map((day) => (
                                <DayBreakdown key={day.day} day={day} keyPrefix={`${program.id}:${w.week}`} />
                              ))}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                  )}
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
          <button
            onClick={() => router.push(`/programs/${program.id}/train`)}
            className="flex w-full items-center gap-3 rounded-full bg-rival-red px-4 py-3 transition hover:bg-red-600"
          >
            <span className="text-sm font-bold text-white">Continue Training</span>
            <span className="ml-auto text-xs text-white/80">
              Week {program.currentWeek} of {program.duration}
            </span>
          </button>
        ) : (
          <button
            onClick={() => {
              toggleEnroll(program.id);
              router.push(`/programs/${program.id}/train`);
            }}
            className="w-full rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white hover:bg-red-600"
          >
            START PROGRAM
          </button>
        )}
      </div>
    </div>
  );
}
